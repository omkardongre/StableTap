"use client";

import type { ApiPromise } from "@polkadot/api";
import { NATIVE_DECIMALS, network } from "./network";

let apiPromise: Promise<ApiPromise> | null = null;

/**
 * One shared, validated connection per tab. polkadot.js reconnects the socket
 * by itself; a failed first connect clears the cache so the next call retries.
 */
export function getApi(): Promise<ApiPromise> {
  apiPromise ??= (async () => {
    const [{ assertNetwork, connect }, { cryptoWaitReady }] = await Promise.all([import("@stabletap/engine"), import("@polkadot/util-crypto")]);
    await cryptoWaitReady();
    const api = await connect(network);
    await assertNetwork(api, network);
    const decimals = api.registry.chainDecimals[0];
    if (decimals !== NATIVE_DECIMALS) throw new Error(`Native token has ${decimals} decimals, app expects ${NATIVE_DECIMALS}`);
    return api;
  })().catch((e: unknown) => {
    apiPromise = null;
    throw e;
  });
  return apiPromise;
}
