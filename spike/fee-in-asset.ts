/**
 * Go/no-go spike for StableTap.
 *
 * Question: can a customer who holds only pUSD (plus the one-time 0.1 tPOT
 * existential deposit) pay a merchant and have the network fee taken in pUSD,
 * leaving their tPOT untouched?
 *
 * Runs against a local Chopsticks fork (ws://localhost:8000) by default, so it
 * needs no real tPOT. Uses @polkadot/api here because Chopsticks serves the
 * legacy author_* RPCs reliably; app code targets the real node.
 *
 *   pnpm fork   # terminal 1
 *   pnpm fee    # terminal 2
 */
import { ApiPromise, WsProvider } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const WS = process.env.PORTALDOT_WS ?? "ws://localhost:8000";
const PUSD_ID = 7779; // fork-only id; 7777 is the live pUSD and 7778 is used by the engine fork setup
const PUSD = 1_000_000n; // 6 decimals
const TPOT = 100_000_000_000_000n; // 14 decimals
const PRICE = 4_500_000n; // 4.50 pUSD

const fmt = (v: bigint, d: bigint) => (Number(v) / Number(d)).toFixed(6);
const pusdKind = { WithId: PUSD_ID };

type Result = { hash: string; block: string; events: { section: string; method: string; data: unknown }[] };

/** Sign, submit, resolve once in a block; reject on dispatch error. */
function submit(api: ApiPromise, tx: SubmittableExtrinsic<"promise">, signer: KeyringPair, opts: object = {}): Promise<Result> {
  return new Promise((resolve, reject) => {
    tx.signAndSend(signer, opts, ({ status, events, dispatchError, txHash }) => {
      if (!status.isInBlock) return;
      if (dispatchError) {
        const msg = dispatchError.isModule
          ? (({ section, name }) => `${section}.${name}`)(api.registry.findMetaError(dispatchError.asModule))
          : dispatchError.toString();
        return reject(new Error(msg));
      }
      resolve({
        hash: txHash.toHex(),
        block: status.asInBlock.toHex(),
        events: events.map(({ event }) => ({ section: event.section, method: event.method, data: event.data.toJSON() })),
      });
    }).catch(reject);
  });
}

function report(label: string, r: Result) {
  console.log(`\n[${label}] tx=${r.hash} block=${r.block}`);
  for (const e of r.events) console.log(`  ${e.section}.${e.method}`);
}

async function main() {
  await cryptoWaitReady();
  const kr = new Keyring({ type: "sr25519", ss58Format: 42 });
  const alice = kr.addFromUri("//Alice"); // issuer + liquidity provider
  const bob = kr.addFromUri("//Bob"); // customer: holds only the ED in tPOT
  const charlie = kr.addFromUri("//Charlie"); // merchant

  // Tell polkadot.js the exact on-chain shape of the fee extension (asset kind is NativeOrWithId<u32>).
  const api = await ApiPromise.create({
    provider: new WsProvider(WS),
    noInitWarn: true,
    signedExtensions: {
      ChargeAssetTxPayment: {
        extrinsic: { tip: "Compact<Balance>", assetId: "Option<FrameSupportTokensFungibleUnionOfNativeOrWithId>" },
        payload: {},
      },
    },
  });
  console.log(`connected ${WS} spec=${api.runtimeVersion.specName}/${api.runtimeVersion.specVersion}`);

  const balances = async (who: string) => {
    const [acct, asset] = await Promise.all([api.query.system.account(who), api.query.assets.account(PUSD_ID, who)]);
    return { tpot: (acct as any).data.free.toBigInt() as bigint, pusd: (asset as any).isSome ? ((asset as any).unwrap().balance.toBigInt() as bigint) : 0n };
  };

  // Setup (once): issue pUSD, fund the customer, create a pUSD/tPOT pool with liquidity.
  if ((await api.query.assets.asset(PUSD_ID) as any).isNone) {
    const r = await submit(api, api.tx.utility.batchAll([
      api.tx.assets.create(PUSD_ID, alice.address, 10_000n),
      api.tx.assets.setMetadata(PUSD_ID, "Portaldot USD (test)", "pUSD", 6),
      api.tx.assets.mint(PUSD_ID, alice.address, 10_000n * PUSD),
      api.tx.assets.mint(PUSD_ID, bob.address, 20n * PUSD),
      api.tx.assetConversion.createPool({ Native: null }, pusdKind),
      // 100 tPOT : 1,000 pUSD  => 1 tPOT = 10 pUSD
      api.tx.assetConversion.addLiquidity({ Native: null }, pusdKind, 100n * TPOT, 1_000n * PUSD, 0, 0, alice.address),
    ]), alice);
    report("setup: create pUSD + pool + liquidity", r);
  } else console.log("pUSD already set up, skipping");

  const checkout = (invoiceId: string) => api.tx.utility.batchAll([
    api.tx.assets.transferKeepAlive(PUSD_ID, charlie.address, PRICE),
    api.tx.system.remarkWithEvent(`stabletap:${invoiceId}`),
  ]);

  const before = { bob: await balances(bob.address), charlie: await balances(charlie.address) };
  console.log("\nbefore", { customer: { tPOT: fmt(before.bob.tpot, TPOT), pUSD: fmt(before.bob.pusd, PUSD) }, merchant_pUSD: fmt(before.charlie.pusd, PUSD) });

  // 1. Contrast: same checkout, fee in native tPOT. Should be refused (customer only holds the ED).
  try {
    await submit(api, checkout("contrast-1"), bob);
    console.log("\n[contrast] UNEXPECTED: native-fee payment went through");
  } catch (e) {
    console.log(`\n[contrast] native-fee payment refused as expected: ${(e as Error).message.slice(0, 160)}`);
  }

  // 2. Hero: same checkout, fee paid in pUSD through the pool.
  try {
    const info = await checkout("inv-0001").paymentInfo(bob.address, { assetId: pusdKind } as any);
    console.log(`\nfee quote: ${fmt(info.partialFee.toBigInt(), TPOT)} tPOT-equivalent`);
  } catch (e) {
    console.log(`\nfee quote unavailable: ${(e as Error).message.slice(0, 120)}`);
  }
  // Chopsticks' own submitAndWatch decoder assumes the Asset Hub fee-extension
  // shape, so sign locally and submit the raw bytes, then read the next block.
  const hero = await checkout("inv-0001").signAsync(bob, { assetId: pusdKind });
  const head0 = (await api.rpc.chain.getHeader()).number.toNumber();
  const hash = await api.rpc.author.submitExtrinsic(hero.toHex());
  let blockHash = (await api.rpc.chain.getBlockHash()).toHex();
  for (let i = 0; i < 60 && (await api.rpc.chain.getHeader()).number.toNumber() <= head0; i++) await new Promise((s) => setTimeout(s, 2000));
  blockHash = (await api.rpc.chain.getBlockHash()).toHex();
  const block = await api.rpc.chain.getBlock(blockHash);
  const idx = block.block.extrinsics.findIndex((x) => x.hash.toHex() === hash.toHex());
  if (idx < 0) throw new Error("hero tx not found in the next block");
  const evs = (await (await api.at(blockHash)).query.system.events()) as any;
  const r: Result = {
    hash: hash.toHex(),
    block: blockHash,
    events: evs.filter((e: any) => e.phase.isApplyExtrinsic && e.phase.asApplyExtrinsic.toNumber() === idx)
      .map(({ event }: any) => ({ section: event.section, method: event.method, data: event.data.toJSON() })),
  };
  report("hero: pay 4.50 pUSD, fee in pUSD", r);
  const failed = r.events.find((e) => e.method === "ExtrinsicFailed");
  if (failed) console.log("hero dispatch failed:", JSON.stringify(failed.data));

  const fee = r.events.find((e) => e.method === "AssetTxFeePaid");
  const after = { bob: await balances(bob.address), charlie: await balances(charlie.address) };
  console.log("\nafter", { customer: { tPOT: fmt(after.bob.tpot, TPOT), pUSD: fmt(after.bob.pusd, PUSD) }, merchant_pUSD: fmt(after.charlie.pusd, PUSD) });

  const go = !!fee && before.bob.tpot === after.bob.tpot && after.charlie.pusd - before.charlie.pusd === PRICE;
  console.log("\nVERDICT", {
    feeEvent: fee?.data ?? null,
    tPotSpentByCustomer: fmt(before.bob.tpot - after.bob.tpot, TPOT),
    merchantReceived_pUSD: fmt(after.charlie.pusd - before.charlie.pusd, PUSD),
    customerPaidTotal_pUSD: fmt(before.bob.pusd - after.bob.pusd, PUSD),
  });
  console.log(go ? "\nGO: fee paid in pUSD, customer tPOT untouched" : "\nNO-GO: check output above");
  await api.disconnect();
  process.exit(go ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
