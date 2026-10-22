"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { errorText, shortHash, tpot, usd } from "@/lib/format";
import { fetchStats, indexerEnabled, type Stats as StatsData } from "@/lib/indexer";
import { NATIVE_SYMBOL, explorerLink, network } from "@/lib/network";

const REFRESH_MS = 10_000;

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!indexerEnabled()) return setError("Stats are not configured on this deployment (NEXT_PUBLIC_STABLETAP_INDEXER).");
    let live = true;
    const load = () =>
      fetchStats().then(
        (s) => live && (setStats(s), setError(null)),
        (e: unknown) => live && setError(errorText(e)),
      );
    void load();
    const t = setInterval(load, REFRESH_MS);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  // pUSD units per whole tPOT (14 decimals).
  const price = stats && stats.pool.native > 0n ? (stats.pool.stable * 10n ** 14n) / stats.pool.native : null;

  return (
    <section className="stack" aria-live="polite">
      <div className="row">
        <h1>On-chain stats</h1>
        <Link href="/" className="small">
          Home
        </Link>
      </div>
      <p className="muted small">Read from finalized Portaldot blocks. Every number below links back to a transaction.</p>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {stats && (
        <>
          <div className="grid2">
            <Metric label="Payments" value={String(stats.payments)} />
            <Metric label="Volume" value={usd(stats.volume)} />
            <Metric label="Fees paid in dollars" value={`${stats.stableFees.count}`} hint={`${usd(stats.stableFees.amount)} total`} />
            <Metric label={`Fees paid in ${NATIVE_SYMBOL}`} value={String(stats.nativeFeeCount)} />
            <Metric label="Paid with other tokens" value={String(stats.otherAssetFeeCount)} hint="swapped to pUSD in the same tx" />
            <Metric label="Refunds" value={String(stats.refunds)} hint={usd(stats.refunded)} />
            <Metric label="Payers · merchants" value={`${stats.payers} · ${stats.merchants}`} />
          </div>
          <div className="card">
            <span className="label">Fee pool (pUSD / {NATIVE_SYMBOL})</span>
            <dl className="kv">
              <dt>pUSD</dt>
              <dd>{usd(stats.pool.stable)}</dd>
              <dt>{NATIVE_SYMBOL}</dt>
              <dd>{tpot(stats.pool.native)}</dd>
              <dt>Price</dt>
              <dd>{price === null ? "–" : `1 ${NATIVE_SYMBOL} ≈ ${usd(price)}`}</dd>
              <dt>Indexed to</dt>
              <dd>#{stats.indexedTo}</dd>
            </dl>
          </div>
          <div className="card">
            <span className="label">Latest</span>
            {stats.recent.length === 0 && <p className="muted">No payments yet.</p>}
            <ul className="list">
              {stats.recent.map((r) => {
                const amount = r.transfers.reduce((s, t) => s + t.amount, 0n);
                const link = explorerLink(r.blockNumber, r.extrinsicIndex);
                return (
                  <li key={r.txHash} className="list-item">
                    <div className="row">
                      <strong>
                        {r.kind === "refund" ? "Refund " : ""}
                        {usd(amount)}
                      </strong>
                      <span className="muted small">#{r.blockNumber}</span>
                    </div>
                    <div className="row small">
                      <span>
                        fee {feeText(r.fee)}
                      </span>
                      {link ? (
                        <a className="mono" href={link} target="_blank" rel="noreferrer">
                          {shortHash(r.txHash)}
                        </a>
                      ) : (
                        <span className="mono">{shortHash(r.txHash)}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      {!stats && !error && <p className="muted">Loading…</p>}
    </section>
  );
}

function feeText(fee: { amount: bigint; assetId: number | null } | null): string {
  if (!fee) return "?";
  if (fee.assetId === network.assetId) return `${usd(fee.amount)} in dollars`;
  if (fee.assetId === null) return `${tpot(fee.amount)} ${NATIVE_SYMBOL}`;
  return `paid in asset ${fee.assetId}`;
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card metric">
      <span className="label">{label}</span>
      <span className="mid">{value}</span>
      {hint && <span className="muted small">{hint}</span>}
    </div>
  );
}
