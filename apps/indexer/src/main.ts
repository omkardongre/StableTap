import { cryptoWaitReady } from "@polkadot/util-crypto";
import { assertNetwork, connect } from "@stabletap/engine";
import { loadConfig } from "./config.ts";
import { Store } from "./db.ts";
import { createApi } from "./http.ts";
import { startIndexer } from "./indexer.ts";
import { startDelivery } from "./webhooks.ts";

const log = (msg: string) => console.log(`${new Date().toISOString()} ${msg}`);

const cfg = loadConfig(process.env);
await cryptoWaitReady();
const api = await connect(cfg.net);
await assertNetwork(api, cfg.net);
const store = new Store(cfg.dbPath);
store.bindChain(api.genesisHash.toHex(), cfg.net.assetId);

const startBlock = cfg.startBlock === "head" ? (await api.rpc.chain.getHeader(await api.rpc.chain.getFinalizedHead())).number.toNumber() : cfg.startBlock;
const indexer = await startIndexer(api, cfg.net, store, startBlock, log);
const stopDelivery = startDelivery(store, cfg.allowInsecureWebhooks, log);
const server = createApi({ store, net: cfg.net, api, status: indexer.status, corsOrigins: cfg.corsOrigins, allowInsecureWebhooks: cfg.allowInsecureWebhooks });
server.listen(cfg.port, cfg.host, () => log(`indexer API on http://${cfg.host}:${cfg.port}, indexing from #${indexer.status().nextBlock}`));
if (cfg.allowInsecureWebhooks) log("WARNING: INDEXER_ALLOW_INSECURE_WEBHOOKS=1 (dev only): http and private webhook targets are allowed");

let closing = false;
const shutdown = (signal: string) => {
  if (closing) return;
  closing = true;
  log(`${signal}: shutting down`);
  indexer.stop();
  stopDelivery();
  server.close(() => {
    store.close();
    void api.disconnect().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
