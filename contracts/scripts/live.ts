// Deploy PotCheckout against pUSD's ERC-20 precompile on Portaldot V3 and run the EVM flows once:
// permit-pay with replay rejection, hold $50 → capture $42 ($8 back), refund. Writes public evidence only.
//   node --env-file=.env node_modules/hardhat/dist/src/cli.js run scripts/live.ts --network portaldotTestnet
// Env (git-ignored .env): PORTALDOT_EVM_PRIVATE_KEY (deployer), EVM_CUSTOMER_PRIVATE_KEY, EVM_MERCHANT_PRIVATE_KEY.
// Optional: POT_CHECKOUT_ADDRESS to reuse a deployment, EVIDENCE_PATH.
import { writeFileSync } from "node:fs";
import { network } from "hardhat";
import { createWalletClient, defineChain, getAddress, http, keccak256, parseSignature, stringToHex, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/** Portaldot's Assets precompile: asset id in the first 4 bytes, prefix 0x0001 in bytes 16-17. */
export const assetPrecompile = (assetId: number) => getAddress(`0x${assetId.toString(16).padStart(8, "0")}${"0".repeat(24)}00010000`);

const PUSD_ASSET_ID = 7777;
const usd = (n: string) => BigInt(Math.round(Number(n) * 1e6));
const key = (name: string) => {
  const v = process.env[name]?.trim();
  if (!v || !/^0x[0-9a-fA-F]{64}$/.test(v)) throw new Error(`Missing ${name}`);
  return v as Hex;
};

const { viem } = await network.create();
const publicClient = await viem.getPublicClient();
const RPC = "https://test-evm-rpc-v3.portaldot.dev";
const chain = defineChain({
  id: 420420777,
  name: "Portaldot V3 testnet",
  nativeCurrency: { name: "tPOT", symbol: "tPOT", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
});
if ((await publicClient.getChainId()) !== chain.id) throw new Error("Connected to the wrong chain");
const transport = http(RPC);
const customer = createWalletClient({ account: privateKeyToAccount(key("EVM_CUSTOMER_PRIVATE_KEY")), chain, transport });
const merchant = createWalletClient({ account: privateKeyToAccount(key("EVM_MERCHANT_PRIVATE_KEY")), chain, transport });
const pusd = assetPrecompile(PUSD_ASSET_ID);
const token = await viem.getContractAt("MockPermitToken", pusd); // same ERC-20 + permit ABI as the precompile
// Portaldot's eth-rpc can take a few blocks to index a transaction, so "not found" is retried until the timeout.
async function receiptOf(hash: Hex) {
  const until = Date.now() + 180_000;
  for (;;) {
    try {
      return await publicClient.getTransactionReceipt({ hash });
    } catch (e) {
      if (Date.now() > until) throw e;
      await new Promise((r) => setTimeout(r, 3_000));
    }
  }
}
const wait = async (hash: Hex, what: string) => {
  const r = await receiptOf(hash);
  if (r.status !== "success") throw new Error(`${what} reverted (${hash})`);
  console.log(`${what}: ${hash} (block ${r.blockNumber}, gas ${r.gasUsed})`);
  return { txHash: hash, block: Number(r.blockNumber), gasUsed: r.gasUsed.toString() };
};
const balance = (who: Hex) => token.read.balanceOf([who]);

console.log(`chain ${await publicClient.getChainId()} | pUSD precompile ${pusd} | supply ${await token.read.totalSupply()}`);

let address = process.env.POT_CHECKOUT_ADDRESS?.trim() as Hex | undefined;
let deployTx: { txHash: Hex; block: number; gasUsed: string } | null = null;
const knownDeployTx = process.env.POT_CHECKOUT_DEPLOY_TX?.trim() as Hex | undefined;
if (address && knownDeployTx) deployTx = await wait(knownDeployTx, "deploy PotCheckout (earlier run)");
if (!address) {
  const { contract, deploymentTransaction } = await viem.sendDeploymentTransaction("PotCheckout", [pusd]);
  deployTx = await wait(deploymentTransaction.hash, "deploy PotCheckout");
  address = contract.address;
}
const checkout = await viem.getContractAt("PotCheckout", address);
if (getAddress(await checkout.read.token()) !== pusd) throw new Error("Deployment points at another token");
console.log(`PotCheckout at ${address}`);

const domain = { name: await token.read.name(), version: "1", chainId: await publicClient.getChainId(), verifyingContract: pusd } as const;
const permitTypes = {
  Permit: [
    { name: "owner", type: "address" }, { name: "spender", type: "address" }, { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" }, { name: "deadline", type: "uint256" },
  ],
} as const;
async function permit(value: bigint) {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 900);
  const nonce = await token.read.nonces([customer.account.address]);
  const sig = await customer.signTypedData({ domain, types: permitTypes, primaryType: "Permit", message: { owner: customer.account.address, spender: address!, value, nonce, deadline } });
  const { r, s, v } = parseSignature(sig);
  return [deadline, Number(v), r, s] as const;
}
const asCustomer = await viem.getContractAt("PotCheckout", address, { client: { wallet: customer } });
const asMerchant = await viem.getContractAt("PotCheckout", address, { client: { wallet: merchant } });
const shop = merchant.account.address;
const run = `${Date.now()}`;

// 1. Pay $4.50 with one permit signature; the same invoice again must be rejected.
const payId = keccak256(stringToHex(`inv-evm-${run}`));
const before = { c: await balance(customer.account.address), m: await balance(shop) };
const paid = await wait(await asCustomer.write.permitAndPay([shop, payId, usd("4.50"), BigInt(Math.floor(Date.now() / 1000) + 300), ...(await permit(usd("4.50")))]), "permitAndPay $4.50");
if ((await balance(shop)) - before.m !== usd("4.50")) throw new Error("merchant did not receive $4.50");
let replayRejected = false;
try {
  await asCustomer.simulate.pay([shop, payId, usd("4.50"), BigInt(Math.floor(Date.now() / 1000) + 300)]);
} catch (e) {
  replayRejected = /InvoiceAlreadyUsed/.test(String(e));
}
if (!replayRejected) throw new Error("replay was not rejected");
console.log("replay of the same invoice: rejected (InvoiceAlreadyUsed)");

// 2. Hold $50, capture $42, $8 returns to the customer in the same tx.
const holdId = keccak256(stringToHex(`inv-bike-${run}`));
const held = await wait(
  await asCustomer.write.permitAndHold([shop, holdId, usd("50"), Math.floor(Date.now() / 1000) + 3600, ...(await permit(usd("50")))]),
  "permitAndHold $50",
);
const cHeld = await balance(customer.account.address);
const captured = await wait(await asMerchant.write.capture([holdId, usd("42")]), "capture $42");
if ((await balance(customer.account.address)) - cHeld !== usd("8")) throw new Error("customer did not get $8 back");

// 3. Merchant refunds $2 of the $4.50 payment.
const tokenAsMerchant = await viem.getContractAt("MockPermitToken", pusd, { client: { wallet: merchant } });
await wait(await tokenAsMerchant.write.approve([address, usd("2")]), "merchant approve $2");
const refunded = await wait(await asMerchant.write.refund([payId, usd("2")]), "refund $2");
const after = { c: await balance(customer.account.address), m: await balance(shop) };

const evidence = {
  network: "Portaldot V3 testnet (EVM)",
  chainId: await publicClient.getChainId(),
  rpc: RPC,
  pusdPrecompile: pusd,
  potCheckout: address,
  deployTx,
  accounts: { customer: customer.account.address, merchant: shop },
  permitAndPay: { amount: "4500000", ...paid, replayRejected },
  permitAndHold: { amount: "50000000", ...held },
  capture: { captured: "42000000", releasedToPayer: "8000000", ...captured },
  refund: { amount: "2000000", ...refunded },
  balances: { customerBefore: before.c.toString(), customerAfter: after.c.toString(), merchantBefore: before.m.toString(), merchantAfter: after.m.toString() },
  note: "EVM transactions pay gas in tPOT; the stablecoin moves through the Assets ERC-20 precompile.",
  verifiedAt: new Date().toISOString(),
};
const path = process.env.EVIDENCE_PATH?.trim() || "../evidence/testnet-contract.json";
writeFileSync(path, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`customer ${before.c} → ${after.c} | merchant ${before.m} → ${after.m} | evidence ${path}`);
