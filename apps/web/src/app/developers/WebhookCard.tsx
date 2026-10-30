"use client";

import { useCallback, useEffect, useState } from "react";
import { u8aToHex, stringToU8a } from "@polkadot/util";
import { webhookRegistrationMessage } from "@stabletap/engine";
import { errorText } from "@/lib/format";
import { deleteWebhook, fetchWebhook, putWebhook, type WebhookStatus } from "@/lib/indexer";
import { withUnlockedPair } from "@/lib/keys";
import type { VaultRecord } from "@/lib/vault";

export function WebhookCard({ vault }: { vault: VaultRecord }) {
  const [status, setStatus] = useState<WebhookStatus | null>(null);
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    fetchWebhook(vault.address).then(setStatus, (e: unknown) => setError(errorText(e)));
  }, [vault.address]);
  useEffect(refresh, [refresh]);

  /** The merchant proves control of the payout address by signing the exact registration. */
  async function signed(target: string) {
    const signedAt = Math.floor(Date.now() / 1000);
    const signature = await withUnlockedPair(vault, async (pair) => u8aToHex(pair.sign(stringToU8a(webhookRegistrationMessage(vault.address, target, signedAt)))));
    return { signedAt, signature };
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const target = new URL(url.trim()).toString();
      const res = await putWebhook(vault.address, { url: target, ...(await signed(target)) });
      setSecret(res.secret);
      setUrl("");
      refresh();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await deleteWebhook(vault.address, await signed(""));
      setSecret(null);
      refresh();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={save}>
      <h2>Payment notifications (webhook)</h2>
      <p className="muted small">
        Get a signed message on your server for every payment and refund.
      </p>
      {status?.configured && <p className="small">Sending to {status.host}</p>}
      {secret && (
        <div className="notice" role="status">
          <p className="small">Signing secret, shown once. Store it on your server:</p>
          <p className="mono small">{secret}</p>
          <button type="button" className="btn" onClick={() => navigator.clipboard.writeText(secret)}>
            Copy secret
          </button>
        </div>
      )}
      <label className="label" htmlFor="hook-url">
        {status?.configured ? "Replace URL (issues a new secret)" : "HTTPS endpoint"}
      </label>
      <input id="hook-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://shop.example/stabletap" autoComplete="off" />
      <button type="submit" className="btn primary" disabled={busy || !url.trim()}>
        {busy ? "Confirm on your phone…" : "Save"}
      </button>
      {status?.configured && (
        <button type="button" className="btn" onClick={() => void remove()} disabled={busy}>
          Remove webhook
        </button>
      )}
      {status && status.deliveries.length > 0 && (
        <ul className="list small">
          {status.deliveries.slice(0, 5).map((d) => (
            <li key={d.id} className="row">
              <span className="mono">{d.id.slice(0, 14)}…</span>
              <span>
                {d.status}
                {d.status !== "delivered" && d.lastError ? ` (${d.lastError}, ${d.attempts} tries)` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
