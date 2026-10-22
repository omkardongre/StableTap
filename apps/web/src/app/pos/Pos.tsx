"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { encodeInvoice, newInvoiceId, parseAmount, watchInvoice, type Invoice, type PaidEvent } from "@stabletap/engine";
import { Qr } from "@/components/Qr";
import { getApi } from "@/lib/chain";
import { errorText, shortHash, usd } from "@/lib/format";
import { network } from "@/lib/network";
import { loadVault } from "@/lib/vault";

interface Shop {
  name: string;
  payout: string;
}

const SHOP_KEY = "stabletap.pos.shop.v1";
// The POS keypad charges in cents; the asset may have more decimals.
const KEYPAD_DECIMALS = 2;
const MAX_DIGITS = 7;

type View = { name: "setup" } | { name: "keypad" } | { name: "charging"; invoice: Invoice; link: string } | { name: "paid"; invoice: Invoice; paid: PaidEvent };

function loadShop(): Shop | null {
  const raw = localStorage.getItem(SHOP_KEY);
  if (!raw) return null;
  const s = JSON.parse(raw) as Partial<Shop>;
  if (typeof s.name !== "string" || typeof s.payout !== "string") throw new Error("Stored shop settings are corrupted");
  return { name: s.name, payout: s.payout };
}

/** Cents typed on the keypad -> "4.50". */
const centsText = (digits: string) => {
  const n = digits.replace(/^0+/, "").padStart(KEYPAD_DECIMALS + 1, "0");
  return `${n.slice(0, -KEYPAD_DECIMALS)}.${n.slice(-KEYPAD_DECIMALS)}`;
};

export function Pos() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [digits, setDigits] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = loadShop();
      setShop(s);
      setView(s ? { name: "keypad" } : { name: "setup" });
    } catch (e) {
      setError(errorText(e));
      setView({ name: "setup" });
    }
  }, []);

  function charge() {
    if (!shop) return;
    setError(null);
    try {
      const amount = parseAmount(centsText(digits), network.decimals);
      const invoice: Invoice = { to: shop.payout, amount, id: newInvoiceId(), merchant: shop.name };
      setView({ name: "charging", invoice, link: encodeInvoice(invoice, network.ss58) });
    } catch (e) {
      setError(errorText(e));
    }
  }

  const amountText = centsText(digits);
  const canCharge = /[1-9]/.test(digits);

  return (
    <section className="stack" aria-live="polite">
      <div className="row">
        <h1>{shop?.name ?? "Merchant POS"}</h1>
        <span className="row small">
          {shop && view?.name === "keypad" && (
            <button className="btn" onClick={() => setView({ name: "setup" })}>
              Settings
            </button>
          )}
          <Link href="/">Home</Link>
        </span>
      </div>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {view?.name === "setup" && (
        <ShopSettings
          initial={shop}
          onSave={(s) => {
            localStorage.setItem(SHOP_KEY, JSON.stringify(s));
            setShop(s);
            setError(null);
            setView({ name: "keypad" });
          }}
        />
      )}

      {view?.name === "keypad" && (
        <>
          <div className="card">
            <span className="label">Ready to charge</span>
            <span className="big" aria-label={`Amount ${amountText} dollars`}>
              ${amountText}
            </span>
          </div>
          <div className="keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <button key={d} className="btn" onClick={() => setDigits((v) => (v.length < MAX_DIGITS ? v + d : v))}>
                {d}
              </button>
            ))}
            <button className="btn" onClick={() => setDigits("")} aria-label="Clear">
              C
            </button>
            <button className="btn" onClick={() => setDigits((v) => (v && v.length < MAX_DIGITS ? v + "0" : v))}>
              0
            </button>
            <button className="btn" onClick={() => setDigits((v) => v.slice(0, -1))} aria-label="Delete last digit">
              ⌫
            </button>
          </div>
          <button className="btn primary" onClick={charge} disabled={!canCharge}>
            Charge ${amountText}
          </button>
        </>
      )}

      {view?.name === "charging" && (
        <Charging
          invoice={view.invoice}
          link={view.link}
          onPaid={(paid) => setView({ name: "paid", invoice: view.invoice, paid })}
          onError={(e) => setError(e)}
          onCancel={() => setView({ name: "keypad" })}
        />
      )}

      {view?.name === "paid" && (
        <>
          <div className="paid" role="status">
            <span className="label">Paid</span>
            <div className="big">{usd(view.invoice.amount)}</div>
          </div>
          <div className="card">
            <dl className="kv">
              <dt>Invoice</dt>
              <dd className="mono small">{view.invoice.id}</dd>
              <dt>Block</dt>
              <dd>#{view.paid.blockNumber} (final)</dd>
              <dt>From</dt>
              <dd className="mono small">{shortHash(view.paid.payer)}</dd>
            </dl>
            <span className="label">Transaction</span>
            <span className="mono small" title={view.paid.txHash}>
              {shortHash(view.paid.txHash)}
            </span>
          </div>
          <button
            className="btn primary"
            onClick={() => {
              setDigits("");
              setView({ name: "keypad" });
            }}
          >
            New sale
          </button>
        </>
      )}
    </section>
  );
}

function Charging({
  invoice,
  link,
  onPaid,
  onError,
  onCancel,
}: {
  invoice: Invoice;
  link: string;
  onPaid: (p: PaidEvent) => void;
  onError: (e: string) => void;
  onCancel: () => void;
}) {
  const cbs = useRef({ onPaid, onError });
  cbs.current = { onPaid, onError };
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let live = true;
    getApi()
      .then((api) =>
        watchInvoice(api, network, invoice, {
          onPaid: (p) => live && cbs.current.onPaid(p),
          onError: (e) => live && cbs.current.onError(`Stopped watching for the payment: ${e.message}`),
        }),
      )
      .then((s) => {
        if (live) {
          stop = s;
          setWatching(true);
        } else s();
      })
      .catch((e: unknown) => live && cbs.current.onError(errorText(e)));
    return () => {
      live = false;
      stop?.();
    };
  }, [invoice]);

  return (
    <div className="card">
      <span className="label">Scan to pay {invoice.merchant}</span>
      <span className="big">{usd(invoice.amount)}</span>
      <Qr value={link} label={`Payment QR code for ${usd(invoice.amount)}`} />
      <p className="muted" aria-busy={!watching}>
        {watching ? "Waiting for payment…" : "Connecting…"}
      </p>
      <span className="mono small">{invoice.id}</span>
      <button className="btn" onClick={() => navigator.clipboard.writeText(link)}>
        Copy payment link
      </button>
      <button className="btn" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

function ShopSettings({ initial, onSave }: { initial: Shop | null; onSave: (s: Shop) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [payout, setPayout] = useState(initial?.payout ?? "");
  const [error, setError] = useState<string | null>(null);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 1 || n.length > 40) return setError("Shop name must be 1-40 characters");
    try {
      onSave({ name: n, payout: encodeAddress(decodeAddress(payout.trim()), network.ss58) });
    } catch {
      setError("Payout address is not a valid Portaldot address");
    }
  }

  function useThisWallet() {
    try {
      const v = loadVault();
      if (!v) return setError("No wallet on this device yet. Create one in the wallet first.");
      setPayout(v.address);
    } catch (e) {
      setError(errorText(e));
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <h2>Shop settings</h2>
      <label className="label" htmlFor="shop-name">
        Shop name (shown to customers)
      </label>
      <input id="shop-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
      <label className="label" htmlFor="payout">
        Payout address
      </label>
      <input id="payout" className="mono" value={payout} onChange={(e) => setPayout(e.target.value)} autoComplete="off" spellCheck={false} required />
      <button type="button" className="btn" onClick={useThisWallet}>
        Use this device&apos;s wallet address
      </button>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn primary">
        Save
      </button>
    </form>
  );
}
