"use client";

import { normalizeAddress, parseAmount, type Invoice } from "@stabletap/engine";
import { ITEM_MAX, LINK_ID, SHOP_MAX, fetchShortLink, linkQuery, shortLinkUrl, type LinkInfo } from "./linkCore";
import { network, options } from "./network";

export { ITEM_MAX } from "./linkCore";

/**
 * Payment links: a reusable URL for one item at a fixed price, like Stripe or Coinbase Payment Links.
 * The link is saved with the indexer so the shared URL is short (/l/<id>) and doesn't show the
 * shop's address; the long form (everything in the URL) still works and is the fallback when the
 * indexer can't be reached. Each customer who opens the link gets a fresh invoice id
 * ("lnk-<link id>-<random>"), which lets the shop's Sales page match a payment back to its link.
 */
export interface PaymentLink extends LinkInfo {
  createdAt: number;
  /** Saved with the indexer, so the short URL works. */
  short: boolean;
}

const KEY = "stabletap.links.v1";
const ID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

const randomId = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ID_ALPHABET[b & 31]).join("");

/** Invoice id for one checkout of a link; fits the engine's 32-character id limit. */
export const checkoutInvoiceId = (linkId: string) => `lnk-${linkId}-${randomId(8)}`;

/** The link id inside an invoice id made by `checkoutInvoiceId`, or null for counter sales. */
export function linkIdOf(invoiceId: string): string | null {
  const m = /^lnk-([a-z0-9]{6})-[a-z0-9]{8}$/.exec(invoiceId);
  return m ? m[1]! : null;
}

/** The URL the shop shares: short when saved with the indexer, otherwise the long form. */
export const linkUrl = (origin: string, l: PaymentLink) => (l.short ? shortLinkUrl(origin, l.id) : new URL(`/l${linkQuery(l)}`, origin).toString());

/** Validates a link opened by a customer. Throws a readable error for broken or edited links. */
export function parseLink(params: URLSearchParams): LinkInfo {
  const broken = "This payment link is broken. Ask the shop for a new one.";
  const id = params.get("k") ?? "";
  const item = (params.get("i") ?? "").trim();
  const shop = (params.get("s") ?? "").trim();
  const a = (params.get("a") ?? "").trim();
  if (!LINK_ID.test(id) || item.length < 1 || item.length > ITEM_MAX || shop.length < 1 || shop.length > SHOP_MAX || !/^\d{1,7}(\.\d{1,2})?$/.test(a)) {
    throw new Error(broken);
  }
  const amount = parseAmount(a, network.decimals);
  if (amount <= 0n) throw new Error(broken);
  const to = normalizeAddress(params.get("to") ?? "", network.ss58, broken);
  return { id, item, amount, shop, to };
}

/** Name the wallet shows for a link payment, within the invoice's 40-character merchant limit. */
export function checkoutName(shop: string, item: string): string {
  const full = `${shop} · ${item}`;
  return full.length <= SHOP_MAX ? full : `${full.slice(0, SHOP_MAX - 1)}…`;
}

/** Long enough to create a wallet and add test dollars before paying. */
export const CHECKOUT_TTL_SEC = 15 * 60;

/** A fresh invoice for one checkout of a link: one link, many customers, each payment matched on its own. */
export function linkInvoice(link: LinkInfo, chainNowSec: number): Invoice {
  return {
    to: link.to,
    amount: link.amount,
    id: checkoutInvoiceId(link.id),
    merchant: checkoutName(link.shop, link.item),
    expiresAt: chainNowSec + CHECKOUT_TTL_SEC,
    ...(options.split ? { split: options.split } : {}),
  };
}

// ---------- the shop's own list (this device) ----------

interface Stored {
  id: string;
  item: string;
  amount: string;
  shop: string;
  to: string;
  createdAt: number;
  short?: boolean;
}

export function loadLinks(to: string): PaymentLink[] {
  return readAll()
    .filter((l) => l && l.to === to && LINK_ID.test(l.id) && /^\d+$/.test(l.amount))
    .map((l) => ({ ...l, amount: BigInt(l.amount), short: l.short === true }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(links: Stored[]) {
  localStorage.setItem(KEY, JSON.stringify(links));
}

function readAll(): Stored[] {
  const raw = localStorage.getItem(KEY);
  const all = raw ? (JSON.parse(raw) as unknown) : [];
  if (!Array.isArray(all)) throw new Error("Stored payment links are corrupted");
  return all as Stored[];
}

/** Save the link with the indexer so its short URL works. False if the id is taken or the indexer can't be reached. */
async function register(l: LinkInfo): Promise<"ok" | "taken" | "failed"> {
  if (!options.indexer) return "failed";
  try {
    const res = await fetch(`${options.indexer}/v1/links`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: l.id, item: l.item, shop: l.shop, amount: l.amount.toString(), merchant: l.to }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok ? "ok" : res.status === 409 ? "taken" : "failed";
  } catch {
    return "failed";
  }
}

export async function createLink(input: { item: string; amount: bigint; shop: string; to: string }): Promise<PaymentLink> {
  const item = input.item.trim();
  if (item.length < 1 || item.length > ITEM_MAX) throw new Error(`Enter an item name (up to ${ITEM_MAX} characters)`);
  if (input.amount <= 0n) throw new Error("Enter a price");
  let link: PaymentLink = { id: randomId(6), item, amount: input.amount, shop: input.shop, to: input.to, createdAt: Date.now(), short: false };
  // Ids are random; on the rare clash with another shop's link, pick a new one.
  for (let i = 0; i < 3; i++) {
    const r = await register(link);
    if (r === "ok") link = { ...link, short: true };
    if (r !== "taken") break;
    link = { ...link, id: randomId(6) };
  }
  saveAll([{ ...link, amount: link.amount.toString() }, ...readAll()]);
  return link;
}

/** Links made before short links (or while offline): save them with the indexer so they get a short URL too. */
export async function upgradeLinks(to: string): Promise<PaymentLink[] | null> {
  const pending = loadLinks(to).filter((l) => !l.short);
  if (pending.length === 0) return null;
  let changed = false;
  const all = readAll();
  for (const l of pending) {
    if ((await register(l)) !== "ok") continue;
    const s = all.find((x) => x.id === l.id && x.to === to);
    if (s) {
      s.short = true;
      changed = true;
    }
  }
  if (!changed) return null;
  saveAll(all);
  return loadLinks(to);
}

export function deleteLink(id: string): void {
  saveAll(readAll().filter((l) => l.id !== id));
}

/** Item names of this shop's links, by link id, for labelling sales. */
export function linkItems(to: string): Map<string, string> {
  try {
    return new Map(loadLinks(to).map((l) => [l.id, l.item]));
  } catch {
    return new Map();
  }
}

/** Item name of a link made on another phone (e.g. before signing in here), from the indexer. */
export async function remoteLinkItem(id: string): Promise<string | null> {
  return (await fetchShortLink(id, { cache: "no-store" }))?.item ?? null;
}
