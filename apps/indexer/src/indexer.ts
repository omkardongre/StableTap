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
/** polkadot.js can leave a request pending forever across a websocket reconnect; never wait longer than this. */
const FETCH_TIMEOUT_MS = 30_000;
/** Behind the chain with no progress for this long means the connection is wedged; exit so the supervisor restarts us. */
const STALL_MS = 3 * 60_000;

function withTimeout<T>(p: Promise<T>, ms: number, what: string): Promise<T> {
  let t: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error(`${what} timed out after ${ms / 1000}s`)), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(t));
}

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
  let lastProgress = Date.now();
  let lastHead = Date.now();

  const catchUp = async () => {
    if (running || stopped) return;
    running = true;
    try {
      while (!stopped && status.nextBlock <= status.finalizedHead) {
        const count = Math.min(PREFETCH, status.finalizedHead - status.nextBlock + 1);
        const from = status.nextBlock;
        const blocks: ScannedBlock[] = await withTimeout(
          Promise.all(Array.from({ length: count }, (_, i) => scanBlock(api, net, from + i))),
          FETCH_TIMEOUT_MS,
          `fetching #${from}..#${from + count - 1}`,
        );
        for (const b of blocks) {
          store.applyBlock(b, (rec, merchant) => eventPayload(net, rec, merchant));
          status.nextBlock = b.blockNumber + 1;
          lastProgress = Date.now();
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
    lastHead = Date.now();
    void catchUp();
  });

  // Watchdog: the cursor is stored per block, so exiting loses nothing and a fresh process reconnects cleanly.
  const watchdog = setInterval(() => {
    const behind = status.nextBlock <= status.finalizedHead;
    if (!stopped && behind && Date.now() - lastProgress > STALL_MS) {
      log(`indexer stalled at #${status.nextBlock} (head #${status.finalizedHead}) for ${STALL_MS / 1000}s; exiting for a clean restart`);
      process.exit(1);
    }
    if (!behind) lastProgress = Date.now();
    // Blocks finalize every few seconds; silence this long means the head subscription itself died.
    if (!stopped && Date.now() - lastHead > STALL_MS) {
      log(`no finalized head for ${STALL_MS / 1000}s; exiting for a clean restart`);
      process.exit(1);
    }
  }, 15_000);
  watchdog.unref();

  return {
    status: () => ({ ...status }),
    stop: () => {
      stopped = true;
      clearInterval(watchdog);
      clearTimeout(retry);
      unsub();
    },
  };
}
