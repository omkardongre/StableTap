"use client";

import { useCallback, useEffect, useState } from "react";
import { formatUnits, getAddress, isAddress, parseUnits, type Address, type Hex, type WalletClient } from "viem";
import { newInvoiceId } from "@stabletap/engine/invoice";
import {
  CHECKOUT_ABI, TOKEN_ABI, checkoutAddress, connectWallet, discoverWallets, evmEnabled, evmErrorText, evmPublic, invoiceKey, merchantPayments, send, signPermit,
  type DiscoveredWallet,
} from "@/lib/evm";
import { ErrorNote } from "@/components/ErrorNote";
import { options } from "@/lib/network";

interface Token {
  address: Address;
  symbol: string;
  decimals: number;
}

/** Measured on Portaldot V3 testnet: permitAndPay / permitAndHold use ≈3.9 tPOT of gas and storage deposit. */
const LOW_GAS = 4n * 10n ** 18n;
type Row = Awaited<ReturnType<typeof merchantPayments>>[number];

const SHOP_KEY = "stabletap.checkout.shop.v1";
const HOLD_TTL_SEC = 24 * 3600;
const PAY_TTL_SEC = 300;

export function Checkout() {
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const [conn, setConn] = useState<{ wallet: WalletClient; account: Address; name: string } | null>(null);
  const [token, setToken] = useState<Token | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [gas, setGas] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => (evmEnabled() ? discoverWallets(setWallets) : undefined), []);

  useEffect(() => {
    if (!evmEnabled()) return;
    const pub = evmPublic();
    (async () => {
      const address = await pub.readContract({ address: checkoutAddress(), abi: CHECKOUT_ABI, functionName: "token" });
      const [symbol, decimals] = await Promise.all([
        pub.readContract({ address, abi: TOKEN_ABI, functionName: "symbol" }),
        pub.readContract({ address, abi: TOKEN_ABI, functionName: "decimals" }),
      ]);
      setToken({ address, symbol, decimals });
    })().catch((e: unknown) => setError(`Can't read the checkout contract: ${evmErrorText(e)}`));
  }, []);

  // After a write, read at the receipt's block: Portaldot's eth-rpc can still answer "latest" from the block before.
  const refreshBalance = useCallback(
    async (blockNumber?: bigint) => {
      if (!conn || !token) return;
      const pub = evmPublic();
      const [stable, native] = await Promise.all([
        pub.readContract({ address: token.address, abi: TOKEN_ABI, functionName: "balanceOf", args: [conn.account], blockNumber }),
        pub.getBalance({ address: conn.account, blockNumber }),
      ]);
      setBalance(stable);
      setGas(native);
    },
    [conn, token],
  );
  useEffect(() => void refreshBalance().catch((e: unknown) => setError(evmErrorText(e))), [refreshBalance]);

  async function connect(w: DiscoveredWallet) {
    setError(null);
    try {
      const c = await connectWallet(w.provider);
      setConn({ ...c, name: w.info.name });
    } catch (e) {
      setError(evmErrorText(e));
    }
  }

  /** Run one wallet action with a busy label; reports the tx and refreshes balances. */
  async function act(label: string, fn: () => Promise<{ hash: Hex; blockNumber: bigint } | void>) {
    setBusy(label);
    setError(null);
    setNote(null);
    try {
      const r = await fn();
      await refreshBalance(r?.blockNumber);
      if (r) setNote(`${label}: done in block #${r.blockNumber}, tx ${r.hash.slice(0, 10)}…${r.hash.slice(-8)}`);
    } catch (e) {
      setError(evmErrorText(e));
    } finally {
      setBusy(null);
    }
  }

  if (!evmEnabled()) {
    return (
      <section className="stack">
        <h1>MetaMask checkout</h1>
        <p className="alert">The MetaMask checkout isn&apos;t configured for this deployment (NEXT_PUBLIC_STABLETAP_EVM_* and the contract address).</p>
      </section>
    );
  }

  const fmt = (v: bigint) => (token ? `$${formatUnits(v, token.decimals)}` : "…");

  return (
    <section className="stack wide" aria-live="polite">
      <div className="row">
        <h1>MetaMask checkout</h1>
      </div>
      <p className="muted small">
        The same {token?.symbol ?? "pUSD"} through Portaldot&apos;s ERC-20 precompile, held and settled by the PotCheckout contract. Gas is paid in tPOT on this path.
      </p>
      <ErrorNote text={error} onClose={() => setError(null)} />
      {note && <p className="notice" role="status">{note}</p>}

      {!conn ? (
        <div className="card">
          <span className="label">Connect a wallet</span>
          {wallets.length === 0 && <p className="muted">No browser wallet found. Install MetaMask, then reload.</p>}
          {wallets.map((w) => (
            <button key={w.info.uuid} className="btn primary" onClick={() => void connect(w)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- wallet icons are data URIs */}
              <img src={w.info.icon} alt="" width={20} height={20} style={{ marginRight: 8 }} />
              {w.info.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="card">
          <span className="label">Connected ({conn.name})</span>
          <span className="mono small">{conn.account}</span>
          <span className="big">{balance === null ? "…" : fmt(balance)}</span>
          <span className="muted small">Gas: {gas === null ? "…" : `${Number(formatUnits(gas, 18)).toFixed(2)} tPOT`}</span>
          {gas !== null && gas < LOW_GAS && (
            <p className="alert small">Low on tPOT. On this testnet a pay or hold costs about 3.9 tPOT in gas and storage; capture and refund cost about 0.02.</p>
          )}
          <span className="muted small">
            Contract <span className="mono">{checkoutAddress()}</span>
          </span>
        </div>
      )}

      {conn && token && <PayCard conn={conn} token={token} busy={busy} act={act} />}
      {conn && token && <ShopCard conn={conn} token={token} busy={busy} act={act} fmt={fmt} />}
    </section>
  );
}

type Act = (label: string, fn: () => Promise<{ hash: Hex; blockNumber: bigint } | void>) => Promise<void>;
interface CardProps {
  conn: { wallet: WalletClient; account: Address };
  token: Token;
  busy: string | null;
  act: Act;
}

/** Customer: pay an invoice or place a hold (e.g. a bike rental deposit) with one permit signature. */
function PayCard({ conn, token, busy, act }: CardProps) {
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState("50.00");
  const [lastInvoice, setLastInvoice] = useState<{ id: string; mode: "pay" | "hold"; value: bigint } | null>(null);
  useEffect(() => setShop(localStorage.getItem(SHOP_KEY) ?? ""), []);

  function parse(): { merchant: Address; value: bigint } {
    if (!isAddress(shop.trim())) throw new Error("Shop address must be a 0x address");
    const merchant = getAddress(shop.trim());
    if (merchant === conn.account) throw new Error("Use a different account for the shop");
    if (!/^\d{1,7}(\.\d{1,6})?$/.test(amount.trim())) throw new Error("Amount must be like 50.00");
    const value = parseUnits(amount.trim(), token.decimals);
    if (value <= 0n) throw new Error("Amount must be positive");
    localStorage.setItem(SHOP_KEY, merchant);
    return { merchant, value };
  }

  const submit = (mode: "pay" | "hold", id = newInvoiceId()) =>
    act(mode === "hold" ? `Hold ${amount}` : `Pay ${amount}`, async () => {
      const { merchant, value } = parse();
      const key = invoiceKey(id);
      const { deadline, v, r, s } = await signPermit(conn.wallet, conn.account, token.address, checkoutAddress(), value);
      const now = BigInt(Math.floor(Date.now() / 1000));
      setLastInvoice({ id, mode, value });
      return send(conn.wallet, conn.account, {
        address: checkoutAddress(),
        abi: CHECKOUT_ABI,
        ...(mode === "hold"
          ? { functionName: "permitAndHold", args: [merchant, key, value, Number(now) + HOLD_TTL_SEC, deadline, v, r, s] }
          : { functionName: "permitAndPay", args: [merchant, key, value, now + BigInt(PAY_TTL_SEC), deadline, v, r, s] }),
      });
    });

  return (
    <div className="card">
      <h2>Pay a shop</h2>
      <label className="label" htmlFor="shop">
        Shop address (0x)
      </label>
      <input id="shop" className="mono" value={shop} onChange={(e) => setShop(e.target.value)} autoComplete="off" spellCheck={false} />
      <label className="label" htmlFor="amount">
        Amount ({token.symbol})
      </label>
      <input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button className="btn primary" disabled={!!busy} onClick={() => void submit("hold")}>
        {busy?.startsWith("Hold") ? "Holding…" : `Hold $${amount} (deposit)`}
      </button>
      <button className="btn" disabled={!!busy} onClick={() => void submit("pay")}>
        {busy?.startsWith("Pay") ? "Paying…" : `Pay $${amount} now`}
      </button>
      <p className="muted small">One signature approves exactly this amount (EIP-2612 permit), then one transaction.</p>
      {lastInvoice && (
        <>
          <span className="small">
            Last invoice <span className="mono">{lastInvoice.id}</span>
          </span>
          <button className="btn" disabled={!!busy} onClick={() => void submit(lastInvoice.mode, lastInvoice.id)}>
            Pay the same invoice again
          </button>
        </>
      )}
    </div>
  );
}

/** Shop: holds and payments received by the connected account; capture, release, refund. */
function ShopCard({ conn, token, busy, act, fmt }: CardProps & { fmt: (v: bigint) => string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setRows(await merchantPayments(conn.account, options.evm!.fromBlock));
      setError(null);
    } catch (e) {
      setError(evmErrorText(e));
    }
  }, [conn.account]);
  useEffect(() => {
    void load();
  }, [load, busy]);

  const capture = (r: Row) =>
    act("Capture", () => send(conn.wallet, conn.account, { address: checkoutAddress(), abi: CHECKOUT_ABI, functionName: "capture", args: [r.invoiceId, value(r)] }));
  const release = (r: Row) =>
    act("Release hold", () => send(conn.wallet, conn.account, { address: checkoutAddress(), abi: CHECKOUT_ABI, functionName: "voidHold", args: [conn.account, r.invoiceId] }));

  const value = (r: Row) => {
    const text = (amounts[r.invoiceId] ?? "").trim();
    if (!/^\d{1,7}(\.\d{1,6})?$/.test(text)) throw new Error("Amount must be like 42.00");
    return parseUnits(text, token.decimals);
  };

  async function refund(r: Row) {
    await act("Refund", async () => {
      const v = value(r);
      // The refund is paid from the shop's own balance, so the contract needs an allowance for it.
      await send(conn.wallet, conn.account, { address: token.address, abi: TOKEN_ABI, functionName: "approve", args: [checkoutAddress(), v] });
      return send(conn.wallet, conn.account, { address: checkoutAddress(), abi: CHECKOUT_ABI, functionName: "refund", args: [r.invoiceId, v] });
    });
  }

  return (
    <div className="card">
      <h2>Shop: received</h2>
      {error && <p className="alert small">{error}</p>}
      {rows === null ? (
        <p className="muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="muted">Nothing received by this account yet.</p>
      ) : (
        <ul className="list">
          {rows.map((r) => (
            <li key={r.invoiceId} className="list-item">
              <div className="row">
                <strong>
                  {r.kind === "Held" ? "Hold" : "Payment"} {fmt(r.original)}
                </strong>
                <span className="small">{r.status === "Held" ? `held ${fmt(r.amount)}` : r.status === "Voided" ? "released" : `${r.status.toLowerCase()}, refundable ${fmt(r.amount)}`}</span>
              </div>
              <span className="mono small">from {r.payer}</span>
              {(r.status === "Held" || ((r.status === "Paid" || r.status === "Captured") && r.amount > 0n)) && (
                <>
                  <input
                    aria-label={r.status === "Held" ? "Capture amount" : "Refund amount"}
                    inputMode="decimal"
                    placeholder={r.status === "Held" ? "Capture amount, e.g. 42.00" : "Refund amount"}
                    value={amounts[r.invoiceId] ?? ""}
                    onChange={(e) => setAmounts({ ...amounts, [r.invoiceId]: e.target.value })}
                  />
                  {r.status === "Held" ? (
                    <div className="grid2">
                      <button className="btn primary" disabled={!!busy} onClick={() => void capture(r)}>
                        Capture
                      </button>
                      <button className="btn" disabled={!!busy} onClick={() => void release(r)}>
                        Release all
                      </button>
                    </div>
                  ) : (
                    <button className="btn" disabled={!!busy} onClick={() => void refund(r)}>
                      Refund
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
