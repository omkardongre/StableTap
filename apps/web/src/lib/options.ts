import { MAX_SPLIT_BPS, normalizeAddress, type Split } from "@stabletap/engine/invoice";

/** Optional app features, from NEXT_PUBLIC_ env. Each is validated; a half-set pair is an error. */
export interface AppOptions {
  /** Indexer API base URL (history, stats, webhooks). */
  indexer: string | null;
  /** Block explorer base URL; links are `${explorer}/#/extrinsics/<block>-<index>`. */
  explorer: string | null;
  /** Platform share added to every POS invoice. */
  split: Split | null;
  /** Other assets (with a native pool) a customer may pay with; swapped to the stablecoin in the same tx. */
  payAssets: number[];
}

export function loadAppOptions(env: Record<string, string | undefined>, ss58: number): AppOptions {
  const indexer = url(env.NEXT_PUBLIC_STABLETAP_INDEXER, "NEXT_PUBLIC_STABLETAP_INDEXER");
  const explorer = url(env.NEXT_PUBLIC_STABLETAP_EXPLORER, "NEXT_PUBLIC_STABLETAP_EXPLORER");
  const to = env.NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS?.trim();
  const bps = env.NEXT_PUBLIC_STABLETAP_PLATFORM_BPS?.trim();
  if (!to !== !bps) throw new Error("Set both NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS and NEXT_PUBLIC_STABLETAP_PLATFORM_BPS, or neither");
  let split: Split | null = null;
  if (to && bps) {
    if (!/^\d{1,5}$/.test(bps) || Number(bps) < 1 || Number(bps) > MAX_SPLIT_BPS) throw new Error(`NEXT_PUBLIC_STABLETAP_PLATFORM_BPS must be 1-${MAX_SPLIT_BPS}`);
    split = { to: normalizeAddress(to, ss58, "NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS is not a valid address"), bps: Number(bps) };
  }
  const payAssets = (env.NEXT_PUBLIC_STABLETAP_PAY_ASSETS?.trim() ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      if (!/^\d{1,10}$/.test(x) || Number(x) > 0xffff_ffff) throw new Error("NEXT_PUBLIC_STABLETAP_PAY_ASSETS must be a comma-separated list of asset ids");
      return Number(x);
    });
  if (new Set(payAssets).size !== payAssets.length) throw new Error("NEXT_PUBLIC_STABLETAP_PAY_ASSETS has duplicates");
  return { indexer, explorer, split, payAssets };
}

function url(raw: string | undefined, key: string): string | null {
  const v = raw?.trim();
  if (!v) return null;
  if (!/^https?:\/\/[^\s/]+(\/[^\s]*)?$/.test(v)) throw new Error(`${key} must be an http(s) URL`);
  return v.replace(/\/+$/, "");
}
