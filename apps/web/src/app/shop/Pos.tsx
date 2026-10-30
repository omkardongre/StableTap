"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { chainNow, encodeInvoice, newInvoiceId, parseAmount, watchInvoice, type Invoice, type PaidEvent } from "@stabletap/engine";
import { ErrorNote } from "@/components/ErrorNote";
import { PhraseGrid } from "@/components/PhraseGrid";
import { Qr } from "@/components/Qr";
import { getApi } from "@/lib/chain";
import { errorText, usd } from "@/lib/format";
import { createWallet, restoreFromPhrase, signIn } from "@/lib/keys";
import { network, options } from "@/lib/network";
import { SHOP_KEY, notifyShopChanged } from "@/lib/shop";
import { useSlow } from "@/lib/useSlow";
import { SignInError, loadVault, passkeyPrfSupported, unlockVault, type VaultRecord } from "@/lib/vault";

interface Shop {
  name: string;
  payout: string;
}

/** Address of the shop wallet once it is open on chain. */
const ACTIVATED_KEY = "stabletap.pos.activated.v1";
/** One gentle reminder after setup to save the recovery phrase; never forced. */
const BACKUP_TIP_KEY = "stabletap.pos.backup-tip.v1";
// The POS keypad charges in cents; the asset may have more decimals.
const KEYPAD_DECIMALS = 2;
const MAX_DIGITS = 7;
const INVOICE_TTL_SEC = 300;
// After expiry, keep watching briefly for a payment signed just before it.
const IN_FLIGHT_GRACE_SEC = 60;
const SCREEN_LOCK = "Secured with your phone's screen lock.";

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
  // "Charge" first connects to the chain (a few seconds on a slow network): show it's working.
  const [starting, setStarting] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    try {
      const s = loadShop();
      setShop(s);
      setView(s ? { name: "keypad" } : { name: "setup" });
      setTip(localStorage.getItem(BACKUP_TIP_KEY) === "show");
    } catch (e) {
      setError(errorText(e));
      setView({ name: "setup" });
    }
  }, []);

  function hideTip() {
    localStorage.removeItem(BACKUP_TIP_KEY);
    setTip(false);
  }

  async function charge() {
    if (!shop || starting) return;
    setError(null);
    setStarting(true);
    try {
      const amount = parseAmount(centsText(digits), network.decimals);
      // Expiry uses chain time so a wrong device clock can't extend or cut it.
      const expiresAt = (await chainNow(await getApi())) + INVOICE_TTL_SEC;
      const invoice: Invoice = { to: shop.payout, amount, id: newInvoiceId(), merchant: shop.name, expiresAt, ...(options.split ? { split: options.split } : {}) };
      setView({ name: "charging", invoice, link: encodeInvoice(invoice, network.ss58) });
    } catch (e) {
      setError(errorText(e));
    } finally {
      setStarting(false);
    }
  }

  const amountText = centsText(digits);
  const canCharge = /[1-9]/.test(digits);
  const save = (s: Shop) => {
    localStorage.setItem(SHOP_KEY, JSON.stringify(s));
    notifyShopChanged();
    setShop(s);
    setError(null);
    setView({ name: "keypad" });
  };

  return (
    <section className="stack" aria-live="polite">
      {shop && view?.name === "setup" && (
        <div className="stack tight">
          <button type="button" className="link-btn back-btn" onClick={() => setView({ name: "keypad" })}>
            ‹ Back
          </button>
          <h1>Settings</h1>
        </div>
      )}
      {shop && view?.name !== "setup" && (
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
      <ErrorNote text={error} onClose={() => setError(null)} />

      {view?.name === "setup" && !shop && (
        <ShopStart
          onDone={(s, created) => {
            if (created) {
              localStorage.setItem(BACKUP_TIP_KEY, "show");
              setTip(true);
            }
            save(s);
          }}
        />
      )}

      {view?.name === "setup" && shop && (
        <>
          <ShopSettings initial={shop} onSave={save} />
          <RecoveryCard payout={shop.payout} onShown={hideTip} />
          <Link className="card setting-link" href="/wallet">
            <span>
              <strong>Personal wallet</strong>
              <span className="muted small">Pay at other shops with your own money</span>
            </span>
            <span aria-hidden="true">›</span>
          </Link>
        </>
      )}

      {view?.name === "keypad" && (
        <>
          {tip && (
            <p className="notice tip" role="status">
              <span>Tip: save your recovery phrase in Settings, in case you lose this phone.</span>
              <button type="button" className="tip-close" onClick={hideTip} aria-label="Dismiss">
                ×
              </button>
            </p>
          )}
          <p className={`till-amount${canCharge ? "" : " empty"}`} aria-live="polite" aria-label={`Amount ${amountText} dollars`}>
            ${amountText}
          </p>
          <div className="keypad">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <button key={d} className="btn" onClick={() => setDigits((v) => (v.length < MAX_DIGITS ? v + d : v))} disabled={starting}>
                {d}
              </button>
            ))}
            <button className="btn" onClick={() => setDigits("")} aria-label="Clear" disabled={starting}>
              C
            </button>
            <button className="btn" onClick={() => setDigits((v) => (v && v.length < MAX_DIGITS ? v + "0" : v))} disabled={starting}>
              0
            </button>
            <button className="btn" onClick={() => setDigits((v) => v.slice(0, -1))} aria-label="Delete last digit" disabled={starting}>
              ⌫
            </button>
          </div>
          <button className="btn primary" onClick={() => void charge()} disabled={!canCharge || starting} aria-busy={starting}>
            {starting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Getting ready…
              </>
            ) : (
              `Charge $${amountText}`
            )}
          </button>
        </>
      )}

      {view?.name === "charging" && (
        <Charging
          invoice={view.invoice}
          link={view.link}
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

/** The counter screen while a customer pays: amount, QR, time left, Cancel. Nothing else, like Square. */
function Charging({
  invoice,
  link,
  onPaid,
  onExpired,
  onError,
  onCancel,
}: {
  invoice: Invoice;
  link: string;
  onPaid: (p: PaidEvent) => void;
  onExpired: () => void;
  onError: (e: string) => void;
  onCancel: () => void;
}) {
  const cbs = useRef({ onPaid, onExpired, onError });
  cbs.current = { onPaid, onExpired, onError };
  const [watching, setWatching] = useState(false);
  const [left, setLeft] = useState<number | null>(null);

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
          onError: (e) => live && cbs.current.onError(`Stopped watching for the payment: ${errorText(e)}`),
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
      <div className="amount-head">
        <span className="label">Scan to pay</span>
        <span className="big">{usd(invoice.amount)}</span>
      </div>
      {!expired && <Qr value={link} label={`Payment QR code for ${usd(invoice.amount)}`} />}
      <p className="muted center row-start center-row" aria-busy={!watching}>
        {!watching && <span className="spinner dark" aria-hidden="true" />}
        {!watching ? "Getting ready…" : expired ? "Expired. Checking for a payment already sent…" : `Waiting for payment… ${fmtLeft(left)}`}
      </p>
      <button className="btn" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

/** Line under a busy button: what is happening and how long it takes, then "Still working…" if it's slow. */
function BusyNote({ busy, slow, text }: { busy: boolean; slow: boolean; text: string }) {
  if (!busy) return null;
  return <p className="muted small center">{slow ? "Still working… please keep this page open." : text}</p>;
}

/**
 * First screen on a phone without a shop: create one (name + passkey), or sign in to an existing
 * one with its passkey, or with the recovery phrase as a last resort. Like Square or Shopify POS,
 * a returning owner just signs in.
 */
function ShopStart({ onDone }: { onDone: (s: Shop, created: boolean) => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // A wrong recovery phrase is shown under the phrase box, not under "Create my shop".
  const [phraseError, setPhraseError] = useState<string | null>(null);
  // Signed in (passkey or phrase): only the shop name is left to ask.
  const [signedIn, setSignedIn] = useState<VaultRecord | null>(null);
  const [phrase, setPhrase] = useState("");
  const [usePhrase, setUsePhrase] = useState(false);
  const slow = useSlow(busy !== null);

  const shopName = () => {
    const n = name.trim();
    if (n.length < 1 || n.length > 40) throw new Error("Enter a shop name (up to 40 characters)");
    return n;
  };

  async function run(label: string, fn: () => Promise<void>, show: (e: string | null) => void = setError) {
    setError(null);
    setPhraseError(null);
    setBusy(label);
    try {
      await fn();
    } catch (e) {
      show(e instanceof SignInError ? e.message : errorText(e));
    } finally {
      setBusy(null);
    }
  }

  const create = () =>
    run("Setting up your shop…", async () => {
      const n = shopName();
      // A retry after a failed switch-on reuses the passkey made a moment ago instead of making a second one.
      let w = loadVault("shop");
      if (!w) {
        if (!(await passkeyPrfSupported())) throw new Error("This browser can't keep a shop safe with your screen lock. Try Chrome on Android or Safari on iPhone.");
        w = await createWallet("shop", n);
      }
      // A new account must exist on chain before it can receive dollars; the test faucet opens it (no money added).
      await activate(w.address);
      onDone({ name: n, payout: w.address }, true);
    });

  const finish = () =>
    run("Opening your shop…", async () => {
      if (!signedIn) return;
      const n = shopName();
      // A returning shop is already open on chain: only a shop that never finished setup needs the faucet.
      if (localStorage.getItem(ACTIVATED_KEY) !== signedIn.address && !(await isOpenOnChain(signedIn.address))) await activate(signedIn.address);
      onDone({ name: n, payout: signedIn.address }, false);
    });

  if (signedIn) {
    return (
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          void finish();
        }}
      >
        <h2>Welcome back</h2>
        <p className="muted small">You&apos;re signed in. What&apos;s your shop called? Customers see this name when they pay.</p>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          maxLength={40}
          placeholder="Corner Coffee"
          aria-label="Shop name"
          autoComplete="organization"
          required
          autoFocus
        />
        <ErrorNote text={error} onClose={() => setError(null)} />
        <button type="submit" className="btn primary" disabled={busy !== null}>
          {busy ? <BusyLabel text={busy} /> : "Open my shop"}
        </button>
        <BusyNote busy={busy !== null} slow={slow} text="A few seconds." />
      </form>
    );
  }

  return (
    <div className="stack">
      <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          void create();
        }}
      >
        <h2>Name your shop</h2>
        <input
          id="shop-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          maxLength={40}
          placeholder="Corner Coffee"
          aria-label="Shop name"
          autoComplete="organization"
          required
          disabled={busy !== null}
        />
        <p className="muted small">Customers see this name when they pay.</p>
        <ErrorNote text={error} onClose={() => setError(null)} />
        <button type="submit" className="btn primary" disabled={busy !== null}>
          {busy ? <BusyLabel text={busy} /> : "Create my shop"}
        </button>
        {busy ? <BusyNote busy slow={slow} text="About 10 seconds." /> : <p className="muted small center">{SCREEN_LOCK}</p>}
      </form>

      {!busy && (
        <div className="signin">
          <span className="muted small">Already have a shop?</span>
          <button type="button" className="link-btn" onClick={() => void run("Signing in…", async () => setSignedIn(await signIn("shop")))}>
            Sign in
          </button>
        </div>
      )}

      {!busy && (
        <details className="more" open={usePhrase} onToggle={(e) => setUsePhrase((e.target as HTMLDetailsElement).open)}>
          <summary>Other ways to sign in</summary>
          <form
            className="card"
            onSubmit={(e) => {
              e.preventDefault();
              void run("Restoring…", async () => setSignedIn(await restoreFromPhrase("shop", phrase, name.trim() || undefined)), setPhraseError);
            }}
          >
            <label className="field-label" htmlFor="shop-phrase">
              Recovery phrase
            </label>
            <textarea
              id="shop-phrase"
              className="phrase-input"
              value={phrase}
              onChange={(e) => {
                setPhrase(e.target.value);
                setPhraseError(null);
              }}
              rows={3}
              placeholder="12 words, separated by spaces"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="none"
              required
              aria-invalid={phraseError !== null}
              aria-describedby="shop-phrase-error"
            />
            {phraseError && (
              <p id="shop-phrase-error" className="field-error" role="alert">
                {phraseError}
              </p>
            )}
            <button type="submit" className="btn">
              Restore my shop
            </button>
          </form>
        </details>
      )}
    </div>
  );
}

const BusyLabel = ({ text }: { text: string }) => (
  <>
    <span className="spinner" aria-hidden="true" />
    {text}
  </>
);

/** Rename the shop. Owners who paste a payout address from another wallet keep it here too. */
function ShopSettings({ initial, onSave }: { initial: Shop; onSave: (s: Shop) => void }) {
  const [name, setName] = useState(initial.name);
  const [wallet, setWallet] = useState<VaultRecord | null>(null);
  // A pasted payout address, for owners who already have a wallet elsewhere.
  const [custom, setCustom] = useState(false);
  const [payout, setPayout] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const w = loadVault("shop");
      setWallet(w);
      if (initial.payout !== w?.address) {
        setCustom(true);
        setPayout(initial.payout);
      }
    } catch (e) {
      setError(errorText(e));
    }
  }, [initial]);

  const changed = name.trim() !== initial.name || (custom && payout.trim() !== initial.payout);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!changed) return;
    const n = name.trim();
    if (n.length < 1 || n.length > 40) return setError("Enter a shop name (up to 40 characters)");
    if (custom) {
      try {
        return onSave({ name: n, payout: encodeAddress(decodeAddress(payout.trim()), network.ss58) });
      } catch {
        return setError("That wallet address is not valid");
      }
    }
    if (!wallet) return setError("This phone has no shop wallet. Sign in again.");
    setBusy(true);
    try {
      if (localStorage.getItem(ACTIVATED_KEY) !== wallet.address) await activate(wallet.address);
      onSave({ name: n, payout: wallet.address });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={(e) => void save(e)}>
      <label className="field-label" htmlFor="shop-name">
        Shop name
      </label>
      <input
        id="shop-name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError(null);
        }}
        maxLength={40}
        aria-label="Shop name"
        autoComplete="organization"
        required
      />
      {custom && (
        <>
          <label className="label" htmlFor="payout">
            Wallet address for your money
          </label>
          <input
            id="payout"
            className="mono"
            value={payout}
            onChange={(e) => {
              setPayout(e.target.value);
              setError(null);
            }}
            placeholder="Paste a wallet address"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </>
      )}
      <ErrorNote text={error} onClose={() => setError(null)} />
      {/* Nothing to save until something changed, like iOS Settings. */}
      <button type="submit" className="btn primary" disabled={busy || !changed}>
        {busy ? <BusyLabel text="Saving…" /> : "Save"}
      </button>
    </form>
  );
}

/** The backup if the passkey is ever lost: 12 words, shown after the phone's lock check. */
function RecoveryCard({ payout, onShown }: { payout: string; onShown: () => void }) {
  const [vault, setVault] = useState<VaultRecord | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const w = loadVault("shop");
      setVault(w && w.address === payout ? w : null);
    } catch {
      setVault(null);
    }
  }, [payout]);
  if (!vault) return null;
  return (
    <div className="card">
      <h2 className="card-title">Recovery phrase</h2>
      {phrase ? (
        <>
          <p className="muted small">Write these 12 words on paper, in order. Anyone with them controls your shop&apos;s money.</p>
          <PhraseGrid phrase={phrase} />
          <button type="button" className="btn" onClick={() => setPhrase(null)}>
            Hide
          </button>
        </>
      ) : (
        <>
          <p className="muted small">On a new phone you can sign in with your passkey. Write down these words too, in case the passkey is lost.</p>
          <ErrorNote text={error} onClose={() => setError(null)} />
          <button
            type="button"
            className="btn"
            onClick={() => {
              setError(null);
              unlockVault(vault)
                .then((p) => {
                  setPhrase(p);
                  onShown();
                })
                .catch((e: unknown) => setError(errorText(e)));
            }}
          >
            Show recovery phrase
          </button>
        </>
      )}
    </div>
  );
}

/** True when the account already exists on chain (it holds the deposit), so it needs no opening. */
async function isOpenOnChain(address: string): Promise<boolean> {
  try {
    const api = await getApi();
    const a = await api.query.system.account(address);
    const open = a.providers.toNumber() > 0 || a.data.free.toBigInt() > 0n;
    if (open) localStorage.setItem(ACTIVATED_KEY, address);
    return open;
  } catch {
    // Can't tell: opening again is safe (the faucet answers 409 for an open account).
    return false;
  }
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

function fmtLeft(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) return "…";
  const s = Math.max(0, sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
