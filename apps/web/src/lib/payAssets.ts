"use client";

import { useEffect, useState } from "react";
import { getApi } from "./chain";
import { options } from "./network";

export interface PayAsset {
  id: number;
  symbol: string;
  decimals: number;
  /** Live balance of the watched address, smallest unit. */
  balance: bigint;
}

/**
 * Metadata (from chain) and live balances of the configured pay assets for
 * `address`. Assets without a pool against the native token are dropped,
 * since they can't be swapped or used for the fee.
 */
export function usePayAssets(address: string | null): { assets: PayAsset[]; error: string | null } {
  const [assets, setAssets] = useState<PayAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || options.payAssets.length === 0) return;
    let live = true;
    const unsubs: (() => void)[] = [];
    getApi()
      .then(async (api) => {
        const metas: Omit<PayAsset, "balance">[] = [];
        for (const id of options.payAssets) {
          const [meta, pool] = await Promise.all([api.query.assets.metadata(id), api.call.assetConversionApi.getReserves({ Native: null }, { WithId: id })]);
          if (pool.isNone || meta.symbol.isEmpty) continue;
          metas.push({ id, symbol: meta.symbol.toUtf8(), decimals: meta.decimals.toNumber() });
        }
        const balances = new Map<number, bigint>();
        const push = () => live && setAssets(metas.filter((m) => balances.has(m.id)).map((m) => ({ ...m, balance: balances.get(m.id)! })));
        for (const m of metas) {
          unsubs.push(
            await api.query.assets.account(m.id, address, (a) => {
              balances.set(m.id, a.isSome ? a.unwrap().balance.toBigInt() : 0n);
              push();
            }),
          );
        }
        if (!live) unsubs.forEach((u) => u());
      })
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      live = false;
      unsubs.forEach((u) => u());
    };
  }, [address]);

  return { assets, error };
}
