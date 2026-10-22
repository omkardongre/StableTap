import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { EventRecord } from "@polkadot/types/interfaces";
import { NATIVE, chainNow, feeAsset, withId } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { assertNotExpired, memoFor, splitAmounts, type Invoice } from "./invoice.ts";
import type { PayStage, Receipt } from "./pay.ts";
import { submitFinalized } from "./submit.ts";

/** Default price protection for the swap leg: the customer never spends more than quote + 1%. */
export const DEFAULT_SLIPPAGE_BPS = 100;

export interface SwapQuote {
  /** Expected amount of the pay asset the swap takes. */
  expectedIn: bigint;
  /** Upper bound signed into the call (expected + slippage); the swap fails rather than spend more. */
  maxIn: bigint;
  /** Estimated network fee, also in the pay asset. */
  fee: bigint;
}

/**
 * Units of `payAssetId` needed to get exactly `amountOut` of the stablecoin,
 * routed pay asset -> native -> stablecoin (pool fees included). The runtime
 * quote API prices one pool at a time, so the two hops are priced in reverse.
 */
export async function quoteSwapIn(api: ApiPromise, net: NetworkConfig, payAssetId: number, amountOut: bigint): Promise<bigint> {
  const native = await api.call.assetConversionApi.quotePriceTokensForExactTokens(NATIVE, withId(net.assetId), amountOut, true);
  if (native.isNone) throw new Error("No liquidity to buy the stablecoin with the native token");
  const payIn = await api.call.assetConversionApi.quotePriceTokensForExactTokens(withId(payAssetId), NATIVE, native.unwrap(), true);
  if (payIn.isNone) throw new Error(`Asset ${payAssetId} has no pool with the native token`);
  return payIn.unwrap().toBigInt();
}

/**
 * One atomic call: swap the pay asset for exactly the invoice amount of
 * stablecoin into the payer's account, forward the merchant (and platform)
 * share, add the memo. The forwards use `assets.transfer` (not keep-alive):
 * a payer holding no stablecoin ends at zero again, which keep-alive forbids.
 */
export function buildSwapPayCall(api: ApiPromise, net: NetworkConfig, inv: Invoice, payAssetId: number, maxIn: bigint, payer: string): SubmittableExtrinsic<"promise"> {
  if (payAssetId === net.assetId) throw new Error("Use pay() for the stablecoin itself");
  const { merchant, platform } = splitAmounts(inv);
  return api.tx.utility.batchAll([
    api.tx.assetConversion.swapTokensForExactTokens([withId(payAssetId), NATIVE, withId(net.assetId)], inv.amount, maxIn, payer, true),
    api.tx.assets.transfer(net.assetId, inv.to, merchant),
    ...(platform > 0n ? [api.tx.assets.transfer(net.assetId, inv.split!.to, platform)] : []),
    api.tx.system.remarkWithEvent(memoFor(inv.id)),
  ]);
}

export async function quoteSwapPay(
  api: ApiPromise,
  net: NetworkConfig,
  inv: Invoice,
  payAssetId: number,
  payer: string,
  slippageBps = DEFAULT_SLIPPAGE_BPS,
): Promise<SwapQuote> {
  if (!Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > 1_000) throw new Error("Slippage must be 0-1000 bps");
  const expectedIn = await quoteSwapIn(api, net, payAssetId, inv.amount);
  const maxIn = expectedIn + (expectedIn * BigInt(slippageBps) + 9_999n) / 10_000n;
  const info = await buildSwapPayCall(api, net, inv, payAssetId, maxIn, payer).paymentInfo(payer, feeAsset(payAssetId));
  const fee = await api.call.assetConversionApi.quotePriceTokensForExactTokens(withId(payAssetId), NATIVE, info.partialFee, true);
  if (fee.isNone) throw new Error(`Fee cannot be priced in asset ${payAssetId}`);
  return { expectedIn, maxIn, fee: fee.unwrap().toBigInt() };
}

/**
 * Pay a stablecoin invoice with another asset: the merchant still receives
 * exactly the invoice amount in the stablecoin, and the fee is paid in the pay
 * asset, so the payer's native balance is untouched. Same finality, expiry
 * and fee guarantees as `pay`.
 */
export async function payWithAsset(
  api: ApiPromise,
  net: NetworkConfig,
  inv: Invoice,
  payAssetId: number,
  maxIn: bigint,
  payer: KeyringPair,
  onStage?: (stage: PayStage, txHash: string) => void,
): Promise<Receipt & { spentIn: bigint }> {
  assertNotExpired(inv, await chainNow(api));
  const tx = await buildSwapPayCall(api, net, inv, payAssetId, maxIn, payer.address).signAsync(payer, feeAsset(payAssetId));
  const txHash = tx.hash.toHex();
  onStage?.("signed", txHash);
  const done = await submitFinalized(api, tx, (stage) => onStage?.(stage, txHash));
  return { txHash, blockHash: done.blockHash, blockNumber: done.blockNumber, feePaid: feeInAsset(api, done.events, payAssetId), spentIn: swapIn(api, done.events) };
}

/** Fee charged in `assetId` (AssetTxFeePaid); throws if it was charged in anything else. */
export function feeInAsset(api: ApiPromise, events: EventRecord[], assetId: number): bigint {
  const rec = events.find(({ event }) => api.events.assetConversionTxPayment.AssetTxFeePaid.is(event));
  if (!rec || !api.events.assetConversionTxPayment.AssetTxFeePaid.is(rec.event)) throw new Error("No AssetTxFeePaid event: the fee was not paid in an asset");
  const [, actualFee, , kind] = rec.event.data;
  if (!kind.isWithId || kind.asWithId.toNumber() !== assetId) throw new Error(`Fee was paid in ${JSON.stringify(kind.toJSON())}, expected asset ${assetId}`);
  return actualFee.toBigInt();
}

function swapIn(api: ApiPromise, events: EventRecord[]): bigint {
  const rec = events.find(({ event }) => api.events.assetConversion.SwapExecuted.is(event));
  if (!rec || !api.events.assetConversion.SwapExecuted.is(rec.event)) throw new Error("No SwapExecuted event");
  return rec.event.data.amountIn.toBigInt();
}
