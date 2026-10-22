import { formatAmount } from "@stabletap/engine/config";
import { NATIVE_DECIMALS, network } from "./network";

export const usd = (units: bigint) => `$${formatAmount(units, network.decimals)}`;
export const tpot = (planck: bigint) => formatAmount(planck, NATIVE_DECIMALS);
export const shortHash = (h: string) => `${h.slice(0, 10)}…${h.slice(-8)}`;
export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
