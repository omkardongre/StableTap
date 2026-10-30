import { entropyToMnemonic } from "@polkadot/util-crypto/mnemonic/bip39";

/**
 * Passkey wallets.
 *
 * v2 (current): the key is rebuilt from the passkey itself. The WebAuthn PRF extension, evaluated
 * with a fixed per-kind salt, returns the same 32 bytes on every device that has the passkey
 * (Google Password Manager and iCloud Keychain sync it). HKDF-SHA-256 turns them into the entropy of
 * a 12-word recovery phrase. The phone keeps only the address and credential id, no secret, so
 * clearing site data or getting a new phone loses nothing: "Sign in" asks for the passkey again.
 * Same idea as Breez passkey login (github.com/breez/passkey-login).
 *
 * v1 (older wallets, and wallets restored from a recovery phrase): the phrase is encrypted with
 * AES-256-GCM under a key derived from the PRF output with a random salt, and that sealed copy
 * lives in this browser. It opens only after the phone's lock check on this device.
 */

/** v1: sealed phrase stored in this browser. */
export interface SealedRecord {
  v: 1;
  address: string;
  /** base64url WebAuthn credential id. */
  credentialId: string;
  /** base64url PRF input (32 random bytes). */
  prfSalt: string;
  /** base64url HKDF salt. */
  hkdfSalt: string;
  /** base64url AES-GCM nonce. */
  iv: string;
  /** base64url ciphertext + tag. */
  ct: string;
}

/** v2: nothing secret on the phone; the passkey rebuilds the key. */
export interface PasskeyRecord {
  v: 2;
  kind: VaultKind;
  address: string;
  /** base64url WebAuthn credential id. */
  credentialId: string;
}

export type VaultRecord = SealedRecord | PasskeyRecord;

const HKDF_INFO = new TextEncoder().encode("stabletap/vault/v1");
/** A device can hold a personal wallet (customer) and a separate shop wallet (business). */
export type VaultKind = "personal" | "shop";
const STORAGE_KEYS: Record<VaultKind, string> = { personal: "stabletap.vault.v1", shop: "stabletap.shop-vault.v1" };
const RP_NAME = "StableTap";

/**
 * The passkey's user handle says which StableTap key it holds, so "Sign in" can tell a shop
 * passkey from a wallet passkey (and from older ones). Layout: "ST", version 2, kind, 12 random bytes.
 */
const HANDLE_MAGIC = [0x53, 0x54, 0x02] as const;
const KIND_BYTE: Record<VaultKind, number> = { personal: 1, shop: 2 };

// ---------- pure crypto (also runs in Node for tests) ----------

async function deriveKey(prfOutput: Uint8Array<ArrayBuffer>, hkdfSalt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  if (prfOutput.length !== 32) throw new Error("PRF output must be 32 bytes");
  const ikm = await crypto.subtle.importKey("raw", prfOutput, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: hkdfSalt, info: HKDF_INFO },
    ikm,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Associated data binds the ciphertext to its address and credential. */
const aad = (r: Pick<SealedRecord, "v" | "address" | "credentialId">) => new TextEncoder().encode(`${r.v}|${r.address}|${r.credentialId}`);

export async function seal(
  secret: string,
  prfOutput: Uint8Array<ArrayBuffer>,
  meta: { address: string; credentialId: string; prfSalt: string },
): Promise<SealedRecord> {
  const hkdfSalt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(prfOutput, hkdfSalt);
  const head = { v: 1 as const, ...meta };
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(head) }, key, new TextEncoder().encode(secret));
  return { ...head, hkdfSalt: b64u(hkdfSalt), iv: b64u(iv), ct: b64u(new Uint8Array(ct)) };
}

export async function open(record: SealedRecord, prfOutput: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await deriveKey(prfOutput, fromB64u(record.hkdfSalt));
  try {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64u(record.iv), additionalData: aad(record) }, key, fromB64u(record.ct));
    return new TextDecoder().decode(pt);
  } catch {
    throw new Error("Could not unlock the wallet with this passkey");
  }
}

/** Fixed PRF input for v2 keys: same passkey + same salt = same key on every device. */
export async function prfSalt(kind: VaultKind): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`StableTap passkey key v2 / ${kind}`)));
}

/** The 12-word recovery phrase of a v2 key, from the passkey's PRF output. Deterministic. */
export async function phraseFromPrf(prfOutput: Uint8Array<ArrayBuffer>, kind: VaultKind): Promise<string> {
  if (prfOutput.length !== 32) throw new Error("PRF output must be 32 bytes");
  const ikm = await crypto.subtle.importKey("raw", prfOutput, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: new TextEncoder().encode(`stabletap/phrase/v2/${kind}`) },
    ikm,
    128,
  );
  return entropyToMnemonic(new Uint8Array(bits));
}

/** Which StableTap key a passkey holds, from its user handle: a v2 kind, or "old" for anything else. */
export function handleKind(userHandle: Uint8Array | null): VaultKind | "old" {
  if (!userHandle || userHandle.length < 4 || HANDLE_MAGIC.some((b, i) => userHandle[i] !== b)) return "old";
  if (userHandle[3] === KIND_BYTE.personal) return "personal";
  if (userHandle[3] === KIND_BYTE.shop) return "shop";
  return "old";
}

export function b64u(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromB64u(text: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error("Invalid base64url");
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "="));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function parseRecord(json: string): VaultRecord {
  const r = JSON.parse(json) as Record<string, unknown> | null;
  const filled = (fields: readonly string[]) => !!r && fields.every((f) => typeof r[f] === "string" && (r[f] as string).length > 0);
  if (r?.v === 1 && filled(["address", "credentialId", "prfSalt", "hkdfSalt", "iv", "ct"])) return r as unknown as SealedRecord;
  if (r?.v === 2 && (r.kind === "personal" || r.kind === "shop") && filled(["address", "credentialId"])) return r as unknown as PasskeyRecord;
  throw new Error("Stored wallet is corrupted");
}

// ---------- browser: passkey + storage ----------

/** True when this browser can give us a PRF secret from a passkey. */
export async function passkeyPrfSupported(): Promise<boolean> {
  if (typeof PublicKeyCredential === "undefined") return false;
  const caps = await PublicKeyCredential.getClientCapabilities?.().catch(() => undefined);
  if (caps && "extension:prf" in caps) return caps["extension:prf"] === true;
  // Browsers without getClientCapabilities: we can only know at creation time.
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

export function loadVault(kind: VaultKind = "personal"): VaultRecord | null {
  const raw = localStorage.getItem(STORAGE_KEYS[kind]);
  return raw ? parseRecord(raw) : null;
}

export function removeVault(kind: VaultKind = "personal"): void {
  localStorage.removeItem(STORAGE_KEYS[kind]);
}

function store(kind: VaultKind, record: VaultRecord) {
  localStorage.setItem(STORAGE_KEYS[kind], JSON.stringify(record));
  void navigator.storage?.persist?.().catch(() => false);
}

/** Names the phone's password manager shows; words people recognise, not the address. */
function userNames(kind: VaultKind, label?: string) {
  return kind === "shop"
    ? { name: `${label ?? "My shop"} · StableTap shop`, displayName: label ?? "My shop" }
    : { name: "StableTap wallet", displayName: "StableTap wallet" };
}

async function createPasskey(kind: VaultKind, userId: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>, label?: string) {
  const cred = (await navigator.credentials.create({
    publicKey: {
      rp: { name: RP_NAME },
      user: { id: userId, ...userNames(kind, label) },
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      // Discoverable, so "Sign in" finds it with no stored id; synced by the phone's password manager.
      authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "required", userVerification: "required" },
      timeout: 120_000,
      extensions: { prf: { eval: { first: salt } } },
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("Passkey creation was cancelled");
  const ext = cred.getClientExtensionResults().prf;
  if (!ext?.enabled) throw new Error("This phone's passkeys can't protect a wallet key. Try Chrome on Android, or Safari on iPhone (iOS 18 or later).");
  const credentialId = b64u(new Uint8Array(cred.rawId));
  // Some platforms only return the PRF output on sign-in, not on creation.
  const first = ext.results?.first;
  const prf = first ? toBytes(first) : await evaluatePrf(credentialId, salt);
  return { credentialId, prf };
}

/**
 * New wallet whose key comes from the passkey (v2). Returns the record and the address;
 * `addressOf` turns the phrase into the chain address (kept out of this module so tests stay light).
 */
export async function createPasskeyVault(kind: VaultKind, addressOf: (phrase: string) => Promise<string>, label?: string): Promise<PasskeyRecord> {
  const userId = new Uint8Array([...HANDLE_MAGIC, KIND_BYTE[kind], ...crypto.getRandomValues(new Uint8Array(12))]);
  const { credentialId, prf } = await createPasskey(kind, userId, await prfSalt(kind), label);
  const record: PasskeyRecord = { v: 2, kind, address: await addressOf(await phraseFromPrf(prf, kind)), credentialId };
  store(kind, record);
  return record;
}

/** Errors "Sign in" can show as they are: the person picked the wrong passkey. */
export class SignInError extends Error {}

/** Sign in on this phone with an existing passkey (after clearing data, or on a new phone with the same Google or Apple account). */
export async function signInWithPasskey(kind: VaultKind, addressOf: (phrase: string) => Promise<string>): Promise<PasskeyRecord> {
  const cred = (await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      userVerification: "required",
      timeout: 120_000,
      extensions: { prf: { eval: { first: await prfSalt(kind) } } },
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new SignInError("Sign in was cancelled");
  const response = cred.response as AuthenticatorAssertionResponse;
  const found = handleKind(response.userHandle ? new Uint8Array(response.userHandle) : null);
  if (found === "old") throw new SignInError("This passkey is from an older version of StableTap. Use your recovery phrase instead.");
  if (found !== kind) throw new SignInError(kind === "shop" ? "That's your wallet passkey. Pick the one with your shop's name." : "That's a shop passkey. Pick \"StableTap wallet\".");
  const first = cred.getClientExtensionResults().prf?.results?.first;
  if (!first) throw new SignInError("This phone's passkeys can't sign in to a wallet. Use your recovery phrase instead.");
  const record: PasskeyRecord = { v: 2, kind, address: await addressOf(await phraseFromPrf(toBytes(first), kind)), credentialId: b64u(new Uint8Array(cred.rawId)) };
  store(kind, record);
  return record;
}

/** Restore from a recovery phrase: a new passkey on this phone locks a sealed copy of the phrase (v1). */
export async function createVault(mnemonic: string, address: string, kind: VaultKind = "personal", label?: string): Promise<SealedRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const { credentialId, prf } = await createPasskey(kind, crypto.getRandomValues(new Uint8Array(16)), salt, label);
  const record = await seal(mnemonic, prf, { address, credentialId, prfSalt: b64u(salt) });
  store(kind, record);
  return record;
}

/** Ask for the phone's lock (fingerprint, face, PIN or pattern) and return the recovery phrase. */
export async function unlockVault(record: VaultRecord): Promise<string> {
  if (record.v === 2) return phraseFromPrf(await evaluatePrf(record.credentialId, await prfSalt(record.kind)), record.kind);
  return open(record, await evaluatePrf(record.credentialId, fromB64u(record.prfSalt)));
}

async function evaluatePrf(credentialId: string, salt: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const cred = (await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{ type: "public-key", id: fromB64u(credentialId) }],
      userVerification: "required",
      timeout: 120_000,
      extensions: { prf: { eval: { first: salt } } },
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("Unlock was cancelled");
  const first = cred.getClientExtensionResults().prf?.results?.first;
  if (!first) throw new Error("The passkey did not return its secret (PRF unsupported on this device)");
  return toBytes(first);
}

function toBytes(src: BufferSource): Uint8Array<ArrayBuffer> {
  const view = ArrayBuffer.isView(src) ? new Uint8Array(src.buffer, src.byteOffset, src.byteLength) : new Uint8Array(src);
  return new Uint8Array(view);
}
