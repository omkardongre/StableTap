import assert from "node:assert/strict";
import { test } from "node:test";
import { Keyring } from "@polkadot/keyring";
import { u8aToHex, stringToU8a } from "@polkadot/util";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { webhookRegistrationMessage as registrationMessage, type ChainRecord, type NetworkConfig, type ScannedBlock } from "@stabletap/engine";
import { Store } from "../src/db.ts";
import {
  HttpError, eventPayload, isPublicIp, sign, validateWebhookUrl, verifyRegistration,
} from "../src/webhooks.ts";

const net: NetworkConfig = { ws: "ws://x", assetId: 7777, decimals: 6, ss58: 42 };
const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";
const CHARLIE = "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y";

function rec(over: Partial<ChainRecord>): ChainRecord {
  return {
    kind: "payment", invoiceId: "inv-1", txHash: "0xaa", blockNumber: 10, blockHash: "0xb10", extrinsicIndex: 1, signer: BOB, timestamp: 1_800_000_000_000,
    transfers: [{ from: BOB, to: CHARLIE, amount: 4_455_000n }, { from: BOB, to: ALICE, amount: 45_000n }], fee: { amount: 18_000n, assetId: 7777 }, ...over,
  };
}
const block = (n: number, records: ChainRecord[]): ScannedBlock => ({ blockNumber: n, blockHash: `0xb${n}`, timestamp: 0, records });

test("Standard Webhooks v1 signature matches the published test vector", () => {
  assert.equal(
    sign("whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw", "msg_p5jXN8AQM9LWM0D4loKWxJek", 1614265330, '{"test": 2432232314}'),
    "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
  );
});

test("store indexes payments and refunds, advances the cursor, and writes the outbox atomically", () => {
  const s = new Store(":memory:");
  s.bindChain("0xgen", 7777);
  assert.throws(() => s.bindChain("0xother", 7777), /belongs to/);
  s.putWebhook({ merchant: CHARLIE, url: "https://shop.example/hook", secret: "whsec_AAAA", signedAt: 1 });
  const pay = rec({});
  const refund = rec({ kind: "refund", txHash: "0xbb", blockNumber: 12, blockHash: "0xb12", signer: CHARLIE, transfers: [{ from: CHARLIE, to: BOB, amount: 4_455_000n }] });
  s.applyBlock(block(10, [pay]), (r, m) => eventPayload(net, r, m));
  s.applyBlock(block(11, []), (r, m) => eventPayload(net, r, m));
  s.applyBlock(block(12, [refund]), (r, m) => eventPayload(net, r, m));
  // Re-applying a block (e.g. after a crash before the cursor moved) changes nothing.
  s.applyBlock(block(10, [pay]), (r, m) => eventPayload(net, r, m));
  assert.equal(s.nextBlock(0), 11);
  s.applyBlock(block(12, [refund]), (r, m) => eventPayload(net, r, m));
  assert.equal(s.nextBlock(0), 13);

  const mine = s.merchantRecords(CHARLIE, 10);
  assert.deepEqual(mine.map((r) => r.kind), ["refund", "payment"]);
  assert.deepEqual(mine[1]!.transfers, pay.transfers);
  assert.deepEqual(mine[1]!.fee, { amount: 18_000n, assetId: 7777 });
  assert.deepEqual(s.merchantRecords(BOB, 10), [], "the payer is not a merchant");

  const st = s.stats(7777);
  assert.equal(st.payments, 1);
  assert.equal(st.volume, 4_500_000n);
  assert.equal(st.refunds, 1);
  assert.equal(st.refunded, 4_455_000n);
  assert.equal(st.merchants, 1);
  assert.deepEqual(st.stableFees, { count: 2, amount: 36_000n });
  assert.equal(st.nativeFeeCount, 0);
  assert.equal(st.otherAssetFeeCount, 0);

  const due = s.dueDeliveries(Date.now() + 1, 10);
  assert.equal(due.length, 2, "one event per record for the hooked merchant, no duplicates");
  const body = JSON.parse(due[0]!.payload);
  assert.equal(body.type, "payment.succeeded");
  assert.equal(body.data.amount, "4455000");
  assert.equal(JSON.parse(due[1]!.payload).type, "refund.succeeded");
  s.markFailedAttempt(due[0]!.id, "HTTP 500", Date.now() + 60_000);
  s.markDelivered(due[1]!.id, Date.now());
  assert.equal(s.dueDeliveries(Date.now() + 1, 10).length, 0);
  s.close();
});

test("a swap payment counts only what leaves the payer, and the merchant is the first other recipient", () => {
  const s = new Store(":memory:");
  const POOL = "5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z";
  s.applyBlock(block(20, [rec({ fee: { amount: 50_000n, assetId: 7780 }, transfers: [{ from: POOL, to: BOB, amount: 4_500_000n }, ...rec({}).transfers] })]), (r, m) => eventPayload(net, r, m));
  const st = s.stats(7777);
  assert.equal(st.volume, 4_500_000n);
  assert.equal(st.merchants, 1);
  assert.equal(st.otherAssetFeeCount, 1);
  assert.deepEqual(s.merchantRecords(BOB, 10), []);
  s.close();
});

test("webhook URLs must be https and public", () => {
  assert.equal(validateWebhookUrl("https://shop.example/hook", false), "https://shop.example/hook");
  for (const bad of ["http://shop.example/hook", "https://user:pw@shop.example/", "https://127.0.0.1/x", "https://[::1]/x", "https://10.0.0.5/", "https://169.254.169.254/latest", "ftp://x", "nope"]) {
    assert.throws(() => validateWebhookUrl(bad, false), HttpError, bad);
  }
  assert.ok(isPublicIp("8.8.8.8"));
  for (const ip of ["127.0.0.1", "192.168.1.5", "100.64.0.1", "::1", "fd00::1", "::ffff:127.0.0.1"]) assert.equal(isPublicIp(ip), false, ip);
});

test("webhook registration needs the merchant's signature, fresh and newer than the last", async () => {
  await cryptoWaitReady();
  const pair = new Keyring({ type: "sr25519", ss58Format: 42 }).addFromUri("//Charlie");
  const s = new Store(":memory:");
  const now = 1_800_000_000;
  const url = "https://shop.example/hook";
  const sig = (u: string, at: number) => u8aToHex(pair.sign(stringToU8a(registrationMessage(CHARLIE, u, at))));
  assert.doesNotThrow(() => verifyRegistration(s, CHARLIE, url, now, sig(url, now), now));
  assert.throws(() => verifyRegistration(s, CHARLIE, "https://evil.example/", now, sig(url, now), now), /does not match/);
  assert.throws(() => verifyRegistration(s, BOB, url, now, sig(url, now), now), /does not match/);
  assert.throws(() => verifyRegistration(s, CHARLIE, url, now - 600, sig(url, now - 600), now), /within 5 minutes/);
  s.putWebhook({ merchant: CHARLIE, url, secret: "whsec_AAAA", signedAt: now });
  assert.throws(() => verifyRegistration(s, CHARLIE, url, now, sig(url, now), now), /newer registration/, "replayed registration");
  s.close();
});
