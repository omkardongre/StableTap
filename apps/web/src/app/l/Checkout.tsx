"use client";

import { useEffect, useState } from "react";
import { chainNow, encodeInvoice, quoteFee } from "@stabletap/engine";
import { parseAmount } from "@stabletap/engine/config";
import { ErrorNote } from "@/components/ErrorNote";
import { getApi } from "@/lib/chain";
import { errorText, usd, usdFee } from "@/lib/format";
import { linkQuery, type LinkInfo } from "@/lib/linkCore";
import { linkInvoice, parseLink } from "@/lib/links";
import { network } from "@/lib/network";
import { loadVault } from "@/lib/vault";

/** A short link's details from the server (amount as text, so it passes from server to browser as is). */
export interface ServerLink {
  id: string;
  item: string;
  shop: string;
  to: string;
  amount: string;
}

/**
 * Hosted checkout for a payment link: what you're buying, from whom, for how much, then pay.
 * `link` is set for short links (/l/<id>), null when that short link doesn't exist, and
 * undefined for the long form, which carries everything in the URL.
 */
export function LinkCheckout({ link: fromServer }: { link?: ServerLink | null }) {
  const [link, setLink] = useState<LinkInfo | null>(null);
  // The link can't be read or doesn't exist: nothing else to do on this page, so it stays.
  const [broken, setBroken] = useState<string | null>(null);
  // Opening the wallet failed (e.g. no connection): hides by itself, the customer can tap again.
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fee, setFee] = useState<bigint | null>(null);
  // Only people without a wallet on this phone need to hear that making one is quick.
  const [hasWallet, setHasWallet] = useState(true);

  useEffect(() => {
    try {
      if (fromServer === null) throw new Error("This payment link doesn't exist. Ask the shop for a new one.");
      setLink(fromServer ? { ...fromServer, amount: parseAmount(fromServer.amount, network.decimals) } : parseLink(new URLSearchParams(window.location.search)));
    } catch (e) {
      setBroken(errorText(e));
    }
    try {
      setHasWallet(loadVault() !== null);
    } catch {
      setHasWallet(false);
    }
  }, [fromServer]);

  // The exact fee, like a real checkout shows it. It barely depends on who pays, so a new
  // customer's estimate uses the shop's address.
  useEffect(() => {
    if (!link) return;
    let live = true;
    void (async () => {
      try {
        const api = await getApi();
        let payer = link.to;
        try {
          payer = loadVault()?.address ?? link.to;
        } catch {
          // No wallet: estimate with the shop's address.
        }
        const f = await quoteFee(api, network, linkInvoice(link, await chainNow(api)), payer);
        if (live) setFee(f);
      } catch {
        // The wallet shows the fee again before paying.
      }
    })();
    return () => {
      live = false;
    };
  }, [link]);

  async function pay() {
    if (!link) return;
    setBusy(true);
    setError(null);
    try {
      const invoice = linkInvoice(link, await chainNow(await getApi()));
      const url = new URL("/wallet", window.location.origin);
      url.searchParams.set("pay", encodeInvoice(invoice, network.ss58));
      // The link itself, so a new customer whose code runs out during wallet setup gets a fresh one.
      url.searchParams.set("from", linkQuery(link));
      window.location.assign(url.toString());
    } catch (e) {
      setError(errorText(e));
      setBusy(false);
    }
  }

  return (
    <section className="stack" aria-live="polite">
      <h1 className="sr-only">Checkout</h1>
      {broken && (
        <p className="alert" role="alert">
          {broken}
        </p>
      )}
      <ErrorNote text={error} onClose={() => setError(null)} />
      {!link && !broken && <p className="muted">Loading…</p>}
      {link && (
        <div className="card checkout">
          {/* Same look as the chat preview card, so the customer sees it's the shop they were talking to. */}
          <span className="shop-badge">
            <span className="shop-avatar" aria-hidden="true">
              {[...link.shop][0]?.toUpperCase() ?? "$"}
            </span>
            {link.shop}
          </span>
          <h2 className="checkout-item">{link.item}</h2>
          <span className="big">{usd(link.amount)}</span>
          <p className="muted small fee-line">{fee === null ? <span className="skeleton" aria-label="Loading the fee" /> : `+ ${usdFee(fee)} fee`}</p>
          <button className="btn primary" onClick={() => void pay()} disabled={busy}>
            {busy ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Opening your wallet…
              </>
            ) : (
              // The total that leaves the wallet, the same number the wallet's Pay button shows next.
              `Pay ${fee === null ? usd(link.amount) : usdFee(link.amount + fee)}`
            )}
          </button>
          {!hasWallet && <p className="muted small center">No wallet yet? You can make one in a few seconds.</p>}
        </div>
      )}
      <p className="muted small center">Payments by StableTap</p>
    </section>
  );
}
