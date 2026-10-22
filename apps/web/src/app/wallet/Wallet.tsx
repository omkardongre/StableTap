"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import { decodeInvoice, getBalances, pay, quoteFee, type Invoice, type Receipt } from "@stabletap/engine";
import { Scanner } from "@/components/Scanner";
import { getApi } from "@/lib/chain";
import { errorText, shortHash, tpot, usd } from "@/lib/format";
import { NATIVE_SYMBOL, network } from "@/lib/network";
import { useBalances } from "@/lib/useBalances";
import { createVault, loadVault, passkeyPrfSupported, unlockVault, type VaultRecord } from "@/lib/vault";

type View =
  | { name: "loading" }
  | { name: "setup"; supported: boolean }
  | { name: "home" }
  | { name: "scan" }
  | { name: "confirm"; invoice: Invoice; fee: bigint | null }
  | { name: "paying"; invoice: Invoice; stage: string }
  | { name: "receipt"; invoice: Invoice; receipt: Receipt; nativeSpent: bigint }
  | { name: "phrase"; phrase: string };

async function pairFrom(phrase: string) {
  await cryptoWaitReady();
  return new Keyring({ type: "sr25519", ss58Format: network.ss58 }).addFromMnemonic(phrase);
}

export function Wallet() {
  const [vault, setVault] = useState<VaultRecord | null>(null);
  const [view, setView] = useState<View>({ name: "loading" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { balances, error: balanceError } = useBalances(vault?.address ?? null);

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
      setView({ name: "confirm", invoice, fee: null });
      try {
        const api = await getApi();
        const fee = await quoteFee(api, network, invoice, address);
        setView((v) => (v.name === "confirm" && v.invoice.id === invoice.id ? { ...v, fee } : v));
      } catch (e) {
        setError(`Could not estimate the fee: ${errorText(e)}`);
      }
    },
    [],
  );

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

  async function fund() {
    if (!vault) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/faucet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: vault.address }) });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `Faucet error ${res.status}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirmPay(invoice: Invoice) {
    if (!vault || !balances) return;
    setError(null);
    const nativeBefore = balances.native;
    try {
      setView({ name: "paying", invoice, stage: "Confirm with your fingerprint…" });
      const pair = await pairFrom(await unlockVault(vault));
      if (pair.address !== vault.address) throw new Error("Unlocked key does not match this wallet");
      const api = await getApi();
      try {
        const receipt = await pay(api, network, invoice, pair, (stage) =>
          setView({ name: "paying", invoice, stage: stage === "signed" ? "Sending…" : "In a block, waiting for finality…" }),
        );
        const after = await getBalances(api, network, vault.address, receipt.blockHash);
        setView({ name: "receipt", invoice, receipt, nativeSpent: nativeBefore - after.native });
      } finally {
        pair.lock();
      }
    } catch (e) {
      setError(errorText(e));
      setView({ name: "confirm", invoice, fee: null });
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

  const alert = error ?? balanceError;

  return (
    <section className="stack" aria-live="polite">
      <div className="row">
        <h1>Wallet</h1>
        <Link href="/" className="small">
          Home
        </Link>
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
            <span className="muted small">
              {balances ? `${tpot(balances.native)} ${NATIVE_SYMBOL} (one-time account deposit, never spent)` : "Connecting…"}
            </span>
          </div>
          {balances && balances.native === 0n && balances.stable === 0n && (
            <button className="btn" onClick={fund} disabled={busy}>
              {busy ? "Requesting…" : "Get 20 test dollars"}
            </button>
          )}
          <button className="btn primary" onClick={() => setView({ name: "scan" })} disabled={!balances || balances.stable === 0n}>
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
            <dt>Invoice</dt>
            <dd className="mono small">{view.invoice.id}</dd>
          </dl>
          <span className="muted small mono">To {view.invoice.to}</span>
          <button
            className="btn primary"
            onClick={() => void confirmPay(view.invoice)}
            disabled={view.fee === null || !balances || balances.stable < view.invoice.amount + view.fee}
          >
            Pay with fingerprint
          </button>
          {view.fee !== null && balances && balances.stable < view.invoice.amount + view.fee && <p className="alert">Not enough dollars for this payment and its fee.</p>}
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
              <dt>Fee (in dollars)</dt>
              <dd>{usd(view.receipt.feePaid)}</dd>
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
