"use client";

import { useEffect, useRef, useState } from "react";
import { NATIVE, withId } from "@stabletap/engine";
import { formatAmount } from "@stabletap/engine/config";
import { getApi } from "@/lib/chain";
import { errorText } from "@/lib/format";
import { NATIVE_DECIMALS, NATIVE_SYMBOL } from "@/lib/network";

export interface PoolAsset {
  id: number;
  symbol: string;
  decimals: number;
}

/** Amount with at most 4 decimals (truncated), enough to see a pool move. */
function short(v: bigint, decimals: number): string {
  const [int, frac = ""] = formatAmount(v, decimals).split(".");
  return `${int}.${frac.slice(0, 4).padEnd(2, "0")}`;
}

interface Reserves {
  native: bigint;
  token: bigint;
}

/**
 * Live reserves of the native pools a swap payment goes through, read at each
 * finalized block, with the change since this gauge opened.
 */
export function PoolGauge({ assets }: { assets: PoolAsset[] }) {
  const [now, setNow] = useState<Map<number, Reserves>>(new Map());
  const start = useRef<Map<number, Reserves>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const key = assets.map((a) => a.id).join(",");

  useEffect(() => {
    let live = true;
    let unsub: (() => void) | undefined;
    const ids = key.split(",").map(Number);
    getApi()
      .then(async (api) => {
        const read = async (hash: string) => {
          const at = await api.at(hash);
          const out = new Map<number, Reserves>();
          for (const id of ids) {
            const r = await at.call.assetConversionApi.getReserves(NATIVE, withId(id));
            if (r.isSome) {
              const [native, token] = r.unwrap().map((x) => x.toBigInt());
              out.set(id, { native: native!, token: token! });
            }
          }
          return out;
        };
        const u = await api.rpc.chain.subscribeFinalizedHeads((h) => {
          read(h.hash.toHex())
            .then((m) => {
              if (!live) return;
              for (const [id, r] of m) if (!start.current.has(id)) start.current.set(id, r);
              setNow(m);
            })
            .catch((e: unknown) => live && setError(errorText(e)));
        });
        if (!live) return u();
        unsub = u;
      })
      .catch((e: unknown) => live && setError(errorText(e)));
    return () => {
      live = false;
      unsub?.();
    };
  }, [key]);

  return (
    <div className="card" aria-live="polite">
      <span className="label">Portaldot pools (live)</span>
      {assets.map((a) => {
        const r = now.get(a.id);
        const s = start.current.get(a.id);
        return (
          <dl key={a.id} className="kv small">
            <dt>{a.symbol} pool</dt>
            <dd>
              {r ? (
                <>
                  {short(r.token, a.decimals)} {a.symbol} <Delta v={s ? r.token - s.token : 0n} decimals={a.decimals} />
                </>
              ) : (
                "…"
              )}
            </dd>
            <dt />
            <dd>
              {r ? (
                <>
                  {short(r.native, NATIVE_DECIMALS)} {NATIVE_SYMBOL} <Delta v={s ? r.native - s.native : 0n} decimals={NATIVE_DECIMALS} />
                </>
              ) : null}
            </dd>
          </dl>
        );
      })}
      {error && <p className="alert small">{error}</p>}
    </div>
  );
}

function Delta({ v, decimals }: { v: bigint; decimals: number }) {
  if (v === 0n) return null;
  const text = short(v < 0n ? -v : v, decimals);
  return <span className={v > 0n ? "up" : "down"}>({v > 0n ? "+" : "−"}{text})</span>;
}
