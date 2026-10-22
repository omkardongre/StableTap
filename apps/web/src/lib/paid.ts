/**
 * Invoices this wallet has already paid, so scanning the same QR again is
 * refused instead of paying twice. Keyed by merchant + invoice id.
 */
const KEY = "stabletap.paid.v1";
const MAX_ENTRIES = 500;

type Ledger = Record<string, { txHash: string; at: number }>;

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

export function recordPaid(to: string, id: string, txHash: string): void {
  const ledger = read();
  ledger[keyOf(to, id)] = { txHash, at: Date.now() };
  const entries = Object.entries(ledger).sort((a, b) => b[1].at - a[1].at).slice(0, MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(entries)));
}
