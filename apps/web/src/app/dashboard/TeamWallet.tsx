"use client";

import { useEffect, useState } from "react";
import { buildTransferCall, multisigAddress, quoteCallFee, transferStable, type MultisigSpec } from "@stabletap/engine";
import { parseAmount } from "@stabletap/engine/config";
import { getApi } from "@/lib/chain";
import { errorText, shortHash, usd, usdFee } from "@/lib/format";
import { withUnlockedPair } from "@/lib/keys";
import { network } from "@/lib/network";
import { useBalances } from "@/lib/useBalances";
import type { VaultRecord } from "@/lib/vault";

const KEY = "stabletap.team.v1";

interface Team extends MultisigSpec {
  address: string;
}

function loadTeam(): Team | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const t = JSON.parse(raw) as Partial<Team>;
  if (!Array.isArray(t.signatories) || typeof t.threshold !== "number") throw new Error("Stored team wallet is corrupted");
  // Re-derive instead of trusting the stored address.
  return { signatories: t.signatories, threshold: t.threshold, address: multisigAddress({ signatories: t.signatories, threshold: t.threshold }, network.ss58) };
}

/** Payout of the day's takings to a pallet-multisig team wallet (e.g. 2 of 3). */
export function TeamWallet({ vault, suggested }: { vault: VaultRecord; suggested: bigint }) {
  const [team, setTeam] = useState<Team | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState<bigint | null>(null);
  const { balances: own } = useBalances(vault.address);
  const { balances: teamBal } = useBalances(team?.address ?? null);

  useEffect(() => {
    try {
      const t = loadTeam();
      setTeam(t);
      setEditing(!t);
    } catch (e) {
      setError(errorText(e));
      setTeam(null);
      setEditing(true);
    }
  }, []);

  useEffect(() => {
    if (suggested > 0n && amount === "") setAmount(usd(suggested).slice(1).replace(/,/g, ""));
  }, [suggested, amount]);

  useEffect(() => {
    if (!team) return;
    let live = true;
    getApi()
      .then((api) => quoteCallFee(api, network, buildTransferCall(api, network, team.address, 1n), vault.address))
      .then((f) => live && setFee(f), (e: unknown) => live && setError(`Could not estimate the fee: ${errorText(e)}`));
    return () => {
      live = false;
    };
  }, [team, vault.address]);

  async function activate() {
    if (!team) return;
    setBusy("Activating…");
    setError(null);
    try {
      const res = await fetch("/api/faucet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: team.address }) });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `Faucet error ${res.status}`);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(null);
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!team) return;
    setError(null);
    setNotice(null);
    try {
      const value = parseAmount(amount, network.decimals);
      if (value <= 0n) throw new Error("Amount must be positive");
      if (own && fee !== null && value + fee > own.stable) throw new Error(`Not enough dollars: balance ${usd(own.stable)}, fee ≈ ${usdFee(fee)}`);
      setBusy("Confirm with your fingerprint…");
      const api = await getApi();
      const r = await withUnlockedPair(vault, (pair) => transferStable(api, network, team.address, value, pair));
      setNotice(`Sent ${usd(value)} to the team wallet (tx ${shortHash(r.txHash)}, fee ${usdFee(r.feePaid)} in dollars)`);
      setAmount("");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(null);
    }
  }

  if (team === undefined) return null;

  return (
    <div className="stack">
      <p className="muted small">Move takings to a shared wallet that needs 2 of 3 people to spend.</p>
      {editing ? (
        <TeamForm
          initial={team ?? { signatories: [vault.address, "", ""], threshold: 2 }}
          onSave={(t) => {
            localStorage.setItem(KEY, JSON.stringify({ signatories: t.signatories, threshold: t.threshold }));
            setTeam(t);
            setEditing(false);
          }}
          onCancel={team ? () => setEditing(false) : undefined}
        />
      ) : (
        team && (
          <>
            <p className="small">
              {team.threshold}-of-{team.signatories.length} Portaldot multisig. Spending from it needs {team.threshold} of these signatories.
            </p>
            <span className="mono small">{team.address}</span>
            <dl className="kv">
              <dt>Team balance</dt>
              <dd>{teamBal ? usd(teamBal.stable) : "…"}</dd>
            </dl>
            {teamBal && teamBal.native === 0n ? (
              <>
                <p className="muted small">This team wallet needs a one-time setup before it can receive dollars.</p>
                <button className="btn" onClick={() => void activate()} disabled={busy !== null}>
                  {busy ?? "Activate team wallet"}
                </button>
              </>
            ) : (
              <form className="stack" onSubmit={send}>
                <label className="label" htmlFor="payout-amount">
                  Send to team wallet (dollars)
                </label>
                <input id="payout-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={busy !== null} />
                <span className="muted small">Network fee ≈ {fee === null ? "…" : usdFee(fee)}, paid in dollars</span>
                <button type="submit" className="btn primary" disabled={busy !== null || !amount.trim()}>
                  {busy ?? "Send with fingerprint"}
                </button>
              </form>
            )}
            <button className="btn" onClick={() => setEditing(true)} disabled={busy !== null}>
              Change team wallet
            </button>
          </>
        )
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function TeamForm({ initial, onSave, onCancel }: { initial: MultisigSpec; onSave: (t: Team) => void; onCancel?: () => void }) {
  const [members, setMembers] = useState<string[]>(initial.signatories);
  const [threshold, setThreshold] = useState(initial.threshold);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const api = await getApi();
      const signatories = members.map((m) => m.trim());
      const address = multisigAddress({ signatories, threshold }, network.ss58, api.consts.multisig.maxSignatories.toNumber());
      onSave({ signatories, threshold, address });
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <form className="stack" onSubmit={save}>
      {members.map((m, i) => (
        <div key={i} className="stack">
          <label className="label" htmlFor={`sig-${i}`}>
            Signatory {i + 1}
            {i === 0 ? " (this device by default)" : ""}
          </label>
          <input
            id={`sig-${i}`}
            className="mono"
            value={m}
            onChange={(e) => setMembers(members.map((x, j) => (j === i ? e.target.value : x)))}
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>
      ))}
      <label className="label" htmlFor="threshold">
        Approvals needed
      </label>
      <select id="threshold" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))}>
        {members.slice(1).map((_, i) => (
          <option key={i} value={i + 2}>
            {i + 2} of {members.length}
          </option>
        ))}
      </select>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn primary">
        Save team wallet
      </button>
      {onCancel && (
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
