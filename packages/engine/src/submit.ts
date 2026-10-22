import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { DispatchError, EventRecord } from "@polkadot/types/interfaces";

export interface Finalized {
  txHash: string;
  blockHash: string;
  blockNumber: number;
  /** Events of this extrinsic only. */
  events: EventRecord[];
}

export type SubmitStage = "inBlock";

/**
 * Submit an already signed extrinsic and resolve once it is finalized.
 * Rejects if it is invalid, dropped, usurped, hits a finality timeout, or
 * fails to dispatch. Never resolves for a tx that did not land.
 */
export function submitFinalized(
  api: ApiPromise,
  tx: SubmittableExtrinsic<"promise">,
  onStage?: (stage: SubmitStage) => void,
): Promise<Finalized> {
  if (!tx.isSigned) return Promise.reject(new Error("Extrinsic must be signed before submit"));
  const txHash = tx.hash.toHex();

  return new Promise<Finalized>((resolve, reject) => {
    let unsub: (() => void) | undefined;
    let done = false;
    const finish = (err: Error | null, out?: Finalized) => {
      if (done) return;
      done = true;
      unsub?.();
      if (err) reject(err);
      else resolve(out!);
    };

    tx.send((result) => {
      const { status, events, dispatchError } = result;
      if (status.isInvalid || status.isDropped || status.isUsurped || status.isFinalityTimeout) {
        return finish(new Error(`Transaction ${status.type.toLowerCase()}`));
      }
      if (dispatchError) return finish(new Error(describeDispatchError(api, dispatchError)));
      if (status.isInBlock) return onStage?.("inBlock");
      if (!status.isFinalized) return;

      const blockHash = status.asFinalized.toHex();
      api.rpc.chain
        .getHeader(blockHash)
        .then((header) => finish(null, { txHash, blockHash, blockNumber: header.number.toNumber(), events }))
        .catch((e: unknown) => finish(toError(e)));
    })
      .then((u) => {
        unsub = u;
        if (done) u();
      })
      .catch((e: unknown) => finish(toError(e)));
  });
}

export function describeDispatchError(api: ApiPromise, e: DispatchError): string {
  if (!e.isModule) return e.toString();
  const { section, name, docs } = api.registry.findMetaError(e.asModule);
  return `${section}.${name}${docs.length ? `: ${docs.join(" ")}` : ""}`;
}

export const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));
