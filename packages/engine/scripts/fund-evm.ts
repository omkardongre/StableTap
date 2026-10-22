// Fund an Ethereum (H160) account on Portaldot from the issuer: tPOT for EVM gas and optionally pUSD.
//   node --env-file=.env.setup scripts/fund-evm.ts --to 0x… --native 5 [--stable 60]
// pallet-revive maps an H160 to the AccountId32 `h160 ++ 0xEE × 12`; funds sent there are what
// MetaMask sees. Secrets come only from the env file (ISSUER_SURI).
import { Keyring } from "@polkadot/keyring";
import { hexToU8a, isHex, u8aConcat } from "@polkadot/util";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { connect, formatAmount, getBalances, loadNetwork, parseAmount, submitFinalized } from "../src/index.ts";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : args[i + 1];
};
const to = opt("--to");
if (!to || !isHex(to, 160)) throw new Error("--to must be a 20-byte 0x address");
const suri = process.env.ISSUER_SURI?.trim();
if (!suri) throw new Error("Missing ISSUER_SURI");

await cryptoWaitReady();
const net = loadNetwork(process.env);
const api = await connect(net);
try {
  const nativeDecimals = api.registry.chainDecimals[0]!;
  const native = parseAmount(opt("--native") ?? "0", nativeDecimals);
  const stable = parseAmount(opt("--stable") ?? "0", net.decimals);
  if (native === 0n && stable === 0n) throw new Error("Nothing to send: set --native and/or --stable");
  const mapped = encodeAddress(u8aConcat(hexToU8a(to), new Uint8Array(12).fill(0xee)), net.ss58);
  // Confirm the mapping with the runtime itself before sending anything.
  const back = (await api.call.reviveApi.address(mapped)).toHex();
  if (back.toLowerCase() !== to.toLowerCase()) throw new Error(`Runtime maps ${mapped} to ${back}, not ${to}`);
  const issuer = new Keyring({ type: "sr25519", ss58Format: net.ss58 }).addFromUri(suri);
  const calls = [
    ...(native > 0n ? [api.tx.balances.transferKeepAlive(mapped, native)] : []),
    ...(stable > 0n ? [api.tx.assets.transferKeepAlive(net.assetId, mapped, stable)] : []),
  ];
  const done = await submitFinalized(api, await api.tx.utility.batchAll(calls).signAsync(issuer));
  const b = await getBalances(api, net, mapped, done.blockHash);
  console.log(`${to} (${mapped}) now holds ${formatAmount(b.native, nativeDecimals)} tPOT, ${formatAmount(b.stable, net.decimals)} stable | tx ${done.txHash} #${done.blockNumber}`);
} finally {
  await api.disconnect();
}
