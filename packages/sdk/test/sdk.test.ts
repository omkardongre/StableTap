// Runs against the built package (`pnpm build` first), the way a consumer imports it.
import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeInvoice, encodeInvoice, loadNetwork, parseAmount, splitAmounts, walletPayUrl } from "../dist/index.js";

const MERCHANT = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";

test("built package encodes an invoice and builds the wallet deep link", () => {
  const net = loadNetwork({ STABLETAP_WS: "wss://test-node-v3.portaldot.dev", STABLETAP_ASSET_ID: "7777", STABLETAP_ASSET_DECIMALS: "6" });
  const link = encodeInvoice({ to: MERCHANT, amount: parseAmount("4.50", net.decimals), id: "inv-sdk1" }, net.ss58);
  assert.equal(decodeInvoice(link, net.ss58).amount, 4_500_000n);
  assert.deepEqual(splitAmounts(decodeInvoice(link, net.ss58)), { merchant: 4_500_000n, platform: 0n });
  const url = new URL(walletPayUrl("https://pay.example", link));
  assert.equal(url.pathname, "/wallet");
  assert.equal(url.searchParams.get("pay"), link);
  assert.throws(() => walletPayUrl("http://pay.example", link), /https/);
  assert.throws(() => walletPayUrl("https://pay.example", "https://evil.example"), /Portaldot/);
});

test("react entry exports the Pay button", async () => {
  const mod = await import("../dist/react.js");
  assert.equal(typeof mod.PayButton, "function");
});
