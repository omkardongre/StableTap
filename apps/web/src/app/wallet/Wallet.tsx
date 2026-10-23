"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import {
  InvoiceExpiredError, assertNotExpired, chainNow, decodeInvoice, getBalances, nativeFeeCheck, pay, payWithAsset, quoteFee, quoteSwapPay, splitAmounts,
  type Invoice, type Receipt, type SwapQuote,
} from "@stabletap/engine";
import { formatAmount } from "@stabletap/engine/config";
import { PoolGauge, type PoolAsset } from "@/components/PoolGauge";
import { Scanner } from "@/components/Scanner";
import { getApi } from "@/lib/chain";
import { errorText, shortHash, tpot, usd } from "@/lib/format";
import { pairFrom, withUnlockedPair } from "@/lib/keys";
import { NATIVE_SYMBOL, STABLE_SYMBOL, network } from "@/lib/network";
import { findPaid, recordPaid } from "@/lib/paid";
import { usePayAssets, type PayAsset } from "@/lib/payAssets";
import { useBalances } from "@/lib/useBalances";
import { createVault, loadVault, passkeyPrfSupported, unlockVault, type VaultRecord } from "@/lib/vault";

type View =
  | { name: "loading" }
  | { name: "setup"; supported: boolean }
  | { name: "home" }
  | { name: "scan" }
  | { name: "confirm"; invoice: Invoice; fee: bigint | null; native: NativeCheck | null; alts: AltQuote[] }
  | { name: "paying"; invoice: Invoice; stage: string; via: PayAsset | null }
  | { name: "receipt"; invoice: Invoice; receipt: Receipt; nativeSpent: bigint; paidWith: PaidWith | null }
  | { name: "phrase"; phrase: string };

/** Paying a pUSD invoice with another token, swapped on the way. */
interface AltQuote {
  asset: PayAsset;
  quote: SwapQuote | null;
  error: string | null;
}

type NativeCheck = Awaited<ReturnType<typeof nativeFeeCheck>>;

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
  const { balances, error: balanceError } = useBalances(vault?.address ?? null);
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
        if (paidTx) throw new Error(`Rejected: this invoice is already paid (tx ${shortHash(paidTx)})`);
        const api = await getApi();
        assertNotExpired(invoice, await chainNow(api));
      } catch (e) {
        setView({ name: "home" });
        return setError(e instanceof InvoiceExpiredError ? "Rejected: this invoice has expired. Ask the shop for a new one." : errorText(e));
      }
      // Other tokens are offered by the effect below, as their balances load.
      setView({ name: "confirm", invoice, fee: null, native: null, alts: [] });
      const api = await getApi();
      try {
        const [fee, native] = await Promise.all([quoteFee(api, network, invoice, address), nativeFeeCheck(api, network, invoice, address)]);
        setView((v) => (v.name === "confirm" && v.invoice.id === invoice.id ? { ...v, fee, native } : v));
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
        if (!stored) return setView({ name: "setup", supported: await passkeyPrfSupported() });
        setVault(stored);
        setView({ name: "home" });
        // Payment links opened directly (e.g. from an NFC tag): /wallet?pay=<portaldot:pay?...>
        const link = new URLSearchParams(window.location.search).get("pay");
        if (link) {
          window.history.replaceState(null, "", window.location.pathname);
          await openInvoice(link, stored.address);
        }
      } catch (e) {
        setError(errorText(e));
        setView({ name: "setup", supported: false });
      }
    })();
  }, [openInvoice]);

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

  async function fund(asset?: number) {
    if (!vault) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/faucet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: vault.address, asset }) });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `Faucet error ${res.status}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirmPay(invoice: Invoice, alt?: { asset: PayAsset; quote: SwapQuote }) {
    if (!vault || !balances) return;
    setError(null);
    const nativeBefore = balances.native;
    try {
      const via = alt?.asset ?? null;
      setView({ name: "paying", invoice, stage: "Confirm with your fingerprint…", via });
      const api = await getApi();
      const onStage = (stage: string) => setView({ name: "paying", invoice, via, stage: stage === "signed" ? "Sending…" : "In a block, waiting for finality…" });
      let paidWith: PaidWith | null = null;
      const receipt = await withUnlockedPair(vault, async (pair) => {
        if (!alt) return pay(api, network, invoice, pair, onStage);
        const r = await payWithAsset(api, network, invoice, alt.asset.id, alt.quote.maxIn, pair, onStage);
        paidWith = { id: alt.asset.id, symbol: alt.asset.symbol, decimals: alt.asset.decimals, spent: r.spentIn, fee: r.feePaid };
        return r;
      });
      recordPaid(invoice.to, invoice.id, receipt.txHash);
      const after = await getBalances(api, network, vault.address, receipt.blockHash);
      setView({ name: "receipt", invoice, receipt, nativeSpent: nativeBefore - after.native, paidWith });
    } catch (e) {
      if (e instanceof InvoiceExpiredError) {
        setView({ name: "home" });
        return setError("Rejected: this invoice has expired. Ask the shop for a new one.");
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

  const alert = error ?? balanceError ?? assetError;
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
      <div className="row">
        <h1>Wallet</h1>
      </div>
      {alert && (
        <p className="alert" role="alert">
          {alert}
        </p>
      )}

      {view.name === "loading" && <p className="muted">Loading…</p>}

      {view.name === "setup" && (
        <div className="card">
          <h2>Create your wallet</h2>
          <p className="muted">Your key is created on this phone and locked by your fingerprint or face. It never leaves the device.</p>
          {view.supported ? (
            <button className="btn primary" onClick={create} disabled={busy}>
              {busy ? "Creating…" : "Create wallet"}
            </button>
          ) : (
            <p className="alert">This browser can&apos;t lock a key with a passkey. Use Chrome on Android or Safari 18+ on iPhone.</p>
          )}
        </div>
      )}

      {vault && view.name === "home" && (
        <>
          <div className="card">
            <span className="label">Balance</span>
            <span className="big">{balances ? usd(balances.stable) : "…"}</span>
            {payAssets
              .filter((a) => a.balance > 0n)
              .map((a) => (
                <span key={a.id} className="small">
                  {amt(a.balance, a)}
                </span>
              ))}
            <span className="muted small">
              {balances ? `${tpot(balances.native)} ${NATIVE_SYMBOL} (one-time account deposit, never spent)` : "Connecting…"}
            </span>
          </div>
          {empty && (
            <button className="btn" onClick={() => void fund()} disabled={busy}>
              {busy ? "Requesting…" : "Get 20 test dollars"}
            </button>
          )}
          {empty &&
            payAssets.map((a) => (
              <button key={a.id} className="btn" onClick={() => void fund(a.id)} disabled={busy}>
                {busy ? "Requesting…" : `Get test ${a.symbol} instead`}
              </button>
            ))}
          <button
            className="btn primary"
            onClick={() => setView({ name: "scan" })}
            disabled={!balances || (balances.stable === 0n && !payAssets.some((a) => a.balance > 0n))}
          >
            Scan to pay
          </button>
          <div className="card">
            <span className="label">Your address</span>
            <span className="mono small">{vault.address}</span>
            <button className="btn" onClick={() => navigator.clipboard.writeText(vault.address)}>
              Copy address
            </button>
            <button className="btn" onClick={showPhrase}>
              Show recovery phrase
            </button>
          </div>
        </>
      )}

      {vault && view.name === "scan" && (
        <>
          <Scanner onResult={(text) => void openInvoice(text, vault.address)} />
          <PasteLink onSubmit={(text) => void openInvoice(text, vault.address)} />
          <button className="btn" onClick={() => setView({ name: "home" })}>
            Cancel
          </button>
        </>
      )}

      {view.name === "confirm" && (
        <div className="card">
          <span className="label">Pay {view.invoice.merchant ?? "merchant"}</span>
          <span className="big">{usd(view.invoice.amount)}</span>
          <dl className="kv">
            <dt>Network fee</dt>
            <dd>{view.fee === null ? "estimating…" : `≈ ${usd(view.fee)}`}</dd>
            <dt>Paid in</dt>
            <dd>dollars (not {NATIVE_SYMBOL})</dd>
            {view.native && (
              <>
                <dt>With a {NATIVE_SYMBOL} fee</dt>
                <dd className={view.native.payable ? undefined : "bad"}>
                  {view.native.payable
                    ? `≈ ${tpot(view.native.fee)} ${NATIVE_SYMBOL}`
                    : `would fail: needs ${tpot(view.native.fee)} ${NATIVE_SYMBOL}, you can spend ${tpot(view.native.spendable)}`}
                </dd>
              </>
            )}
            <dt>Invoice</dt>
            <dd className="mono small">{view.invoice.id}</dd>
            {view.invoice.split && (
              <>
                <dt>Shop gets</dt>
                <dd>{usd(splitAmounts(view.invoice).merchant)}</dd>
                <dt>Platform fee ({view.invoice.split.bps / 100}%)</dt>
                <dd>{usd(splitAmounts(view.invoice).platform)}</dd>
              </>
            )}
          </dl>
          <span className="muted small mono">To {view.invoice.to}</span>
          {view.invoice.split && <span className="muted small mono">Platform {view.invoice.split.to}</span>}
          <button
            className="btn primary"
            onClick={() => void confirmPay(view.invoice)}
            disabled={view.fee === null || !balances || balances.stable < view.invoice.amount + view.fee}
          >
            Pay with fingerprint
          </button>
          {view.fee !== null && balances && balances.stable < view.invoice.amount + view.fee && (
            <p className={view.alts.length ? "muted small" : "alert"}>Not enough dollars for this payment and its fee{view.alts.length ? ". You can pay with another token:" : "."}</p>
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
                      <dt>At most</dt>
                      <dd>{amt(quote.maxIn, asset)}</dd>
                      <dt>Network fee</dt>
                      <dd>≈ {amt(quote.fee, asset)}</dd>
                    </>
                  )}
                </dl>
                <span className="muted small">The invoice is still paid in exactly {usd(view.invoice.amount)}; the pool swaps your {asset.symbol} on the way.</span>
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
          <p>{view.stage}</p>
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
                  <dt>Fee (in dollars)</dt>
                  <dd>{usd(view.receipt.feePaid)}</dd>
                </>
              )}
              <dt>{NATIVE_SYMBOL} spent</dt>
              <dd>{tpot(view.nativeSpent)}</dd>
              <dt>Block</dt>
              <dd>#{view.receipt.blockNumber} (final)</dd>
              <dt>Invoice</dt>
              <dd className="mono small">{view.invoice.id}</dd>
            </dl>
            <span className="label">Transaction</span>
            <span className="mono small" title={view.receipt.txHash}>
              {shortHash(view.receipt.txHash)}
            </span>
            <button className="btn" onClick={() => navigator.clipboard.writeText(view.receipt.txHash)}>
              Copy tx hash
            </button>
          </div>
          <button className="btn primary" onClick={() => setView({ name: "home" })}>
            Done
          </button>
        </>
      )}

      {gaugeAssets.length > 0 && <PoolGauge assets={gaugeAssets} />}

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
        Or paste a payment link
      </label>
      <input id="paylink" value={text} onChange={(e) => setText(e.target.value)} placeholder="portaldot:pay?…" autoComplete="off" />
      <button className="btn" type="submit" disabled={!text.trim()}>
        Open link
      </button>
    </form>
  );
}
