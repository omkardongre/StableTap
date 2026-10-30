import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { ApiPromise } from "@polkadot/api";
import { NATIVE, normalizeAddress, withId, type NetworkConfig } from "@stabletap/engine";
import type { Store, StoredRecord } from "./db.ts";
import type { IndexerStatus } from "./indexer.ts";
import { LINK_ID, saveLink } from "./links.ts";
import { HttpError, newSecret, validateWebhookUrl, verifyRegistration } from "./webhooks.ts";

export interface ApiDeps {
  store: Store;
  net: NetworkConfig;
  api: ApiPromise;
  status: () => IndexerStatus;
  corsOrigins: string[];
  allowInsecureWebhooks: boolean;
}

const MAX_BODY = 8 * 1024;
const WRITE_LIMIT = { perMinute: 10 };

/** JSON API. Read endpoints expose public chain data and public payment links; webhook writes need the merchant's signature. */
export function createApi(deps: ApiDeps): Server {
  const writes = new Map<string, { count: number; resetAt: number }>();

  return createServer((req, res) => {
    handle(req, res).catch((e: unknown) => {
      if (e instanceof HttpError) return send(res, e.status, { error: e.message });
      console.error(e);
      send(res, 500, { error: "Internal error" });
    });
  });

  async function handle(req: IncomingMessage, res: ServerResponse) {
    const origin = req.headers.origin;
    if (origin && deps.corsOrigins.includes(origin)) {
      res.setHeader("access-control-allow-origin", origin);
      res.setHeader("vary", "origin");
      res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");
      res.setHeader("access-control-allow-headers", "content-type, authorization");
      res.setHeader("access-control-max-age", "600");
    }
    if (req.method === "OPTIONS") return send(res, 204, null);
    const url = new URL(req.url ?? "/", "http://localhost");
    const parts = url.pathname.split("/").filter(Boolean);

    if (req.method === "GET" && url.pathname === "/health") {
      const s = deps.status();
      return send(res, s.lastError ? 503 : 200, { ok: !s.lastError, ...s });
    }

    if (req.method === "GET" && url.pathname === "/v1/stats") {
      const reserves = await deps.api.call.assetConversionApi.getReserves(NATIVE, withId(deps.net.assetId));
      const [native, stable] = reserves.isSome ? reserves.unwrap().map((x) => x.toBigInt()) : [0n, 0n];
      return send(res, 200, {
        network: { assetId: deps.net.assetId, decimals: deps.net.decimals },
        indexedTo: deps.status().nextBlock - 1,
        ...deps.store.stats(deps.net.assetId),
        pool: { native, stable },
        recent: deps.store.recentRecords(20),
      });
    }

    if (parts[0] === "v1" && parts[1] === "links") {
      if (req.method === "POST" && parts.length === 2) {
        rateLimit(req);
        return send(res, 201, saveLink(deps.store, deps.net.ss58, await readJson(req), Date.now()));
      }
      if (req.method === "GET" && parts.length === 3 && parts[2]) {
        const link = LINK_ID.test(parts[2]) ? deps.store.getLink(parts[2]) : null;
        if (!link) throw new HttpError(404, "Unknown link");
        return send(res, 200, link);
      }
    }

    // A customer's own activity (public chain data, like the merchant view).
    if (req.method === "GET" && parts[0] === "v1" && parts[1] === "payers" && parts[2] && parts[3] === "records" && parts.length === 4) {
      const payer = addressParam(parts[2], deps.net.ss58);
      const limit = intParam(url.searchParams.get("limit"), 20, 1, 100);
      return send(res, 200, { payer, records: deps.store.payerRecords(payer, limit) });
    }

    if (parts[0] === "v1" && parts[1] === "merchants" && parts[2]) {
      const merchant = addressParam(parts[2], deps.net.ss58);
      if (req.method === "GET" && parts.length === 4 && parts[3] === "records") {
        const limit = intParam(url.searchParams.get("limit"), 50, 1, 200);
        const before = url.searchParams.has("before") ? intParam(url.searchParams.get("before"), 0, 1, 2 ** 32) : undefined;
        const records = deps.store.merchantRecords(merchant, limit, before);
        return send(res, 200, { merchant, records: records.map((r) => withRefunds(r, merchant)) });
      }
      if (parts.length === 4 && parts[3] === "webhook") {
        if (req.method === "GET") {
          const hook = deps.store.getWebhook(merchant);
          return send(res, 200, {
            configured: !!hook,
            host: hook ? new URL(hook.url).host : null,
            deliveries: deps.store.deliveryStatus(merchant, 20),
          });
        }
        if (req.method === "PUT" || req.method === "DELETE") {
          rateLimit(req);
          const body = await readJson(req);
          const signedAt = body.signedAt;
          const signature = body.signature;
          if (typeof signedAt !== "number" || typeof signature !== "string") throw new HttpError(400, "Send { signedAt, signature }");
          const now = Math.floor(Date.now() / 1000);
          if (req.method === "DELETE") {
            verifyRegistration(deps.store, merchant, "", signedAt, signature, now);
            deps.store.deleteWebhook(merchant);
            return send(res, 200, { configured: false });
          }
          if (typeof body.url !== "string") throw new HttpError(400, "Send { url, signedAt, signature }");
          // The merchant signs the URL exactly as sent; normalization must not change it.
          const target = validateWebhookUrl(body.url, deps.allowInsecureWebhooks);
          if (target !== body.url) throw new HttpError(400, `Use the normalized url: ${target}`);
          verifyRegistration(deps.store, merchant, body.url, signedAt, signature, now);
          const secret = newSecret();
          deps.store.putWebhook({ merchant, url: target, secret, signedAt });
          return send(res, 200, { configured: true, secret });
        }
      }
    }
    throw new HttpError(404, "Not found");
  }

  /** For a payment, add how much this merchant has refunded against the same invoice. */
  function withRefunds(r: StoredRecord, merchant: string) {
    if (r.kind !== "payment") return r;
    const refunded = deps.store
      .invoiceRecords(r.invoiceId)
      .filter((x) => x.kind === "refund" && x.signer === merchant)
      .flatMap((x) => x.transfers.filter((t) => t.from === merchant))
      .reduce((s, t) => s + t.amount, 0n);
    return { ...r, refunded };
  }

  function rateLimit(req: IncomingMessage) {
    const key = req.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    const cur = writes.get(key);
    if (!cur || cur.resetAt <= now) writes.set(key, { count: 1, resetAt: now + 60_000 });
    else if (++cur.count > WRITE_LIMIT.perMinute) throw new HttpError(429, "Too many requests");
    if (writes.size > 10_000) for (const [k, v] of writes) if (v.resetAt <= now) writes.delete(k);
  }
}

function addressParam(raw: string, ss58: number): string {
  try {
    return normalizeAddress(decodeURIComponent(raw), ss58);
  } catch {
    throw new HttpError(400, "Invalid address");
  }
}

function intParam(raw: string | null, dflt: number, min: number, max: number): number {
  if (raw === null) return dflt;
  if (!/^\d{1,10}$/.test(raw)) throw new HttpError(400, "Invalid number");
  const n = Number(raw);
  if (n < min || n > max) throw new HttpError(400, "Number out of range");
  return n;
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (!req.headers["content-type"]?.startsWith("application/json")) throw new HttpError(415, "Use application/json");
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const c of req as AsyncIterable<Buffer>) {
    size += c.length;
    if (size > MAX_BODY) throw new HttpError(413, "Body too large");
    chunks.push(c);
  }
  let v: unknown;
  try {
    v = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw new HttpError(400, "Body must be a JSON object");
  return v as Record<string, unknown>;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("cache-control", "no-store");
  res.setHeader("x-content-type-options", "nosniff");
  if (body === null) return res.end();
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body, (_k, v: unknown) => (typeof v === "bigint" ? v.toString() : v)));
}
