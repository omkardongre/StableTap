"use client";

import { useEffect, useState } from "react";
import { chainNow, encodeInvoice, type Invoice } from "@stabletap/engine";
import { getApi } from "@/lib/chain";
import { errorText, usd } from "@/lib/format";
import { checkoutInvoiceId, checkoutName, parseLink, type PaymentLink } from "@/lib/links";
import { network, options } from "@/lib/network";

/** Long enough to create a wallet and add test dollars before paying. */
const CHECKOUT_TTL_SEC = 15 * 60;

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
      // A fresh invoice per checkout: one link, many customers, each payment matched on its own.
      const invoice: Invoice = {
        to: link.to,
        amount: link.amount,
        id: checkoutInvoiceId(link.id),
        merchant: checkoutName(link.shop, link.item),
        expiresAt: (await chainNow(await getApi())) + CHECKOUT_TTL_SEC,
        ...(options.split ? { split: options.split } : {}),
      };
      const url = new URL("/wallet", window.location.origin);
      url.searchParams.set("pay", encodeInvoice(invoice, network.ss58));
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
