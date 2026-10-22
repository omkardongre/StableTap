import { loadNetwork, type NetworkConfig } from "@stabletap/engine/config";

export interface IndexerConfig {
  net: NetworkConfig;
  /** SQLite file path, or ":memory:". */
  dbPath: string;
  port: number;
  host: string;
  /** First block to index on an empty database (e.g. the block the stablecoin was created in), or "head" = current finalized block. */
  startBlock: number | "head";
  /** Browser origins allowed to call the API (CORS). */
  corsOrigins: string[];
  /** Dev only: allow http:// and private-network webhook URLs (e.g. a local test receiver). */
  allowInsecureWebhooks: boolean;
}

/**
 * Required: STABLETAP_WS, STABLETAP_ASSET_ID, STABLETAP_ASSET_DECIMALS,
 * INDEXER_DB, INDEXER_START_BLOCK (number or "head"), INDEXER_CORS_ORIGINS.
 * Optional: INDEXER_PORT (default 8787), INDEXER_HOST (default 127.0.0.1),
 * INDEXER_ALLOW_INSECURE_WEBHOOKS=1 (dev only).
 */
export function loadConfig(env: Record<string, string | undefined>): IndexerConfig {
  const net = loadNetwork(env);
  const dbPath = req(env, "INDEXER_DB");
  const rawStart = req(env, "INDEXER_START_BLOCK");
  const startBlock = rawStart === "head" ? "head" : uint(rawStart, "INDEXER_START_BLOCK");
  const port = uint(env.INDEXER_PORT?.trim() || "8787", "INDEXER_PORT");
  if (port < 1 || port > 65535) throw new Error("INDEXER_PORT out of range");
  const corsOrigins = req(env, "INDEXER_CORS_ORIGINS")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  for (const o of corsOrigins) {
    if (!/^https?:\/\/[^/\s]+$/.test(o)) throw new Error(`INDEXER_CORS_ORIGINS: "${o}" must be an origin like https://app.example`);
  }
  const insecure = env.INDEXER_ALLOW_INSECURE_WEBHOOKS?.trim();
  if (insecure && insecure !== "1" && insecure !== "0") throw new Error("INDEXER_ALLOW_INSECURE_WEBHOOKS must be 0 or 1");
  return { net, dbPath, port, host: env.INDEXER_HOST?.trim() || "127.0.0.1", startBlock, corsOrigins, allowInsecureWebhooks: insecure === "1" };
}

function req(env: Record<string, string | undefined>, key: string): string {
  const v = env[key]?.trim();
  if (!v) throw new Error(`Missing ${key}`);
  return v;
}

function uint(text: string, key: string): number {
  if (!/^\d{1,10}$/.test(text)) throw new Error(`${key} must be a non-negative integer`);
  return Number(text);
}
