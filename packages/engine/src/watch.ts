import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { EventRecord } from "@polkadot/types/interfaces";
import { blake2AsHex, decodeAddress } from "@polkadot/util-crypto";
import { u8aEq } from "@polkadot/util";
import type { NetworkConfig } from "./config.ts";
import { memoFor, type Invoice } from "./invoice.ts";

export interface PaidEvent {
  txHash: string;
  blockHash: string;
  blockNumber: number;
  payer: string;
}

export interface WatchOptions {
  /** First block to scan (inclusive). Default: the current finalized block. Use it to resume after a reconnect. */
  fromBlock?: number;
  onPaid: (e: PaidEvent) => void;
  onError: (e: Error) => void;
}

/**
 * Report the invoice as paid once a finalized extrinsic both transfers exactly
 * `inv.amount` of the stablecoin to `inv.to` and carries the invoice memo.
 * A bare memo or a plain transfer never counts. Finalized-head notifications
 * can skip blocks, so every block between the last scanned and the new head is
 * scanned in order. Stops after the first match. Returns an unsubscribe fn.
 */
export async function watchInvoice(api: ApiPromise, net: NetworkConfig, inv: Invoice, opts: WatchOptions): Promise<() => void> {
  const memoHash = blake2AsHex(memoFor(inv.id));
  const merchant = decodeAddress(inv.to);
  let next = opts.fromBlock ?? (await api.rpc.chain.getHeader(await api.rpc.chain.getFinalizedHead())).number.toNumber();
  let stopped = false;
  let queue = Promise.resolve();

  const scan = async (blockNumber: number): Promise<PaidEvent | null> => {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const [block, at] = await Promise.all([api.rpc.chain.getBlock(blockHash), api.at(blockHash)]);
    const events = await at.query.system.events();
    for (const [index, xt] of block.block.extrinsics.entries()) {
      const mine = events.filter((r) => r.phase.isApplyExtrinsic && r.phase.asApplyExtrinsic.eq(index));
      if (matches(api, net, inv, merchant, memoHash, mine)) {
        return { txHash: xt.hash.toHex(), blockHash: blockHash.toHex(), blockNumber, payer: xt.signer.toString() };
      }
    }
    return null;
  };

  const unsub = await api.rpc.chain.subscribeFinalizedHeads((header) => {
    const head = header.number.toNumber();
    queue = queue.then(async () => {
      while (!stopped && next <= head) {
        const hit = await scan(next);
        next += 1;
        if (hit) {
          stop();
          opts.onPaid(hit);
        }
      }
    }).catch((e: unknown) => {
      stop();
      opts.onError(e instanceof Error ? e : new Error(String(e)));
    });
  });

  function stop() {
    if (stopped) return;
    stopped = true;
    unsub();
  }
  return stop;
}

function matches(api: ApiPromise, net: NetworkConfig, inv: Invoice, merchant: Uint8Array, memoHash: string, events: EventRecord[]): boolean {
  let ok = false;
  let memo = false;
  let transfer = false;
  for (const { event } of events) {
    if (api.events.system.ExtrinsicSuccess.is(event)) ok = true;
    else if (api.events.system.Remarked.is(event) && event.data[1].toHex() === memoHash) memo = true;
    else if (api.events.assets.Transferred.is(event)) {
      const [assetId, , to, amount] = event.data;
      if (assetId.toNumber() === net.assetId && u8aEq(to, merchant) && amount.toBigInt() === inv.amount) transfer = true;
    }
  }
  return ok && memo && transfer;
}
