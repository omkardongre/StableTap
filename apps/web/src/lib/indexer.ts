"use client";

import { options } from "./network";

export interface Transfer {
  from: string;
  to: string;
  amount: bigint;
}

export interface IndexedRecord {
  kind: "payment" | "refund";
  invoiceId: string;
  txHash: string;
  blockNumber: number;
  extrinsicIndex: number;
  signer: string;
  /** Unix ms. */
  timestamp: number;
  transfers: Transfer[];
  fee: { amount: bigint; assetId: number | null } | null;
  /** Payments only: how much this merchant has refunded against the invoice. */
  refunded?: bigint;
}

export interface Stats {
  indexedTo: number;
  payments: number;
  volume: bigint;
  refunds: number;
  refunded: bigint;
  payers: number;
  merchants: number;
  stableFees: { count: number; amount: bigint };
  nativeFeeCount: number;
  otherAssetFeeCount: number;
  pool: { native: bigint; stable: bigint };
  recent: IndexedRecord[];
}

export interface WebhookStatus {
  configured: boolean;
  host: string | null;
  deliveries: { id: string; status: string; attempts: number; lastError: string | null; deliveredAt: number | null }[];
}

export const indexerEnabled = () => options.indexer !== null;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  if (!options.indexer) throw new Error("History is not configured (NEXT_PUBLIC_STABLETAP_INDEXER)");
  const res = await fetch(`${options.indexer}${path}`, { ...init, cache: "no-store", headers: { "content-type": "application/json", ...init?.headers } });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Indexer error ${res.status}`);
  return body as T;
}

type Raw<T> = { [K in keyof T]: T[K] extends bigint ? string : T[K] extends bigint | undefined ? string | undefined : T[K] extends object ? Raw<T[K]> : T[K] };

function record(r: Raw<IndexedRecord>): IndexedRecord {
  return {
    ...r,
    transfers: r.transfers.map((t) => ({ ...t, amount: BigInt(t.amount) })),
    fee: r.fee && { amount: BigInt(r.fee.amount), assetId: r.fee.assetId },
    refunded: r.refunded === undefined ? undefined : BigInt(r.refunded),
  };
}

export async function fetchStats(): Promise<Stats> {
  const s = await call<Raw<Stats> & { recent: Raw<IndexedRecord>[] }>("/v1/stats");
  return {
    ...s,
    volume: BigInt(s.volume),
    refunded: BigInt(s.refunded),
    stableFees: { count: s.stableFees.count, amount: BigInt(s.stableFees.amount) },
    pool: { native: BigInt(s.pool.native), stable: BigInt(s.pool.stable) },
    recent: s.recent.map(record),
  };
}

export async function fetchMerchantRecords(merchant: string, limit = 50): Promise<IndexedRecord[]> {
  const r = await call<{ records: Raw<IndexedRecord>[] }>(`/v1/merchants/${encodeURIComponent(merchant)}/records?limit=${limit}`);
  return r.records.map(record);
}

export const fetchWebhook = (merchant: string) => call<WebhookStatus>(`/v1/merchants/${encodeURIComponent(merchant)}/webhook`);

export const putWebhook = (merchant: string, body: { url: string; signedAt: number; signature: string }) =>
  call<{ configured: true; secret: string }>(`/v1/merchants/${encodeURIComponent(merchant)}/webhook`, { method: "PUT", body: JSON.stringify(body) });

export const deleteWebhook = (merchant: string, body: { signedAt: number; signature: string }) =>
  call<{ configured: false }>(`/v1/merchants/${encodeURIComponent(merchant)}/webhook`, { method: "DELETE", body: JSON.stringify(body) });

/** Stablecoin this merchant received in a payment, or sent in a refund. */
export function merchantAmount(r: IndexedRecord, merchant: string): bigint {
  return r.transfers.filter((t) => (r.kind === "payment" ? t.to === merchant : t.from === merchant)).reduce((s, t) => s + t.amount, 0n);
}
