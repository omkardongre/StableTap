import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import { decodeAddress } from "@polkadot/util-crypto";
import { u8aEq } from "@polkadot/util";
import { NATIVE, withId } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { submitFinalized, type Finalized } from "./submit.ts";

/** What the stablecoin and its fee pool should look like. All amounts in smallest units. */
export interface StablecoinPlan {
  name: string;
  symbol: string;
  /** Smallest balance an account may hold (pallet-assets min_balance). */
  minBalance: bigint;
  /** Minted to the issuer when the asset is created. Must cover the pool's stablecoin side. */
  mint: bigint;
  /** Initial pool liquidity; their ratio sets the price used to charge fees. */
  poolNative: bigint;
  poolStable: bigint;
}

export interface SetupStep {
  call: string;
  detail: string;
}

export interface SetupResult {
  steps: SetupStep[];
  /** Absent when nothing had to change. */
  tx?: Finalized;
}

/**
 * Idempotent: creates the asset (with metadata and mint), the native/asset
 * pool and its first liquidity, skipping whatever already exists. An existing
 * asset must be owned by the issuer with the configured decimals; an existing
 * pool with liquidity is left untouched so its price is never moved here.
 * Everything that is missing goes into one atomic batch.
 */
export async function planStablecoin(
  api: ApiPromise,
  net: NetworkConfig,
  issuer: string,
  plan: StablecoinPlan,
): Promise<{ steps: SetupStep[]; calls: SubmittableExtrinsic<"promise">[] }> {
  validatePlan(plan);
  const steps: SetupStep[] = [];
  const calls: SubmittableExtrinsic<"promise">[] = [];
  const asset = await api.query.assets.asset(net.assetId);

  if (asset.isNone) {
    calls.push(
      api.tx.assets.create(net.assetId, issuer, plan.minBalance),
      api.tx.assets.setMetadata(net.assetId, plan.name, plan.symbol, net.decimals),
      api.tx.assets.mint(net.assetId, issuer, plan.mint),
    );
    steps.push(
      { call: "assets.create", detail: `id ${net.assetId}, min balance ${plan.minBalance}` },
      { call: "assets.setMetadata", detail: `${plan.name} (${plan.symbol}), ${net.decimals} decimals` },
      { call: "assets.mint", detail: `${plan.mint} to issuer` },
    );
  } else {
    if (!u8aEq(asset.unwrap().owner, decodeAddress(issuer))) throw new Error(`Asset ${net.assetId} exists and is owned by ${asset.unwrap().owner.toString()}, not the issuer`);
    const meta = await api.query.assets.metadata(net.assetId);
    if (meta.decimals.toNumber() !== net.decimals) throw new Error(`Asset ${net.assetId} has ${meta.decimals.toNumber()} decimals, config says ${net.decimals}`);
  }

  const pool = await api.query.assetConversion.pools([NATIVE, withId(net.assetId)]);
  if (pool.isNone) {
    calls.push(api.tx.assetConversion.createPool(NATIVE, withId(net.assetId)));
    steps.push({ call: "assetConversion.createPool", detail: `Native / ${net.assetId}` });
  }

  const reserves = pool.isNone ? null : await api.call.assetConversionApi.getReserves(NATIVE, withId(net.assetId));
  const empty = !reserves || reserves.isNone || reserves.unwrap().some((r) => r.isZero());
  if (empty) {
    if (asset.isSome) {
      const held = await api.query.assets.account(net.assetId, issuer);
      const balance = held.isSome ? held.unwrap().balance.toBigInt() : 0n;
      if (balance < plan.poolStable) throw new Error(`Issuer holds ${balance} of asset ${net.assetId}, pool needs ${plan.poolStable}`);
    }
    // First deposit sets the price, so the minimums equal the amounts.
    calls.push(api.tx.assetConversion.addLiquidity(NATIVE, withId(net.assetId), plan.poolNative, plan.poolStable, plan.poolNative, plan.poolStable, issuer));
    steps.push({ call: "assetConversion.addLiquidity", detail: `${plan.poolNative} native : ${plan.poolStable} stable` });
  }
  return { steps, calls };
}

export async function setupStablecoin(api: ApiPromise, net: NetworkConfig, issuer: KeyringPair, plan: StablecoinPlan): Promise<SetupResult> {
  const { steps, calls } = await planStablecoin(api, net, issuer.address, plan);
  if (calls.length === 0) return { steps };
  const tx = await api.tx.utility.batchAll(calls).signAsync(issuer);
  return { steps, tx: await submitFinalized(api, tx) };
}

function validatePlan(p: StablecoinPlan): void {
  if (!p.name.trim() || !p.symbol.trim()) throw new Error("Asset name and symbol are required");
  if (p.minBalance <= 0n) throw new Error("minBalance must be positive");
  if (p.poolNative <= 0n || p.poolStable <= 0n) throw new Error("Pool amounts must be positive");
  if (p.mint < p.poolStable) throw new Error("mint must cover the pool's stablecoin side");
}
