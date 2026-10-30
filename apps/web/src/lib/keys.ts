"use client";

import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady, mnemonicValidate } from "@polkadot/util-crypto";
import { network } from "./network";
import { createPasskeyVault, createVault, signInWithPasskey, unlockVault, type VaultKind, type VaultRecord } from "./vault";

export async function pairFrom(phrase: string): Promise<KeyringPair> {
  await cryptoWaitReady();
  return new Keyring({ type: "sr25519", ss58Format: network.ss58 }).addFromMnemonic(phrase);
}

/** The chain address of a recovery phrase; the key is locked again right away. */
export async function addressOf(phrase: string): Promise<string> {
  const pair = await pairFrom(phrase);
  const address = pair.address;
  pair.lock();
  return address;
}

/** New wallet or shop: a passkey on this phone, which rebuilds the key on any phone that has it. */
export const createWallet = (kind: VaultKind, label?: string) => createPasskeyVault(kind, addressOf, label);

/** Existing wallet or shop, from its passkey. */
export const signIn = (kind: VaultKind) => signInWithPasskey(kind, addressOf);

/** Existing wallet or shop, from its 12-word recovery phrase; a new passkey locks it on this phone. */
export async function restoreFromPhrase(kind: VaultKind, phrase: string, label?: string): Promise<VaultRecord> {
  const words = phrase.trim().toLowerCase().split(/\s+/).join(" ");
  await cryptoWaitReady();
  if (!mnemonicValidate(words)) throw new Error("Those words aren't a valid recovery phrase. Check each word and the order.");
  return createVault(words, await addressOf(words), kind, label);
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
