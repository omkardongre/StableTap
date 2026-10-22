/** Network and asset settings, loaded from the environment and validated. */
export interface NetworkConfig {
  /** Substrate websocket endpoint. */
  ws: string;
  /** Asset id of the stablecoin (pUSD) in pallet-assets. */
  assetId: number;
  /** Stablecoin decimals. Checked against on-chain metadata by `assertNetwork`. */
  decimals: number;
  ss58: number;
}

export const TESTNET_WS = "wss://test-node-v3.portaldot.dev";
const SS58 = 42;

/**
 * Required: STABLETAP_WS, STABLETAP_ASSET_ID, STABLETAP_ASSET_DECIMALS.
 * Throws on anything missing or malformed; there are no silent defaults.
 */
export function loadNetwork(env: Record<string, string | undefined>): NetworkConfig {
  const ws = required(env, "STABLETAP_WS");
  if (!/^wss?:\/\/\S+$/.test(ws)) throw new Error("STABLETAP_WS must be a ws:// or wss:// URL");
  return {
    ws,
    assetId: uint(required(env, "STABLETAP_ASSET_ID"), "STABLETAP_ASSET_ID", 0xffff_ffff),
    decimals: uint(required(env, "STABLETAP_ASSET_DECIMALS"), "STABLETAP_ASSET_DECIMALS", 18),
    ss58: SS58,
  };
}

function required(env: Record<string, string | undefined>, key: string): string {
  const v = env[key]?.trim();
  if (!v) throw new Error(`Missing ${key}`);
  return v;
}

function uint(text: string, key: string, max: number): number {
  if (!/^\d+$/.test(text)) throw new Error(`${key} must be a non-negative integer`);
  const n = Number(text);
  if (n > max) throw new Error(`${key} out of range`);
  return n;
}

/** "4.50" -> 4_500_000n. Rejects more decimals than the asset has. */
export function parseAmount(text: string, decimals: number): bigint {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(text.trim());
  if (!m) throw new Error(`Invalid amount: ${text}`);
  const frac = m[2] ?? "";
  if (frac.length > decimals) throw new Error(`Too many decimals (max ${decimals})`);
  return BigInt(m[1]! + frac.padEnd(decimals, "0"));
}

/** 4_500_000n -> "4.50": at least 2 fraction digits, trailing zeros trimmed beyond that. */
export function formatAmount(value: bigint, decimals: number): string {
  if (value < 0n) throw new Error("Negative amount");
  if (decimals === 0) return value.toString();
  const s = value.toString().padStart(decimals + 1, "0");
  const int = s.slice(0, -decimals);
  const frac = s.slice(-decimals).replace(/0+$/, "").padEnd(2, "0");
  return `${int}.${frac}`;
}
