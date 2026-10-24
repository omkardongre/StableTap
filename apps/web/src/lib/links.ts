"use client";

import { normalizeAddress, parseAmount, type Invoice } from "@stabletap/engine";
import { formatAmount } from "@stabletap/engine/config";
import { network, options } from "./network";

/**
 * Payment links: a reusable URL for one item at a fixed price, like Stripe or Coinbase Payment Links.
 * Everything the checkout needs is in the URL, so no server stores them. Each customer who opens the
 * link gets a fresh invoice id ("lnk-<link id>-<random>"), which lets the shop's Sales page match a
 * payment back to its link and show the item name.
 */
export interface PaymentLink {
  /** 6 characters, [a-z0-9]. */
  id: string;
  item: string;
  /** Stablecoin smallest units. */
  amount: bigint;
  shop: string;
  to: string;
  createdAt: number;
}

const KEY = "stabletap.links.v1";
const ID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";
const LINK_ID = /^[a-z0-9]{6}$/;
export const ITEM_MAX = 30;
const SHOP_MAX = 40;

const randomId = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ID_ALPHABET[b & 31]).join("");

/** Invoice id for one checkout of a link; fits the engine's 32-character id limit. */
export const checkoutInvoiceId = (linkId: string) => `lnk-${linkId}-${randomId(8)}`;

/** The link id inside an invoice id made by `checkoutInvoiceId`, or null for counter sales. */
export function linkIdOf(invoiceId: string): string | null {
  const m = /^lnk-([a-z0-9]{6})-[a-z0-9]{8}$/.exec(invoiceId);
  return m ? m[1]! : null;
}

export function linkUrl(origin: string, l: Pick<PaymentLink, "id" | "item" | "amount" | "shop" | "to">): string {
  const u = new URL("/l", origin);
  u.searchParams.set("k", l.id);
  u.searchParams.set("i", l.item);
  u.searchParams.set("a", formatAmount(l.amount, network.decimals));
  u.searchParams.set("s", l.shop);
  u.searchParams.set("to", l.to);
  return u.toString();
}

/** Validates a link opened by a customer. Throws a readable error for broken or edited links. */
export function parseLink(params: URLSearchParams): Omit<PaymentLink, "createdAt"> {
  const id = params.get("k") ?? "";
  const item = (params.get("i") ?? "").trim();
  const shop = (params.get("s") ?? "").trim();
  const a = (params.get("a") ?? "").trim();
  if (!LINK_ID.test(id) || item.length < 1 || item.length > ITEM_MAX || shop.length < 1 || shop.length > SHOP_MAX || !/^\d{1,7}(\.\d{1,2})?$/.test(a)) {
    throw new Error("This payment link is broken. Ask the shop for a new one.");
  }
  const amount = parseAmount(a, network.decimals);
  if (amount <= 0n) throw new Error("This payment link is broken. Ask the shop for a new one.");
  const to = normalizeAddress(params.get("to") ?? "", network.ss58, "This payment link is broken. Ask the shop for a new one.");
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
export function linkInvoice(link: Omit<PaymentLink, "createdAt">, chainNowSec: number): Invoice {
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
}

export function loadLinks(to: string): PaymentLink[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  const all = JSON.parse(raw) as unknown;
  if (!Array.isArray(all)) throw new Error("Stored payment links are corrupted");
  return (all as Stored[])
    .filter((l) => l && l.to === to && LINK_ID.test(l.id) && /^\d+$/.test(l.amount))
    .map((l) => ({ ...l, amount: BigInt(l.amount) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function saveAll(links: Stored[]) {
  localStorage.setItem(KEY, JSON.stringify(links));
}

function readAll(): Stored[] {
  const raw = localStorage.getItem(KEY);
  const all = raw ? (JSON.parse(raw) as unknown) : [];
  return Array.isArray(all) ? (all as Stored[]) : [];
}

export function createLink(input: { item: string; amount: bigint; shop: string; to: string }): PaymentLink {
  const item = input.item.trim();
  if (item.length < 1 || item.length > ITEM_MAX) throw new Error(`Enter an item name (up to ${ITEM_MAX} characters)`);
  if (input.amount <= 0n) throw new Error("Enter a price");
  const link: PaymentLink = { id: randomId(6), item, amount: input.amount, shop: input.shop, to: input.to, createdAt: Date.now() };
  saveAll([{ ...link, amount: link.amount.toString() }, ...readAll()]);
  return link;
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
