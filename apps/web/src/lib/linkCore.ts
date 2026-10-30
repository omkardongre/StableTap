import { formatAmount, parseAmount } from "@stabletap/engine/config";
import { network, options } from "./network";
import { usd } from "./format";

/**
 * Payment-link basics shared by the server (chat preview, short links) and the browser.
 * Nothing here touches localStorage or the chain.
 */

/** What a customer sees and pays: one item at a fixed price from one shop. */
export interface LinkInfo {
  /** 6 characters, [a-z0-9]; also the short URL /l/<id>. */
  id: string;
  item: string;
  /** Stablecoin smallest units. */
  amount: bigint;
  shop: string;
  to: string;
}

export const LINK_ID = /^[a-z0-9]{6}$/;
export const ITEM_MAX = 30;
export const SHOP_MAX = 40;
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/;

/** The short URL people share, like buy.stripe.com/<id>. */
export const shortLinkUrl = (origin: string, id: string) => new URL(`/l/${id}`, origin).toString();

/** The long form: everything in the URL. Used when the indexer is down, and to renew an expired checkout. */
export function linkQuery(l: Pick<LinkInfo, "id" | "item" | "amount" | "shop" | "to">): string {
  const q = new URLSearchParams();
  q.set("k", l.id);
  q.set("i", l.item);
  q.set("a", formatAmount(l.amount, network.decimals));
  q.set("s", l.shop);
  q.set("to", l.to);
  return `?${q.toString()}`;
}

/** Chat preview text, e.g. "Chocolate cake · $2.00" and "Pay Sunrise Bakery in dollars". */
export function previewText(l: Pick<LinkInfo, "item" | "amount" | "shop">) {
  return { title: `${l.item} · ${usd(l.amount)}`, description: `Pay ${l.shop} in dollars` };
}

/** Message shared with the link (WhatsApp shows it above the preview card). */
export const shareText = (l: Pick<LinkInfo, "item" | "amount" | "shop">) => `${l.item}, ${usd(l.amount)} from ${l.shop}`;

const cleanText = (v: string | null | undefined, max: number) => {
  const t = (v ?? "").trim();
  return t.length >= 1 && t.length <= max && !CONTROL.test(t) ? t : null;
};

/** Item, shop and price from a long link's query, for the preview only (the wallet checks the full link before paying). */
export function previewFromQuery(q: URLSearchParams): Pick<LinkInfo, "item" | "amount" | "shop"> | null {
  const item = cleanText(q.get("i"), ITEM_MAX);
  const shop = cleanText(q.get("s"), SHOP_MAX);
  const a = (q.get("a") ?? "").trim();
  if (!item || !shop || !/^\d{1,7}(\.\d{1,2})?$/.test(a)) return null;
  const amount = parseAmount(a, network.decimals);
  return amount > 0n ? { item, shop, amount } : null;
}

/** A short link from the indexer, or null if it doesn't exist or the indexer can't be reached. Server and browser. */
export async function fetchShortLink(id: string, init?: RequestInit & { next?: { revalidate: number } }): Promise<LinkInfo | null> {
  if (!options.indexer || !LINK_ID.test(id)) return null;
  try {
    const res = await fetch(`${options.indexer}/v1/links/${id}`, { ...init, signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return null;
    const v = (await res.json()) as { id?: unknown; item?: unknown; shop?: unknown; amount?: unknown; merchant?: unknown };
    const item = typeof v.item === "string" ? cleanText(v.item, ITEM_MAX) : null;
    const shop = typeof v.shop === "string" ? cleanText(v.shop, SHOP_MAX) : null;
    if (v.id !== id || !item || !shop || typeof v.amount !== "string" || !/^[1-9]\d{0,19}$/.test(v.amount) || typeof v.merchant !== "string") return null;
    return { id, item, shop, amount: BigInt(v.amount), to: v.merchant };
  } catch {
    return null;
  }
}
