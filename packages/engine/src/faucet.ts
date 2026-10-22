import type {} from "./augment.ts";
import type { ApiPromise } from "@polkadot/api";
import type { KeyringPair } from "@polkadot/keyring/types";
import { getBalances } from "./chain.ts";
import type { NetworkConfig } from "./config.ts";
import { submitFinalized, type Finalized } from "./submit.ts";

/**
 * Give a brand-new account what it needs to use the stablecoin: exactly the
 * native existential deposit (so the account can exist) plus `stableAmount`.
 * Refuses accounts that already hold anything, so a wallet is funded once.
 * The faucet pays its own fee in the native token.
 */
export async function fundNewAccount(
  api: ApiPromise,
  net: NetworkConfig,
  faucet: KeyringPair,
  to: string,
  stableAmount: bigint,
): Promise<Finalized> {
  if (stableAmount <= 0n) throw new Error("Faucet amount must be positive");
  const current = await getBalances(api, net, to);
  if (current.native > 0n || current.stable > 0n) throw new AlreadyFundedError();
  const ed = api.consts.balances.existentialDeposit.toBigInt();
  const tx = await api.tx.utility
    .batchAll([api.tx.balances.transferKeepAlive(to, ed), api.tx.assets.transferKeepAlive(net.assetId, to, stableAmount)])
    .signAsync(faucet);
  return submitFinalized(api, tx);
}

export class AlreadyFundedError extends Error {
  constructor() {
    super("This account is already funded");
    this.name = "AlreadyFundedError";
  }
}
