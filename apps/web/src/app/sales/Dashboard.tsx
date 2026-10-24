"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { buildRefundCall, quoteCallFee, refund } from "@stabletap/engine";
import { parseAmount } from "@stabletap/engine/config";
import { getApi } from "@/lib/chain";
import { clockText, dayText, errorText, usd, usdFee, whenText } from "@/lib/format";
import { fetchMerchantRecords, historyInSync, indexerEnabled, merchantAmount, type IndexedRecord } from "@/lib/indexer";
import { withUnlockedPair } from "@/lib/keys";
import { linkIdOf, linkItems } from "@/lib/links";
import { explorerLink, network } from "@/lib/network";
import { useBalances } from "@/lib/useBalances";
import { loadVault, type VaultRecord } from "@/lib/vault";

const REFRESH_MS = 6_000;
/** Sales shown at first, and added by each "Show more". */
const SALES_PAGE = 10;
/** How long a confirmation stays up (long enough to read, then out of the way). */
const NOTICE_MS = 6_000;
/** History a few blocks behind is normal right after a payment; only warn when it stays behind this long. */
const STALE_WARN_MS = 60_000;

/** A sale (payment) with the refunds made against it. Refunds never get their own row. */
interface Sale {
  payment: IndexedRecord;
  /** What the customer paid. */
  amount: bigint;
  /** What reached the shop after the StableTap service fee. */
  received: bigint;
  /** Item name for payment-link sales; null for counter sales. */
  item: string | null;
  refunds: IndexedRecord[];
  refunded: bigint;
}

type Screen = { name: "list" } | { name: "detail"; txHash: string } | { name: "refund"; txHash: string };

export function Dashboard() {
  const [vault, setVault] = useState<VaultRecord | null | undefined>(undefined);
  const [records, setRecords] = useState<IndexedRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  // When the history first fell behind (or failed); null while it is in sync.
  const [behindSince, setBehindSince] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  // Refunds this phone just sent, shown right away until the history lists them.
  const [sent, setSent] = useState<IndexedRecord[]>([]);
  const [shown, setShown] = useState(SALES_PAGE);
  // Records cover sales and refunds; fetch a margin so "shown" sales are all there.
  const limit = Math.min(200, shown * 2 + 10);
  const { balances } = useBalances(vault?.address ?? null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    try {
      setVault(loadVault("shop"));
    } catch (e) {
      setError(errorText(e));
      setVault(null);
    }
  }, []);

  const load = useCallback(async (merchant: string) => {
    const [recs, sync] = await Promise.allSettled([fetchMerchantRecords(merchant, limit), historyInSync()]);
    if (recs.status === "fulfilled") setRecords(recs.value);
    const ok = recs.status === "fulfilled" && sync.status === "fulfilled" && sync.value;
    setBehindSince((since) => (ok ? null : (since ?? Date.now())));
    setNow(Date.now());
  }, [limit]);

  useEffect(() => {
    if (!vault || !indexerEnabled()) return;
    void load(vault.address);
    const t = setInterval(() => void load(vault.address), REFRESH_MS);
    return () => clearInterval(t);
  }, [vault, load]);

  if (vault === undefined) return <p className="muted">Loading…</p>;

  if (!vault) {
    return (
      <section className="stack">
        <h1 className="sr-only">Sales</h1>
        <div className="card">
          <h2>No shop on this phone yet</h2>
          <p className="muted">Set up your shop first. Your sales show up here.</p>
          <Link className="btn primary" href="/shop">
            Set up my shop
          </Link>
        </div>
      </section>
    );
  }

  const known = new Set((records ?? []).map((r) => r.txHash));
  const all = [...(records ?? []), ...sent.filter((r) => !known.has(r.txHash))];
  const sales = toSales(all, vault.address, linkItems(vault.address));
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const todays = sales.filter((s) => s.payment.timestamp >= startOfDay);
  const todayRefunds = all.filter((r) => r.kind === "refund" && r.timestamp >= startOfDay);
  const days = groupByDay(sales.slice(0, shown));
  // What the shop keeps today: received after the service fee, minus refunds it sent.
  const takings = todays.reduce((s, x) => s + x.received, 0n) - todayRefunds.reduce((s, r) => s + merchantAmount(r, vault.address), 0n);
  const stale = !indexerEnabled() || (behindSince !== null && now - behindSince > STALE_WARN_MS);
  const selected = screen.name !== "list" ? sales.find((s) => s.payment.txHash === screen.txHash) : undefined;

  return (
    <section className="stack" aria-live="polite">
      <h1 className="sr-only">Sales</h1>
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

      {screen.name === "list" && (
        <>
          <div className="card">
            <span className="muted">Today</span>
            <span className="big">{records ? usd(takings < 0n ? 0n : takings) : "…"}</span>
            <span className="muted small">
              {records ? plural(todays.length, "sale") : ""}
              {balances ? ` · Balance ${usd(balances.stable)}` : ""}
            </span>
          </div>

          {stale && (
            <p className="notice" role="status">
              Sales are updating. New payments can take a minute to show here. Your money is safe in your balance.
            </p>
          )}

          <div className="card">
            <h2 className="card-title">Payments</h2>
            {records === null && <p className="muted">Loading…</p>}
            {records !== null && sales.length === 0 && <p className="muted">No payments yet. Start a sale in your shop.</p>}
            {days.map(([day, list]) => (
              <div key={day} className="day-group">
                <h3 className="day-head">{day}</h3>
            <ul className="sales">
              {list.map((s) => (
                <li key={s.payment.txHash}>
                  <button
                    type="button"
                    className="sale-row"
                    onClick={() => {
                      setNotice(null);
                      setError(null);
                      setScreen({ name: "detail", txHash: s.payment.txHash });
                    }}
                  >
                    <span className="sale-main">
                      <strong>{usd(s.amount)}</strong>
                      <span className="muted small">
                        {s.item ?? "Counter sale"} · {clockText(s.payment.timestamp)}
                      </span>
                    </span>
                    {s.refunded > 0n && <span className="chip">{s.refunded >= s.amount ? "Refunded" : `Refunded ${usd(s.refunded)}`}</span>}
                    <span className="chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </li>
              ))}
            </ul>
              </div>
            ))}
            {(sales.length > shown || (records !== null && records.length >= limit && limit < 200)) && (
              <button type="button" className="link-btn" onClick={() => setShown((n) => n + SALES_PAGE)}>
                Show more
              </button>
            )}
          </div>
        </>
      )}

      {screen.name !== "list" && !selected && (
        <div className="card">
          <p className="muted">Loading…</p>
          <BackButton onClick={() => setScreen({ name: "list" })} />
        </div>
      )}

      {screen.name === "detail" && selected && (
        <SaleDetail sale={selected} onBack={() => setScreen({ name: "list" })} onRefund={() => setScreen({ name: "refund", txHash: selected.payment.txHash })} />
      )}

      {screen.name === "refund" && selected && (
        <RefundForm
          sale={selected}
          vault={vault}
          balance={balances?.stable ?? null}
          onCancel={() => setScreen({ name: "detail", txHash: selected.payment.txHash })}
          onDone={async (amount, txHash) => {
            setSent((list) => [
              ...list,
              {
                kind: "refund",
                invoiceId: selected.payment.invoiceId,
                txHash,
                blockNumber: 0,
                extrinsicIndex: 0,
                signer: vault.address,
                timestamp: Date.now(),
                transfers: [{ from: vault.address, to: selected.payment.signer, amount }],
                fee: null,
              },
            ]);
            setNotice(`Refunded ${usd(amount)}. The customer gets it in a few seconds.`);
            setScreen({ name: "detail", txHash: selected.payment.txHash });
            await load(vault.address);
          }}
        />
      )}
    </section>
  );
}

function SaleDetail({ sale, onBack, onRefund }: { sale: Sale; onBack: () => void; onRefund: () => void }) {
  const p = sale.payment;
  const refundable = sale.amount - sale.refunded;
  const [copied, setCopied] = useState(false);
  const explorer = explorerLink(p.blockNumber);
  return (
    <div className="card">
      <BackButton onClick={onBack} />
      <div className="detail-head">
        <span className="big">{usd(sale.amount)}</span>
        <span className={`chip ${sale.refunded >= sale.amount ? "" : "ok"}`}>
          {sale.refunded === 0n ? "Paid" : sale.refunded >= sale.amount ? "Refunded" : "Partly refunded"}
        </span>
      </div>
      <dl className="kv">
        <dt>Sold by</dt>
        <dd>{sale.item ? `Payment link · ${sale.item}` : "Counter"}</dd>
        <dt>Date</dt>
        <dd>{whenText(p.timestamp)}</dd>
        {sale.received < sale.amount && (
          <>
            <dt>StableTap fee</dt>
            <dd>−{usd(sale.amount - sale.received)}</dd>
            <dt>You received</dt>
            <dd>{usd(sale.received)}</dd>
          </>
        )}
        {sale.refunds.map((r) => (
          <RefundLine key={r.txHash} rec={r} />
        ))}
      </dl>
      <details>
        <summary>More details</summary>
        <dl className="kv small">
          <dt>Order</dt>
          <dd className="mono">{p.invoiceId}</dd>
        </dl>
        <button
          type="button"
          className="btn"
          onClick={() => {
            void navigator.clipboard.writeText(p.txHash).then(() => setCopied(true));
          }}
        >
          {copied ? "Copied" : "Copy transaction ID"}
        </button>
      </details>
      {explorer && (
        <a className="link-btn" href={explorer} target="_blank" rel="noopener noreferrer">
          View on Portaldot explorer ↗
        </a>
      )}
      {refundable > 0n && (
        <button type="button" className="btn primary" onClick={onRefund}>
          Refund
        </button>
      )}
    </div>
  );
}

function RefundLine({ rec }: { rec: IndexedRecord }) {
  const amount = rec.transfers.reduce((s, t) => s + t.amount, 0n);
  return (
    <>
      <dt>Refund</dt>
      <dd>
        −{usd(amount)} · {whenText(rec.timestamp)}
      </dd>
    </>
  );
}

function RefundForm({
  sale,
  vault,
  balance,
  onCancel,
  onDone,
}: {
  sale: Sale;
  vault: VaultRecord;
  balance: bigint | null;
  onCancel: () => void;
  onDone: (amount: bigint, txHash: string) => Promise<void>;
}) {
  const max = sale.amount - sale.refunded;
  const [mode, setMode] = useState<"full" | "other">("full");
  const [other, setOther] = useState("");
  const [fee, setFee] = useState<bigint | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getApi()
      // The fee doesn't depend on the amount; quote a tiny one so a low balance can't make the estimate fail.
      .then((api) => quoteCallFee(api, network, buildRefundCall(api, network, { to: sale.payment.signer, amount: 1n, invoiceId: sale.payment.invoiceId }), vault.address))
      .then((f) => live && setFee(f))
      .catch(() => live && setFee(null));
    return () => {
      live = false;
    };
  }, [sale.payment, vault.address]);

  function amount(): bigint {
    if (mode === "full") return max;
    const text = other.trim().replace(/^\$/, "");
    if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error("Enter an amount like 2.50");
    const v = parseAmount(text, network.decimals);
    if (v <= 0n || v > max) throw new Error(`Enter an amount up to ${usd(max)}`);
    return v;
  }

  function checkBalance(value: bigint) {
    if (balance !== null && fee !== null && value + fee > balance)
      throw new Error(`Your balance (${usd(balance)}) can't cover this refund plus the ${usdFee(fee)} fee. Refund up to ${usd(balance > fee ? balance - fee : 0n)}.`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let value: bigint;
    try {
      value = amount();
      checkBalance(value);
    } catch (err) {
      return setError(errorText(err));
    }
    try {
      setBusy("Confirm with your fingerprint…");
      const api = await getApi();
      const receipt = await withUnlockedPair(vault, (pair) => {
        setBusy("Refunding…");
        return refund(api, network, { to: sale.payment.signer, amount: value, invoiceId: sale.payment.invoiceId }, pair);
      });
      await onDone(value, receipt.txHash);
    } catch (err) {
      setError(errorText(err));
      setBusy(null);
    }
  }

  let label = "Refund";
  try {
    label = `Refund ${usd(amount())}`;
  } catch {
    // Invalid "other" amount: keep the plain label until it parses.
  }

  return (
    <form className="card" onSubmit={(e) => void submit(e)}>
      <h2>Refund</h2>
      <fieldset className="choices" disabled={busy !== null}>
        <legend className="sr-only">Refund amount</legend>
        <label className="choice">
          <input type="radio" name="refund" checked={mode === "full"} onChange={() => setMode("full")} />
          <span>Full refund</span>
          <strong>{usd(max)}</strong>
        </label>
        <label className="choice">
          <input type="radio" name="refund" checked={mode === "other"} onChange={() => setMode("other")} />
          <span>Other amount</span>
        </label>
        {mode === "other" && (
          <div className="money-input">
            <span aria-hidden="true">$</span>
            <input inputMode="decimal" placeholder="0.00" value={other} onChange={(e) => setOther(e.target.value)} aria-label="Refund amount in dollars" autoFocus />
          </div>
        )}
      </fieldset>
      <p className="muted small">Goes back to the customer who paid.{fee !== null && ` Network fee ${usdFee(fee)}, paid by you.`}</p>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn primary" disabled={busy !== null}>
        {busy ? (
          <>
            <span className="spinner" aria-hidden="true" />
            {busy}
          </>
        ) : (
          label
        )}
      </button>
      <button type="button" className="btn" onClick={onCancel} disabled={busy !== null}>
        Cancel
      </button>
    </form>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="link-btn back-btn" onClick={onClick}>
      ‹ All payments
    </button>
  );
}

/** One row per payment, newest first; refunds are folded into the payment they belong to. */
function toSales(records: IndexedRecord[], merchant: string, items: Map<string, string>): Sale[] {
  const refundsByInvoice = new Map<string, IndexedRecord[]>();
  for (const r of records) if (r.kind === "refund") refundsByInvoice.set(r.invoiceId, [...(refundsByInvoice.get(r.invoiceId) ?? []), r]);
  return records
    .filter((r) => r.kind === "payment")
    .map((payment) => {
      const refunds = refundsByInvoice.get(payment.invoiceId) ?? [];
      const listed = refunds.reduce((s, r) => s + merchantAmount(r, merchant), 0n);
      // The indexer's total also covers refunds older than the page we fetched.
      const refunded = payment.refunded !== undefined && payment.refunded > listed ? payment.refunded : listed;
      const linkId = linkIdOf(payment.invoiceId);
      // Customers get refunds up to what they paid; like card processors, the service fee isn't returned.
      const amount = payment.transfers.reduce((s, t) => s + t.amount, 0n);
      return {
        payment,
        amount,
        received: merchantAmount(payment, merchant),
        item: linkId ? (items.get(linkId) ?? "Payment link") : null,
        refunds,
        refunded,
      };
    })
    .sort((a, b) => b.payment.timestamp - a.payment.timestamp);
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Sales under "Today", "Yesterday", "23 Oct" headers, newest day first. */
function groupByDay(sales: Sale[]): [string, Sale[]][] {
  const groups = new Map<string, Sale[]>();
  for (const s of sales) {
    const day = dayText(s.payment.timestamp);
    groups.set(day, [...(groups.get(day) ?? []), s]);
  }
  return [...groups];
}
