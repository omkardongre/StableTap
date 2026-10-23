import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { decodeInvoice, type NetworkConfig } from "@stabletap/engine";
import type { Store } from "./db.ts";
import { HttpError } from "./webhooks.ts";

/**
 * Tap to pay with a fixed NFC tag (or printed QR) at the counter.
 *
 * The tag holds a URL with the terminal id, which phones open natively
 * (iOS and Android, no app or Web NFC needed). The POS publishes its current
 * charge here with a bearer token it got once at setup; the wallet fetches it.
 * A charge can only pay the terminal's merchant, so a leaked token can at
 * worst change the amount shown, which the customer confirms before paying.
 */

/** Longest a published charge may stay open (the POS uses 5 minutes). */
export const MAX_CHARGE_TTL_SEC = 15 * 60;
const ID_RE = /^[A-Za-z0-9_-]{22}$/;

const hashToken = (token: string) => createHash("sha256").update(token, "utf8").digest();

export function createTerminal(store: Store, merchant: string, nowMs: number): { id: string; token: string } {
  const id = randomBytes(16).toString("base64url");
  const token = randomBytes(32).toString("base64url");
  store.createTerminal({ id, tokenHash: hashToken(token), merchant, createdAt: nowMs });
  return { id, token };
}

function terminalFor(store: Store, id: string, authorization: string | undefined) {
  if (!ID_RE.test(id)) throw new HttpError(404, "Unknown terminal");
  const t = store.getTerminal(id);
  if (!t) throw new HttpError(404, "Unknown terminal");
  const m = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(authorization ?? "");
  if (!m || !timingSafeEqual(hashToken(m[1]!), t.tokenHash)) throw new HttpError(401, "Invalid terminal token");
  return t;
}

/** Publish the charge the terminal's tag should open. The link must pay this terminal's merchant and expire soon. */
export function publishCharge(store: Store, net: NetworkConfig, id: string, authorization: string | undefined, link: unknown, chainNowSec: number): { expiresAt: number } {
  const t = terminalFor(store, id, authorization);
  if (typeof link !== "string" || link.length > 1024) throw new HttpError(400, "Send { link } with a payment link");
  let inv;
  try {
    inv = decodeInvoice(link, net.ss58);
  } catch (e) {
    throw new HttpError(400, e instanceof Error ? e.message : "Invalid payment link");
  }
  if (inv.to !== t.merchant) throw new HttpError(403, "This terminal can only charge for its own merchant");
  if (inv.expiresAt === undefined) throw new HttpError(400, "The payment link must have an expiry");
  if (inv.expiresAt <= chainNowSec) throw new HttpError(400, "The payment link has already expired");
  if (inv.expiresAt > chainNowSec + MAX_CHARGE_TTL_SEC) throw new HttpError(400, `The payment link must expire within ${MAX_CHARGE_TTL_SEC / 60} minutes`);
  store.setTerminalCharge(id, { link, expiresAt: inv.expiresAt });
  return { expiresAt: inv.expiresAt };
}

export function clearCharge(store: Store, id: string, authorization: string | undefined): void {
  terminalFor(store, id, authorization);
  store.setTerminalCharge(id, null);
}

/**
 * The charge a tap should open, or null when there is none. A charge that has
 * expired or is already paid on chain is dropped, so a late tap can't pay twice.
 */
export function currentCharge(store: Store, net: NetworkConfig, id: string, chainNowSec: number): { link: string; expiresAt: number; merchant: string } | null {
  if (!ID_RE.test(id)) return null;
  const t = store.getTerminal(id);
  if (!t?.charge) return null;
  const { link, expiresAt } = t.charge;
  const inv = decodeInvoice(link, net.ss58);
  const paid = store.invoiceRecords(inv.id).some((r) => r.kind === "payment" && r.transfers.some((x) => x.to === t.merchant));
  if (expiresAt <= chainNowSec || paid) {
    store.setTerminalCharge(id, null);
    return null;
  }
  return { link, expiresAt, merchant: t.merchant };
}
