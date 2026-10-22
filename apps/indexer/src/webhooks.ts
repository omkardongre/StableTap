import { createHmac, randomBytes } from "node:crypto";
import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { BlockList, isIP, type LookupFunction } from "node:net";
import { blake2AsHex, signatureVerify } from "@polkadot/util-crypto";
import { webhookRegistrationMessage, type ChainRecord, type NetworkConfig } from "@stabletap/engine";
import type { Store } from "./db.ts";

/**
 * Webhooks follow the Standard Webhooks spec (symmetric v1): headers
 * webhook-id / webhook-timestamp / webhook-signature, where the signature is
 * base64(HMAC-SHA256(secret, `${id}.${timestamp}.${body}`)) and the secret is
 * shown to the merchant once as `whsec_<base64>`.
 */
export function newSecret(): string {
  return `whsec_${randomBytes(32).toString("base64")}`;
}

export function sign(secret: string, id: string, timestamp: number, body: string): string {
  if (!secret.startsWith("whsec_")) throw new Error("Invalid webhook secret");
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  return `v1,${createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64")}`;
}

/** Deterministic per (merchant, extrinsic), so re-indexing a block never creates a second event. */
export function eventId(rec: ChainRecord, merchant: string): string {
  return `msg_${blake2AsHex(`${merchant}:${rec.blockHash}:${rec.extrinsicIndex}`, 128).slice(2)}`;
}

export function eventPayload(net: NetworkConfig, rec: ChainRecord, merchant: string): { id: string; payload: string } {
  const amount = rec.kind === "refund"
    ? rec.transfers.filter((t) => t.from === merchant).reduce((s, t) => s + t.amount, 0n)
    : rec.transfers.filter((t) => t.to === merchant).reduce((s, t) => s + t.amount, 0n);
  const body = {
    type: rec.kind === "payment" ? "payment.succeeded" : "refund.succeeded",
    timestamp: new Date(rec.timestamp).toISOString(),
    data: {
      invoiceId: rec.invoiceId,
      merchant,
      amount: amount.toString(),
      assetId: net.assetId,
      decimals: net.decimals,
      txHash: rec.txHash,
      blockNumber: rec.blockNumber,
      blockHash: rec.blockHash,
      extrinsicIndex: rec.extrinsicIndex,
      signer: rec.signer,
      transfers: rec.transfers.map((t) => ({ from: t.from, to: t.to, amount: t.amount.toString() })),
      fee: rec.fee && { amount: rec.fee.amount.toString(), assetId: rec.fee.assetId },
    },
  };
  return { id: eventId(rec, merchant), payload: JSON.stringify(body) };
}

export const REGISTRATION_MAX_SKEW_SEC = 300;

/** Verify a merchant-signed registration: valid sr25519/ed25519 signature, fresh, and newer than the last one. */
export function verifyRegistration(store: Store, merchant: string, url: string, signedAt: number, signature: string, nowSec: number): void {
  if (!Number.isSafeInteger(signedAt) || Math.abs(nowSec - signedAt) > REGISTRATION_MAX_SKEW_SEC) throw new HttpError(400, "signedAt must be within 5 minutes of now");
  if (!/^0x[0-9a-f]{128}$/i.test(signature)) throw new HttpError(400, "signature must be 64 bytes hex");
  if (!signatureVerify(webhookRegistrationMessage(merchant, url, signedAt), signature, merchant).isValid) throw new HttpError(401, "Signature does not match the merchant address");
  const prev = store.getWebhook(merchant);
  if (prev && signedAt <= prev.signedAt) throw new HttpError(409, "A newer registration already exists");
}

export class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Loopback, private, link-local, CGNAT, multicast, reserved and documentation ranges.
const BLOCKED = new BlockList();
for (const [net, bits] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24],
  ["192.0.2.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
] as const) BLOCKED.addSubnet(net, bits, "ipv4");
// BlockList already matches IPv4-mapped IPv6 (::ffff:a.b.c.d) against the IPv4 rules above.
for (const [net, bits] of [["::", 128], ["::1", 128], ["64:ff9b::", 96], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8], ["2001:db8::", 32]] as const) {
  BLOCKED.addSubnet(net, bits, "ipv6");
}

export function isPublicIp(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return false;
  return !BLOCKED.check(address, family === 4 ? "ipv4" : "ipv6");
}

/** Validate a webhook URL's shape. Address checks happen at connect time (see `guardedLookup`). */
export function validateWebhookUrl(raw: string, allowInsecure: boolean): string {
  if (raw.length > 2048) throw new HttpError(400, "url too long");
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new HttpError(400, "url is not a valid URL");
  }
  if (u.protocol !== "https:" && !(allowInsecure && u.protocol === "http:")) throw new HttpError(400, "url must use https");
  if (u.username || u.password) throw new HttpError(400, "url must not contain credentials");
  if (u.hash) throw new HttpError(400, "url must not contain a fragment");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host) && !allowInsecure && !isPublicIp(host)) throw new HttpError(400, "url must point to a public address");
  return u.toString();
}

/**
 * DNS lookup used for every delivery connection: refuses non-public addresses
 * at connect time, so DNS rebinding after registration can't reach internal hosts.
 */
export function guardedLookup(allowInsecure: boolean): LookupFunction {
  return (hostname, options, callback) => {
    dnsLookup(hostname, { ...options, all: true }, (err, addresses: LookupAddress[]) => {
      if (err) return callback(err, "", 0);
      const ok = allowInsecure ? addresses : addresses.filter((a) => isPublicIp(a.address));
      if (ok.length === 0 || ok.length !== addresses.length) {
        return callback(Object.assign(new Error(`Refusing to connect to non-public address for ${hostname}`), { code: "EBLOCKED" }), "", 0);
      }
      if (options.all) return (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, ok);
      callback(null, ok[0]!.address, ok[0]!.family);
    });
  };
}

const TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 64 * 1024;
/** Retry delays after each failed attempt; the event is marked failed after the last. */
export const RETRY_DELAYS_SEC = [5, 30, 120, 600, 1800, 7200, 18000, 36000];

/** POST one signed event. Resolves with the HTTP status; redirects are not followed. */
export function post(url: string, secret: string, id: string, payload: string, allowInsecure: boolean): Promise<number> {
  const ts = Math.floor(Date.now() / 1000);
  const u = new URL(url);
  const req = u.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise((resolve, reject) => {
    const r = req(
      u,
      {
        method: "POST",
        lookup: guardedLookup(allowInsecure),
        timeout: TIMEOUT_MS,
        headers: {
          "content-type": "application/json",
          "user-agent": "StableTap-Webhooks/1",
          "webhook-id": id,
          "webhook-timestamp": String(ts),
          "webhook-signature": sign(secret, id, ts, payload),
        },
      },
      (res) => {
        let size = 0;
        res.on("data", (c: Buffer) => {
          size += c.length;
          if (size > MAX_RESPONSE_BYTES) res.destroy();
        });
        res.on("close", () => resolve(res.statusCode ?? 0));
      },
    );
    r.on("timeout", () => r.destroy(new Error("timeout")));
    r.on("error", reject);
    r.end(payload);
  });
}

/** Deliver due events one by one; at-least-once, with backoff. Returns a stop fn. */
export function startDelivery(store: Store, allowInsecure: boolean, log: (msg: string) => void, intervalMs = 2_000): () => void {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      for (const d of store.dueDeliveries(Date.now(), 20)) {
        const hook = store.getWebhook(d.merchant);
        if (!hook) {
          store.markFailedAttempt(d.id, "webhook removed", null);
          continue;
        }
        let error: string;
        try {
          const status = await post(hook.url, hook.secret, d.id, d.payload, allowInsecure);
          if (status >= 200 && status < 300) {
            store.markDelivered(d.id, Date.now());
            continue;
          }
          error = `HTTP ${status}`;
        } catch (e) {
          error = e instanceof Error ? e.message : String(e);
        }
        const delay = RETRY_DELAYS_SEC[d.attempts];
        store.markFailedAttempt(d.id, error, delay === undefined ? null : Date.now() + delay * 1000);
        log(`webhook ${d.id} to ${d.merchant}: ${error}${delay === undefined ? " (giving up)" : `, retry in ${delay}s`}`);
      }
    } catch (e) {
      log(`webhook worker error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      running = false;
    }
  };
  const timer = setInterval(() => void tick(), intervalMs);
  void tick();
  return () => clearInterval(timer);
}
