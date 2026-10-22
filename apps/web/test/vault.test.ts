import assert from "node:assert/strict";
import { test } from "node:test";
import { b64u, fromB64u, open, parseRecord, seal } from "../src/lib/vault.ts";

const phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
const meta = { address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", credentialId: "Y3JlZC0x", prfSalt: b64u(new Uint8Array(32).fill(7)) };
const prf = () => new Uint8Array(32).fill(42);

test("vault opens only with the same passkey secret and untampered record", async () => {
  const record = parseRecord(JSON.stringify(await seal(phrase, prf(), meta)));
  assert.ok(!record.ct.includes(phrase));
  assert.equal(await open(record, prf()), phrase);

  const wrong = prf();
  wrong[0] = 1;
  await assert.rejects(open(record, wrong), /Could not unlock/);
  // Ciphertext is bound to its address and credential (AES-GCM associated data).
  await assert.rejects(open({ ...record, address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y" }, prf()), /Could not unlock/);
  const ct = fromB64u(record.ct);
  ct[0]! ^= 1;
  await assert.rejects(open({ ...record, ct: b64u(ct) }, prf()), /Could not unlock/);

  assert.throws(() => parseRecord(JSON.stringify({ ...record, v: 2 })), /corrupted/);
  await assert.rejects(seal(phrase, new Uint8Array(16), meta), /32 bytes/);
});
