"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import {
  InvoiceExpiredError, assertNotExpired, chainNow, decodeInvoice, encodeInvoice, pay, payWithAsset, quoteFee, quoteSwapPay,
  type Invoice, type Receipt, type SwapQuote,
} from "@stabletap/engine";
import { formatAmount } from "@stabletap/engine/config";
import { PoolGauge, type PoolAsset } from "@/components/PoolGauge";
import { Scanner } from "@/components/Scanner";
import { getApi } from "@/lib/chain";
import Link from "next/link";
import { errorText, shortHash, usd, usdFee, whenText } from "@/lib/format";
import { fetchPayerRecords, indexerEnabled, type IndexedRecord } from "@/lib/indexer";
import { pairFrom, withUnlockedPair } from "@/lib/keys";
import { linkInvoice, parseLink } from "@/lib/links";
import { STABLE_SYMBOL, explorerLink, network } from "@/lib/network";
import { findPaid, paidNames, recentPayments, recordPaid, type RecentPayment } from "@/lib/paid";
import { usePayAssets, type PayAsset } from "@/lib/payAssets";
import { useBalances } from "@/lib/useBalances";
import { createVault, loadVault, passkeyPrfSupported, unlockVault, type VaultRecord } from "@/lib/vault";

type View =
  | { name: "loading" }
  | { name: "setup"; supported: boolean }
  | { name: "home" }
  | { name: "scan" }
  | { name: "paste" }
  | { name: "confirm"; invoice: Invoice; fee: bigint | null; alts: AltQuote[] }
  | { name: "paying"; invoice: Invoice; stage: string; via: PayAsset | null }
  | { name: "receipt"; invoice: Invoice; receipt: Receipt; paidWith: PaidWith | null }
  | { name: "phrase"; phrase: string }
  | { name: "activity"; item: Activity };

/** Paying a pUSD invoice with another token, swapped on the way. */
interface AltQuote {
  asset: PayAsset;
  quote: SwapQuote | null;
  error: string | null;
}

/** A payment waiting for this new wallet (survives the passkey prompt and a reload). */
const PENDING_KEY = "stabletap.pending-pay.v2";
/** Recent rows shown at first, and added by each "Show more". */
const RECENT_PAGE = 5;
/** How long a faucet message stays up: long enough to read, then out of the way. */
const NOTICE_MS = 6_000;

/** The code to pay, plus the payment link it came from (if any) so an expired code can be renewed. */
interface Pending {
  link: string;
  from: string | null;
  invoice: Invoice;
}

function readPending(): { link: string; from: string | null } | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(PENDING_KEY) ?? "null") as { link?: unknown; from?: unknown } | null;
    return v && typeof v.link === "string" ? { link: v.link, from: typeof v.from === "string" ? v.from : null } : null;
  } catch {
    return null;
  }
}

interface PaidWith {
  id: number;
  symbol: string;
  decimals: number;
  spent: bigint;
  fee: bigint;
}

const amt = (v: bigint, a: { decimals: number; symbol: string }) => `${formatAmount(v, a.decimals)} ${a.symbol}`;

export function Wallet() {
  const [vault, setVault] = useState<VaultRecord | null>(null);
  const [view, setView] = useState<View>({ name: "loading" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // The test-dollar faucet is running.
  const [funding, setFunding] = useState<"stable" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Faucet problems are not payment errors: they clear themselves like the success notice.
  const [fundError, setFundError] = useState<string | null>(null);
  useEffect(() => {
    if (!notice && !fundError) return;
    const t = setTimeout(() => {
      setNotice(null);
      setFundError(null);
    }, NOTICE_MS);
    return () => clearTimeout(t);
  }, [notice, fundError]);
  const [recent, setRecent] = useState<RecentPayment[]>([]);
  // The same history from the chain: covers other devices and refunds the shop sent back.
  const [chainRecent, setChainRecent] = useState<IndexedRecord[] | null>(null);
  // A payment link opened before this person had a wallet: kept until they can pay it.
  const [pending, setPending] = useState<Pending | null>(null);
  const [shown, setShown] = useState(RECENT_PAGE);
  // Refresh the list whenever the wallet comes back to its home screen (e.g. after a payment).
  useEffect(() => {
    if (view.name !== "home") return setNotice(null);
    try {
      setRecent(recentPayments(50));
    } catch {
      setRecent([]);
    }
  }, [view.name]);
  const { balances, error: balanceError } = useBalances(vault?.address ?? null);
  useEffect(() => {
    if (view.name !== "home" || !vault || !indexerEnabled()) return;
    let live = true;
    const load = () =>
      // One extra row tells whether there is more to show.
      fetchPayerRecords(vault.address, Math.min(100, shown + 1))
        .then((r) => live && setChainRecent(r))
        .catch(() => undefined);
    void load();
    const t = setInterval(load, 15_000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [view.name, vault, shown]);
  const { assets: payAssets, error: assetError } = usePayAssets(vault?.address ?? null);

  const openInvoice = useCallback(
    async (text: string, address: string) => {
      setError(null);
      let invoice: Invoice;
      try {
        invoice = decodeInvoice(text, network.ss58);
      } catch (e) {
        setView({ name: "home" });
        return setError(errorText(e));
      }
      try {
        const paidTx = findPaid(invoice.to, invoice.id);
        if (paidTx) throw new Error("You already paid this. Ask the shop for a new code if needed.");
        const api = await getApi();
        assertNotExpired(invoice, await chainNow(api));
      } catch (e) {
        setView({ name: "home" });
        return setError(e instanceof InvoiceExpiredError ? "This payment code has expired. Ask the shop for a new one." : errorText(e));
      }
      // Other tokens are offered by the effect below, as their balances load.
      setView({ name: "confirm", invoice, fee: null, alts: [] });
      const api = await getApi();
      try {
        const fee = await quoteFee(api, network, invoice, address);
        setView((v) => (v.name === "confirm" && v.invoice.id === invoice.id ? { ...v, fee } : v));
      } catch (e) {
        setError(`Could not estimate the fee: ${errorText(e)}`);
      }
    },
    [],
  );

  // Offer each held pay asset on the confirm screen, also when balances arrive after the invoice
  // was opened (a tap or deep link opens it before they load).
  const confirmInvoice = view.name === "confirm" ? view.invoice : null;
  const offered = useRef(new Set<string>());
  useEffect(() => {
    if (!confirmInvoice || !vault) return;
    for (const asset of payAssets) {
      const k = `${confirmInvoice.id}:${asset.id}`;
      if (asset.balance === 0n || offered.current.has(k)) continue;
      offered.current.add(k);
      const forThis = (v: View) => v.name === "confirm" && v.invoice.id === confirmInvoice.id;
      setView((v) => (forThis(v) && v.name === "confirm" ? { ...v, alts: [...v.alts, { asset, quote: null, error: null }] } : v));
      void (async () => {
        let alt: AltQuote;
        try {
          alt = { asset, quote: await quoteSwapPay(await getApi(), network, confirmInvoice, asset.id, vault.address), error: null };
        } catch (e) {
          alt = { asset, quote: null, error: errorText(e) };
        }
        setView((v) => (forThis(v) && v.name === "confirm" ? { ...v, alts: v.alts.map((x) => (x.asset.id === asset.id ? alt : x)) } : v));
      })();
    }
  }, [confirmInvoice, payAssets, vault]);

  useEffect(() => {
    (async () => {
      try {
        const stored = loadVault();
        const params = new URLSearchParams(window.location.search);
        const incoming = params.get("pay");
        const from = params.get("from");
        if (incoming) window.history.replaceState(null, "", window.location.pathname);
        const keep = (p: { link: string; from: string | null } | null) => {
          if (!p) return;
          try {
            setPending({ ...p, invoice: decodeInvoice(p.link, network.ss58) });
            sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
          } catch {
            sessionStorage.removeItem(PENDING_KEY);
          }
        };
        if (!stored) {
          // New customer from a payment link: create the wallet first, then come back to this payment.
          keep(incoming ? { link: incoming, from } : readPending());
          return setView({ name: "setup", supported: await passkeyPrfSupported() });
        }
        setVault(stored);
        setView({ name: "home" });
        // Payment links opened directly (e.g. from an NFC tag or a checkout page): /wallet?pay=<portaldot:pay?...>
        if (incoming) await openInvoice(incoming, stored.address);
        // Left over from wallet setup: finish it once there are dollars to pay with (effect below).
        else keep(readPending());
      } catch (e) {
        setError(errorText(e));
        setView({ name: "setup", supported: false });
      }
    })();
  }, [openInvoice]);

  // Continue a payment that started before the wallet existed, as soon as the balance can cover it.
  useEffect(() => {
    if (!pending || !vault || !balances || view.name !== "home") return;
    if (balances.stable < pending.invoice.amount) return;
    sessionStorage.removeItem(PENDING_KEY);
    const p = pending;
    setPending(null);
    void (async () => {
      let link = p.link;
      try {
        // Setup can outlast the code; a payment link can always make a fresh one.
        const now = await chainNow(await getApi());
        if (p.from && p.invoice.expiresAt !== undefined && now >= p.invoice.expiresAt) {
          link = encodeInvoice(linkInvoice(parseLink(new URLSearchParams(p.from)), now), network.ss58);
        }
      } catch {
        // Fall through: openInvoice reports an expired or broken code.
      }
      await openInvoice(link, vault.address);
    })();
  }, [pending, vault, balances, view.name, openInvoice]);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const phrase = mnemonicGenerate(12);
      const pair = await pairFrom(phrase);
      setVault(await createVault(phrase, pair.address));
      pair.lock();
      setView({ name: "home" });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function fund() {
    if (!vault) return;
    setFunding("stable");
    setFundError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: vault.address }),
        signal: AbortSignal.timeout(90_000),
      }).catch(() => {
        throw new Error("The test network didn't answer in time. Please try again.");
      });
      const body = (await res.json()) as { error?: string };
      // The test faucet hands out dollars once per wallet.
      if (res.status === 409) throw new Error("You already got your free test dollars.");
      if (!res.ok) throw new Error(body.error ?? `Faucet error ${res.status}`);
      setNotice("+$20 test dollars added");
    } catch (e) {
      setFundError(errorText(e));
    } finally {
      setFunding(null);
    }
  }

  async function confirmPay(invoice: Invoice, alt?: { asset: PayAsset; quote: SwapQuote }) {
    if (!vault || !balances) return;
    setError(null);
    try {
      const via = alt?.asset ?? null;
      setView({ name: "paying", invoice, stage: "Confirm with your fingerprint…", via });
      // Chain stages (signed, in a block, final) mean nothing to a shopper: after the fingerprint it's just "Paying…".
      const api = await getApi();
      const onStage = () => setView({ name: "paying", invoice, via, stage: "Paying…" });
      let paidWith: PaidWith | null = null;
      const receipt = await withUnlockedPair(vault, async (pair) => {
        if (!alt) return pay(api, network, invoice, pair, onStage);
        const r = await payWithAsset(api, network, invoice, alt.asset.id, alt.quote.maxIn, pair, onStage);
        paidWith = { id: alt.asset.id, symbol: alt.asset.symbol, decimals: alt.asset.decimals, spent: r.spentIn, fee: r.feePaid };
        return r;
      });
      recordPaid(invoice.to, invoice.id, receipt.txHash, { merchant: invoice.merchant, amount: invoice.amount });
      setView({ name: "receipt", invoice, receipt, paidWith });
    } catch (e) {
      if (e instanceof InvoiceExpiredError) {
        setView({ name: "home" });
        return setError("This payment code has expired. Ask the shop for a new one.");
      }
      setError(errorText(e));
      setView({ name: "home" });
    }
  }

  async function showPhrase() {
    if (!vault) return;
    setError(null);
    try {
      setView({ name: "phrase", phrase: await unlockVault(vault) });
    } catch (e) {
      setError(errorText(e));
    }
  }

  const alert = error ?? fundError ?? balanceError ?? assetError;
  const activity = vault ? toActivity(chainRecent, recent, vault.address) : [];
  const empty = balances !== null && balances.native === 0n && balances.stable === 0n;
  // Pools a swap payment moves: shown from the choice to the receipt, so the change is visible.
  const swapAssets: PoolAsset[] =
    view.name === "confirm"
      ? view.alts.map((a) => a.asset)
      : view.name === "paying" && view.via
        ? [view.via]
        : view.name === "receipt" && view.paidWith
          ? [view.paidWith]
          : [];
  const gaugeAssets: PoolAsset[] = swapAssets.length ? [...swapAssets, { id: network.assetId, symbol: STABLE_SYMBOL, decimals: network.decimals }] : [];

  return (
    <section className="stack" aria-live="polite">
      {/* The active "Wallet" tab already names the page; keep a heading for screen readers only. */}
      <h1 className="sr-only">Wallet</h1>
      {alert && (
        <p className="alert" role="alert">
          {alert}
        </p>
      )}

      {notice && view.name === "home" && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      {view.name === "loading" && <p className="muted">Loading…</p>}

      {view.name === "setup" && (
        <div className="card">
          <h2>Create your wallet</h2>
          {pending ? (
            <p className="muted">
              To pay {pending.invoice.merchant ?? "the shop"} <strong>{usd(pending.invoice.amount)}</strong>. Secured with your fingerprint.
            </p>
          ) : (
            <p className="muted">Pay shops in dollars. Secured with your fingerprint.</p>
          )}
          {view.supported ? (
            <button className="btn primary" onClick={create} disabled={busy}>
              {busy ? "Creating…" : "Create my wallet"}
            </button>
          ) : (
            <p className="alert">This browser can&apos;t lock a key with a passkey. Use Chrome on Android or Safari 18+ on iPhone.</p>
          )}
        </div>
      )}

      {vault && view.name === "home" && (
        <>
          <div className="card">
            <div className="row">
              <span className="label">Balance</span>
              {!empty && balances && (
                <button type="button" className="pill-btn" onClick={() => void fund()} disabled={funding !== null}>
                  {funding === "stable" ? "Adding…" : "+ Add money"}
                </button>
              )}
            </div>
            <span className="big">{balances ? usd(balances.stable) : "…"}</span>
            {payAssets
              .filter((a) => a.balance > 0n)
              .map((a) => (
                <span key={a.id} className="small">
                  {amt(a.balance, a)}
                </span>
              ))}
            {!balances && <span className="muted small">Connecting…</span>}
          </div>
          {pending && (
            <div className="notice" role="status">
              <strong>
                Paying {pending.invoice.merchant ?? "a shop"} {usd(pending.invoice.amount)}
              </strong>
              <span className="small">Add dollars to your wallet and the payment opens right away.</span>
            </div>
          )}
          {empty ? (
            <>
              <button className="btn primary" onClick={() => void fund()} disabled={funding !== null}>
                {funding === "stable" ? "Adding dollars…" : "Get 20 free test dollars"}
              </button>
              {funding !== null && <p className="muted small center">This takes up to a minute.</p>}
            </>
          ) : (
            <button
              className="btn primary"
              onClick={() => setView({ name: "scan" })}
              disabled={!balances || (balances.stable === 0n && !payAssets.some((a) => a.balance > 0n))}
            >
              Scan to pay
            </button>
          )}
          {activity.length > 0 && (
            <div className="card">
              <h2 className="card-title">Recent</h2>
              <ul className="activity">
                {activity.slice(0, shown).map((a) => (
                  <li key={a.key}>
                    <button type="button" className="activity-row" onClick={() => setView({ name: "activity", item: a })}>
                      <span>
                        <strong>{a.title}</strong>
                        <span className="muted small">
                          {a.refund && a.title !== "Refund" ? "Refund · " : ""}
                          {whenText(a.at)}
                        </span>
                      </span>
                      <span className={`amount${a.refund ? " plus" : ""}`}>
                        {a.refund ? "+" : "−"}
                        {usd(a.amount)}
                      </span>
                      <span className="chevron" aria-hidden="true">
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {activity.length > shown && (
                <button type="button" className="link-btn" onClick={() => setShown((n) => n + RECENT_PAGE * 2)}>
                  Show more
                </button>
              )}
            </div>
          )}
          <details className="card">
            <summary>Account and backup</summary>
            <div className="stack">
              {/* The one thing everyone should do: without the phrase, a lost phone means lost money. */}
              <p className="muted small">Write down your recovery phrase. It&apos;s the only way to get your money back if you lose this phone.</p>
              <button className="btn primary" onClick={showPhrase}>
                Show recovery phrase
              </button>
              <div className="row">
                <div className="stack tight">
                  <span className="label">Your address</span>
                  <span className="mono small" title={vault.address}>
                    {shortHash(vault.address)}
                  </span>
                </div>
                <CopyButton text={vault.address} label="Copy" />
              </div>
              <Link className="link-btn" href="/business">
                Have a shop? Open StableTap Business
              </Link>
            </div>
          </details>
        </>
      )}

      {vault && view.name === "activity" && (
        <ActivityDetail item={view.item} payAssets={payAssets} onBack={() => setView({ name: "home" })} />
      )}

      {vault && view.name === "scan" && (
        <Scanner
          title="Scan the shop's QR code"
          hint="Point your camera at the code on the shop's screen."
          onResult={(text) => void openInvoice(text, vault.address)}
          onCancel={() => setView({ name: "home" })}
          extra={
            <button type="button" className="scanner-link" onClick={() => setView({ name: "paste" })}>
              Paste a payment link instead
            </button>
          }
        />
      )}

      {vault && view.name === "paste" && (
        <div className="card">
          <PasteLink onSubmit={(text) => void openInvoice(text, vault.address)} />
          <button className="btn" onClick={() => setView({ name: "home" })}>
            Cancel
          </button>
        </div>
      )}

      {view.name === "confirm" && (
        <div className="card">
          <span className="label">Pay {view.invoice.merchant ?? "merchant"}</span>
          <span className="big">{usd(view.invoice.amount)}</span>
          <dl className="kv">
            <dt>Fee</dt>
            <dd>{view.fee === null ? "…" : usdFee(view.fee)}</dd>
          </dl>
          <button
            className="btn primary"
            onClick={() => void confirmPay(view.invoice)}
            disabled={view.fee === null || !balances || balances.stable < view.invoice.amount + view.fee}
          >
            Pay with fingerprint
          </button>
          {view.fee !== null && balances && balances.stable < view.invoice.amount + view.fee && (
            <p className={view.alts.length ? "muted small" : "alert"}>Not enough dollars for this payment{view.alts.length ? ". You can pay with another coin you hold:" : "."}</p>
          )}
          {view.alts.map(({ asset, quote, error: altError }) => {
            const enough = quote !== null && asset.balance >= quote.maxIn + quote.fee;
            return (
              <div key={asset.id} className="stack">
                <dl className="kv">
                  <dt>Pay with {asset.symbol}</dt>
                  <dd>{quote ? `≈ ${amt(quote.expectedIn, asset)}` : altError ? "unavailable" : "quoting…"}</dd>
                  {quote && (
                    <>
                      <dt>Fee</dt>
                      <dd>≈ {amt(quote.fee, asset)}</dd>
                    </>
                  )}
                </dl>
                <span className="muted small">The shop still receives exactly {usd(view.invoice.amount)}. Your {asset.symbol} is converted automatically.</span>
                <button className="btn" onClick={() => quote && void confirmPay(view.invoice, { asset, quote })} disabled={!enough}>
                  Pay with fingerprint ({asset.symbol})
                </button>
                {quote && !enough && <p className="alert small">Not enough {asset.symbol}.</p>}
                {altError && <p className="alert small">{altError}</p>}
              </div>
            );
          })}
          <button className="btn" onClick={() => setView({ name: "home" })}>
            Cancel
          </button>
        </div>
      )}

      {view.name === "paying" && (
        <div className="card" aria-busy="true">
          <span className="label">Paying {view.invoice.merchant ?? "merchant"}</span>
          <span className="big">{usd(view.invoice.amount)}</span>
          <p className="row-start">
            {view.stage === "Paying…" && <span className="spinner dark" aria-hidden="true" />}
            {view.stage}
          </p>
        </div>
      )}

      {view.name === "receipt" && (
        <>
          <div className="paid" role="status">
            <span className="label">Paid {view.invoice.merchant ?? ""}</span>
            <div className="big">{usd(view.invoice.amount)}</div>
          </div>
          <div className="card">
            <dl className="kv">
              {view.paidWith ? (
                <>
                  <dt>Paid with</dt>
                  <dd>{amt(view.paidWith.spent, view.paidWith)}</dd>
                  <dt>Fee (in {view.paidWith.symbol})</dt>
                  <dd>{amt(view.paidWith.fee, view.paidWith)}</dd>
                </>
              ) : (
                <>
                  <dt>Fee</dt>
                  <dd>{usdFee(view.receipt.feePaid)}</dd>
                </>
              )}
              <dt>Time</dt>
              <dd>{whenText(Date.now())}</dd>
            </dl>
            <details>
              <summary>Receipt details</summary>
              <dl className="kv small">
                <dt>Order</dt>
                <dd className="mono">{view.invoice.id}</dd>
              </dl>
              <CopyButton text={view.receipt.txHash} label="Copy transaction ID" />
              {explorerLink(view.receipt.blockNumber) && (
                <a className="link-btn" href={explorerLink(view.receipt.blockNumber)!} target="_blank" rel="noopener noreferrer">
                  View on Portaldot explorer ↗
                </a>
              )}
            </details>
          </div>
          <button className="btn primary" onClick={() => setView({ name: "home" })}>
            Done
          </button>
        </>
      )}

      {gaugeAssets.length > 0 && (
        <details>
          <summary>See how the conversion moved the market</summary>
          <PoolGauge assets={gaugeAssets} />
        </details>
      )}

      {view.name === "phrase" && (
        <div className="card">
          <h2>Recovery phrase</h2>
          <p className="muted">Write these words down and keep them offline. Anyone with them controls this wallet. If you lose this phone, they are the only way back.</p>
          <p className="mono">{view.phrase}</p>
          <button className="btn primary" onClick={() => setView({ name: "home" })}>
            Hide
          </button>
        </div>
      )}
    </section>
  );
}

function PasteLink({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) onSubmit(text);
      }}
    >
      <label className="label" htmlFor="paylink">
        Or paste a payment link from the shop
      </label>
      <input id="paylink" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste link here" autoComplete="off" />
      <button className="btn" type="submit" disabled={!text.trim()}>
        Open link
      </button>
    </form>
  );
}

interface Activity {
  key: string;
  title: string;
  refund: boolean;
  at: number;
  amount: bigint;
  /** Unknown (empty / 0 / null) for a payment from this device the history hasn't listed yet. */
  invoiceId: string;
  blockNumber: number;
  /** The network fee this wallet paid (payments only; the shop pays for refunds). */
  fee: { amount: bigint; assetId: number | null } | null;
}

/** One payment or refund, like the shop's sale detail: what, when, the fee, and the proof on chain. */
function ActivityDetail({ item, payAssets, onBack }: { item: Activity; payAssets: PayAsset[]; onBack: () => void }) {
  const explorer = explorerLink(item.blockNumber);
  const feeAsset = item.fee && item.fee.assetId !== network.assetId ? payAssets.find((a) => a.id === item.fee!.assetId) : undefined;
  return (
    <div className="card">
      <button type="button" className="link-btn back-btn" onClick={onBack}>
        ‹ Back
      </button>
      <span className="label">{item.refund ? `Refund from ${item.title === "Refund" ? "a shop" : item.title}` : `Paid ${item.title}`}</span>
      <div className="detail-head">
        <span className="big">
          {item.refund ? "+" : "−"}
          {usd(item.amount)}
        </span>
        <span className="chip ok">{item.refund ? "Refunded" : "Paid"}</span>
      </div>
      <dl className="kv">
        <dt>Date</dt>
        <dd>{whenText(item.at)}</dd>
        {item.fee && (
          <>
            <dt>Network fee</dt>
            <dd>{feeAsset ? amt(item.fee.amount, feeAsset) : usdFee(item.fee.amount)}</dd>
          </>
        )}
        {item.invoiceId && (
          <>
            <dt>Order</dt>
            <dd className="mono small">{item.invoiceId}</dd>
          </>
        )}
      </dl>
      {explorer ? (
        <a className="link-btn" href={explorer} target="_blank" rel="noopener noreferrer">
          View on Portaldot explorer ↗
        </a>
      ) : (
        <p className="muted small">The on-chain record shows up here in a few seconds.</p>
      )}
      <CopyButton text={item.key} label="Copy transaction ID" />
    </div>
  );
}

/** Payments and refunds from the chain, plus payments from this device the history hasn't caught up with yet. */
function toActivity(chain: IndexedRecord[] | null, local: RecentPayment[], me: string): Activity[] {
  const names = (() => {
    try {
      return paidNames();
    } catch {
      return new Map<string, string>();
    }
  })();
  const seen = new Set<string>();
  const out: Activity[] = [];
  for (const r of chain ?? []) {
    const refund = r.kind === "refund";
    // A swap payment first moves dollars from the pool to the payer; only what leaves the payer counts.
    const amount = r.transfers.filter((t) => (refund ? t.to === me : t.from === me)).reduce((sum, t) => sum + t.amount, 0n);
    if (amount === 0n) continue;
    seen.add(r.txHash);
    out.push({
      key: r.txHash,
      title: names.get(r.invoiceId) ?? (refund ? "Refund" : "Payment"),
      refund,
      at: r.timestamp,
      amount,
      invoiceId: r.invoiceId,
      blockNumber: r.blockNumber,
      fee: refund ? null : r.fee,
    });
  }
  for (const p of local)
    if (!seen.has(p.txHash)) out.push({ key: p.txHash, title: p.merchant, refund: false, at: p.at, amount: p.amount, invoiceId: "", blockNumber: 0, fee: null });
  return out.sort((a, b) => b.at - a.at);
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="btn" onClick={() => void navigator.clipboard.writeText(text).then(() => setCopied(true))}>
      {copied ? "Copied" : label}
    </button>
  );
}
