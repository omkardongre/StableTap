import assert from "node:assert/strict";
import { test } from "node:test";
import { b64u, fromB64u, handleKind, open, parseRecord, phraseFromPrf, prfSalt, seal, type SealedRecord } from "../src/lib/vault.ts";

const phrase = "legal winner thank year wave sausage worth useful legal winner thank yellow";
const meta = { address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", credentialId: "Y3JlZC0x", prfSalt: b64u(new Uint8Array(32).fill(7)) };
const prf = () => new Uint8Array(32).fill(42);

test("vault opens only with the same passkey secret and untampered record", async () => {
  const parsed = parseRecord(JSON.stringify(await seal(phrase, prf(), meta)));
  assert.equal(parsed.v, 1);
  const record = parsed as SealedRecord;
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

test("a v2 key comes back from the same passkey secret, separately for wallet and shop", async () => {
  const a = await phraseFromPrf(prf(), "personal");
  assert.equal(await phraseFromPrf(prf(), "personal"), a, "same passkey, same phrase on every phone");
  assert.equal(a.split(" ").length, 12);
  assert.notEqual(await phraseFromPrf(prf(), "shop"), a, "shop and wallet keys differ");
  const other = prf();
  other[0] = 1;
  assert.notEqual(await phraseFromPrf(other, "personal"), a);
  assert.notDeepEqual(await prfSalt("personal"), await prfSalt("shop"));

  assert.equal(handleKind(new Uint8Array([0x53, 0x54, 0x02, 1, 9, 9])), "personal");
  assert.equal(handleKind(new Uint8Array([0x53, 0x54, 0x02, 2, 9, 9])), "shop");
  assert.equal(handleKind(new Uint8Array(16).fill(7)), "old", "random handle from an older wallet");
  assert.equal(handleKind(null), "old");

  const v2 = { v: 2, kind: "shop", address: meta.address, credentialId: meta.credentialId };
  assert.deepEqual(parseRecord(JSON.stringify(v2)), v2);
  assert.throws(() => parseRecord(JSON.stringify({ ...v2, kind: "other" })), /corrupted/);
});
