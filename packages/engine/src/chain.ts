import type {} from "./augment.ts";
import { ApiPromise, WsProvider } from "@polkadot/api";
import type { NetworkConfig } from "./config.ts";

/**
 * Connect with the exact fee-extension shape of Portaldot V3.
 * Without this override polkadot.js assumes the Asset Hub shape (XCM location)
 * and the fee asset is encoded wrongly.
 */
export async function connect(net: NetworkConfig): Promise<ApiPromise> {
  return ApiPromise.create({
    provider: new WsProvider(net.ws),
    noInitWarn: true,
    throwOnConnect: true,
    signedExtensions: {
      ChargeAssetTxPayment: {
        extrinsic: { tip: "Compact<Balance>", assetId: "Option<FrameSupportTokensFungibleUnionOfNativeOrWithId>" },
        payload: {},
      },
    },
  });
}

export const NATIVE = { Native: null } as const;
export const withId = (assetId: number) => ({ WithId: assetId });

/** Signer option that makes the fee be paid in `assetId`. */
export const feeAsset = (assetId: number) => ({ assetId: withId(assetId) });

/**
 * Fail fast if the configured stablecoin is unusable: the asset must exist with
 * the configured decimals, and a pool with the native token must hold liquidity
 * (the fee is swapped through it).
 */
export async function assertNetwork(api: ApiPromise, net: NetworkConfig): Promise<void> {
  const asset = await api.query.assets.asset(net.assetId);
  if (asset.isNone) throw new Error(`Asset ${net.assetId} does not exist on this chain`);
  if (!asset.unwrap().status.isLive) throw new Error(`Asset ${net.assetId} is not live`);
  const meta = await api.query.assets.metadata(net.assetId);
  if (meta.decimals.toNumber() !== net.decimals) {
    throw new Error(`Asset ${net.assetId} has ${meta.decimals.toNumber()} decimals, config says ${net.decimals}`);
  }
  const reserves = await api.call.assetConversionApi.getReserves(NATIVE, withId(net.assetId));
  if (reserves.isNone) throw new Error(`No pool between the native token and asset ${net.assetId}`);
  const [native, stable] = reserves.unwrap();
  if (native.isZero() || stable.isZero()) throw new Error(`Pool for asset ${net.assetId} has no liquidity`);
}

export interface Balances {
  /** Free native balance (planck). */
  native: bigint;
  /** Stablecoin balance in its smallest unit. */
  stable: bigint;
}

/** Balances at the best block, or at `blockHash` when given (e.g. the block a payment landed in). */
export async function getBalances(api: ApiPromise, net: NetworkConfig, who: string, blockHash?: string): Promise<Balances> {
  const q = blockHash ? (await api.at(blockHash)).query : api.query;
  const [account, asset] = await Promise.all([q.system.account(who), q.assets.account(net.assetId, who)]);
  return { native: account.data.free.toBigInt(), stable: asset.isSome ? asset.unwrap().balance.toBigInt() : 0n };
}
