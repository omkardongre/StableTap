import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import { createKeyMulti, decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
import { feeAsset } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { normalizeAddress } from "./invoice.ts";
import { stableFeeFrom, type Receipt } from "./pay.ts";
import { submitFinalized } from "./submit.ts";

export interface MultisigSpec {
  signatories: string[];
  threshold: number;
}

/**
 * The pallet-multisig account for these signatories and threshold (order
 * doesn't matter). Validates the set the same way the pallet will:
 * distinct members, 2 <= threshold <= members <= maxSignatories.
 */
export function multisigAddress(spec: MultisigSpec, ss58: number, maxSignatories = 100): string {
  const members = spec.signatories.map((s, i) => normalizeAddress(s, ss58, `Signatory ${i + 1} is not a valid address`));
  if (new Set(members.map((m) => u8aToHex(decodeAddress(m)))).size !== members.length) throw new Error("Signatories must be distinct");
  if (members.length < 2 || members.length > maxSignatories) throw new Error(`A multisig needs 2-${maxSignatories} signatories`);
  if (!Number.isInteger(spec.threshold) || spec.threshold < 2 || spec.threshold > members.length) {
    throw new Error(`Threshold must be between 2 and ${members.length}`);
  }
  return encodeAddress(createKeyMulti(members, spec.threshold), ss58);
}

/** Plain stablecoin transfer (keep-alive), e.g. a payout to the team wallet. */
export function buildTransferCall(api: ApiPromise, net: NetworkConfig, to: string, amount: bigint): SubmittableExtrinsic<"promise"> {
  if (amount <= 0n) throw new Error("Amount must be positive");
  return api.tx.assets.transferKeepAlive(net.assetId, to, amount);
}

/** Send stablecoin with the fee paid in the stablecoin; resolves on finality. */
export async function transferStable(api: ApiPromise, net: NetworkConfig, to: string, amount: bigint, signer: KeyringPair): Promise<Receipt> {
  const tx = await buildTransferCall(api, net, to, amount).signAsync(signer, feeAsset(net.assetId));
  const done = await submitFinalized(api, tx);
  return { txHash: done.txHash, blockHash: done.blockHash, blockNumber: done.blockNumber, feePaid: stableFeeFrom(api, net, done.events) };
}
