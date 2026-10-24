"use client";

import { useEffect, useState } from "react";
import { chainNow, encodeInvoice } from "@stabletap/engine";
import { getApi } from "@/lib/chain";
import { errorText, usd } from "@/lib/format";
import { linkInvoice, parseLink, type PaymentLink } from "@/lib/links";
import { network } from "@/lib/network";

/** Hosted checkout for a payment link: what you're buying, from whom, for how much, then pay. */
export function LinkCheckout() {
  const [link, setLink] = useState<Omit<PaymentLink, "createdAt"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setLink(parseLink(new URLSearchParams(window.location.search)));
    } catch (e) {
      setError(errorText(e));
    }
  }, []);

  async function pay() {
    if (!link) return;
    setBusy(true);
    setError(null);
    try {
      const invoice = linkInvoice(link, await chainNow(await getApi()));
      const url = new URL("/wallet", window.location.origin);
      url.searchParams.set("pay", encodeInvoice(invoice, network.ss58));
      // The link itself, so a new customer whose code runs out during wallet setup gets a fresh one.
      url.searchParams.set("from", window.location.search);
      window.location.assign(url.toString());
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  return (
    <section className="stack" aria-live="polite">
      <h1 className="sr-only">Checkout</h1>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!link && !error && <p className="muted">Loading…</p>}
      {link && (
        <div className="card checkout">
          <span className="muted">{link.shop}</span>
          <h2 className="checkout-item">{link.item}</h2>
          <span className="big">{usd(link.amount)}</span>
          <p className="muted small">+ a few cents network fee</p>
          <button className="btn primary" onClick={() => void pay()} disabled={busy}>
            {busy ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Opening your wallet…
              </>
            ) : (
              "Pay with fingerprint"
            )}
          </button>
          <p className="muted small center">No wallet yet? You can create one in a few seconds.</p>
        </div>
      )}
      <p className="muted small center">Payments by StableTap</p>
    </section>
  );
}
