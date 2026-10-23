"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { decodeAddress, encodeAddress, mnemonicGenerate } from "@polkadot/util-crypto";
import { chainNow, encodeInvoice, newInvoiceId, parseAmount, watchInvoice, type Invoice, type PaidEvent } from "@stabletap/engine";
import { Qr } from "@/components/Qr";
import { getApi } from "@/lib/chain";
import { errorText, usd } from "@/lib/format";
import { network, options } from "@/lib/network";
import {
  clearCharge, createTerminal, forgetTerminal, loadTerminal, nfcWriteSupported, publishCharge, tapUrl, terminalEnabled, writeTag, type TerminalCreds,
} from "@/lib/terminal";
import { pairFrom } from "@/lib/keys";
import { createVault, loadVault, passkeyPrfSupported, type VaultRecord } from "@/lib/vault";
import { TeamWallet } from "../dashboard/TeamWallet";

interface Shop {
  name: string;
  payout: string;
}

const SHOP_KEY = "stabletap.pos.shop.v1";
/** Address of the shop wallet once it is open on chain. */
const ACTIVATED_KEY = "stabletap.pos.activated.v1";
// The POS keypad charges in cents; the asset may have more decimals.
const KEYPAD_DECIMALS = 2;
const MAX_DIGITS = 7;
const INVOICE_TTL_SEC = 300;
// After expiry, keep watching briefly for a payment signed just before it.
const IN_FLIGHT_GRACE_SEC = 60;

type View =
  | { name: "setup" }
  | { name: "keypad" }
  | { name: "charging"; invoice: Invoice; link: string }
  | { name: "paid"; invoice: Invoice; paid: PaidEvent }
  | { name: "expired"; invoice: Invoice };

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
  const [terminal, setTerminal] = useState<TerminalCreds | null>(null);

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

  useEffect(() => {
    if (!shop || !terminalEnabled()) return setTerminal(null);
    try {
      setTerminal(loadTerminal(shop.payout));
    } catch (e) {
      setError(errorText(e));
    }
  }, [shop]);

  async function charge() {
    if (!shop) return;
    setError(null);
    try {
      const amount = parseAmount(centsText(digits), network.decimals);
      // Expiry uses chain time so a wrong device clock can't extend or cut it.
      const expiresAt = (await chainNow(await getApi())) + INVOICE_TTL_SEC;
      const invoice: Invoice = { to: shop.payout, amount, id: newInvoiceId(), merchant: shop.name, expiresAt, ...(options.split ? { split: options.split } : {}) };
      setView({ name: "charging", invoice, link: encodeInvoice(invoice, network.ss58) });
    } catch (e) {
      setError(errorText(e));
    }
  }

  const amountText = centsText(digits);
  const canCharge = /[1-9]/.test(digits);

  return (
    <section className="stack" aria-live="polite">
      {shop && (
        <div className="row">
          <h1>{shop.name}</h1>
          {view?.name === "keypad" && (
            <button className="icon-btn" onClick={() => setView({ name: "setup" })} aria-label="Settings" title="Settings">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          )}
        </div>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {view?.name === "setup" && (
        <>
          <ShopSettings
            initial={shop}
            onSave={(s) => {
              localStorage.setItem(SHOP_KEY, JSON.stringify(s));
              setShop(s);
              setError(null);
              setView({ name: "keypad" });
            }}
          />
          {shop && terminalEnabled() && <TapSetup merchant={shop.payout} terminal={terminal} onChange={setTerminal} />}
          {shop && <MoreSettings payout={shop.payout} />}
          {shop && (
            <button className="btn" onClick={() => setView({ name: "keypad" })}>
              Back to the till
            </button>
          )}
        </>
      )}

      {view?.name === "keypad" && (
        <>
          <p className={`till-amount${canCharge ? "" : " empty"}`} aria-live="polite" aria-label={`Amount ${amountText} dollars`}>
            ${amountText}
          </p>
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
          <button className="btn primary" onClick={() => void charge()} disabled={!canCharge}>
            Charge ${amountText}
          </button>
        </>
      )}

      {view?.name === "charging" && (
        <Charging
          invoice={view.invoice}
          link={view.link}
          terminal={terminal}
          onPaid={(paid) => setView({ name: "paid", invoice: view.invoice, paid })}
          onExpired={() => setView({ name: "expired", invoice: view.invoice })}
          onError={(e) => setError(e)}
          onCancel={() => setView({ name: "keypad" })}
        />
      )}

      {view?.name === "expired" && (
        <>
          <div className="card" role="status">
            <span className="label">Expired, not paid</span>
            <span className="big">{usd(view.invoice.amount)}</span>
          </div>
          <button className="btn primary" onClick={() => setView({ name: "keypad" })}>
            Back to keypad
          </button>
        </>
      )}

      {view?.name === "paid" && (
        <>
          <div className="paid" role="status">
            <span className="label">Paid</span>
            <div className="big">{usd(view.invoice.amount)}</div>
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
  terminal,
  onPaid,
  onExpired,
  onError,
  onCancel,
}: {
  invoice: Invoice;
  link: string;
  terminal: TerminalCreds | null;
  onPaid: (p: PaidEvent) => void;
  onExpired: () => void;
  onError: (e: string) => void;
  onCancel: () => void;
}) {
  const cbs = useRef({ onPaid, onExpired, onError });
  cbs.current = { onPaid, onExpired, onError };
  const [watching, setWatching] = useState(false);
  const [left, setLeft] = useState<number | null>(null);

  // Publish this charge to the counter tag; withdraw it when the sale ends (paid, expired or cancelled).
  const [tap, setTap] = useState<"off" | "publishing" | "on" | "failed">(terminal ? "publishing" : "off");
  useEffect(() => {
    if (!terminal) return;
    let live = true;
    publishCharge(terminal, link)
      .then(() => live && setTap("on"))
      .catch((e: unknown) => {
        if (!live) return;
        setTap("failed");
        cbs.current.onError(`Tap to pay is off for this sale: ${errorText(e)}. The QR still works.`);
      });
    return () => {
      live = false;
      clearCharge(terminal).catch(() => {
        // The indexer also drops a charge once it is paid or expired.
      });
    };
  }, [terminal, link]);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let live = true;
    getApi()
      .then(async (api) => {
        // Count down on the device clock, anchored to chain time once.
        const skew = (await chainNow(api)) - Date.now() / 1000;
        const s = await watchInvoice(api, network, invoice, {
          onPaid: (p) => live && cbs.current.onPaid(p),
          onError: (e) => live && cbs.current.onError(`Stopped watching for the payment: ${e.message}`),
        });
        if (!live) return s();
        stop = s;
        setWatching(true);
        const tick = () => {
          const remaining = Math.ceil((invoice.expiresAt ?? Infinity) - (Date.now() / 1000 + skew));
          setLeft(remaining);
          if (remaining <= -IN_FLIGHT_GRACE_SEC) {
            clearInterval(timer);
            stop?.();
            if (live) cbs.current.onExpired();
          }
        };
        tick();
        timer = setInterval(tick, 1000);
      })
      .catch((e: unknown) => live && cbs.current.onError(errorText(e)));
    return () => {
      live = false;
      clearInterval(timer);
      stop?.();
    };
  }, [invoice]);

  const expired = left !== null && left <= 0;
  return (
    <div className="card">
      <span className="label">{tap === "on" ? "Tap or scan to pay" : "Scan to pay"}</span>
      <span className="big">{usd(invoice.amount)}</span>
      {tap === "on" && !expired && <span className="small">Or tap the sticker at the counter</span>}
      {!expired && <Qr value={link} label={`Payment QR code for ${usd(invoice.amount)}`} />}
      <p className="muted" aria-busy={!watching}>
        {!watching ? "Connecting…" : expired ? "Expired. Checking for a payment already sent…" : `Waiting for payment… expires in ${fmtLeft(left)}`}
      </p>
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
  const [wallet, setWallet] = useState<VaultRecord | null>(null);
  // A pasted payout address, for owners who already have a wallet elsewhere.
  const [custom, setCustom] = useState(false);
  const [payout, setPayout] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const w = loadVault("shop");
      setWallet(w);
      if (initial && initial.payout !== w?.address) {
        setCustom(true);
        setPayout(initial.payout);
      }
    } catch (e) {
      setError(errorText(e));
    }
  }, [initial]);
  function shopName(): string | null {
    const n = name.trim();
    if (n.length < 1 || n.length > 40) {
      setError("Enter a shop name (up to 40 characters)");
      return null;
    }
    return n;
  }
  /** Creates the shop's own passkey wallet on this device, then activates it with the faucet. */
  async function createWallet(n: string) {
    setBusy("Creating your shop…");
    if (!(await passkeyPrfSupported())) throw new Error("This browser can't use fingerprint sign-in. Try Chrome on Android or Safari on iPhone.");
    const phrase = mnemonicGenerate(12);
    const pair = await pairFrom(phrase);
    const w = await createVault(phrase, pair.address, "shop", n);
    pair.lock();
    setWallet(w);
    // A new account must exist on chain before it can receive dollars; the test faucet opens it (no money added).
    setBusy("Almost done…");
    await activate(w.address);
    onSave({ name: n, payout: w.address });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = shopName();
    if (!n) return;
    try {
      if (custom) return onSave({ name: n, payout: encodeAddress(decodeAddress(payout.trim()), network.ss58) });
      if (wallet) {
        if (localStorage.getItem(ACTIVATED_KEY) !== wallet.address) {
          setBusy("Almost done…");
          await activate(wallet.address);
        }
        return onSave({ name: n, payout: wallet.address });
      }
      await createWallet(n);
    } catch (err) {
      setError(custom && !busy ? "That wallet address is not valid" : errorText(err));
    } finally {
      setBusy(null);
    }
  }
  const first = !initial;
  return (
    <form className="card" onSubmit={(e) => void save(e)}>
      <h2>{first ? "Name your shop" : "Shop settings"}</h2>
      {!first && (
        <label className="field-label" htmlFor="shop-name">
          Shop name
        </label>
      )}
      <input
        id="shop-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={40}
        placeholder="Corner Coffee"
        aria-label="Shop name"
        autoComplete="organization"
        required
      />
      {first && <p className="muted small">Customers see this name when they pay.</p>}
      {custom && (
        <>
          <label className="label" htmlFor="payout">
            Wallet address for your money
          </label>
          <input id="payout" className="mono" value={payout} onChange={(e) => setPayout(e.target.value)} placeholder="Paste a wallet address" autoComplete="off" spellCheck={false} required />
        </>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn primary" disabled={busy !== null}>
        {busy ?? (custom || wallet ? "Save" : "Create my shop")}
      </button>
      {first && !busy && <p className="muted small center">Secured with your fingerprint.</p>}
      {/* Sending sales to an existing wallet is an advanced option, offered only after setup. */}
      {!first && (
        <button type="button" className="link-btn" onClick={() => setCustom((c) => !c)} disabled={busy !== null}>
          {custom ? (wallet ? "Use my shop wallet instead" : "Create a shop wallet instead") : "Send sales to another wallet"}
        </button>
      )}
    </form>
  );
}
/** Opens the brand-new shop account on the test network (existential deposit only, so it starts at $0). */
async function activate(address: string) {
  let res: Response;
  try {
    res = await fetch("/api/faucet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, open: true }),
      // Never leave the owner on a spinner if the test network hangs.
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    throw new Error("Your shop was created but the test network didn't answer in time. Tap the button again.");
  }
  if (res.ok || res.status === 409) return localStorage.setItem(ACTIVATED_KEY, address);
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  throw new Error(`Your shop was created but couldn't be switched on yet (${body.error ?? res.status}). Tap the button again in a minute.`);
}
/** One-time setup of the counter tag: register this POS as a terminal, then write its URL to an NFC sticker. */
function TapSetup({ merchant, terminal, onChange }: { merchant: string; terminal: TerminalCreds | null; onChange: (t: TerminalCreds | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const writing = useRef<AbortController | null>(null);
  useEffect(() => () => writing.current?.abort(), []);

  async function setup() {
    setBusy(true);
    setError(null);
    try {
      onChange(await createTerminal(merchant));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function write(url: string) {
    writing.current?.abort();
    const ctl = new AbortController();
    writing.current = ctl;
    setError(null);
    setStatus("Hold an NFC sticker to the back of this phone…");
    try {
      await writeTag(url, ctl.signal);
      setStatus("Tag written. Stick it on the counter.");
    } catch (e) {
      setStatus(null);
      if (!ctl.signal.aborted) setError(errorText(e));
    }
  }

  const url = terminal ? tapUrl(terminal.id) : null;
  return (
    <div className="card">
      <h2>Tap to pay</h2>
      <p className="muted small">Customers tap a sticker at your counter to pay. A printed QR code works too.</p>
      {!url ? (
        <button className="btn" onClick={() => void setup()} disabled={busy}>
          {busy ? "Setting up…" : "Set up tap to pay"}
        </button>
      ) : (
        <>
          {nfcWriteSupported() ? (
            <button className="btn" onClick={() => void write(url)}>
              Write the sticker
            </button>
          ) : (
            <p className="muted small">To write the sticker, open this page in Chrome on Android, or use any NFC app.</p>
          )}
          <Qr value={url} label="Counter QR code for tap to pay" />
          <button className="btn" onClick={() => navigator.clipboard.writeText(url)}>
            Copy sticker link
          </button>
          <button
            className="btn"
            onClick={() => {
              forgetTerminal();
              onChange(null);
            }}
          >
            Remove tap to pay
          </button>
        </>
      )}
      {status && <p role="status">{status}</p>}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function fmtLeft(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) return "…";
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

/** Less common shop tools, kept off the till: the team payout wallet and developer tools. */
function MoreSettings({ payout }: { payout: string }) {
  const [vault, setVault] = useState<VaultRecord | null>(null);
  useEffect(() => {
    try {
      const v = loadVault("shop");
      // Team payouts sign with the shop wallet, so they only apply when sales go to it.
      setVault(v && v.address === payout ? v : null);
    } catch {
      setVault(null);
    }
  }, [payout]);
  return (
    <>
      {vault && (
        <details className="card">
          <summary>Team wallet</summary>
          <TeamWallet vault={vault} suggested={0n} />
        </details>
      )}
      <Link className="card setting-link" href="/wallet">
        <span>
          <strong>Personal wallet</strong>
          <span className="muted small">Pay at other shops with your own money</span>
        </span>
        <span aria-hidden="true">›</span>
      </Link>
      <Link className="card setting-link" href="/developers">
        <span>
          <strong>For developers</strong>
          <span className="muted small">Pay button for your website, payment notifications</span>
        </span>
        <span aria-hidden="true">›</span>
      </Link>
    </>
  );
}
