"use client";

import { useEffect, useState } from "react";
import type { Balances } from "@stabletap/engine";
import { getApi } from "./chain";
import { network } from "./network";

/** Live native + stablecoin balances for `address` (best block). */
export function useBalances(address: string | null): { balances: Balances | null; error: string | null } {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    let live = true;
    const unsubs: (() => void)[] = [];
    let native: bigint | null = null;
    let stable: bigint | null = null;
    const push = () => live && native !== null && stable !== null && setBalances({ native, stable });

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
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : String(e)));

    return () => {
      live = false;
      unsubs.forEach((u) => u());
    };
  }, [address]);

  return { balances, error };
}
