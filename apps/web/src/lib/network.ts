import { loadNetwork, type NetworkConfig } from "@stabletap/engine/config";

/**
 * Browser-visible network config. Each NEXT_PUBLIC_ variable is referenced by
 * its full name so Next.js inlines it at build time; next.config.ts already
 * validated the same values, so a broken config never ships.
 */
export const network: NetworkConfig = loadNetwork({
  STABLETAP_WS: process.env.NEXT_PUBLIC_STABLETAP_WS,
  STABLETAP_ASSET_ID: process.env.NEXT_PUBLIC_STABLETAP_ASSET_ID,
  STABLETAP_ASSET_DECIMALS: process.env.NEXT_PUBLIC_STABLETAP_ASSET_DECIMALS,
});

/** tPOT decimals on Portaldot V3 (checked against the chain on connect). */
export const NATIVE_DECIMALS = 14;
export const STABLE_SYMBOL = "pUSD";
export const NATIVE_SYMBOL = "tPOT";
