import assert from "node:assert/strict";
import { test } from "node:test";
import {
  InvoiceExpiredError, assertNotExpired, decodeInvoice, encodeInvoice, formatAmount, loadNetwork, memoFor, newInvoiceId, parseAmount, parseMemo,
  refundMemoFor, splitAmounts,
} from "../src/index.ts";

const SS58 = 42;
// //Charlie dev account in generic (42) and Polkadot (0) formats.
const MERCHANT = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";
const MERCHANT_POLKADOT = "14Gjs1TD93gnwEBfDMHoCgsuf1s2TVKUP6Z1qKmAZnZ8cW5q";

test("invoice link round-trips and normalizes the merchant address", () => {
  const inv = { to: MERCHANT_POLKADOT, amount: 4_500_000n, id: newInvoiceId(), merchant: " Corner Cafe " };
  const back = decodeInvoice(encodeInvoice(inv, SS58), SS58);
  assert.deepEqual(back, { to: MERCHANT, amount: 4_500_000n, id: inv.id, merchant: "Corner Cafe" });
  assert.match(inv.id, /^inv-[0-9a-z]{10}$/);
});

test("invoice link rejects tampered or malformed input", () => {
  const ok = encodeInvoice({ to: MERCHANT, amount: 1n, id: "inv-1" }, SS58);
  for (const bad of [
    "https://evil.example/pay?to=x",
    ok.replace(MERCHANT, MERCHANT.slice(0, -1) + "Z"), // bad checksum
    ok.replace("amount=1", "amount=0"),
    ok.replace("amount=1", "amount=-1"),
    ok.replace("amount=1", "amount=1.5"),
    ok.replace("id=inv-1", "id=../../x"),
  ]) assert.throws(() => decodeInvoice(bad, SS58), bad);
  assert.throws(() => encodeInvoice({ to: MERCHANT, amount: 1n, id: "inv-1", merchant: "x".repeat(41) }, SS58));
});

test("invoice expiry round-trips and is enforced against the given clock", () => {
  const inv = decodeInvoice(encodeInvoice({ to: MERCHANT, amount: 1n, id: "inv-1", expiresAt: 1_800_000_300 }, SS58), SS58);
  assert.equal(inv.expiresAt, 1_800_000_300);
  assert.doesNotThrow(() => assertNotExpired(inv, 1_800_000_299));
  assert.throws(() => assertNotExpired(inv, 1_800_000_300), InvoiceExpiredError);
  assert.throws(() => decodeInvoice(`${encodeInvoice({ to: MERCHANT, amount: 1n, id: "inv-1" }, SS58)}&exp=soon`, SS58), /expiry/);
});

test("amounts parse and format exactly", () => {
  assert.equal(parseAmount("4.5", 6), 4_500_000n);
  assert.equal(parseAmount("0.000001", 6), 1n);
  assert.equal(formatAmount(4_500_000n, 6), "4.50");
  assert.equal(formatAmount(177_686n, 6), "0.177686");
  for (const bad of ["", "1.", ".5", "1e3", "-1", "0.0000001"]) assert.throws(() => parseAmount(bad, 6), bad);
});

test("network config is required and validated", () => {
  const env = { STABLETAP_WS: "wss://node.example", STABLETAP_ASSET_ID: "7777", STABLETAP_ASSET_DECIMALS: "6" };
  assert.deepEqual(loadNetwork(env), { ws: "wss://node.example", assetId: 7777, decimals: 6, ss58: 42 });
  assert.throws(() => loadNetwork({ ...env, STABLETAP_ASSET_ID: "" }), /Missing STABLETAP_ASSET_ID/);
  assert.throws(() => loadNetwork({ ...env, STABLETAP_WS: "http://x" }), /ws:\/\//);
  assert.throws(() => loadNetwork({ ...env, STABLETAP_ASSET_DECIMALS: "x" }), /integer/);
});

test("split round-trips, divides the amount exactly and is validated", () => {
  const PLATFORM = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"; // //Bob
  const inv = decodeInvoice(encodeInvoice({ to: MERCHANT, amount: 4_500_000n, id: "inv-1", split: { to: PLATFORM, bps: 100 } }, SS58), SS58);
  assert.deepEqual(inv.split, { to: PLATFORM, bps: 100 });
  assert.deepEqual(splitAmounts(inv), { merchant: 4_455_000n, platform: 45_000n });
  assert.deepEqual(splitAmounts({ ...inv, amount: 99n }), { merchant: 99n, platform: 0n });
  assert.deepEqual(splitAmounts({ to: MERCHANT, amount: 5n, id: "x" }), { merchant: 5n, platform: 0n });
  const base = encodeInvoice({ to: MERCHANT, amount: 1n, id: "inv-1" }, SS58);
  for (const bad of [`${base}&st=${PLATFORM}`, `${base}&st=${PLATFORM}&sb=0`, `${base}&st=${PLATFORM}&sb=1001`, `${base}&st=${MERCHANT}&sb=100`, `${base}&st=nope&sb=100`]) {
    assert.throws(() => decodeInvoice(bad, SS58), bad);
  }
});

test("memos parse to payment or refund and nothing else", () => {
  assert.deepEqual(parseMemo(memoFor("inv-abc")), { kind: "payment", invoiceId: "inv-abc" });
  assert.deepEqual(parseMemo(refundMemoFor("inv-abc")), { kind: "refund", invoiceId: "inv-abc" });
  for (const bad of ["stabletap:", "stabletap:refund:", "stabletap:a:b", "other:inv-1", "stabletap:INV"]) assert.equal(parseMemo(bad), null, bad);
});
