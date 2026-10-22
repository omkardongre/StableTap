// Create the stablecoin and its fee pool on a network, then verify it is usable.
//   node --env-file=<file> scripts/setup-stablecoin.ts [--dry-run] [--evidence <path>]
// Secrets come only from the env file (ISSUER_SURI); nothing secret is printed or written.
import { writeFileSync } from "node:fs";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import {
  assertNetwork, connect, formatAmount, loadNetwork, parseAmount, planStablecoin, setupStablecoin, type StablecoinPlan,
} from "../src/index.ts";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const evidenceAt = args.indexOf("--evidence");
const evidencePath = evidenceAt >= 0 ? args[evidenceAt + 1] : undefined;
if (evidenceAt >= 0 && !evidencePath) throw new Error("--evidence needs a path");

const env = (key: string) => {
  const v = process.env[key]?.trim();
  if (!v) throw new Error(`Missing ${key}`);
  return v;
};

await cryptoWaitReady();
const net = loadNetwork(process.env);
const api = await connect(net);
try {
  const nativeDecimals = api.registry.chainDecimals[0]!;
  const issuer = new Keyring({ type: "sr25519", ss58Format: net.ss58 }).addFromUri(env("ISSUER_SURI"));
  const plan: StablecoinPlan = {
    name: env("SETUP_ASSET_NAME"),
    symbol: env("SETUP_ASSET_SYMBOL"),
    minBalance: parseAmount(env("SETUP_MIN_BALANCE"), net.decimals),
    mint: parseAmount(env("SETUP_MINT"), net.decimals),
    poolNative: parseAmount(env("SETUP_POOL_NATIVE"), nativeDecimals),
    poolStable: parseAmount(env("SETUP_POOL_STABLE"), net.decimals),
  };
  const { data } = await api.query.system.account(issuer.address);
  console.log(`network ${net.ws} | asset ${net.assetId} | issuer ${issuer.address} | free ${formatAmount(data.free.toBigInt(), nativeDecimals)}`);

  if (dryRun) {
    const { steps, calls } = await planStablecoin(api, net, issuer.address, plan);
    steps.forEach((s) => console.log(`plan: ${s.call} ${s.detail}`));
    if (calls.length) {
      const info = await api.tx.utility.batchAll(calls).paymentInfo(issuer.address);
      console.log(`estimated fee ${formatAmount(info.partialFee.toBigInt(), nativeDecimals)} (deposits and pool setup fee are extra)`);
    } else console.log("nothing to do");
  } else {
    const { steps, tx } = await setupStablecoin(api, net, issuer, plan);
    steps.forEach((s) => console.log(`done: ${s.call} ${s.detail}`));
    if (tx) console.log(`tx ${tx.txHash} in finalized block #${tx.blockNumber} (${tx.blockHash})`);
    else console.log("already set up, nothing submitted");

    await assertNetwork(api, net);
    const reserves = (await api.call.assetConversionApi.getReserves({ Native: null }, { WithId: net.assetId })).unwrap();
    const [rNative, rStable] = reserves.map((r) => r.toBigInt()) as [bigint, bigint];
    console.log(`verified: pool ${formatAmount(rNative, nativeDecimals)} native : ${formatAmount(rStable, net.decimals)} stable`);

    if (evidencePath) {
      const evidence = {
        network: net.ws,
        genesisHash: api.genesisHash.toHex(),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        assetId: net.assetId,
        decimals: net.decimals,
        symbol: plan.symbol,
        issuer: issuer.address,
        setupTx: tx ? { hash: tx.txHash, block: tx.blockNumber, blockHash: tx.blockHash, calls: steps.map((s) => s.call) } : null,
        poolReserves: { native: rNative.toString(), stable: rStable.toString() },
        verifiedAt: new Date().toISOString(),
      };
      writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
      console.log(`evidence written to ${evidencePath}`);
    }
  }
} finally {
  await api.disconnect();
}
