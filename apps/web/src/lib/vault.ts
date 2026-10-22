/**
 * Device-bound key vault. The recovery phrase is encrypted with AES-256-GCM
 * under a key derived (HKDF-SHA-256) from the WebAuthn PRF output of a
 * platform passkey, so it can only be opened after a fingerprint / face /
 * device-PIN check on this device. Nothing secret is ever stored in clear.
 */

export interface VaultRecord {
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

const HKDF_INFO = new TextEncoder().encode("stabletap/vault/v1");
const STORAGE_KEY = "stabletap.vault.v1";
const RP_NAME = "StableTap";

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
const aad = (r: Pick<VaultRecord, "v" | "address" | "credentialId">) => new TextEncoder().encode(`${r.v}|${r.address}|${r.credentialId}`);

export async function seal(
  secret: string,
  prfOutput: Uint8Array<ArrayBuffer>,
  meta: { address: string; credentialId: string; prfSalt: string },
): Promise<VaultRecord> {
  const hkdfSalt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(prfOutput, hkdfSalt);
  const head = { v: 1 as const, ...meta };
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(head) }, key, new TextEncoder().encode(secret));
  return { ...head, hkdfSalt: b64u(hkdfSalt), iv: b64u(iv), ct: b64u(new Uint8Array(ct)) };
}

export async function open(record: VaultRecord, prfOutput: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await deriveKey(prfOutput, fromB64u(record.hkdfSalt));
  try {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64u(record.iv), additionalData: aad(record) }, key, fromB64u(record.ct));
    return new TextDecoder().decode(pt);
  } catch {
    throw new Error("Could not unlock the wallet with this passkey");
  }
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
  const r = JSON.parse(json) as Partial<VaultRecord>;
  const fields = ["address", "credentialId", "prfSalt", "hkdfSalt", "iv", "ct"] as const;
  if (r.v !== 1 || fields.some((f) => typeof r[f] !== "string" || r[f].length === 0)) throw new Error("Stored wallet is corrupted");
  return r as VaultRecord;
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

export function loadVault(): VaultRecord | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? parseRecord(raw) : null;
}

export function removeVault(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Create a platform passkey, take its PRF secret and store the sealed phrase. */
export async function createVault(mnemonic: string, address: string): Promise<VaultRecord> {
  const prfSalt = crypto.getRandomValues(new Uint8Array(32));
  const cred = (await navigator.credentials.create({
    publicKey: {
      rp: { name: RP_NAME },
      user: { id: crypto.getRandomValues(new Uint8Array(16)), name: `StableTap ${address.slice(0, 6)}…${address.slice(-4)}`, displayName: "StableTap wallet" },
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "required", userVerification: "required" },
      timeout: 120_000,
      extensions: { prf: { eval: { first: prfSalt } } },
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("Passkey creation was cancelled");

  const ext = cred.getClientExtensionResults().prf;
  if (!ext?.enabled) throw new Error("This device's passkeys can't protect a wallet key (no PRF support). Try Chrome on Android, or Safari 18+ on iOS");
  const credentialId = b64u(new Uint8Array(cred.rawId));
  // Some platforms only return PRF output on assertion, not on creation.
  const first = ext.results?.first;
  const prf = first ? toBytes(first) : await evaluatePrf(credentialId, prfSalt);

  const record = await seal(mnemonic, prf, { address, credentialId, prfSalt: b64u(prfSalt) });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  await navigator.storage?.persist?.().catch(() => false);
  return record;
}

/** Ask for the passkey (fingerprint) and return the recovery phrase. */
export async function unlockVault(record: VaultRecord): Promise<string> {
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
