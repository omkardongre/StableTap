import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

/** What a merchant asks for. Carried inside the QR; no server needed. */
export interface Invoice {
  /** Merchant SS58 address, normalized to the network prefix. */
  to: string;
  /** Amount in the stablecoin's smallest unit. */
  amount: bigint;
  /** Short id, matched on-chain through the memo. */
  id: string;
  /** Display name shown to the customer. */
  merchant?: string;
}

const ID_RE = /^[a-z0-9_-]{1,32}$/;
const MERCHANT_MAX = 40;
const SCHEME = "portaldot:pay?";
// 32 symbols, so `byte & 31` is unbiased.
const ID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

export const MEMO_PREFIX = "stabletap:";
export const memoFor = (id: string) => `${MEMO_PREFIX}${id}`;

/** Random id such as "inv-7k2m9xqa4c" (50 bits of entropy). */
export function newInvoiceId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return `inv-${Array.from(bytes, (b) => ID_ALPHABET[b & 31]).join("")}`;
}

/** portaldot:pay?to=<ss58>&amount=<units>&id=<id>&m=<name> */
export function encodeInvoice(inv: Invoice, ss58: number): string {
  const v = validate(inv, ss58);
  const q = new URLSearchParams({ to: v.to, amount: v.amount.toString(), id: v.id });
  if (v.merchant) q.set("m", v.merchant);
  return `${SCHEME}${q}`;
}

export function decodeInvoice(uri: string, ss58: number): Invoice {
  const text = uri.trim();
  if (!text.startsWith(SCHEME)) throw new Error("Not a Portaldot payment link");
  const q = new URLSearchParams(text.slice(SCHEME.length));
  const amount = q.get("amount") ?? "";
  if (!/^\d{1,39}$/.test(amount)) throw new Error("Invalid amount");
  return validate({ to: q.get("to") ?? "", amount: BigInt(amount), id: q.get("id") ?? "", merchant: q.get("m") ?? undefined }, ss58);
}

function validate(inv: Invoice, ss58: number): Invoice {
  let to: string;
  try {
    to = encodeAddress(decodeAddress(inv.to), ss58);
  } catch {
    throw new Error("Invalid merchant address");
  }
  if (inv.amount <= 0n) throw new Error("Amount must be positive");
  if (!ID_RE.test(inv.id)) throw new Error("Invalid invoice id");
  const merchant = inv.merchant?.trim();
  if (merchant !== undefined && (merchant.length === 0 || merchant.length > MERCHANT_MAX)) {
    throw new Error(`Merchant name must be 1-${MERCHANT_MAX} characters`);
  }
  return { to, amount: inv.amount, id: inv.id, ...(merchant ? { merchant } : {}) };
}
