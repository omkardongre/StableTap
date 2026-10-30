"use client";

import type { ApiPromise } from "@polkadot/api";
import { NATIVE_DECIMALS, network } from "./network";

let apiPromise: Promise<ApiPromise> | null = null;

/** Runtime metadata of the last connection, so a page open skips the ~640 KB download. */
const META_KEY = "stabletap.chain-metadata.v1";
/**
 * A request this slow means the network is down; fail and retry instead of waiting polkadot.js's 60 s.
 * Long enough for the one big response (the metadata) on a slow mobile connection.
 */
const REQUEST_TIMEOUT_MS = 30_000;

function cachedMetadata(): Record<string, `0x${string}`> | undefined {
  try {
    const v = JSON.parse(localStorage.getItem(META_KEY) ?? "null") as { key?: unknown; hex?: unknown } | null;
    if (v && typeof v.key === "string" && typeof v.hex === "string" && v.hex.startsWith("0x")) return { [v.key]: v.hex as `0x${string}` };
  } catch {
    // A broken cache only costs a download.
  }
  return undefined;
}

function saveMetadata(api: ApiPromise) {
  try {
    const key = `${api.genesisHash.toHex()}-${api.runtimeVersion.specVersion.toString()}`;
    if (cachedMetadata()?.[key]) return;
    localStorage.setItem(META_KEY, JSON.stringify({ key, hex: api.runtimeMetadata.toHex() }));
  } catch {
    // Storage full or blocked: the next open downloads it again.
  }
}

/**
 * One shared, validated connection per tab. polkadot.js reconnects the socket
 * by itself; a failed first connect clears the cache so the next call retries.
 * The runtime metadata is cached on the device; polkadot.js uses it only when the
 * chain's genesis hash and runtime version still match, so an upgrade fetches it fresh.
 */
export function getApi(): Promise<ApiPromise> {
  apiPromise ??= (async () => {
    const [{ assertNetwork, connect }, { cryptoWaitReady }] = await Promise.all([import("@stabletap/engine"), import("@polkadot/util-crypto")]);
    await cryptoWaitReady();
    const api = await connect(network, { metadata: cachedMetadata(), timeoutMs: REQUEST_TIMEOUT_MS });
    try {
      await assertNetwork(api, network);
      const decimals = api.registry.chainDecimals[0];
      if (decimals !== NATIVE_DECIMALS) throw new Error(`Native token has ${decimals} decimals, app expects ${NATIVE_DECIMALS}`);
    } catch (e) {
      await api.disconnect().catch(() => undefined);
      throw e;
    }
    saveMetadata(api);
    return api;
  })().catch((e: unknown) => {
    apiPromise = null;
    throw e;
  });
  return apiPromise;
}
