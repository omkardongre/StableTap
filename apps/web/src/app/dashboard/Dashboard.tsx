"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { u8aToHex, stringToU8a } from "@polkadot/util";
import { buildRefundCall, quoteCallFee, refund, webhookRegistrationMessage } from "@stabletap/engine";
import { getApi } from "@/lib/chain";
import { errorText, shortHash, usd } from "@/lib/format";
import {
  deleteWebhook, fetchMerchantRecords, fetchWebhook, indexerEnabled, merchantAmount, putWebhook, type IndexedRecord, type WebhookStatus,
} from "@/lib/indexer";
import { withUnlockedPair } from "@/lib/keys";
import { explorerLink, network } from "@/lib/network";
import { useBalances } from "@/lib/useBalances";
import { loadVault, type VaultRecord } from "@/lib/vault";
import { TeamWallet } from "./TeamWallet";

const REFRESH_MS = 6_000;

type RefundView = { rec: IndexedRecord; max: bigint; amount: string; fee: bigint | null; stage: string | null };

export function Dashboard() {
  const [vault, setVault] = useState<VaultRecord | null | undefined>(undefined);
  const [records, setRecords] = useState<IndexedRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [refunding, setRefunding] = useState<RefundView | null>(null);
  const { balances } = useBalances(vault?.address ?? null);

  useEffect(() => {
    try {
      setVault(loadVault());
    } catch (e) {
      setError(errorText(e));
      setVault(null);
    }
  }, []);

  const load = useCallback(async (merchant: string) => {
    try {
      setRecords(await fetchMerchantRecords(merchant));
    } catch (e) {
      setError(`Could not load history: ${errorText(e)}`);
    }
  }, []);

  useEffect(() => {
    if (!vault || !indexerEnabled()) return;
    void load(vault.address);
    const t = setInterval(() => void load(vault.address), REFRESH_MS);
    return () => clearInterval(t);
  }, [vault, load]);

  async function startRefund(rec: IndexedRecord) {
    if (!vault) return;
    const max = merchantAmount(rec, vault.address) - (rec.refunded ?? 0n);
    setError(null);
    setNotice(null);
    const view: RefundView = { rec, max, amount: usd(max).slice(1), fee: null, stage: null };
    setRefunding(view);
    try {
      const api = await getApi();
      const fee = await quoteCallFee(api, network, buildRefundCall(api, network, { to: rec.signer, amount: max, invoiceId: rec.invoiceId }), vault.address);
      setRefunding((v) => (v && v.rec.txHash === rec.txHash ? { ...v, fee } : v));
    } catch (e) {
      setError(`Could not estimate the refund fee: ${errorText(e)}`);
    }
  }

  async function confirmRefund(v: RefundView) {
    if (!vault) return;
    setError(null);
    try {
      const { parseAmount } = await import("@stabletap/engine/config");
      const amount = parseAmount(v.amount, network.decimals);
      if (amount <= 0n || amount > v.max) throw new Error(`Refund must be between ${usd(1n)} and ${usd(v.max)}`);
      setRefunding({ ...v, stage: "Confirm with your fingerprint…" });
      const api = await getApi();
      const r = await withUnlockedPair(vault, (pair) =>
        refund(api, network, { to: v.rec.signer, amount, invoiceId: v.rec.invoiceId }, pair, (stage) =>
          setRefunding({ ...v, stage: stage === "signed" ? "Sending…" : "In a block, waiting for finality…" }),
        ),
      );
      setRefunding(null);
      setNotice(`Refunded ${usd(amount)} for ${v.rec.invoiceId} (tx ${shortHash(r.txHash)}, fee ${usd(r.feePaid)} in dollars)`);
      await load(vault.address);
    } catch (e) {
      setError(errorText(e));
      setRefunding({ ...v, stage: null });
    }
  }

  if (vault === undefined) return <p className="muted">Loading…</p>;

  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const today = records?.filter((r) => r.timestamp >= startOfDay) ?? [];
  const takings = today.reduce((s, r) => s + (r.kind === "payment" ? merchantAmount(r, vault?.address ?? "") : -merchantAmount(r, vault?.address ?? "")), 0n);

  return (
    <section className="stack" aria-live="polite">
      <div className="row">
        <h1>Dashboard</h1>
        <span className="row small">
          <Link href="/pos">POS</Link>
          <Link href="/">Home</Link>
        </span>
      </div>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      {!vault && (
        <div className="card">
          <p>The dashboard uses this device&apos;s wallet as the shop&apos;s payout account, so it can sign refunds.</p>
          <Link className="btn primary" href="/wallet">
            Create a wallet first
          </Link>
        </div>
      )}

      {vault && (
        <>
          <div className="card">
            <span className="label">Payout account</span>
            <span className="mono small">{vault.address}</span>
            <dl className="kv">
              <dt>Balance</dt>
              <dd>{balances ? usd(balances.stable) : "…"}</dd>
              <dt>Today, net of refunds</dt>
              <dd>{records ? usd(takings < 0n ? 0n : takings) : "…"}</dd>
              <dt>Sales today</dt>
              <dd>{records ? today.filter((r) => r.kind === "payment").length : "…"}</dd>
            </dl>
          </div>

          {!indexerEnabled() && <p className="alert">History is not configured on this deployment (NEXT_PUBLIC_STABLETAP_INDEXER).</p>}

          {refunding && (
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                void confirmRefund(refunding);
              }}
            >
              <h2>Refund {refunding.rec.invoiceId}</h2>
              <label className="label" htmlFor="refund-amount">
                Amount in dollars (max {usd(refunding.max)})
              </label>
              <input
                id="refund-amount"
                inputMode="decimal"
                value={refunding.amount}
                onChange={(e) => setRefunding({ ...refunding, amount: e.target.value })}
                disabled={refunding.stage !== null}
              />
              <dl className="kv">
                <dt>To customer</dt>
                <dd className="mono small">{shortHash(refunding.rec.signer)}</dd>
                <dt>Network fee</dt>
                <dd>{refunding.fee === null ? "estimating…" : `≈ ${usd(refunding.fee)} (in dollars)`}</dd>
              </dl>
              {refunding.stage && <p aria-busy="true">{refunding.stage}</p>}
              <button type="submit" className="btn primary" disabled={refunding.stage !== null || refunding.fee === null}>
                Refund with fingerprint
              </button>
              <button type="button" className="btn" onClick={() => setRefunding(null)} disabled={refunding.stage !== null}>
                Cancel
              </button>
            </form>
          )}

          {indexerEnabled() && (
            <div className="card">
              <span className="label">Invoices</span>
              {records === null && <p className="muted">Loading…</p>}
              {records?.length === 0 && <p className="muted">No payments yet. Charge something on the POS.</p>}
              <ul className="list">
                {records?.map((r) => (
                  <RecordRow key={r.txHash} rec={r} merchant={vault.address} onRefund={() => void startRefund(r)} busy={refunding !== null} />
                ))}
              </ul>
            </div>
          )}

          <TeamWallet vault={vault} suggested={takings > 0n ? takings : 0n} />

          {indexerEnabled() && <WebhookCard vault={vault} />}
        </>
      )}
    </section>
  );
}

function RecordRow({ rec, merchant, onRefund, busy }: { rec: IndexedRecord; merchant: string; onRefund: () => void; busy: boolean }) {
  const amount = merchantAmount(rec, merchant);
  const refundable = rec.kind === "payment" ? amount - (rec.refunded ?? 0n) : 0n;
  const link = explorerLink(rec.blockNumber, rec.extrinsicIndex);
  const platform = rec.kind === "payment" ? rec.transfers.filter((t) => t.to !== merchant).reduce((s, t) => s + t.amount, 0n) : 0n;
  return (
    <li className="list-item">
      <div className="row">
        <strong>
          {rec.kind === "refund" ? "Refund " : ""}
          {rec.kind === "refund" ? `−${usd(amount)}` : usd(amount)}
        </strong>
        <span className="muted small">{new Date(rec.timestamp).toLocaleString()}</span>
      </div>
      <div className="row small">
        <span className="mono">{rec.invoiceId}</span>
        {link ? (
          <a className="mono" href={link} target="_blank" rel="noreferrer">
            {shortHash(rec.txHash)}
          </a>
        ) : (
          <span className="mono">{shortHash(rec.txHash)}</span>
        )}
      </div>
      {rec.kind === "payment" && (
        <div className="row small muted">
          <span>
            {platform > 0n ? `Platform share ${usd(platform)} · ` : ""}
            {rec.fee?.assetId === network.assetId ? `Fee ${usd(rec.fee.amount)} in dollars` : rec.fee ? `Paid with asset ${rec.fee.assetId ?? "native"}` : "Fee ?"}
          </span>
          {(rec.refunded ?? 0n) > 0n && <span>Refunded {usd(rec.refunded!)}</span>}
        </div>
      )}
      {rec.kind === "payment" && refundable > 0n && (
        <button className="btn" onClick={onRefund} disabled={busy}>
          Refund
        </button>
      )}
    </li>
  );
}

function WebhookCard({ vault }: { vault: VaultRecord }) {
  const [status, setStatus] = useState<WebhookStatus | null>(null);
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    fetchWebhook(vault.address).then(setStatus, (e: unknown) => setError(errorText(e)));
  }, [vault.address]);
  useEffect(refresh, [refresh]);

  /** The merchant proves control of the payout address by signing the exact registration. */
  async function signed(target: string) {
    const signedAt = Math.floor(Date.now() / 1000);
    const signature = await withUnlockedPair(vault, async (pair) => u8aToHex(pair.sign(stringToU8a(webhookRegistrationMessage(vault.address, target, signedAt)))));
    return { signedAt, signature };
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const target = new URL(url.trim()).toString();
      const res = await putWebhook(vault.address, { url: target, ...(await signed(target)) });
      setSecret(res.secret);
      setUrl("");
      refresh();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await deleteWebhook(vault.address, await signed(""));
      setSecret(null);
      refresh();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <span className="label">Webhook</span>
      <p className="muted small">
        Your server gets a signed POST (Standard Webhooks: webhook-id, webhook-timestamp, webhook-signature) for every payment and refund, once final.
      </p>
      {status?.configured && <p className="small">Sending to {status.host}</p>}
      {secret && (
        <div className="notice" role="status">
          <p className="small">Signing secret, shown once. Store it on your server:</p>
          <p className="mono small">{secret}</p>
          <button type="button" className="btn" onClick={() => navigator.clipboard.writeText(secret)}>
            Copy secret
          </button>
        </div>
      )}
      <label className="label" htmlFor="hook-url">
        {status?.configured ? "Replace URL (issues a new secret)" : "HTTPS endpoint"}
      </label>
      <input id="hook-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://shop.example/stabletap" autoComplete="off" />
      <button type="submit" className="btn primary" disabled={busy || !url.trim()}>
        {busy ? "Signing…" : "Save with fingerprint"}
      </button>
      {status?.configured && (
        <button type="button" className="btn" onClick={() => void remove()} disabled={busy}>
          Remove webhook
        </button>
      )}
      {status && status.deliveries.length > 0 && (
        <ul className="list small">
          {status.deliveries.slice(0, 5).map((d) => (
            <li key={d.id} className="row">
              <span className="mono">{d.id.slice(0, 14)}…</span>
              <span>
                {d.status}
                {d.status !== "delivered" && d.lastError ? ` (${d.lastError}, ${d.attempts} tries)` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
