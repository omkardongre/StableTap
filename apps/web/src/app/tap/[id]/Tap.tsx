"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { errorText } from "@/lib/format";
import { fetchCharge } from "@/lib/terminal";

/** Landing page of a counter NFC tag: opens the shop's current charge in the wallet. */
export function Tap({ id }: { id: string }) {
  const [state, setState] = useState<{ name: "loading" } | { name: "none" } | { name: "error"; message: string }>({ name: "loading" });

  const open = useCallback(async () => {
    setState({ name: "loading" });
    try {
      const charge = await fetchCharge(id);
      if (!charge) return setState({ name: "none" });
      // Full navigation; the wallet validates the link, expiry and replay itself.
      window.location.replace(`/wallet?pay=${encodeURIComponent(charge.link)}`);
    } catch (e) {
      setState({ name: "error", message: errorText(e) });
    }
  }, [id]);

  useEffect(() => void open(), [open]);

  return (
    <section className="stack" aria-live="polite">
      <h1>Tap to pay</h1>
      {state.name === "loading" && <p className="muted">Opening the shop&apos;s charge…</p>}
      {state.name === "none" && (
        <div className="card">
          <p>The shop isn&apos;t charging right now. Ask them to start the sale, then tap again.</p>
          <button className="btn primary" onClick={() => void open()}>
            Try again
          </button>
        </div>
      )}
      {state.name === "error" && (
        <p className="alert" role="alert">
          {state.message}
        </p>
      )}
      <Link href="/wallet" className="small">
        Open wallet
      </Link>
    </section>
  );
}
