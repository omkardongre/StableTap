/**
 * Invoices this wallet has already paid, so scanning the same QR again is
 * refused instead of paying twice. Keyed by merchant + invoice id.
 * Entries also keep the shop name and amount for the wallet's "Recent" list.
 */
const KEY = "stabletap.paid.v1";
const MAX_ENTRIES = 500;
interface Entry {
  txHash: string;
  at: number;
  merchant?: string;
  /** Stablecoin base units as a decimal string (JSON has no bigint). */
  amount?: string;
}
type Ledger = Record<string, Entry>;
const keyOf = (to: string, id: string) => `${to}|${id}`;
function read(): Ledger {
  const raw = localStorage.getItem(KEY);
  if (!raw) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("Stored payment history is corrupted");
  return parsed as Ledger;
}
export function findPaid(to: string, id: string): string | null {
  return read()[keyOf(to, id)]?.txHash ?? null;
}
export function recordPaid(to: string, id: string, txHash: string, meta?: { merchant?: string; amount: bigint }): void {
  const ledger = read();
  ledger[keyOf(to, id)] = { txHash, at: Date.now(), merchant: meta?.merchant, amount: meta?.amount.toString() };
  const entries = Object.entries(ledger).sort((a, b) => b[1].at - a[1].at).slice(0, MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(entries)));
}

export interface RecentPayment {
  txHash: string;
  at: number;
  merchant: string;
  amount: bigint;
}

/** Newest payments made from this device, for the wallet's "Recent" list. */
export function recentPayments(limit = 5): RecentPayment[] {
  return Object.values(read())
    .filter((e) => typeof e.amount === "string" && /^\d+$/.test(e.amount))
    .sort((a, b) => b.at - a.at)
    .slice(0, limit)
    .map((e) => ({ txHash: e.txHash, at: e.at, merchant: e.merchant || "Shop", amount: BigInt(e.amount as string) }));
}

/** Shop names this device saw when paying, by invoice id (the chain only stores the id). */
export function paidNames(): Map<string, string> {
  const names = new Map<string, string>();
  for (const [key, e] of Object.entries(read())) if (e.merchant) names.set(key.slice(key.indexOf("|") + 1), e.merchant);
  return names;
}
