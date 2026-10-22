/**
 * Integration test against a local Chopsticks fork of the V3 testnet with pUSD
 * and its pool already created (`pnpm spike:fork`, then `pnpm spike:fee` once).
 * Needs STABLETAP_WS, STABLETAP_ASSET_ID, STABLETAP_ASSET_DECIMALS.
 */
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import {
  AlreadyFundedError, assertNetwork, connect, fundNewAccount, getBalances, loadNetwork, newInvoiceId, pay, quoteFee, watchInvoice,
  type Invoice, type NetworkConfig, type PaidEvent,
} from "../src/index.ts";

let api: ApiPromise;
let net: NetworkConfig;

before(async () => {
  await cryptoWaitReady();
  net = loadNetwork(process.env);
  api = await connect(net);
  await assertNetwork(api, net);
});
after(() => api?.disconnect());

test("pay settles in the stablecoin, the watcher sees it, native balance is untouched", { timeout: 180_000 }, async () => {
  const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  const customer = kr.addFromUri("//Bob");
  const merchant = kr.addFromUri("//Charlie");
  const inv: Invoice = { to: merchant.address, amount: 1_250_000n, id: newInvoiceId() };

  const quote = await quoteFee(api, net, inv, customer.address);
  const start = (await api.rpc.chain.getHeader()).number.toNumber();
  const [cBefore, mBefore] = await Promise.all([getBalances(api, net, customer.address), getBalances(api, net, merchant.address)]);

  const seen = new Promise<PaidEvent>((resolve, reject) => {
    void watchInvoice(api, net, inv, { fromBlock: start, onPaid: resolve, onError: reject });
  });
  const receipt = await pay(api, net, inv, customer);
  const paid = await seen;

  const [cAfter, mAfter] = await Promise.all([getBalances(api, net, customer.address), getBalances(api, net, merchant.address)]);
  assert.equal(paid.txHash, receipt.txHash);
  assert.equal(paid.blockHash, receipt.blockHash);
  assert.equal(cAfter.native, cBefore.native, "customer native balance changed");
  assert.equal(mAfter.stable - mBefore.stable, inv.amount);
  assert.equal(cBefore.stable - cAfter.stable, inv.amount + receipt.feePaid);
  assert.ok(receipt.feePaid > 0n);
  // Quote is taken before inclusion; actual fee may differ slightly (weight refund, pool move).
  assert.ok(receipt.feePaid <= quote * 11n / 10n && receipt.feePaid >= quote * 9n / 10n, `quote ${quote} vs paid ${receipt.feePaid}`);
});

test("a fresh wallet funded once by the faucet pays without spending native", { timeout: 180_000 }, async () => {
  const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  const faucet = kr.addFromUri("//Alice");
  const wallet = kr.addFromUri(`//fresh/${newInvoiceId()}`);
  const ed = api.consts.balances.existentialDeposit.toBigInt();

  await fundNewAccount(api, net, faucet, wallet.address, 20_000_000n);
  const funded = await getBalances(api, net, wallet.address);
  assert.deepEqual(funded, { native: ed, stable: 20_000_000n });
  await assert.rejects(fundNewAccount(api, net, faucet, wallet.address, 1n), AlreadyFundedError);

  const receipt = await pay(api, net, { to: kr.addFromUri("//Charlie").address, amount: 4_500_000n, id: newInvoiceId() }, wallet);
  const after = await getBalances(api, net, wallet.address, receipt.blockHash);
  assert.equal(after.native, ed);
  assert.equal(after.stable, 20_000_000n - 4_500_000n - receipt.feePaid);
});

test("a payment the customer cannot afford is rejected, not left pending", { timeout: 60_000 }, async () => {
  const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
  const customer = kr.addFromUri("//Bob");
  const { stable } = await getBalances(api, net, customer.address);
  const inv: Invoice = { to: kr.addFromUri("//Charlie").address, amount: stable + 1n, id: newInvoiceId() };
  await assert.rejects(pay(api, net, inv, customer));
});
