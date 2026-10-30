"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { buildRefundCall, quoteCallFee, refund } from "@stabletap/engine";
import { parseAmount } from "@stabletap/engine/config";
import { ErrorNote } from "@/components/ErrorNote";
import { Toast } from "@/components/Toast";
import { getApi } from "@/lib/chain";
import { clockText, dayText, errorText, usd, usdFee, whenText } from "@/lib/format";
import { fetchMerchantRecords, historyInSync, indexerEnabled, merchantAmount, type IndexedRecord } from "@/lib/indexer";
import { withUnlockedPair } from "@/lib/keys";
import { linkIdOf, linkItems, remoteLinkItem } from "@/lib/links";
import { explorerLink, network } from "@/lib/network";
import { useBalances } from "@/lib/useBalances";
import { loadVault, type VaultRecord } from "@/lib/vault";

const REFRESH_MS = 6_000;
/** Sales shown at first, and added by each "Show more". */
const SALES_PAGE = 10;
/** History a few blocks behind is normal right after a payment; only warn when it stays behind this long. */
const STALE_WARN_MS = 60_000;
/** Last sales seen on this phone, shown at once while fresh ones load (like a banking app). */
const CACHE_KEY = "stabletap.sales-cache.v1";

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

// ---------- the phone's copy of the last sales ----------

const toJson = (records: IndexedRecord[]) => JSON.stringify(records, (_k, v: unknown) => (typeof v === "bigint" ? `${v}n` : v));
const fromJson = (text: string) =>
  JSON.parse(text, (_k, v: unknown) => (typeof v === "string" && /^\d+n$/.test(v) ? BigInt(v.slice(0, -1)) : v)) as IndexedRecord[];

function readCache(merchant: string): IndexedRecord[] | null {
  try {
    const v = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as { merchant?: string; records?: string } | null;
    return v?.merchant === merchant && typeof v.records === "string" ? fromJson(v.records) : null;
  } catch {
    return null;
  }
}

function writeCache(merchant: string, records: IndexedRecord[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ merchant, records: toJson(records.slice(0, 60)) }));
  } catch {
    // Only costs the instant list on the next open.
  }
}

export function Dashboard() {
  const [vault, setVault] = useState<VaultRecord | null | undefined>(undefined);
  const [records, setRecords] = useState<IndexedRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  // When the history first fell behind (or failed); null while it is in sync.
  const [behindSince, setBehindSince] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  // Refunds this phone just sent, shown right away until the history lists them.
  const [sent, setSent] = useState<IndexedRecord[]>([]);
  const [shown, setShown] = useState(SALES_PAGE);
  // Item names of links made on another phone (e.g. before signing in here).
  const [remoteItems, setRemoteItems] = useState<Map<string, string>>(new Map());
  // Records cover sales and refunds; fetch a margin so "shown" sales are all there.
  const limit = Math.min(200, shown * 2 + 10);
  const { balances } = useBalances(vault?.address ?? null);
  const clearToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    try {
      const v = loadVault("shop");
      setVault(v);
      if (v) setRecords(readCache(v.address));
    } catch (e) {
      setError(errorText(e));
      setVault(null);
    }
  }, []);

  const load = useCallback(
    async (merchant: string) => {
      const [recs, sync] = await Promise.allSettled([fetchMerchantRecords(merchant, limit), historyInSync()]);
      if (recs.status === "fulfilled") {
        setRecords(recs.value);
        writeCache(merchant, recs.value);
      }
      const ok = recs.status === "fulfilled" && sync.status === "fulfilled" && sync.value;
      setBehindSince((since) => (ok ? null : (since ?? Date.now())));
      setNow(Date.now());
    },
    [limit],
  );

  useEffect(() => {
    if (!vault || !indexerEnabled()) return;
    void load(vault.address);
    const t = setInterval(() => void load(vault.address), REFRESH_MS);
    return () => clearInterval(t);
  }, [vault, load]);

  // Name link sales this phone has no link for, once each.
  const local = vault ? linkItems(vault.address) : new Map<string, string>();
  const unknownIds = [...new Set((records ?? []).map((r) => linkIdOf(r.invoiceId)).filter((id): id is string => !!id && !local.has(id)))].join(",");
  useEffect(() => {
    if (!unknownIds) return;
    let live = true;
    for (const id of unknownIds.split(",")) {
      if (remoteItems.has(id)) continue;
      void remoteLinkItem(id).then((item) => live && setRemoteItems((m) => new Map(m).set(id, item ?? "Payment link")));
    }
    return () => {
      live = false;
    };
    // remoteItems is read only to skip ids already asked for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unknownIds]);

  if (vault === undefined) return <p className="muted">Loading…</p>;

  if (!vault) {
    return (
      <section className="stack">
        <h1 className="sr-only">Sales</h1>
        <div className="card">
          <h2>No shop on this phone yet</h2>
          <p className="muted">Set up your shop or sign in. Your sales show up here.</p>
          <Link className="btn primary" href="/shop">
            Open my shop
          </Link>
        </div>
      </section>
    );
  }

  const known = new Set((records ?? []).map((r) => r.txHash));
  const all = [...(records ?? []), ...sent.filter((r) => !known.has(r.txHash))];
  const sales = toSales(all, vault.address, new Map([...remoteItems, ...local]));
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const todays = sales.filter((s) => s.payment.timestamp >= startOfDay);
  const refundsToday = all.filter((r) => r.kind === "refund" && r.timestamp >= startOfDay);
  const todayRefunds = refundsToday.reduce((s, r) => s + merchantAmount(r, vault.address), 0n);
  // The shop pays the network fee of each refund it sends (in dollars), so it counts like a fee.
  const refundFees = refundsToday.reduce((s, r) => s + (r.fee && r.fee.assetId === network.assetId ? r.fee.amount : 0n), 0n);
  const days = groupByDay(sales.slice(0, shown));
  const gross = todays.reduce((s, x) => s + x.amount, 0n);
  const fees = todays.reduce((s, x) => s + (x.amount - x.received), 0n) + refundFees;
  // What the shop keeps today: received after the fees, minus refunds it sent.
  const takings = gross - fees - todayRefunds;
  const stale = !indexerEnabled() || (behindSince !== null && now - behindSince > STALE_WARN_MS);
  const selected = screen.name !== "list" ? sales.find((s) => s.payment.txHash === screen.txHash) : undefined;

  return (
    <section className="stack" aria-live="polite">
      <h1 className="sr-only">Sales</h1>
      <ErrorNote text={error} onClose={() => setError(null)} />
      <Toast text={toast} onDone={clearToast} />

      {screen.name === "list" && (
        <>
          <div className="card">
            <span className="muted">Today you get</span>
            <span className="big">{records ? usd(takings < 0n ? 0n : takings) : <span className="skeleton big-skeleton" aria-label="Loading" />}</span>
            {records && (
              <span className="muted small">
                Sales {usd(gross)}
                {/* Rounded up to the cent, so the line adds up to the big number (which drops sub-cent dust). */}
                {fees > 0n && ` · Fees ${usdFee(fees)}`}
                {todayRefunds > 0n && ` · Refunds ${usd(todayRefunds)}`}
              </span>
            )}
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
            setToast(`Refunded ${usd(amount)} to customer ✓`);
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
        {sale.item && sale.item !== "Payment link" && (
          <>
            <dt>Item</dt>
            <dd>{sale.item}</dd>
          </>
        )}
        <dt>Paid via</dt>
        <dd>{sale.item ? "Payment link" : "Counter"}</dd>
        <dt>Date</dt>
        <dd>{whenText(p.timestamp)}</dd>
        {sale.received < sale.amount && (
          <>
            <dt>StableTap fee</dt>
            <dd>−{usdFee(sale.amount - sale.received)}</dd>
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
        {explorer && (
          <a className="link-btn" href={explorer} target="_blank" rel="noopener noreferrer">
            View on Portaldot explorer ↗
          </a>
        )}
      </details>
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

/**
 * Full or partial refund. The fee and the balance are known before the owner taps, so the screen
 * says up front how much can go back and offers that amount, instead of failing after the tap.
 */
function RefundForm({
  sale,
  vault,
  balance: liveBalance,
  onCancel,
  onDone,
}: {
  sale: Sale;
  vault: VaultRecord;
  balance: bigint | null;
  onCancel: () => void;
  onDone: (amount: bigint, txHash: string) => Promise<void>;
}) {
  const left = sale.amount - sale.refunded;
  const [mode, setMode] = useState<"full" | "other">("full");
  const [other, setOther] = useState("");
  // Whether the owner has finished typing once; before that a half-typed amount isn't an error.
  const [touched, setTouched] = useState(false);
  const [fee, setFee] = useState<bigint | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The balance when the owner tapped Refund. The live balance drops as the refund lands; the
  // screen must keep showing what was chosen ("Full refund $0.30"), not recompute from the new balance.
  const [tapBalance, setTapBalance] = useState<bigint | null>(null);
  const balance = busy !== null ? tapBalance : liveBalance;

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

  // Most the shop can send back now: what's left of the sale, and what its balance covers after the fee.
  const affordable = balance !== null && fee !== null ? (balance > fee ? balance - fee : 0n) : null;
  const max = affordable !== null && affordable < left ? affordable : left;
  const short = affordable !== null && affordable < left;

  // Live check of the typed amount; null = fine (or nothing to say yet).
  function check(): { value: bigint | null; problem: string | null } {
    if (mode === "full") return { value: max > 0n ? max : null, problem: max > 0n ? null : "Your balance can't cover a refund right now." };
    const text = other.trim().replace(/^\$/, "");
    if (!text) return { value: null, problem: null };
    if (!/^\d+(\.\d{1,2})?$/.test(text)) return { value: null, problem: "Enter an amount like 2.50" };
    const v = parseAmount(text, network.decimals);
    if (v <= 0n) return { value: null, problem: "Enter an amount above $0.00" };
    if (v > left) return { value: null, problem: `This sale has ${usd(left)} left to refund.` };
    if (affordable !== null && v > affordable) return { value: null, problem: `Your balance covers up to ${usd(affordable)}.` };
    return { value: v, problem: null };
  }
  const { value, problem } = check();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (value === null) return;
    try {
      setTapBalance(liveBalance);
      setBusy("Confirm on your phone…");
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

  return (
    <form className="card" onSubmit={(e) => void submit(e)}>
      <h2>Refund</h2>
      {short && (
        <p className="muted small">
          This sale has {usd(left)} left to refund. Your balance covers up to <strong>{usd(max)}</strong> after the fee.
        </p>
      )}
      <fieldset className="choices" disabled={busy !== null}>
        <legend className="sr-only">Refund amount</legend>
        <label className="choice">
          <input
            type="radio"
            name="refund"
            checked={mode === "full"}
            onChange={() => {
              setMode("full");
              setError(null);
            }}
          />
          <span>{short ? "Most you can refund" : "Full refund"}</span>
          <strong>{usd(max)}</strong>
        </label>
        <label className="choice">
          <input
            type="radio"
            name="refund"
            checked={mode === "other"}
            onChange={() => {
              setMode("other");
              setTouched(false);
              setError(null);
            }}
          />
          <span>Other amount</span>
        </label>
        {mode === "other" && (
          <>
            <div className={`money-input${touched && problem ? " invalid" : ""}`}>
              <span aria-hidden="true">$</span>
              <input
                inputMode="decimal"
                placeholder="0.00"
                value={other}
                onChange={(e) => {
                  setOther(e.target.value);
                  setError(null);
                }}
                onBlur={() => setTouched(true)}
                aria-label="Refund amount in dollars"
                aria-invalid={touched && !!problem}
                aria-describedby="refund-hint"
                autoFocus
              />
            </div>
            {(touched || value !== null) && problem && (
              <p id="refund-hint" className="field-error" role="alert">
                {problem}
              </p>
            )}
          </>
        )}
      </fieldset>
      <p className="muted small fee-line">
        Goes back to the customer who paid.{" "}
        {fee === null ? <span className="skeleton" aria-label="Loading the fee" /> : `Fee ${usdFee(fee)}, paid by you.`}
      </p>
      {mode === "full" && problem && <p className="field-error">{problem}</p>}
      <ErrorNote text={error} onClose={() => setError(null)} />
      <button type="submit" className="btn primary" disabled={busy !== null || value === null || fee === null}>
        {busy ? (
          <>
            <span className="spinner" aria-hidden="true" />
            {busy}
          </>
        ) : value !== null ? (
          `Refund ${usd(value)}`
        ) : (
          "Refund"
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
