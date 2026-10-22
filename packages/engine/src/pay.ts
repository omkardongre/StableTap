import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { EventRecord } from "@polkadot/types/interfaces";
import { NATIVE, feeAsset, withId } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { memoFor, type Invoice } from "./invoice.ts";
import { submitFinalized } from "./submit.ts";

export interface Receipt {
  txHash: string;
  /** Finalized block containing the payment. */
  blockHash: string;
  blockNumber: number;
  /** Fee actually charged, in stablecoin units (from AssetTxFeePaid). */
  feePaid: bigint;
}

export type PayStage = "signed" | "inBlock";

/** One atomic call: stablecoin transfer plus the invoice memo. */
export function buildPayCall(api: ApiPromise, net: NetworkConfig, inv: Invoice): SubmittableExtrinsic<"promise"> {
  return api.tx.utility.batchAll([
    api.tx.assets.transferKeepAlive(net.assetId, inv.to, inv.amount),
    api.tx.system.remarkWithEvent(memoFor(inv.id)),
  ]);
}

/**
 * Estimated fee in stablecoin units for this payer: the runtime's native fee
 * estimate, priced through the stablecoin/native pool (pool LP fee included).
 */
export async function quoteFee(api: ApiPromise, net: NetworkConfig, inv: Invoice, payer: string): Promise<bigint> {
  const info = await buildPayCall(api, net, inv).paymentInfo(payer, feeAsset(net.assetId));
  const quote = await api.call.assetConversionApi.quotePriceTokensForExactTokens(withId(net.assetId), NATIVE, info.partialFee, true);
  if (quote.isNone) throw new Error("Fee cannot be priced: the stablecoin pool has no usable liquidity");
  return quote.unwrap().toBigInt();
}

/**
 * Sign and submit with the fee paid in the stablecoin, so the payer's native
 * balance is never spent. Resolves on finality. Rejects if the tx is invalid,
 * dropped, usurped, fails to dispatch, or was charged in any other asset.
 */
export async function pay(
  api: ApiPromise,
  net: NetworkConfig,
  inv: Invoice,
  payer: KeyringPair,
  onStage?: (stage: PayStage, txHash: string) => void,
): Promise<Receipt> {
  const tx = await buildPayCall(api, net, inv).signAsync(payer, feeAsset(net.assetId));
  const txHash = tx.hash.toHex();
  onStage?.("signed", txHash);
  const done = await submitFinalized(api, tx, (stage) => onStage?.(stage, txHash));
  return { txHash, blockHash: done.blockHash, blockNumber: done.blockNumber, feePaid: feeFrom(api, net, done.events) };
}

/** The fee must have been paid in our stablecoin; anything else breaks the product guarantee. */
function feeFrom(api: ApiPromise, net: NetworkConfig, events: EventRecord[]): bigint {
  const rec = events.find(({ event }) => api.events.assetConversionTxPayment.AssetTxFeePaid.is(event));
  if (!rec) throw new Error("No AssetTxFeePaid event: the fee was not paid in the stablecoin");
  const [, actualFee, , assetId] = rec.event.data;
  const paidIn = (assetId.toJSON() as { withId?: number } | null)?.withId;
  if (paidIn !== net.assetId) throw new Error(`Fee was paid in ${JSON.stringify(assetId.toJSON())}, expected asset ${net.assetId}`);
  return BigInt(actualFee.toString());
}
