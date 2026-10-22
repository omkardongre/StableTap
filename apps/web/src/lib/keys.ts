"use client";

import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { network } from "./network";
import { unlockVault, type VaultRecord } from "./vault";

export async function pairFrom(phrase: string): Promise<KeyringPair> {
  await cryptoWaitReady();
  return new Keyring({ type: "sr25519", ss58Format: network.ss58 }).addFromMnemonic(phrase);
}

/** Unlock the device key with the passkey, run `fn`, and lock it again whatever happens. */
export async function withUnlockedPair<T>(vault: VaultRecord, fn: (pair: KeyringPair) => Promise<T>): Promise<T> {
  const pair = await pairFrom(await unlockVault(vault));
  try {
    if (pair.address !== vault.address) throw new Error("Unlocked key does not match this wallet");
    return await fn(pair);
  } finally {
    pair.lock();
  }
}
