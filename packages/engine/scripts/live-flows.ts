// Run the merchant flows once on a real network and write verifiable evidence:
// split payment, refund, payment with another token (swap), and payout to a 2-of-3 team wallet.
//   node --env-file=<file> scripts/live-flows.ts --pay-asset <id> --evidence <path> [--explorer <base-url>]
// The issuer funds fresh accounts (the faucet path) and is the platform account for the 1% split.
// Keys are generated per run and never written anywhere.
import { writeFileSync } from "node:fs";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import {
  assertNetwork, connect, formatAmount, fundNewAccount, getBalances, loadNetwork, multisigAddress, newInvoiceId, parseAmount, pay, payWithAsset,
  quoteSwapPay, refund, scanBlock, settlesInvoice, transferStable, type Invoice, type Receipt,
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
const payAssetText = opt("--pay-asset");
if (!payAssetText || !/^\d+$/.test(payAssetText)) throw new Error("--pay-asset <asset id> is required");
const payAsset = Number(payAssetText);
const explorer = (opt("--explorer") ?? "https://scanner-testnet-v3.portaldot.dev").replace(/\/$/, "");
const suri = process.env.ISSUER_SURI?.trim();
if (!suri) throw new Error("Missing ISSUER_SURI");

const check = (ok: boolean, what: string) => {
  if (!ok) throw new Error(`Check failed: ${what}`);
};

await cryptoWaitReady();
const net = loadNetwork(process.env);
const api = await connect(net);
try {
  await assertNetwork(api, net);
  const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  const issuer = kr.addFromUri(suri);
  const fresh = () => kr.addFromMnemonic(mnemonicGenerate(12));
  const [customer, merchant, portHolder, cosigner1, cosigner2] = [fresh(), fresh(), fresh(), fresh(), fresh()];
  const ed = api.consts.balances.existentialDeposit.toBigInt();
  const usd = (v: bigint) => formatAmount(v, net.decimals);
  const portMeta = await api.query.assets.metadata(payAsset);
  const port = (v: bigint) => `${formatAmount(v, portMeta.decimals.toNumber())} ${portMeta.symbol.toUtf8()}`;
  const link = async (r: Receipt) => {
    const block = await api.rpc.chain.getBlock(r.blockHash);
    const index = block.block.extrinsics.findIndex((x) => x.hash.toHex() === r.txHash);
    check(index >= 0, "extrinsic found in its finalized block");
    return { txHash: r.txHash, block: r.blockNumber, extrinsicIndex: index, explorer: `${explorer}/#/extrinsics/${r.blockNumber}-${index}` };
  };

  await fundNewAccount(api, net, issuer, customer.address, parseAmount("20", net.decimals));
  await fundNewAccount(api, net, issuer, merchant.address, parseAmount("1", net.decimals));
  await fundNewAccount(api, net, issuer, portHolder.address, parseAmount("20", portMeta.decimals.toNumber()), payAsset);
  console.log(`funded customer ${customer.address}, merchant ${merchant.address}, ${portMeta.symbol.toUtf8()} holder ${portHolder.address}`);

  // 1. Split payment: 99% to the merchant, 1% to the platform (the issuer here).
  const inv: Invoice = { to: merchant.address, amount: parseAmount("4.50", net.decimals), id: newInvoiceId(), merchant: "Corner Cafe", split: { to: issuer.address, bps: 100 } };
  const pBefore = await getBalances(api, net, issuer.address);
  const mBefore = await getBalances(api, net, merchant.address);
  const paid = await pay(api, net, inv, customer);
  const [cAfter, mAfter, pAfter] = await Promise.all([customer, merchant, issuer].map((k) => getBalances(api, net, k.address, paid.blockHash)));
  check(cAfter!.native === ed, "customer native stays at the deposit");
  check(mAfter!.stable - mBefore.stable === 4_455_000n, "merchant got 99%");
  // The issuer also pays nothing here; its delta is exactly the platform share.
  check(pAfter!.stable - pBefore.stable === 45_000n, "platform got 1%");
  const rec = (await scanBlock(api, net, paid.blockNumber)).records.find((r) => r.txHash === paid.txHash);
  check(!!rec && settlesInvoice(rec, inv), "decoder matches the split payment");
  console.log(`split payment ${usd(inv.amount)}: merchant ${usd(4_455_000n)}, platform ${usd(45_000n)}, fee ${usd(paid.feePaid)} in pUSD`);

  // 2. Refund the merchant share, signed by the merchant, fee in pUSD.
  const refunded = await refund(api, net, { to: customer.address, amount: 4_455_000n, invoiceId: inv.id }, merchant);
  const [cRef, mRef] = await Promise.all([customer, merchant].map((k) => getBalances(api, net, k.address, refunded.blockHash)));
  check(cRef!.stable - cAfter!.stable === 4_455_000n, "customer got the refund");
  check(mRef!.native === ed, "merchant native stays at the deposit");
  console.log(`refund ${usd(4_455_000n)}, fee ${usd(refunded.feePaid)} in pUSD`);

  // 3. A customer holding only the other token pays a pUSD invoice.
  const inv2: Invoice = { to: merchant.address, amount: parseAmount("4.50", net.decimals), id: newInvoiceId(), merchant: "Bike Rental" };
  const q = await quoteSwapPay(api, net, inv2, payAsset, portHolder.address);
  const m2Before = await getBalances(api, net, merchant.address);
  const swapped = await payWithAsset(api, net, inv2, payAsset, q.maxIn, portHolder);
  const [hAfter, m2After] = await Promise.all([portHolder, merchant].map((k) => getBalances(api, net, k.address, swapped.blockHash)));
  check(hAfter!.native === ed, "token holder native stays at the deposit");
  check(hAfter!.stable === 0n, "token holder keeps no pUSD");
  check(m2After!.stable - m2Before.stable === inv2.amount, "merchant got exactly the invoice amount in pUSD");
  check(swapped.spentIn <= q.maxIn, "swap within the signed maximum");
  console.log(`paid ${usd(inv2.amount)} with ${port(swapped.spentIn)}, fee ${port(swapped.feePaid)}`);

  // 4. Payout to a 2-of-3 team wallet (merchant + two co-signers).
  const spec = { signatories: [merchant.address, cosigner1.address, cosigner2.address], threshold: 2 };
  const team = multisigAddress(spec, net.ss58, api.consts.multisig.maxSignatories.toNumber());
  await fundNewAccount(api, net, issuer, team, parseAmount("0.01", net.decimals));
  const payout = await transferStable(api, net, team, parseAmount("4", net.decimals), merchant);
  const tAfter = await getBalances(api, net, team, payout.blockHash);
  check(tAfter.stable === parseAmount("4.01", net.decimals), "team wallet received the payout");
  console.log(`payout ${usd(parseAmount("4", net.decimals))} to 2-of-3 team ${team}, fee ${usd(payout.feePaid)} in pUSD`);

  const evidence = {
    network: net.ws,
    genesisHash: api.genesisHash.toHex(),
    stablecoin: net.assetId,
    payAsset: { id: payAsset, symbol: portMeta.symbol.toUtf8() },
    accounts: { customer: customer.address, merchant: merchant.address, platform: issuer.address, tokenHolder: portHolder.address, team, teamSignatories: spec.signatories },
    splitPayment: { invoiceId: inv.id, amount: inv.amount.toString(), merchantShare: "4455000", platformShare: "45000", feePaidStable: paid.feePaid.toString(), ...(await link(paid)) },
    refund: { invoiceId: inv.id, amount: "4455000", feePaidStable: refunded.feePaid.toString(), ...(await link(refunded)) },
    payWithToken: {
      invoiceId: inv2.id, amount: inv2.amount.toString(), spentIn: swapped.spentIn.toString(), maxIn: q.maxIn.toString(), feePaidInToken: swapped.feePaid.toString(),
      nativeSpent: "0", ...(await link(swapped)),
    },
    teamPayout: { threshold: 2, amount: "4000000", feePaidStable: payout.feePaid.toString(), ...(await link(payout)) },
    verifiedAt: new Date().toISOString(),
  };
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`evidence written to ${evidencePath}`);
} finally {
  await api.disconnect();
}
