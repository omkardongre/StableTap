/**
 * Integration test against a local Chopsticks fork of the V3 testnet with the
 * stablecoin and its pool already set up (`pnpm spike:fork`, then
 * `pnpm --filter @stabletap/engine setup:fork` once). Env: test/fork.env.
 */
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady, sortAddresses } from "@polkadot/util-crypto";
import {
  AlreadyFundedError, InvoiceExpiredError, assertNetwork, chainNow, connect, fundNewAccount, getBalances, loadNetwork, newInvoiceId, pay, quoteFee, refund,
  multisigAddress, payWithAsset, quoteSwapPay, scanBlock, settlesInvoice, submitFinalized, transferStable, watchInvoice,
  type Invoice, type NetworkConfig, type PaidEvent,
} from "../src/index.ts";

const FUNDING = 20_000_000n; // 20 pUSD
let api: ApiPromise;
let net: NetworkConfig;
let kr: Keyring;
let customer: KeyringPair;
let ed: bigint;

before(async () => {
  await cryptoWaitReady();
  net = loadNetwork(process.env);
  api = await connect(net);
  await assertNetwork(api, net);
  kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  ed = api.consts.balances.existentialDeposit.toBigInt();
  // A brand-new wallet, funded exactly like the app's faucet does it.
  customer = kr.addFromUri(`//fresh/${newInvoiceId()}`);
  await fundNewAccount(api, net, kr.addFromUri("//Alice"), customer.address, FUNDING);
});
after(() => api?.disconnect());

test("a fresh wallet pays in the stablecoin, the watcher sees it, native stays at the deposit", { timeout: 180_000 }, async () => {
  assert.deepEqual(await getBalances(api, net, customer.address), { native: ed, stable: FUNDING });
  await assert.rejects(fundNewAccount(api, net, kr.addFromUri("//Alice"), customer.address, 1n), AlreadyFundedError);

  const merchant = kr.addFromUri("//Charlie");
  const inv: Invoice = { to: merchant.address, amount: 4_500_000n, id: newInvoiceId() };
  const quote = await quoteFee(api, net, inv, customer.address);
  const start = (await api.rpc.chain.getHeader()).number.toNumber();
  const mBefore = await getBalances(api, net, merchant.address);

  const seen = new Promise<PaidEvent>((resolve, reject) => {
    void watchInvoice(api, net, inv, { fromBlock: start, onPaid: resolve, onError: reject });
  });
  const receipt = await pay(api, net, inv, customer);
  const paid = await seen;

  const [cAfter, mAfter] = await Promise.all([getBalances(api, net, customer.address, receipt.blockHash), getBalances(api, net, merchant.address, receipt.blockHash)]);
  assert.equal(paid.txHash, receipt.txHash);
  assert.equal(paid.blockHash, receipt.blockHash);
  assert.equal(cAfter.native, ed, "customer native balance changed");
  assert.equal(mAfter.stable - mBefore.stable, inv.amount);
  assert.equal(cAfter.stable, FUNDING - inv.amount - receipt.feePaid);
  assert.ok(receipt.feePaid > 0n);
  // Quote is taken before inclusion; actual fee may differ slightly (weight refund, pool move).
  assert.ok(receipt.feePaid <= (quote * 11n) / 10n && receipt.feePaid >= (quote * 9n) / 10n, `quote ${quote} vs paid ${receipt.feePaid}`);
});

test("a split payment pays both shares, decodes from the block, and the merchant refunds it", { timeout: 240_000 }, async () => {
  const merchant = kr.addFromUri(`//merchant/${newInvoiceId()}`);
  const platform = kr.addFromUri(`//platform/${newInvoiceId()}`);
  // Receivers of a non-sufficient asset must already exist; the merchant also needs stablecoin for refund fees.
  await fundNewAccount(api, net, kr.addFromUri("//Alice"), merchant.address, 1_000_000n);
  await fundNewAccount(api, net, kr.addFromUri("//Alice"), platform.address, 10_000n);
  const inv: Invoice = { to: merchant.address, amount: 4_500_000n, id: newInvoiceId(), split: { to: platform.address, bps: 100 } };
  const start = (await api.rpc.chain.getHeader()).number.toNumber();
  const seen = new Promise<PaidEvent>((resolve, reject) => {
    void watchInvoice(api, net, inv, { fromBlock: start, onPaid: resolve, onError: reject });
  });
  const pBefore = await getBalances(api, net, platform.address);
  const receipt = await pay(api, net, inv, customer);
  assert.equal((await seen).txHash, receipt.txHash);
  const [mAfter, pAfter] = await Promise.all([getBalances(api, net, merchant.address, receipt.blockHash), getBalances(api, net, platform.address, receipt.blockHash)]);
  assert.equal(mAfter.stable, 1_000_000n + 4_455_000n);
  assert.equal(pAfter.stable - pBefore.stable, 45_000n);

  const block = await scanBlock(api, net, receipt.blockNumber);
  const rec = block.records.find((r) => r.txHash === receipt.txHash);
  assert.ok(rec && settlesInvoice(rec, inv));
  assert.equal(rec.signer, customer.address);
  assert.deepEqual(rec.fee, { amount: receipt.feePaid, assetId: net.assetId });

  const cBefore = await getBalances(api, net, customer.address, receipt.blockHash);
  const r = await refund(api, net, { to: customer.address, amount: 4_455_000n, invoiceId: inv.id }, merchant);
  const cAfter = await getBalances(api, net, customer.address, r.blockHash);
  assert.equal(cAfter.stable - cBefore.stable, 4_455_000n);
  assert.equal(cAfter.native, ed);
  const refundRec = (await scanBlock(api, net, r.blockNumber)).records.find((x) => x.txHash === r.txHash);
  assert.equal(refundRec?.kind, "refund");
  assert.equal(refundRec?.invoiceId, inv.id);
  assert.equal(refundRec?.signer, merchant.address);
  assert.equal((await getBalances(api, net, merchant.address, r.blockHash)).native, ed, "merchant spent native on the refund fee");
});

test("takings go to a 2-of-3 team wallet that two signatories can spend from", { timeout: 240_000 }, async () => {
  const [a, b, c] = ["//Alice", "//Bob", "//Charlie"].map((u) => kr.addFromUri(u)) as [KeyringPair, KeyringPair, KeyringPair];
  const spec = { signatories: [c.address, a.address, b.address], threshold: 2 };
  const team = multisigAddress(spec, net.ss58, api.consts.multisig.maxSignatories.toNumber());
  assert.equal(team, multisigAddress({ ...spec, signatories: [a.address, b.address, c.address] }, net.ss58), "order must not matter");
  if ((await getBalances(api, net, team)).native === 0n) await fundNewAccount(api, net, a, team, 10_000n);
  const before = await getBalances(api, net, team);
  const r = await transferStable(api, net, team, 2_000_000n, customer);
  assert.ok(r.feePaid > 0n);
  assert.equal((await getBalances(api, net, team, r.blockHash)).stable - before.stable, 2_000_000n);

  // Spend 1 pUSD out of the team wallet: Alice proposes, Bob approves and executes.
  // Multisig approvals reserve a native deposit, so the treasury signers hold tPOT (unlike customers).
  await submitFinalized(api, await api.tx.balances.transferKeepAlive(b.address, 5n * 10n ** 14n).signAsync(a));
  const others = (who: KeyringPair) => sortAddresses(spec.signatories.filter((s) => s !== who.address), net.ss58);
  // A per-run amount keeps the call hash unique, so a leftover approval from an aborted run can't collide.
  const spend = 1_000_000n + BigInt(Math.floor(Math.random() * 1000));
  const call = api.tx.assets.transferKeepAlive(net.assetId, c.address, spend);
  const weight = (await call.paymentInfo(team)).weight;
  const first = await api.tx.multisig.approveAsMulti(2, others(a), null, call.method.hash, weight).signAsync(a);
  const done1 = await submitFinalized(api, first);
  const timepoint = { height: done1.blockNumber, index: (await api.rpc.chain.getBlock(done1.blockHash)).block.extrinsics.findIndex((x) => x.hash.toHex() === done1.txHash) };
  const cBefore = await getBalances(api, net, c.address);
  const second = await api.tx.multisig.asMulti(2, others(b), timepoint, call.method, weight).signAsync(b);
  const done2 = await submitFinalized(api, second);
  assert.ok(done2.events.some(({ event }) => api.events.multisig.MultisigExecuted.is(event) && event.data[4].isOk), "multisig call did not execute");
  assert.equal((await getBalances(api, net, c.address, done2.blockHash)).stable - cBefore.stable, spend);
});

test("a customer holding only PORT pays a pUSD invoice: merchant gets exact pUSD, fee in PORT, no tPOT spent", { timeout: 240_000 }, async () => {
  const port = Number(process.env.STABLETAP_PORT_ASSET_ID);
  assert.ok(Number.isInteger(port) && port > 0, "STABLETAP_PORT_ASSET_ID missing");
  const alice = kr.addFromUri("//Alice");
  const holder = kr.addFromUri(`//port/${newInvoiceId()}`);
  const merchant = kr.addFromUri(`//merchant/${newInvoiceId()}`);
  const platform = kr.addFromUri(`//platform/${newInvoiceId()}`);
  await fundNewAccount(api, net, alice, holder.address, 20_000_000n, port);
  await fundNewAccount(api, net, alice, merchant.address, 10_000n);
  await fundNewAccount(api, net, alice, platform.address, 10_000n);
  const portBalance = async (who: string, at?: string) => {
    const q = at ? (await api.at(at)).query : api.query;
    const a = await q.assets.account(port, who);
    return a.isSome ? a.unwrap().balance.toBigInt() : 0n;
  };
  const inv: Invoice = { to: merchant.address, amount: 4_500_000n, id: newInvoiceId(), split: { to: platform.address, bps: 100 } };
  const q = await quoteSwapPay(api, net, inv, port, holder.address);
  assert.ok(q.maxIn > q.expectedIn && q.fee > 0n);
  const before = await portBalance(holder.address);
  const r = await payWithAsset(api, net, inv, port, q.maxIn, holder);
  assert.ok(r.spentIn <= q.maxIn, "swap spent more than the signed maximum");
  const [h, m] = await Promise.all([getBalances(api, net, holder.address, r.blockHash), getBalances(api, net, merchant.address, r.blockHash)]);
  assert.equal(h.native, ed, "payer native balance changed");
  assert.equal(h.stable, 0n, "payer kept stablecoin");
  assert.equal(m.stable, 10_000n + 4_455_000n);
  assert.equal(before - (await portBalance(holder.address, r.blockHash)), r.spentIn + r.feePaid);
  const rec = (await scanBlock(api, net, r.blockNumber)).records.find((x) => x.txHash === r.txHash);
  assert.ok(rec && settlesInvoice(rec, inv), "watcher would not match the swap payment");
  assert.deepEqual(rec.fee, { amount: r.feePaid, assetId: port });
});

test("an invoice expired by chain time is refused before signing", { timeout: 60_000 }, async () => {
  const inv: Invoice = { to: kr.addFromUri("//Charlie").address, amount: 1_000_000n, id: newInvoiceId(), expiresAt: (await chainNow(api)) - 1 };
  const before = await getBalances(api, net, customer.address);
  await assert.rejects(pay(api, net, inv, customer), InvoiceExpiredError);
  assert.deepEqual(await getBalances(api, net, customer.address), before);
});

test("a payment the customer cannot afford is rejected, not left pending", { timeout: 60_000 }, async () => {
  const { stable } = await getBalances(api, net, customer.address);
  const inv: Invoice = { to: kr.addFromUri("//Charlie").address, amount: stable + 1n, id: newInvoiceId() };
  await assert.rejects(pay(api, net, inv, customer));
});
