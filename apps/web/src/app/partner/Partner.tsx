"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PayButton } from "@stabletap/sdk/react";
import { normalizeAddress } from "@stabletap/sdk";
import { network } from "@/lib/network";

const KEY = "stabletap.partner.merchant.v1";

/**
 * Stand-in for a third-party Portaldot app. Everything payment-related here
 * comes from the published SDK (`@stabletap/sdk/react`), nothing from this app.
 */
export function Partner() {
  const [merchant, setMerchant] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [walletUrl, setWalletUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);

  useEffect(() => {
    setWalletUrl(window.location.origin);
    setMerchant(localStorage.getItem(KEY));
  }, []);

  return (
    <section className="stack">
      <div className="row">
        <h1>Hacker House Merch</h1>
        <Link href="/" className="small">
          StableTap
        </Link>
      </div>
      <p className="muted small">Demo partner app. Its checkout is the StableTap Pay button from the SDK.</p>

      {!merchant ? (
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const a = normalizeAddress(draft, network.ss58, "Not a valid Portaldot address");
              localStorage.setItem(KEY, a);
              setMerchant(a);
              setError(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : String(err));
            }
          }}
        >
          <label className="label" htmlFor="partner-merchant">
            Shop payout address
          </label>
          <input id="partner-merchant" className="mono" value={draft} onChange={(e) => setDraft(e.target.value)} autoComplete="off" spellCheck={false} required />
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn primary">
            Save
          </button>
        </form>
      ) : (
        <div className="card">
          <span className="label">Hacker House T-shirt</span>
          <span className="big">$12.00</span>
          {order ? (
            <p className="notice" role="status">
              Order confirmed. {order}
            </p>
          ) : (
            walletUrl && (
              <PayButton
                className="paybutton"
                network={network}
                to={merchant}
                amount="12.00"
                merchant="Hacker House Merch"
                walletUrl={walletUrl}
                onPaid={(p) => setOrder(`Paid in block #${p.blockNumber}, tx ${p.txHash.slice(0, 10)}…`)}
              />
            )
          )}
          <button
            className="btn"
            onClick={() => {
              localStorage.removeItem(KEY);
              setMerchant(null);
            }}
          >
            Change payout address
          </button>
        </div>
      )}

      <div className="card">
        <span className="label">The integration</span>
        <pre className="code">{`import { PayButton } from "@stabletap/sdk/react";

<PayButton network={net} to={shop} amount="12.00"
  walletUrl="https://<stabletap-host>" onPaid={confirmOrder} />`}</pre>
      </div>
    </section>
  );
}
