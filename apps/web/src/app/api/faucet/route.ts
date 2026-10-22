import type { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady, decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { AlreadyFundedError, assertNetwork, connect, fundNewAccount, parseAmount } from "@stabletap/engine";
import { network } from "@/lib/network";

/**
 * POST { address, asset? } -> funds a brand-new wallet once with the existential
 * deposit plus test pUSD, or plus the configured alternate token (e.g. PORT)
 * when `asset` equals FAUCET_ALT_ASSET_ID. Public endpoint on a test network: abuse is bounded
 * by "only accounts that hold nothing" plus a per-client cooldown. Put the
 * host's rate limiting in front of it when deployed.
 */

interface Faucet {
  api: ApiPromise;
  signer: KeyringPair;
  amount: bigint;
  alt: { assetId: number; amount: bigint } | null;
}

let faucet: Promise<Faucet> | null = null;
let queue: Promise<unknown> = Promise.resolve();
const lastHit = new Map<string, number>();
const COOLDOWN_MS = 60_000;

function getFaucet(): Promise<Faucet> {
  faucet ??= (async () => {
    const suri = process.env.FAUCET_SURI?.trim();
    const amountText = process.env.FAUCET_STABLE_AMOUNT?.trim();
    if (!suri || !amountText) throw new ConfigError();
    await cryptoWaitReady();
    const api = await connect(network);
    await assertNetwork(api, network);
    const signer = new Keyring({ type: "sr25519", ss58Format: network.ss58 }).addFromUri(suri);
    const altId = process.env.FAUCET_ALT_ASSET_ID?.trim();
    const altAmount = process.env.FAUCET_ALT_AMOUNT?.trim();
    if (!altId !== !altAmount) throw new Error("Set both FAUCET_ALT_ASSET_ID and FAUCET_ALT_AMOUNT, or neither");
    let alt: Faucet["alt"] = null;
    if (altId && altAmount) {
      if (!/^\d{1,10}$/.test(altId)) throw new Error("FAUCET_ALT_ASSET_ID must be an asset id");
      const meta = await api.query.assets.metadata(Number(altId));
      alt = { assetId: Number(altId), amount: parseAmount(altAmount, meta.decimals.toNumber()) };
    }
    return { api, signer, amount: parseAmount(amountText, network.decimals), alt };
  })().catch((e: unknown) => {
    faucet = null;
    throw e;
  });
  return faucet;
}

class ConfigError extends Error {
  constructor() {
    super("Faucet is not configured");
  }
}

export async function POST(req: Request): Promise<Response> {
  let address: string;
  let asset: number | undefined;
  try {
    const body = (await req.json()) as { address?: unknown; asset?: unknown };
    if (typeof body.address !== "string") throw new Error();
    if (body.asset !== undefined && (typeof body.asset !== "number" || !Number.isSafeInteger(body.asset))) throw new Error();
    address = encodeAddress(decodeAddress(body.address), network.ss58);
    asset = body.asset as number | undefined;
  } catch {
    return json(400, { error: "Send { address, asset? } with a valid Portaldot address" });
  }

  const client = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  if (now - (lastHit.get(client) ?? 0) < COOLDOWN_MS) return json(429, { error: "Please wait a minute before asking again" });
  lastHit.set(client, now);

  try {
    const f = await getFaucet();
    if (asset !== undefined && asset !== f.alt?.assetId) return json(400, { error: "This faucet doesn't hand out that asset" });
    const [assetId, amount] = asset === undefined ? [network.assetId, f.amount] : [f.alt!.assetId, f.alt!.amount];
    // One faucet tx at a time keeps nonces simple and ordered.
    const run = queue.then(() => fundNewAccount(f.api, network, f.signer, address, amount, assetId));
    queue = run.catch(() => undefined);
    const done = await run;
    return json(200, { txHash: done.txHash, blockNumber: done.blockNumber, assetId, amount: amount.toString() });
  } catch (e) {
    if (e instanceof AlreadyFundedError) return json(409, { error: e.message });
    if (e instanceof ConfigError) return json(503, { error: e.message });
    console.error("faucet failed", e);
    return json(502, { error: "Faucet transaction failed" });
  }
}

function json(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
