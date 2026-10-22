// Run one real end-to-end payment on a network and write verifiable evidence.
//   node --env-file=<file> scripts/live-payment.ts --evidence <path> [--amount 4.50] [--explorer <base-url>]
// Flow: the issuer funds a fresh customer and a fresh merchant (the faucet path), the merchant
// invoice is watched, the customer pays with the fee in the stablecoin, and balances are read
// at the payment's finalized block. Keys are generated per run and never written anywhere.
import { writeFileSync } from "node:fs";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import {
  assertNetwork, connect, formatAmount, fundNewAccount, getBalances, loadNetwork, newInvoiceId, parseAmount, pay, quoteFee, watchInvoice,
  type Invoice, type PaidEvent,
} from "../src/index.ts";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (!v) throw new Error(`${name} needs a value`);
  return v;
};
const evidencePath = opt("--evidence");
if (!evidencePath) throw new Error("--evidence <path> is required");
const explorer = (opt("--explorer") ?? "https://scanner-testnet-v3.portaldot.dev").replace(/\/$/, "");
const suri = process.env.ISSUER_SURI?.trim();
if (!suri) throw new Error("Missing ISSUER_SURI");

await cryptoWaitReady();
const net = loadNetwork(process.env);
const amount = parseAmount(opt("--amount") ?? "4.50", net.decimals);
const api = await connect(net);
try {
  await assertNetwork(api, net);
  const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  const faucet = kr.addFromUri(suri);
  const customer = kr.addFromMnemonic(mnemonicGenerate(12));
  const merchant = kr.addFromMnemonic(mnemonicGenerate(12));
  const ed = api.consts.balances.existentialDeposit.toBigInt();
  const nativeDecimals = api.registry.chainDecimals[0]!;
  const usd = (v: bigint) => formatAmount(v, net.decimals);

  const fundedCustomer = await fundNewAccount(api, net, faucet, customer.address, parseAmount("20", net.decimals));
  // The merchant needs an account to exist (deposit) and holds a little stablecoin, like any funded account.
  const fundedMerchant = await fundNewAccount(api, net, faucet, merchant.address, parseAmount("1", net.decimals));
  console.log(`customer ${customer.address} funded in #${fundedCustomer.blockNumber}`);
  console.log(`merchant ${merchant.address} funded in #${fundedMerchant.blockNumber}`);

  const inv: Invoice = { to: merchant.address, amount, id: newInvoiceId(), merchant: "Corner Cafe" };
  const quote = await quoteFee(api, net, inv, customer.address);
  const before = { customer: await getBalances(api, net, customer.address), merchant: await getBalances(api, net, merchant.address) };
  const start = (await api.rpc.chain.getHeader()).number.toNumber();

  const seen = new Promise<PaidEvent>((resolve, reject) => {
    void watchInvoice(api, net, inv, { fromBlock: start, onPaid: resolve, onError: reject });
  });
  const receipt = await pay(api, net, inv, customer);
  const paid = await seen;

  const at = receipt.blockHash;
  const after = { customer: await getBalances(api, net, customer.address, at), merchant: await getBalances(api, net, merchant.address, at) };
  const block = await api.rpc.chain.getBlock(at);
  const index = block.block.extrinsics.findIndex((x) => x.hash.toHex() === receipt.txHash);
  if (index < 0) throw new Error("Payment extrinsic not found in its finalized block");

  // Hard checks: these are the product's guarantees.
  if (paid.txHash !== receipt.txHash) throw new Error("Watcher and payer disagree on the transaction");
  if (after.customer.native !== before.customer.native) throw new Error("Customer native balance changed");
  if (after.customer.native !== ed) throw new Error("Customer native balance is not the bare deposit");
  if (after.merchant.stable - before.merchant.stable !== amount) throw new Error("Merchant did not receive the exact amount");
  if (before.customer.stable - after.customer.stable !== amount + receipt.feePaid) throw new Error("Customer stablecoin delta != amount + fee");

  const evidence = {
    network: net.ws,
    genesisHash: api.genesisHash.toHex(),
    invoice: { id: inv.id, amount: amount.toString(), amountDisplay: usd(amount), merchant: inv.merchant },
    customer: customer.address,
    merchantAddress: merchant.address,
    payment: {
      txHash: receipt.txHash,
      block: receipt.blockNumber,
      blockHash: receipt.blockHash,
      extrinsicIndex: index,
      explorer: `${explorer}/#/extrinsics/${receipt.blockNumber}-${index}`,
      feePaidStable: receipt.feePaid.toString(),
      feePaidDisplay: usd(receipt.feePaid),
      feeQuoteDisplay: usd(quote),
      nativeSpentByCustomer: (before.customer.native - after.customer.native).toString(),
      merchantReceived: (after.merchant.stable - before.merchant.stable).toString(),
      watcherDetectedSameTx: true,
    },
    fundingTxs: [fundedCustomer.txHash, fundedMerchant.txHash],
    verifiedAt: new Date().toISOString(),
  };
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

  console.log(`PAID ${usd(amount)} | fee ${usd(receipt.feePaid)} (quoted ${usd(quote)}) | customer tPOT spent ${formatAmount(before.customer.native - after.customer.native, nativeDecimals)}`);
  console.log(`tx ${receipt.txHash} | block #${receipt.blockNumber} | ${evidence.payment.explorer}`);
  console.log(`evidence written to ${evidencePath}`);
} finally {
  await api.disconnect();
}
