import { loadNetwork, type NetworkConfig } from "@stabletap/engine/config";
import { loadAppOptions, type AppOptions } from "./options";

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

export const options: AppOptions = loadAppOptions(
  {
    NEXT_PUBLIC_STABLETAP_INDEXER: process.env.NEXT_PUBLIC_STABLETAP_INDEXER,
    NEXT_PUBLIC_STABLETAP_EXPLORER: process.env.NEXT_PUBLIC_STABLETAP_EXPLORER,
    NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS: process.env.NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS,
    NEXT_PUBLIC_STABLETAP_PLATFORM_BPS: process.env.NEXT_PUBLIC_STABLETAP_PLATFORM_BPS,
    NEXT_PUBLIC_STABLETAP_PAY_ASSETS: process.env.NEXT_PUBLIC_STABLETAP_PAY_ASSETS,
  },
  network.ss58,
);

/** tPOT decimals on Portaldot V3 (checked against the chain on connect). */
export const NATIVE_DECIMALS = 14;
export const STABLE_SYMBOL = "pUSD";
export const NATIVE_SYMBOL = "tPOT";

export const explorerLink = (blockNumber: number, extrinsicIndex: number) =>
  options.explorer ? `${options.explorer}/#/extrinsics/${blockNumber}-${extrinsicIndex}` : null;
