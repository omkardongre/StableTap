import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeInvoice, encodeInvoice, formatAmount, loadNetwork, newInvoiceId, parseAmount } from "../src/index.ts";

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
