import type { ApiPromise } from "@polkadot/api";
import { scanBlock, type NetworkConfig, type ScannedBlock } from "@stabletap/engine";
import type { Store } from "./db.ts";
import { eventPayload } from "./webhooks.ts";

export interface IndexerStatus {
  nextBlock: number;
  finalizedHead: number;
  lastError: string | null;
}

const PREFETCH = 8;
const RETRY_MS = 5_000;

/**
 * Follow finalized blocks in order from the stored cursor. Blocks are fetched
 * a few at a time in parallel but applied strictly in order, each in its own
 * transaction with the cursor, so a restart resumes exactly where it stopped.
 * Errors are logged and retried; the loop never skips a block.
 */
export async function startIndexer(api: ApiPromise, net: NetworkConfig, store: Store, startBlock: number, log: (msg: string) => void) {
  const status: IndexerStatus = { nextBlock: store.nextBlock(startBlock), finalizedHead: 0, lastError: null };
  let stopped = false;
  let running = false;
  let retry: ReturnType<typeof setTimeout> | undefined;

  const catchUp = async () => {
    if (running || stopped) return;
    running = true;
    try {
      while (!stopped && status.nextBlock <= status.finalizedHead) {
        const count = Math.min(PREFETCH, status.finalizedHead - status.nextBlock + 1);
        const blocks: ScannedBlock[] = await Promise.all(Array.from({ length: count }, (_, i) => scanBlock(api, net, status.nextBlock + i)));
        for (const b of blocks) {
          store.applyBlock(b, (rec, merchant) => eventPayload(net, rec, merchant));
          status.nextBlock = b.blockNumber + 1;
          for (const r of b.records) log(`#${r.blockNumber} ${r.kind} ${r.invoiceId} ${r.txHash}`);
        }
      }
      status.lastError = null;
    } catch (e) {
      status.lastError = e instanceof Error ? e.message : String(e);
      log(`indexer error at #${status.nextBlock}: ${status.lastError}; retrying`);
      retry = setTimeout(() => void catchUp(), RETRY_MS);
    } finally {
      running = false;
    }
  };

  const unsub = await api.rpc.chain.subscribeFinalizedHeads((h) => {
    status.finalizedHead = h.number.toNumber();
    void catchUp();
  });

  return {
    status: () => ({ ...status }),
    stop: () => {
      stopped = true;
      clearTimeout(retry);
      unsub();
    },
  };
}
