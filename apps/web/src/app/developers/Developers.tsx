"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PayButton } from "@stabletap/sdk/react";
import { errorText } from "@/lib/format";
import { indexerEnabled } from "@/lib/indexer";
import { network, options } from "@/lib/network";
import { loadVault, type VaultRecord } from "@/lib/vault";
import { WebhookCard } from "./WebhookCard";

const SHOP_KEY = "stabletap.pos.shop.v1";
const REPO = "https://github.com/omkardongre/portaldot-hackathon/tree/main/packages/sdk";

/**
 * For shops with a developer: a Pay button for their own checkout and signed payment notifications.
 * Shops without one use payment links instead (Links tab).
 */
export function Developers() {
  const [vault, setVault] = useState<VaultRecord | null | undefined>(undefined);
  const [shop, setShop] = useState<{ name: string; payout: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      setVault(loadVault("shop"));
      const raw = localStorage.getItem(SHOP_KEY);
      setShop(raw ? (JSON.parse(raw) as { name: string; payout: string }) : null);
    } catch (e) {
      setError(errorText(e));
      setVault(null);
    }
  }, []);

  const to = shop?.payout ?? "5…your shop address";
  return (
    <section className="stack">
      <h1>For developers</h1>
      <p className="muted">
        Add StableTap to your own website or app. No developer? Use <Link href="/links">payment links</Link> instead.
      </p>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <div className="card">
        <h2>1. Add the Pay button</h2>
        <p className="muted small">
          Install the SDK from <a href={REPO}>our repository</a> (npm release coming), then drop the button into your checkout.
        </p>
        <pre className="code">{`import { PayButton } from "@stabletap/sdk/react";

<PayButton
  network={portaldot}
  to="${to}"
  amount="12.00"
  merchant="${shop?.name ?? "Your shop"}"
  walletUrl="${typeof window === "undefined" ? "https://stabletap.vercel.app" : window.location.origin}"
  onPaid={(p) => confirmOrder(p.txHash)}
/>`}</pre>
        <p className="muted small">
          The button opens the customer&apos;s StableTap wallet and confirms the payment from the chain itself, never from the browser.
        </p>
      </div>

      <div className="card">
        <h2>Try it</h2>
        {shop ? (
          <>
            <p className="muted small">A real $1.00 payment to {shop.name}, from any StableTap wallet.</p>
            <LiveExample to={shop.payout} shop={shop.name} />
          </>
        ) : (
          <>
            <p className="muted small">Set up your shop to try the button with your own shop wallet.</p>
            <Link className="btn" href="/pos">
              Set up my shop
            </Link>
          </>
        )}
      </div>

      {vault && indexerEnabled() && (
        <>
          <h2 className="section-title">2. Get notified of payments (optional)</h2>
          <WebhookCard vault={vault} />
          <details className="card">
            <summary>Check the signature on your server</summary>
            <p className="muted small">
              Notifications follow the <a href="https://www.standardwebhooks.com/">Standard Webhooks</a> spec, so any of its libraries works.
            </p>
            <pre className="code">{`import { Webhook } from "standardwebhooks";

const wh = new Webhook(process.env.STABLETAP_SECRET); // "whsec_…"
// Throws if the signature or timestamp is wrong.
const event = wh.verify(rawBody, {
  "webhook-id": req.headers["webhook-id"],
  "webhook-timestamp": req.headers["webhook-timestamp"],
  "webhook-signature": req.headers["webhook-signature"],
});`}</pre>
          </details>
        </>
      )}
    </section>
  );
}

function LiveExample({ to, shop }: { to: string; shop: string }) {
  const [done, setDone] = useState<string | null>(null);
  const [walletUrl, setWalletUrl] = useState<string | null>(null);
  useEffect(() => setWalletUrl(window.location.origin), []);
  if (done) {
    return (
      <p className="notice" role="status">
        Paid. Your server would now confirm the order ({done}).
      </p>
    );
  }
  if (!walletUrl) return null;
  return (
    <PayButton
      className="paybutton"
      network={network}
      to={to}
      amount="1.00"
      merchant={shop}
      walletUrl={walletUrl}
      {...(options.split ? { split: options.split } : {})}
      onPaid={(p) => setDone(`tx ${p.txHash.slice(0, 10)}…`)}
    />
  );
}
