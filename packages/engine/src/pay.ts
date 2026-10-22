import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { EventRecord } from "@polkadot/types/interfaces";
import { NATIVE, chainNow, feeAsset, withId } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { assertNotExpired, isInvoiceId, memoFor, refundMemoFor, splitAmounts, type Invoice } from "./invoice.ts";
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

/** One atomic call: stablecoin transfer (merchant share, plus platform share if split) and the invoice memo. */
export function buildPayCall(api: ApiPromise, net: NetworkConfig, inv: Invoice): SubmittableExtrinsic<"promise"> {
  const { merchant, platform } = splitAmounts(inv);
  return api.tx.utility.batchAll([
    api.tx.assets.transferKeepAlive(net.assetId, inv.to, merchant),
    ...(platform > 0n ? [api.tx.assets.transferKeepAlive(net.assetId, inv.split!.to, platform)] : []),
    api.tx.system.remarkWithEvent(memoFor(inv.id)),
  ]);
}

export interface RefundRequest {
  /** Customer to refund (normally the original payer). */
  to: string;
  amount: bigint;
  invoiceId: string;
}

/** Reverse transfer from the merchant plus a refund memo pointing at the invoice. */
export function buildRefundCall(api: ApiPromise, net: NetworkConfig, r: RefundRequest): SubmittableExtrinsic<"promise"> {
  if (r.amount <= 0n) throw new Error("Refund amount must be positive");
  if (!isInvoiceId(r.invoiceId)) throw new Error("Invalid invoice id");
  return api.tx.utility.batchAll([
    api.tx.assets.transferKeepAlive(net.assetId, r.to, r.amount),
    api.tx.system.remarkWithEvent(refundMemoFor(r.invoiceId)),
  ]);
}

/** Refund signed by the merchant, fee paid in the stablecoin. Same finality and fee guarantees as `pay`. */
export async function refund(
  api: ApiPromise,
  net: NetworkConfig,
  r: RefundRequest,
  merchant: KeyringPair,
  onStage?: (stage: PayStage, txHash: string) => void,
): Promise<Receipt> {
  return signAndSettle(api, net, buildRefundCall(api, net, r), merchant, onStage);
}

/** Estimated fee in stablecoin units for any call signed by `payer` with the fee in the stablecoin. */
export async function quoteCallFee(api: ApiPromise, net: NetworkConfig, call: SubmittableExtrinsic<"promise">, payer: string): Promise<bigint> {
  const info = await call.paymentInfo(payer, feeAsset(net.assetId));
  const quote = await api.call.assetConversionApi.quotePriceTokensForExactTokens(withId(net.assetId), NATIVE, info.partialFee, true);
  if (quote.isNone) throw new Error("Fee cannot be priced: the stablecoin pool has no usable liquidity");
  return quote.unwrap().toBigInt();
}

async function signAndSettle(
  api: ApiPromise,
  net: NetworkConfig,
  call: SubmittableExtrinsic<"promise">,
  signer: KeyringPair,
  onStage?: (stage: PayStage, txHash: string) => void,
): Promise<Receipt> {
  const tx = await call.signAsync(signer, feeAsset(net.assetId));
  const txHash = tx.hash.toHex();
  onStage?.("signed", txHash);
  const done = await submitFinalized(api, tx, (stage) => onStage?.(stage, txHash));
  return { txHash, blockHash: done.blockHash, blockNumber: done.blockNumber, feePaid: stableFeeFrom(api, net, done.events) };
}

/**
 * Estimated fee in stablecoin units for this payer: the runtime's native fee
 * estimate, priced through the stablecoin/native pool (pool LP fee included).
 */
export async function quoteFee(api: ApiPromise, net: NetworkConfig, inv: Invoice, payer: string): Promise<bigint> {
  return quoteCallFee(api, net, buildPayCall(api, net, inv), payer);
}

/**
 * Sign and submit with the fee paid in the stablecoin, so the payer's native
 * balance is never spent. Resolves on finality. Rejects if the tx is invalid,
 * dropped, usurped, fails to dispatch, or was charged in any other asset.
 * Refuses to sign an invoice that has expired by chain time.
 */
export async function pay(
  api: ApiPromise,
  net: NetworkConfig,
  inv: Invoice,
  payer: KeyringPair,
  onStage?: (stage: PayStage, txHash: string) => void,
): Promise<Receipt> {
  assertNotExpired(inv, await chainNow(api));
  return signAndSettle(api, net, buildPayCall(api, net, inv), payer, onStage);
}

/** The fee must have been paid in our stablecoin; anything else breaks the product guarantee. */
export function stableFeeFrom(api: ApiPromise, net: NetworkConfig, events: EventRecord[]): bigint {
  const rec = events.find(({ event }) => api.events.assetConversionTxPayment.AssetTxFeePaid.is(event));
  if (!rec) throw new Error("No AssetTxFeePaid event: the fee was not paid in the stablecoin");
  const [, actualFee, , assetId] = rec.event.data;
  const paidIn = (assetId.toJSON() as { withId?: number } | null)?.withId;
  if (paidIn !== net.assetId) throw new Error(`Fee was paid in ${JSON.stringify(assetId.toJSON())}, expected asset ${net.assetId}`);
  return BigInt(actualFee.toString());
}
