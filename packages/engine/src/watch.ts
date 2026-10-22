import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { NetworkConfig } from "./config.ts";
import type { Invoice } from "./invoice.ts";
import { scanBlock, settlesInvoice } from "./records.ts";

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
 * Report the invoice as paid once a finalized, successful extrinsic carries the
 * invoice memo and transfers exactly the merchant share to `inv.to` (and the
 * platform share to the split address, if any). A bare memo or a plain transfer
 * never counts. Finalized-head notifications can skip blocks, so every block
 * between the last scanned and the new head is scanned in order. Stops after
 * the first match. Returns an unsubscribe fn.
 */
export async function watchInvoice(api: ApiPromise, net: NetworkConfig, inv: Invoice, opts: WatchOptions): Promise<() => void> {
  let next = opts.fromBlock ?? (await api.rpc.chain.getHeader(await api.rpc.chain.getFinalizedHead())).number.toNumber();
  let stopped = false;
  let queue = Promise.resolve();

  const unsub = await api.rpc.chain.subscribeFinalizedHeads((header) => {
    const head = header.number.toNumber();
    queue = queue
      .then(async () => {
        while (!stopped && next <= head) {
          const block = await scanBlock(api, net, next);
          next += 1;
          const hit = block.records.find((r) => settlesInvoice(r, inv));
          if (hit) {
            stop();
            opts.onPaid({ txHash: hit.txHash, blockHash: hit.blockHash, blockNumber: hit.blockNumber, payer: hit.signer });
          }
        }
      })
      .catch((e: unknown) => {
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
