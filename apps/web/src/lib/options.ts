import { MAX_SPLIT_BPS, normalizeAddress, type Split } from "@stabletap/engine/invoice";

/** Optional app features, from NEXT_PUBLIC_ env. Each is validated; a half-set pair is an error. */
export interface AppOptions {
  /** Indexer API base URL (history, stats, webhooks). */
  indexer: string | null;
  /** Block explorer base URL; links are `${explorer}/#/extrinsics/<block>-<index>`. */
  explorer: string | null;
  /** Platform share added to every POS invoice. */
  split: Split | null;
  /** Other assets (with a native pool) a customer may pay with; swapped to the stablecoin in the same tx. */
  payAssets: number[];
  /** MetaMask checkout through the PotCheckout contract. */
  evm: EvmOptions | null;
}

export interface EvmOptions {
  rpc: string;
  chainId: number;
  chainName: string;
  checkout: `0x${string}`;
  /** Block the contract was deployed in; history is read from here. */
  fromBlock: bigint;
}

export function loadAppOptions(env: Record<string, string | undefined>, ss58: number): AppOptions {
  const indexer = url(env.NEXT_PUBLIC_STABLETAP_INDEXER, "NEXT_PUBLIC_STABLETAP_INDEXER");
  const explorer = url(env.NEXT_PUBLIC_STABLETAP_EXPLORER, "NEXT_PUBLIC_STABLETAP_EXPLORER");
  const to = env.NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS?.trim();
  const bps = env.NEXT_PUBLIC_STABLETAP_PLATFORM_BPS?.trim();
  if (!to !== !bps) throw new Error("Set both NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS and NEXT_PUBLIC_STABLETAP_PLATFORM_BPS, or neither");
  let split: Split | null = null;
  if (to && bps) {
    if (!/^\d{1,5}$/.test(bps) || Number(bps) < 1 || Number(bps) > MAX_SPLIT_BPS) throw new Error(`NEXT_PUBLIC_STABLETAP_PLATFORM_BPS must be 1-${MAX_SPLIT_BPS}`);
    split = { to: normalizeAddress(to, ss58, "NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS is not a valid address"), bps: Number(bps) };
  }
  const payAssets = (env.NEXT_PUBLIC_STABLETAP_PAY_ASSETS?.trim() ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      if (!/^\d{1,10}$/.test(x) || Number(x) > 0xffff_ffff) throw new Error("NEXT_PUBLIC_STABLETAP_PAY_ASSETS must be a comma-separated list of asset ids");
      return Number(x);
    });
  if (new Set(payAssets).size !== payAssets.length) throw new Error("NEXT_PUBLIC_STABLETAP_PAY_ASSETS has duplicates");
  return { indexer, explorer, split, payAssets, evm: evmOptions(env) };
}

function evmOptions(env: Record<string, string | undefined>): EvmOptions | null {
  const keys = ["NEXT_PUBLIC_STABLETAP_EVM_RPC", "NEXT_PUBLIC_STABLETAP_EVM_CHAIN_ID", "NEXT_PUBLIC_STABLETAP_CHECKOUT_ADDRESS", "NEXT_PUBLIC_STABLETAP_CHECKOUT_FROM_BLOCK"] as const;
  const set = keys.filter((k) => env[k]?.trim());
  if (set.length === 0) return null;
  if (set.length !== keys.length) throw new Error(`Set all of ${keys.join(", ")}, or none`);
  const rpc = url(env.NEXT_PUBLIC_STABLETAP_EVM_RPC, keys[0])!;
  const chainId = env.NEXT_PUBLIC_STABLETAP_EVM_CHAIN_ID!.trim();
  if (!/^\d{1,12}$/.test(chainId) || Number(chainId) < 1) throw new Error(`${keys[1]} must be a positive integer`);
  const checkout = env.NEXT_PUBLIC_STABLETAP_CHECKOUT_ADDRESS!.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(checkout)) throw new Error(`${keys[2]} must be a 0x address`);
  const from = env.NEXT_PUBLIC_STABLETAP_CHECKOUT_FROM_BLOCK!.trim();
  if (!/^\d{1,12}$/.test(from)) throw new Error(`${keys[3]} must be a block number`);
  const chainName = env.NEXT_PUBLIC_STABLETAP_EVM_CHAIN_NAME?.trim() || "Portaldot V3 testnet";
  return { rpc, chainId: Number(chainId), chainName, checkout: checkout as `0x${string}`, fromBlock: BigInt(from) };
}

function url(raw: string | undefined, key: string): string | null {
  const v = raw?.trim();
  if (!v) return null;
  if (!/^https?:\/\/[^\s/]+(\/[^\s]*)?$/.test(v)) throw new Error(`${key} must be an http(s) URL`);
  return v.replace(/\/+$/, "");
}
