import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { KeyringPair } from "@polkadot/keyring/types";
import { getBalances } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { submitFinalized, type Finalized } from "./submit.ts";

/**
 * Give a brand-new account what it needs to pay: exactly the native
 * existential deposit (so the account can exist) plus `amount` of the
 * stablecoin, or of `assetId` when given (e.g. a community token to pay with).
 * Refuses accounts that already hold anything, so a wallet is funded once.
 * The faucet pays its own fee in the native token.
 */
export async function fundNewAccount(
  api: ApiPromise,
  net: NetworkConfig,
  faucet: KeyringPair,
  to: string,
  amount: bigint,
  assetId: number = net.assetId,
): Promise<Finalized> {
  if (amount <= 0n) throw new Error("Faucet amount must be positive");
  const current = await getBalances(api, net, to);
  if (current.native > 0n || current.stable > 0n) throw new AlreadyFundedError();
  const ed = api.consts.balances.existentialDeposit.toBigInt();
  const tx = await api.tx.utility
    .batchAll([api.tx.balances.transferKeepAlive(to, ed), api.tx.assets.transferKeepAlive(assetId, to, amount)])
    .signAsync(faucet);
  return submitFinalized(api, tx);
}

/**
 * Open a brand-new receive-only account (e.g. a shop wallet): exactly the native
 * existential deposit and nothing else, so it can receive the stablecoin but starts at $0.
 */
export async function openAccount(api: ApiPromise, net: NetworkConfig, faucet: KeyringPair, to: string): Promise<Finalized> {
  const current = await getBalances(api, net, to);
  if (current.native > 0n || current.stable > 0n) throw new AlreadyFundedError();
  const ed = api.consts.balances.existentialDeposit.toBigInt();
  return submitFinalized(api, await api.tx.balances.transferKeepAlive(to, ed).signAsync(faucet));
}

export class AlreadyFundedError extends Error {
  constructor() {
    super("This account is already funded");
    this.name = "AlreadyFundedError";
  }
}
