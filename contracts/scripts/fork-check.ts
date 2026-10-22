// Prove PotCheckout against Portaldot's real runtime and Assets precompile on a local Chopsticks fork.
// Deploys through `revive.instantiateWithCode` (Substrate-signed, so no EVM gas key is needed) and runs:
// approve → pay → replay rejected; approve → hold $50 → capture $42 ($8 back); merchant refund.
//   node --env-file=../packages/engine/test/fork.env scripts/fork-check.ts
import { readFileSync } from "node:fs";
import type { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { connect, describeDispatchError, getBalances, loadNetwork, submitFinalized } from "@stabletap/engine";
import type { DispatchError } from "@polkadot/types/interfaces";
import { decodeErrorResult, encodeAbiParameters, encodeFunctionData, getAddress, keccak256, stringToHex, type Abi, type Hex } from "viem";

const art = JSON.parse(readFileSync(new URL("../artifacts/contracts/PotCheckout.sol/PotCheckout.json", import.meta.url), "utf8")) as { abi: Abi; bytecode: Hex };
const tokenAbi = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "s", type: "address" }, { name: "v", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;
const assetPrecompile = (id: number) => getAddress(`0x${id.toString(16).padStart(8, "0")}${"0".repeat(24)}00010000`);
const usd = (n: number) => BigInt(Math.round(n * 1e6));

await cryptoWaitReady();
const net = loadNetwork(process.env);
const api = await connect(net);
const kr = new Keyring({ type: "sr25519", ss58Format: net.ss58 });
const [alice, bob, charlie] = ["//Alice", "//Bob", "//Charlie"].map((u) => kr.addFromUri(u)) as [KeyringPair, KeyringPair, KeyringPair];
const pusd = assetPrecompile(net.assetId);
const h160 = async (who: KeyringPair) => getAddress((await api.call.reviveApi.address(who.address)).toHex());

async function send(api: ApiPromise, who: KeyringPair, tx: Parameters<typeof submitFinalized>[1] extends infer T ? T : never, what: string) {
  const done = await submitFinalized(api, await tx.signAsync(who));
  console.log(`${what}: ${done.txHash} #${done.blockNumber}`);
  return done;
}

const deposits: { what: string; tpot: number; refund: number }[] = [];

/** Dry-run first (exact weight and deposit, and a readable revert), then submit. */
async function call(who: KeyringPair, dest: Hex, data: Hex, what: string, expectRevert?: string) {
  const dry = await api.call.reviveApi.call(who.address, dest, 0, null, null, data);
  const res = dry.result;
  if (res.isErr) throw new Error(`${what}: ${describeDispatchError(api, res.asErr as unknown as DispatchError)}`);
  const ok = res.asOk;
  // ReturnFlags bit 0 = REVERT
  if ((ok.flags.bits.toNumber() & 1) === 1) {
    const raw = ok.data.toHex();
    // Empty revert data comes from the token precompile (e.g. missing allowance), not from PotCheckout.
    const err = raw === "0x" ? { errorName: "EmptyRevert" } : decodeErrorResult({ abi: art.abi, data: raw });
    if (expectRevert && err.errorName === expectRevert) return console.log(`${what}: reverted with ${err.errorName} (expected)`);
    throw new Error(`${what}: reverted with ${err.errorName}`);
  }
  if (expectRevert) throw new Error(`${what}: expected ${expectRevert}, but it succeeded`);
  const deposit = dry.storageDeposit.isCharge ? dry.storageDeposit.asCharge.toBigInt() : 0n;
  const done = await send(api, who, api.tx.revive.call(dest, 0, dry.weightRequired, deposit, data), what);
  deposits.push({ what, tpot: Number(deposit) / 1e14, refund: dry.storageDeposit.isRefund ? Number(dry.storageDeposit.asRefund.toBigInt()) / 1e14 : 0 });
  return done;
}

try {
  // Mapping an account reserves a small native deposit; the fork's Bob and Charlie start with only the existential deposit.
  // Each new contract storage slot reserves a native deposit from the caller, so the payer needs some tPOT here.
  const TPOT = 10n ** 14n;
  const topUp = async (who: KeyringPair, want: bigint) => {
    const have = (await api.query.system.account(who.address)).data.free.toBigInt();
    return have >= want ? [] : [api.tx.balances.transferKeepAlive(who.address, want - have)];
  };
  const native = [...(await topUp(bob, 30n * TPOT)), ...(await topUp(charlie, 5n * TPOT))];
  if (native.length) await send(api, alice, api.tx.utility.batchAll(native), "top up tPOT for mapping, deposits and fees");
  for (const who of [alice, bob, charlie]) {
    const addr = await h160(who);
    if ((await api.query.revive.originalAccount(addr)).isSome) continue;
    await send(api, who, api.tx.revive.mapAccount(), `map ${who.address.slice(0, 6)}`);
    if ((await api.query.revive.originalAccount(addr)).isNone) {
      // Fork-only: on Chopsticks `mapAccount` succeeds but its write doesn't persist, so set the
      // mapping directly. On the live chain the call (or EVM auto-mapping) does this.
      await api.rpc("dev_setStorage" as never, { Revive: { OriginalAccount: [[[addr], who.address]] } } as never);
      await api.rpc("dev_newBlock" as never);
      if ((await api.query.revive.originalAccount(addr)).isNone) throw new Error(`could not map ${who.address}`);
      console.log(`map ${who.address.slice(0, 6)}: set through dev_setStorage (fork only)`);
    }
  }
  // Customer (Bob) needs pUSD; merchant (Charlie) a little for the refund.
  const stableTopUp = async (who: KeyringPair, want: bigint) => {
    const have = (await getBalances(api, net, who.address)).stable;
    return have >= want ? [] : [api.tx.assets.transferKeepAlive(net.assetId, who.address, want - have)];
  };
  const stable = [...(await stableTopUp(bob, usd(60))), ...(await stableTopUp(charlie, usd(5)))];
  if (stable.length) await send(api, alice, api.tx.utility.batchAll(stable), "top up pUSD");

  const code = (art.bytecode + encodeAbiParameters([{ type: "address" }], [pusd]).slice(2)) as Hex;
  const dry = await api.call.reviveApi.instantiate(alice.address, 0, null, null, { Upload: code }, "0x", null);
  if (dry.result.isErr) throw new Error(`instantiate dry-run: ${describeDispatchError(api, dry.result.asErr as unknown as DispatchError)}`);
  if ((dry.result.asOk.result.flags.bits.toNumber() & 1) === 1) throw new Error("constructor reverted");
  const deposit = dry.storageDeposit.asCharge.toBigInt();
  console.log(`deploy: code ${(code.length - 2) / 2} bytes, storage deposit ${Number(deposit) / 1e14} tPOT`);
  await send(api, alice, api.tx.revive.instantiateWithCode(0, dry.weightRequired, deposit, code, "0x", null), "instantiateWithCode");
  const checkout = getAddress(dry.result.asOk.addr.toHex());
  console.log(`PotCheckout at ${checkout} (token ${pusd})`);

  const [shop] = [await h160(charlie)];
  const run = Date.now().toString();
  const now = Math.floor(Date.now() / 1000);
  const fn = (functionName: string, args: readonly unknown[]) => encodeFunctionData({ abi: art.abi, functionName, args });
  const approve = (v: bigint) => encodeFunctionData({ abi: tokenAbi, functionName: "approve", args: [checkout, v] });

  // 1. pay + replay guard
  const payId = keccak256(stringToHex(`inv-${run}`));
  const before = { bob: await getBalances(api, net, bob.address), charlie: await getBalances(api, net, charlie.address) };
  await call(bob, pusd, approve(usd(54.5)), "customer approve $54.50");
  await call(bob, checkout, fn("pay", [shop, payId, usd(4.5), BigInt(now + 600)]), "pay $4.50");
  await call(bob, checkout, fn("pay", [shop, payId, usd(4.5), BigInt(now + 600)]), "replay", "InvoiceAlreadyUsed");
  const afterPay = await getBalances(api, net, charlie.address);
  if (afterPay.stable - before.charlie.stable !== usd(4.5)) throw new Error("merchant did not receive $4.50");

  // 2. hold $50 → capture $42 → $8 back
  const holdId = keccak256(stringToHex(`bike-${run}`));
  await call(bob, checkout, fn("hold", [shop, holdId, usd(50), BigInt(now + 3600)]), "hold $50");
  const bobHeld = (await getBalances(api, net, bob.address)).stable;
  // From any address but the merchant's, the key points at nothing.
  await call(bob, checkout, fn("capture", [holdId, usd(42)]), "capture by non-merchant", "WrongStatus");
  await call(charlie, checkout, fn("capture", [holdId, usd(42)]), "capture $42");
  const bobAfter = (await getBalances(api, net, bob.address)).stable;
  if (bobAfter - bobHeld !== usd(8)) throw new Error(`customer got ${bobAfter - bobHeld} back, expected $8`);

  // 3. refund $2 of the payment
  await call(charlie, pusd, approve(usd(2)), "merchant approve $2");
  await call(charlie, checkout, fn("refund", [payId, usd(5)]), "refund over the paid amount", "BadAmount");
  await call(charlie, checkout, fn("refund", [payId, usd(2)]), "refund $2");

  const after = { bob: await getBalances(api, net, bob.address), charlie: await getBalances(api, net, charlie.address) };
  const delta = (a: bigint, b: bigint) => Number(a - b) / 1e6;
  console.log(`customer pUSD ${delta(after.bob.stable, before.bob.stable)} (expected -44.5: paid 4.50 + captured 42 − refund 2), merchant pUSD +${delta(after.charlie.stable, before.charlie.stable)} (expected +44.5)`);
  if (after.bob.stable - before.bob.stable !== -usd(44.5) || after.charlie.stable - before.charlie.stable !== usd(44.5)) throw new Error("final balances are off");
  console.table(deposits);
  console.log("OK: PotCheckout works against the Portaldot runtime and its pUSD precompile");
} finally {
  await api.disconnect();
}
