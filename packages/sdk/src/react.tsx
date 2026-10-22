import { useEffect, useRef, useState } from "react";
import type { ApiPromise } from "@polkadot/api";
import {
  assertNetwork, chainNow, connect, encodeInvoice, formatAmount, newInvoiceId, parseAmount, watchInvoice,
  type Invoice, type NetworkConfig, type PaidEvent, type Split,
} from "@stabletap/engine";
import { walletPayUrl } from "./links.ts";

export interface PayButtonProps {
  network: NetworkConfig;
  /** Merchant payout address. */
  to: string;
  /** Amount in dollars, e.g. "4.50". */
  amount: string;
  /** Shop name shown in the wallet. */
  merchant?: string;
  /** Optional platform share taken out of the amount. */
  split?: Split;
  /** Base URL of the StableTap wallet that holds the customer's key. */
  walletUrl: string;
  /** Invoice lifetime in seconds of chain time (default 300). */
  ttlSec?: number;
  label?: string;
  className?: string;
  onPaid?: (paid: PaidEvent & { invoice: Invoice }) => void;
  onError?: (error: Error) => void;
}

type State =
  | { name: "idle" }
  | { name: "starting" }
  | { name: "waiting"; invoice: Invoice; url: string; link: string }
  | { name: "paid"; invoice: Invoice; paid: PaidEvent }
  | { name: "expired" }
  | { name: "error"; message: string };

// After expiry, keep watching briefly for a payment signed just before it.
const GRACE_SEC = 60;
const apis = new Map<string, Promise<ApiPromise>>();

/** One validated connection per node URL, shared by every button on the page. */
function getApi(net: NetworkConfig): Promise<ApiPromise> {
  let p = apis.get(net.ws);
  if (!p) {
    p = connect(net).then(async (api) => {
      await assertNetwork(api, net);
      return api;
    });
    p.catch(() => apis.delete(net.ws));
    apis.set(net.ws, p);
  }
  return p;
}

/**
 * Pay with StableTap. Creates an invoice, opens the customer's StableTap
 * wallet on it, and watches finalized blocks until the exact payment lands.
 * Nothing is trusted from the wallet window: "paid" comes from the chain.
 */
export function PayButton(props: PayButtonProps) {
  const { network: net, to, amount, merchant, split, walletUrl, ttlSec = 300, label, className } = props;
  const [state, setState] = useState<State>({ name: "idle" });
  const cbs = useRef({ onPaid: props.onPaid, onError: props.onError });
  cbs.current = { onPaid: props.onPaid, onError: props.onError };
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  const fail = (e: unknown) => {
    const err = e instanceof Error ? e : new Error(String(e));
    setState({ name: "error", message: err.message });
    cbs.current.onError?.(err);
  };

  async function start() {
    // Open the window inside the click so popup blockers allow it; it gets its URL once the invoice exists.
    const win = typeof window !== "undefined" ? window.open("", "_blank") : null;
    if (win) win.opener = null;
    setState({ name: "starting" });
    try {
      const api = await getApi(net);
      const now = await chainNow(api);
      const invoice: Invoice = {
        to,
        amount: parseAmount(amount, net.decimals),
        id: newInvoiceId(),
        ...(merchant ? { merchant } : {}),
        ...(split ? { split } : {}),
        expiresAt: now + ttlSec,
      };
      const link = encodeInvoice(invoice, net.ss58);
      const url = walletPayUrl(walletUrl, link);
      const skew = now - Date.now() / 1000;
      let timer: ReturnType<typeof setInterval> | undefined;
      const stopWatch = await watchInvoice(api, net, invoice, {
        onPaid: (paid) => {
          clearInterval(timer);
          setState({ name: "paid", invoice, paid });
          cbs.current.onPaid?.({ ...paid, invoice });
        },
        onError: (e) => {
          clearInterval(timer);
          fail(e);
        },
      });
      timer = setInterval(() => {
        if (Date.now() / 1000 + skew > invoice.expiresAt! + GRACE_SEC) {
          clearInterval(timer);
          stopWatch();
          setState({ name: "expired" });
        }
      }, 1000);
      stopRef.current = () => {
        clearInterval(timer);
        stopWatch();
      };
      setState({ name: "waiting", invoice, url, link });
      if (win) win.location.href = url;
    } catch (e) {
      win?.close();
      fail(e);
    }
  }

  const display = `$${amount}`;
  return (
    <div className={className} aria-live="polite">
      {(state.name === "idle" || state.name === "error" || state.name === "expired") && (
        <button type="button" onClick={() => void start()}>
          {label ?? `Pay ${display} with StableTap`}
        </button>
      )}
      {state.name === "starting" && (
        <button type="button" disabled aria-busy="true">
          Preparing…
        </button>
      )}
      {state.name === "waiting" && (
        <p>
          Waiting for your payment of {display}…{" "}
          <a href={state.url} target="_blank" rel="noopener noreferrer">
            Open StableTap wallet
          </a>
        </p>
      )}
      {state.name === "paid" && (
        <p role="status">
          Paid {`$${formatAmount(state.invoice.amount, net.decimals)}`} · block #{state.paid.blockNumber}
        </p>
      )}
      {state.name === "expired" && <p role="status">The payment request expired. Try again.</p>}
      {state.name === "error" && <p role="alert">{state.message}</p>}
    </div>
  );
}
