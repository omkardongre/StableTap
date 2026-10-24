"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { parseAmount } from "@stabletap/engine/config";
import { Qr } from "@/components/Qr";
import { errorText, usd } from "@/lib/format";
import { ITEM_MAX, createLink, deleteLink, linkUrl, loadLinks, type PaymentLink } from "@/lib/links";
import { network } from "@/lib/network";

const SHOP_KEY = "stabletap.pos.shop.v1";

interface Shop {
  name: string;
  payout: string;
}

/** Payment links for selling online without a website: make a link, share it in a chat or bio. */
export function Links() {
  const [shop, setShop] = useState<Shop | null | undefined>(undefined);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHOP_KEY);
      const s = raw ? (JSON.parse(raw) as Shop) : null;
      setShop(s);
      if (s) setLinks(loadLinks(s.payout));
    } catch (e) {
      setError(errorText(e));
      setShop(null);
    }
  }, []);

  if (shop === undefined) return <p className="muted">Loading…</p>;

  if (!shop) {
    return (
      <section className="stack">
        <h1 className="sr-only">Payment links</h1>
        <div className="card">
          <h2>No shop on this phone yet</h2>
          <p className="muted">Set up your shop first, then make links to sell online.</p>
          <Link className="btn primary" href="/shop">
            Set up my shop
          </Link>
        </div>
      </section>
    );
  }

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  return (
    <section className="stack" aria-live="polite">
      <h1 className="sr-only">Payment links</h1>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {creating ? (
        <CreateForm
          shop={shop}
          onCancel={() => setCreating(false)}
          onCreated={(l) => {
            setLinks((all) => [l, ...all]);
            setCreating(false);
          }}
        />
      ) : links.length === 0 ? (
        <div className="card">
          <h2>Sell online</h2>
          <p className="muted small">Make a link for an item. Share it in a chat, on Instagram or on your website. Anyone can pay with it.</p>
          <button className="btn primary" onClick={() => setCreating(true)}>
            Create a payment link
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="row">
            <h2 className="card-title">Payment links</h2>
            <button type="button" className="pill-btn" onClick={() => setCreating(true)}>
              + New link
            </button>
          </div>
          <ul className="sales">
            {links.map((l) => (
              <li key={l.id} className="link-item">
                <LinkRow
                  link={l}
                  url={linkUrl(origin, l)}
                  onDelete={() => {
                    deleteLink(l.id);
                    setLinks((all) => all.filter((x) => x.id !== l.id));
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function CreateForm({ shop, onCancel, onCreated }: { shop: Shop; onCancel: () => void; onCreated: (l: PaymentLink) => void }) {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        try {
          const p = price.trim().replace(/^\$/, "");
          if (!/^\d{1,7}(\.\d{1,2})?$/.test(p)) throw new Error("Enter a price like 12.00");
          onCreated(createLink({ item, amount: parseAmount(p, network.decimals), shop: shop.name, to: shop.payout }));
        } catch (err) {
          setError(errorText(err));
        }
      }}
    >
      <h2>New payment link</h2>
      <label className="field-label" htmlFor="link-item">
        What are you selling?
      </label>
      <input id="link-item" value={item} onChange={(e) => setItem(e.target.value)} maxLength={ITEM_MAX} placeholder="T-shirt" required autoFocus />
      <label className="field-label" htmlFor="link-price">
        Price
      </label>
      <div className="money-input">
        <span aria-hidden="true">$</span>
        <input id="link-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required />
      </div>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn primary">
        Create link
      </button>
      <button type="button" className="btn" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

/** One link: name and price, Copy and Share right there; the QR only when asked for. */
function LinkRow({ link, url, onDelete }: { link: PaymentLink; url: string; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState(false);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  return (
    <div className="stack link-row">
      <span className="sale-main">
        <strong>{link.item}</strong>
        <span className="muted small">{usd(link.amount)}</span>
      </span>
      <div className="grid2">
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            void navigator.clipboard.writeText(url).then(() => setCopied(true));
          }}
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        {canShare ? (
          <button type="button" className="btn" onClick={() => void navigator.share({ title: link.item, text: `Pay for ${link.item}`, url }).catch(() => undefined)}>
            Share
          </button>
        ) : (
          <a className="btn" href={url} target="_blank" rel="noreferrer">
            Open
          </a>
        )}
      </div>
      {qr && <Qr value={url} label={`QR code for the ${link.item} payment link`} />}
      <div className="row link-actions">
        <button type="button" className="link-btn" onClick={() => setQr(!qr)} aria-expanded={qr}>
          {qr ? "Hide QR code" : "Show QR code"}
        </button>
        <button type="button" className="link-btn muted-link" onClick={onDelete}>
          Remove
        </button>
      </div>
    </div>
  );
}
