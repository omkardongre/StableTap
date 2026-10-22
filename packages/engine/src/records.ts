import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { GenericExtrinsic } from "@polkadot/types";
import type { Call, EventRecord, SignedBlock } from "@polkadot/types/interfaces";
import { u8aToString } from "@polkadot/util";
import { blake2AsHex, encodeAddress } from "@polkadot/util-crypto";
import type { NetworkConfig } from "./config.ts";
import { parseMemo, splitAmounts, type Invoice } from "./invoice.ts";

export interface StableTransfer {
  from: string;
  to: string;
  amount: bigint;
}

export interface FeePaid {
  amount: bigint;
  /** Asset id the fee was charged in; null = native token. */
  assetId: number | null;
}

/** A successful StableTap extrinsic, decoded from a finalized block. */
export interface ChainRecord {
  kind: "payment" | "refund";
  invoiceId: string;
  txHash: string;
  blockNumber: number;
  blockHash: string;
  extrinsicIndex: number;
  signer: string;
  /** Block time, unix ms (pallet-timestamp). */
  timestamp: number;
  /** Stablecoin transfers emitted by this extrinsic, in event order. */
  transfers: StableTransfer[];
  fee: FeePaid | null;
}

export interface ScannedBlock {
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  records: ChainRecord[];
}

/** Fetch a block with its events and decode every StableTap payment and refund in it. */
export async function scanBlock(api: ApiPromise, net: NetworkConfig, blockNumber: number): Promise<ScannedBlock> {
  const hash = await api.rpc.chain.getBlockHash(blockNumber);
  const [block, at] = await Promise.all([api.rpc.chain.getBlock(hash), api.at(hash)]);
  const [events, now] = await Promise.all([at.query.system.events(), at.query.timestamp.now()]);
  const timestamp = now.toNumber();
  const blockHash = hash.toHex();
  return { blockNumber, blockHash, timestamp, records: decodeBlock(api, net, block, events, { blockNumber, blockHash, timestamp }) };
}

/**
 * A record is produced only for an extrinsic that succeeded and emitted a
 * `Remarked` event whose hash matches a StableTap memo found in its call.
 * The memo text comes from the call (events only carry its hash); amounts come
 * from events, never from call arguments, so a failed or partial call can't count.
 */
export function decodeBlock(
  api: ApiPromise,
  net: NetworkConfig,
  block: SignedBlock,
  events: EventRecord[],
  at: { blockNumber: number; blockHash: string; timestamp: number },
): ChainRecord[] {
  const out: ChainRecord[] = [];
  for (const [index, xt] of block.block.extrinsics.entries()) {
    if (!xt.isSigned) continue;
    const memos = remarksOf(api, xt.method);
    if (memos.length === 0) continue;
    const mine = events.filter((r) => r.phase.isApplyExtrinsic && r.phase.asApplyExtrinsic.eq(index)).map((r) => r.event);
    if (!mine.some((e) => api.events.system.ExtrinsicSuccess.is(e))) continue;
    const remarked = new Set(mine.filter((e) => api.events.system.Remarked.is(e)).map((e) => e.data[1].toHex()));
    const memo = memos.map((m) => ({ m, parsed: parseMemo(m) })).find(({ m, parsed }) => parsed && remarked.has(blake2AsHex(m)));
    if (!memo?.parsed) continue;
    const transfers: StableTransfer[] = [];
    let fee: FeePaid | null = null;
    for (const e of mine) {
      if (api.events.assets.Transferred.is(e)) {
        const [assetId, from, to, amount] = e.data;
        if (assetId.toNumber() === net.assetId) {
          transfers.push({ from: encodeAddress(from, net.ss58), to: encodeAddress(to, net.ss58), amount: amount.toBigInt() });
        }
      } else if (api.events.assetConversionTxPayment.AssetTxFeePaid.is(e)) {
        const [, actualFee, , assetKind] = e.data;
        fee = { amount: actualFee.toBigInt(), assetId: assetKind.isWithId ? assetKind.asWithId.toNumber() : null };
      } else if (api.events.transactionPayment.TransactionFeePaid.is(e) && fee === null) {
        fee = { amount: e.data[1].toBigInt(), assetId: null };
      }
    }
    out.push({
      kind: memo.parsed.kind,
      invoiceId: memo.parsed.invoiceId,
      txHash: xt.hash.toHex(),
      ...at,
      extrinsicIndex: index,
      signer: encodeAddress(xt.signer.toString(), net.ss58),
      transfers,
      fee,
    });
  }
  return out;
}

/** True when the record settles `inv` exactly: the memo, the merchant share and the platform share. */
export function settlesInvoice(rec: ChainRecord, inv: Invoice): boolean {
  if (rec.kind !== "payment" || rec.invoiceId !== inv.id) return false;
  const { merchant, platform } = splitAmounts(inv);
  const has = (to: string, amount: bigint) => rec.transfers.some((t) => t.to === to && t.amount === amount);
  return has(inv.to, merchant) && (platform === 0n || has(inv.split!.to, platform));
}

/** Remark payloads (UTF-8) in a call, looking one level into utility batches. */
function remarksOf(api: ApiPromise, call: Call | GenericExtrinsic["method"]): string[] {
  if (api.tx.system.remarkWithEvent.is(call)) return [u8aToString(call.args[0].toU8a(true))];
  if (api.tx.utility.batchAll.is(call) || api.tx.utility.batch.is(call) || api.tx.utility.forceBatch.is(call)) {
    return call.args[0].flatMap((c) => (api.tx.system.remarkWithEvent.is(c) ? [u8aToString(c.args[0].toU8a(true))] : []));
  }
  return [];
}
