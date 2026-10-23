"use client";

import { options } from "./network";

/**
 * Tap to pay: the POS registers a terminal with the indexer once, then a
 * fixed NFC tag (or printed QR) at the counter holds `/tap/<id>`. Phones open
 * that URL natively; the page fetches the charge the POS published.
 */
export interface TerminalCreds {
  id: string;
  /** Bearer token for publishing charges. Stays on the POS device. */
  token: string;
  merchant: string;
}

const KEY = "stabletap.pos.terminal.v1";

export const terminalEnabled = () => options.indexer !== null;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  if (!options.indexer) throw new Error("Tap to pay needs the indexer (NEXT_PUBLIC_STABLETAP_INDEXER)");
  const res = await fetch(`${options.indexer}${path}`, { ...init, cache: "no-store", headers: { "content-type": "application/json", ...init?.headers } });
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw Object.assign(new Error(body.error ?? `Indexer error ${res.status}`), { status: res.status });
  return body;
}

export function loadTerminal(merchant: string): TerminalCreds | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const t = JSON.parse(raw) as Partial<TerminalCreds>;
  if (typeof t.id !== "string" || typeof t.token !== "string" || typeof t.merchant !== "string") throw new Error("Stored terminal settings are corrupted");
  // A terminal pays one merchant; a new payout address needs a new terminal (and tag).
  return t.merchant === merchant ? (t as TerminalCreds) : null;
}

export async function createTerminal(merchant: string): Promise<TerminalCreds> {
  const t = await call<TerminalCreds>("/v1/terminals", { method: "POST", body: JSON.stringify({ merchant }) });
  localStorage.setItem(KEY, JSON.stringify({ id: t.id, token: t.token, merchant: t.merchant }));
  return t;
}

export const forgetTerminal = () => localStorage.removeItem(KEY);

export const tapUrl = (id: string) => `${window.location.origin}/tap/${id}`;

const auth = (t: TerminalCreds) => ({ authorization: `Bearer ${t.token}` });

export const publishCharge = (t: TerminalCreds, link: string) =>
  call<{ expiresAt: number }>(`/v1/terminals/${t.id}/charge`, { method: "PUT", headers: auth(t), body: JSON.stringify({ link }) });

export const clearCharge = (t: TerminalCreds) => call<{ cleared: true }>(`/v1/terminals/${t.id}/charge`, { method: "DELETE", headers: auth(t) });

/** The open charge behind a tag, or null when the POS isn't charging right now. */
export async function fetchCharge(id: string): Promise<{ link: string; expiresAt: number } | null> {
  return (await call<{ charge: { link: string; expiresAt: number } | null }>(`/v1/terminals/${encodeURIComponent(id)}/charge`)).charge;
}

// Web NFC (Chrome on Android only). Writing the tag is a one-time setup step;
// reading needs no API at all, the phone opens the URL record by itself.
interface NdefWriter {
  write(message: { records: { recordType: "url"; data: string }[] }, options?: { overwrite?: boolean; signal?: AbortSignal }): Promise<void>;
}
declare global {
  interface Window {
    NDEFReader?: new () => NdefWriter;
  }
}

export const nfcWriteSupported = () => typeof window !== "undefined" && typeof window.NDEFReader === "function";

/** Write the tag URL as an NDEF URL record. Resolves once the tag is written; abort to stop waiting. */
export async function writeTag(url: string, signal: AbortSignal): Promise<void> {
  if (!window.NDEFReader) throw new Error("This browser can't write NFC tags. Use Chrome on Android, or write the link with any NFC app.");
  await new window.NDEFReader().write({ records: [{ recordType: "url", data: url }] }, { overwrite: true, signal });
}
