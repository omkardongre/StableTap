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
  /** Unix time (seconds, chain clock) after which the invoice must not be paid. */
  expiresAt?: number;
  /** Platform share taken out of `amount` in the same extrinsic (e.g. 100 bps = 1%). */
  split?: Split;
}

export interface Split {
  /** Platform SS58 address, normalized to the network prefix. */
  to: string;
  /** Basis points of the amount, 1..MAX_SPLIT_BPS. */
  bps: number;
}

export const MAX_SPLIT_BPS = 1_000;

/** How an invoice amount is divided: the merchant gets the rest after the platform share (rounded down). */
export function splitAmounts(inv: Invoice): { merchant: bigint; platform: bigint } {
  const platform = inv.split ? (inv.amount * BigInt(inv.split.bps)) / 10_000n : 0n;
  return { merchant: inv.amount - platform, platform };
}

export class InvoiceExpiredError extends Error {
  constructor() {
    super("This invoice has expired");
    this.name = "InvoiceExpiredError";
  }
}

/** Throws InvoiceExpiredError if `nowSec` (chain time) is at or past the invoice expiry. */
export function assertNotExpired(inv: Invoice, nowSec: number): void {
  if (inv.expiresAt !== undefined && nowSec >= inv.expiresAt) throw new InvoiceExpiredError();
}

const ID_RE = /^[a-z0-9_-]{1,32}$/;
const MERCHANT_MAX = 40;
const SCHEME = "portaldot:pay?";
// 32 symbols, so `byte & 31` is unbiased.
const ID_ALPHABET = "0123456789abcdefghjkmnpqrstvwxyz";

export const MEMO_PREFIX = "stabletap:";
export const REFUND_MEMO_PREFIX = "stabletap:refund:";
export const memoFor = (id: string) => `${MEMO_PREFIX}${id}`;
export const refundMemoFor = (id: string) => `${REFUND_MEMO_PREFIX}${id}`;
export const isInvoiceId = (id: string) => ID_RE.test(id);

/** Parse an on-chain memo. Ids never contain ':', so the two forms can't collide. */
export function parseMemo(text: string): { kind: "payment" | "refund"; invoiceId: string } | null {
  const [kind, rest] = text.startsWith(REFUND_MEMO_PREFIX)
    ? (["refund", text.slice(REFUND_MEMO_PREFIX.length)] as const)
    : text.startsWith(MEMO_PREFIX)
      ? (["payment", text.slice(MEMO_PREFIX.length)] as const)
      : [null, ""];
  return kind && ID_RE.test(rest) ? { kind, invoiceId: rest } : null;
}

/** Random id such as "inv-7k2m9xqa4c" (50 bits of entropy). */
export function newInvoiceId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return `inv-${Array.from(bytes, (b) => ID_ALPHABET[b & 31]).join("")}`;
}

/** portaldot:pay?to=<ss58>&amount=<units>&id=<id>&m=<name>&exp=<unix seconds> */
export function encodeInvoice(inv: Invoice, ss58: number): string {
  const v = validate(inv, ss58);
  const q = new URLSearchParams({ to: v.to, amount: v.amount.toString(), id: v.id });
  if (v.merchant) q.set("m", v.merchant);
  if (v.expiresAt !== undefined) q.set("exp", String(v.expiresAt));
  if (v.split) {
    q.set("st", v.split.to);
    q.set("sb", String(v.split.bps));
  }
  return `${SCHEME}${q}`;
}

export function decodeInvoice(uri: string, ss58: number): Invoice {
  const text = uri.trim();
  if (!text.startsWith(SCHEME)) throw new Error("Not a Portaldot payment link");
  const q = new URLSearchParams(text.slice(SCHEME.length));
  const amount = q.get("amount") ?? "";
  if (!/^\d{1,39}$/.test(amount)) throw new Error("Invalid amount");
  const exp = q.get("exp");
  if (exp !== null && !/^\d{1,12}$/.test(exp)) throw new Error("Invalid expiry");
  const st = q.get("st");
  const sb = q.get("sb");
  if ((st === null) !== (sb === null)) throw new Error("Invalid split");
  if (sb !== null && !/^\d{1,5}$/.test(sb)) throw new Error("Invalid split");
  return validate(
    {
      to: q.get("to") ?? "",
      amount: BigInt(amount),
      id: q.get("id") ?? "",
      merchant: q.get("m") ?? undefined,
      expiresAt: exp === null ? undefined : Number(exp),
      split: st !== null && sb !== null ? { to: st, bps: Number(sb) } : undefined,
    },
    ss58,
  );
}

/** Normalize an SS58 address to `ss58`; throws `message` on a bad checksum or format. */
export function normalizeAddress(address: string, ss58: number, message = "Invalid address"): string {
  try {
    return encodeAddress(decodeAddress(address.trim()), ss58);
  } catch {
    throw new Error(message);
  }
}

function validate(inv: Invoice, ss58: number): Invoice {
  const to = normalizeAddress(inv.to, ss58, "Invalid merchant address");
  if (inv.amount <= 0n) throw new Error("Amount must be positive");
  let split: Split | undefined;
  if (inv.split) {
    const splitTo = normalizeAddress(inv.split.to, ss58, "Invalid split address");
    if (!Number.isInteger(inv.split.bps) || inv.split.bps < 1 || inv.split.bps > MAX_SPLIT_BPS) throw new Error(`Split must be 1-${MAX_SPLIT_BPS} bps`);
    if (splitTo === to) throw new Error("Split address must differ from the merchant");
    split = { to: splitTo, bps: inv.split.bps };
  }
  if (!ID_RE.test(inv.id)) throw new Error("Invalid invoice id");
  const merchant = inv.merchant?.trim();
  if (merchant !== undefined && (merchant.length === 0 || merchant.length > MERCHANT_MAX)) {
    throw new Error(`Merchant name must be 1-${MERCHANT_MAX} characters`);
  }
  if (inv.expiresAt !== undefined && (!Number.isSafeInteger(inv.expiresAt) || inv.expiresAt <= 0)) throw new Error("Invalid expiry");
  return {
    to,
    amount: inv.amount,
    id: inv.id,
    ...(merchant ? { merchant } : {}),
    ...(inv.expiresAt !== undefined ? { expiresAt: inv.expiresAt } : {}),
    ...(split ? { split } : {}),
  };
}
