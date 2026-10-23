import { formatAmount } from "@stabletap/engine/config";
import { NATIVE_DECIMALS, network } from "./network";

/** Dollars to the cent, like every money app shows them; sub-cent dust is dropped (never rounded up). */
export function usd(units: bigint): string {
  const perCent = 10n ** BigInt(Math.max(0, network.decimals - 2));
  const neg = units < 0n;
  const cents = (neg ? -units : units) / perCent;
  return `${neg ? "-" : ""}$${(cents / 100n).toLocaleString("en-US")}.${String(cents % 100n).padStart(2, "0")}`;
}
/** A fee rounded up to whole cents, the way people read prices ("$0.02"). */
export function usdFee(units: bigint): string {
  const perCent = 10n ** BigInt(Math.max(0, network.decimals - 2));
  const cents = (units + perCent - 1n) / perCent;
  return `$${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`;
}
/** "12:57 AM". Always 12-hour so it never reads as "0:57". */
export const clockText = (ms: number) => new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

/** "Today", "Yesterday" or "23 Oct", for list headers. */
export function dayText(ms: number): string {
  const d = new Date(ms).setHours(0, 0, 0, 0);
  const now = new Date();
  if (d === new Date(now).setHours(0, 0, 0, 0)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d === yesterday.setHours(0, 0, 0, 0)) return "Yesterday";
  const date = new Date(ms);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(date.getFullYear() === new Date().getFullYear() ? {} : { year: "numeric" }) });
}

/** "12:57 AM" today, otherwise "23 Oct, 12:57 AM". */
export const whenText = (ms: number) => (dayText(ms) === "Today" ? clockText(ms) : `${dayText(ms)}, ${clockText(ms)}`);

export const tpot = (planck: bigint) => formatAmount(planck, NATIVE_DECIMALS);
export const shortHash = (h: string) => `${h.slice(0, 10)}…${h.slice(-8)}`;
export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
