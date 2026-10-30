"use client";

import { useCallback, useEffect, useState } from "react";
import type { Balances } from "@stabletap/engine";
import { getApi } from "./chain";
import { network } from "./network";

const CACHE_KEY = "stabletap.balances.v1";
/** Retry delays after a failed connection: quick first, then back off (like Cash App's "retrying"). */
const RETRY_MS = [2_000, 5_000, 10_000, 20_000, 30_000];

export interface BalanceState {
  /** Live balances, or the last ones seen on this phone while connecting. */
  balances: Balances | null;
  /** True while `balances` is the saved copy and the live one hasn't arrived yet. */
  updating: boolean;
  /** True while the network can't be reached; it keeps retrying by itself. */
  offline: boolean;
  /** Try again right away (the "Try again" button). */
  retry: () => void;
}

function readCache(address: string): Balances | null {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, { native: string; stable: string } | undefined>;
    const v = all[address];
    return v ? { native: BigInt(v.native), stable: BigInt(v.stable) } : null;
  } catch {
    return null;
  }
}

function writeCache(address: string, b: Balances) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, unknown>;
    all[address] = { native: b.native.toString(), stable: b.stable.toString() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // Only costs the instant balance on the next open.
  }
}

/** Live native + stablecoin balances for `address` (best block), shown from the phone's last copy until the chain answers. */
export function useBalances(address: string | null): BalanceState {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [updating, setUpdating] = useState(false);
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!address) return;
    const cached = readCache(address);
    setBalances((b) => b ?? cached);
    setUpdating((u) => u || cached !== null);
  }, [address]);

  useEffect(() => {
    if (!address) return;
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubs: (() => void)[] = [];
    let native: bigint | null = null;
    let stable: bigint | null = null;
    const push = () => {
      if (!live || native === null || stable === null) return;
      const b = { native, stable };
      setBalances(b);
      setUpdating(false);
      setOffline(false);
      writeCache(address, b);
    };

    const run = (n: number) =>
      getApi()
        .then(async (api) => {
          unsubs.push(
            await api.query.system.account(address, (a) => {
              native = a.data.free.toBigInt();
              push();
            }),
            await api.query.assets.account(network.assetId, address, (a) => {
              stable = a.isSome ? a.unwrap().balance.toBigInt() : 0n;
              push();
            }),
          );
          if (!live) unsubs.forEach((u) => u());
        })
        .catch(() => {
          if (!live) return;
          setOffline(true);
          timer = setTimeout(() => void run(n + 1), RETRY_MS[Math.min(n, RETRY_MS.length - 1)]);
        });
    void run(0);

    return () => {
      live = false;
      clearTimeout(timer);
      unsubs.forEach((u) => u());
    };
  }, [address, attempt]);

  return { balances, updating, offline, retry };
}
