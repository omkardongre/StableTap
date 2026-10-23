# StableTap

Pay in dollars on Portaldot V3 without spending the network token. The fee is paid in the stablecoin too.

## Current state

- Workspace setup (pnpm monorepo, Node 24)
- `spike/`: proof that a payment's fee can be paid in a stablecoin on the Portaldot V3 runtime, on a local fork
- `packages/engine/`: shared payment logic (invoice link with expiry and optional platform split, pay and refund with fee in pUSD, block decoder, paid-watcher, faucet funding, pUSD + pool setup)
- `apps/web/`: customer wallet (`/wallet`), merchant POS (`/pos`), merchant dashboard (`/dashboard`) and public stats (`/stats`), Next.js 16
- `apps/indexer/`: indexes StableTap payments and refunds from finalized blocks into SQLite, serves history and stats, delivers signed webhooks
- `contracts/`: `PotCheckout.sol` (Hardhat 3): invoice registry with replay guard, hold/capture, refunds, EIP-2612 permit, for pUSD through Portaldot's ERC-20 asset precompile
- `packages/sdk/`: `@stabletap/sdk`, the engine as a publishable ESM package plus a React `<PayButton/>` (`apps/web` `/partner` uses it like a third-party app)

## Requirements

- Node 24 (`nvm use`)
- pnpm 10.24

## Run the fee-in-pUSD spike

Runs on a local [Chopsticks](https://github.com/AcalaNetwork/chopsticks) fork of the V3 testnet. No tokens needed; dev accounts are funded through storage overrides.

```bash
pnpm install
pnpm spike:fork   # terminal 1: wait for "RPC listening on ... 8000"
pnpm spike:fee    # terminal 2
```

Expected: the native-fee payment is refused, then the same payment with the fee in pUSD succeeds with an `AssetTxFeePaid` event and the customer's tPOT unchanged.

## Engine tests

```bash
pnpm --filter @stabletap/engine typecheck
pnpm --filter @stabletap/engine test        # unit
pnpm --filter @stabletap/engine test:fork   # needs the fork running and `setup:fork` run once
```

The engine reads `STABLETAP_WS`, `STABLETAP_ASSET_ID` and `STABLETAP_ASSET_DECIMALS`; there are no defaults. Fork values are in `packages/engine/test/fork.env`.

Chain types in `packages/engine/src/interfaces/` are generated from the live runtime: `pnpm --filter @stabletap/engine typegen`.

## Create pUSD and its fee pool

`scripts/setup-stablecoin.ts` creates the asset (metadata + mint), the tPOT/pUSD pool and its first liquidity in one atomic batch. It is idempotent: whatever already exists is checked (owner, decimals) and skipped, and a pool that already has liquidity is never touched. It then verifies the network the same way the apps do.

```bash
# local fork
pnpm --filter @stabletap/engine setup:fork

# a real network: copy packages/engine/setup.env.example to packages/engine/.env.setup (git-ignored), fill in ISSUER_SURI
pnpm --filter @stabletap/engine setup:stablecoin --dry-run
pnpm --filter @stabletap/engine setup:stablecoin --evidence ../../evidence/testnet-setup.json
```

The pool ratio sets the fee price. With the example plan (150 tPOT : 150 pUSD) a payment's fee is about 0.018 pUSD.

## Web app (wallet + POS)

The wallet key is locked by a device passkey (WebAuthn PRF). It needs a browser with passkey PRF support (Chrome on Android, Safari 18+ on iOS, recent desktop Chrome) and HTTPS or `localhost`.

On the local fork (fork running, `pnpm --filter @stabletap/engine setup:fork` run once, indexer running for the dashboard and stats):

```bash
pnpm --filter @stabletap/web dev:fork      # http://localhost:3000
```

Against another network, copy `apps/web/.env.example` to `apps/web/.env.local` and fill it in, then `pnpm --filter @stabletap/web build && pnpm --filter @stabletap/web start`.

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_STABLETAP_WS` | browser + server | Substrate node websocket |
| `NEXT_PUBLIC_STABLETAP_ASSET_ID` | browser + server | pUSD asset id |
| `NEXT_PUBLIC_STABLETAP_ASSET_DECIMALS` | browser + server | pUSD decimals (checked on chain) |
| `FAUCET_SURI` | server only, secret | funded account for `POST /api/faucet` |
| `FAUCET_STABLE_AMOUNT` | server only | test pUSD per new wallet |
| `NEXT_PUBLIC_STABLETAP_INDEXER` | browser, optional | indexer API for `/dashboard`, `/stats`, webhooks (added to CSP `connect-src`) |
| `NEXT_PUBLIC_STABLETAP_EXPLORER` | browser, optional | explorer base URL for tx links (`#/extrinsics/<block>-<index>`) |
| `NEXT_PUBLIC_STABLETAP_PLATFORM_ADDRESS` / `_BPS` | browser, optional, both or neither | platform share split off every POS invoice (max 1000 bps) |
| `NEXT_PUBLIC_STABLETAP_PAY_ASSETS` | browser, optional | other asset ids a customer may pay with (each needs a pool against tPOT) |
| `FAUCET_ALT_ASSET_ID` / `FAUCET_ALT_AMOUNT` | server only, optional | faucet hands out this asset instead of pUSD |
| `NEXT_PUBLIC_STABLETAP_EVM_RPC` / `_EVM_CHAIN_ID` / `_CHECKOUT_ADDRESS` / `_CHECKOUT_FROM_BLOCK` | browser, optional, all or none | MetaMask checkout through `PotCheckout` (RPC added to CSP `connect-src`) |

POS invoices expire 5 minutes after creation, measured in chain time. The wallet refuses expired invoices and invoices it has already paid; the POS keeps watching for 60 s after expiry in case a payment was already sent.

The build fails if the network variables are missing or malformed. The faucet is a public endpoint: it funds only accounts that hold nothing, with a per-client cooldown; add your host's rate limiting in front of it.

Checks:

```bash
pnpm --filter @stabletap/web typecheck
pnpm --filter @stabletap/web test
```

Pay with any token: with `NEXT_PUBLIC_STABLETAP_PAY_ASSETS` set, a customer short of pUSD can pay with another asset that has a pool against tPOT. One extrinsic swaps it for exactly the invoice amount of pUSD (`assetConversion.swapTokensForExactTokens`, route token → tPOT → pUSD, capped at quote + 1%), forwards the shares and adds the memo; the fee is paid in that token. The merchant, watcher and indexer see an ordinary pUSD payment.

Split payments: with a platform share set, the customer still pays the invoice amount. One extrinsic sends the merchant `amount − share` and the platform `share` (rounded down). The platform account must already exist on chain and hold at least the asset's minimum balance, like any receiver of a non-sufficient asset.

Tap to pay (needs the indexer): in POS settings, "Set up tap to pay" registers the POS as a terminal and shows its fixed link `/tap/<id>`. Write it once to an NFC sticker (the POS writes it with Web NFC in Chrome on Android, or use any NFC app) or print it as a QR. Phones open a URL tag natively, so the customer needs no app. While a sale runs, the POS publishes its payment link for that terminal; the tag page opens it in the wallet, which checks it like a scanned QR. A terminal only accepts links that pay its own merchant and expire within 15 minutes; its write token stays on the POS (only a SHA-256 hash is stored), and a charge is dropped once it is paid on chain or expires.

Fee contrast: before paying, the wallet shows what the same payment would need with the usual tPOT fee (`nativeFeeCheck`). A wallet holding only the deposit can spend 0 tPOT, so that path would fail; the node rejects it with `1010 Inability to pay some fees` (checked in the fork test).

Pool gauge: when a customer pays with another token, the wallet shows the live reserves of the pools the swap goes through, read at every finalized block, with the change since the confirm screen opened.

MetaMask checkout (`/checkout`, needs the `NEXT_PUBLIC_STABLETAP_EVM_*` and checkout variables): finds browser wallets with EIP-6963, adds or switches to the Portaldot EVM chain, and pays or holds pUSD in `PotCheckout` with one EIP-2612 permit signature plus one transaction. The shop side lists holds and payments from the contract's events and can capture (the rest returns to the payer), release a hold, or refund. Each write is simulated first, so contract errors (replay, expiry, amount) are shown before the wallet prompt.

Dashboard (`/dashboard`): uses this device's wallet as the shop's payout account. It lists invoices matched by memo (merchant share, platform share, fee in pUSD, refunds), shows today's takings, refunds a payment (full or partial, up to what's left) with a passkey-signed refund that also pays its fee in pUSD, and registers a webhook. "Team wallet" sends takings to a pallet-multisig account (e.g. 2 of 3); the address is derived from the signatories and threshold, and a new team account is activated once through the faucet.

## SDK and Pay button

```bash
pnpm --filter @stabletap/sdk build            # tsdown: ESM + bundled .d.ts in packages/sdk/dist
pnpm --filter @stabletap/sdk test             # builds, then tests the built output
pnpm --filter @stabletap/sdk check:package    # publint + are-the-types-wrong
```

The engine is bundled into the SDK; polkadot.js and React stay as dependencies/peers. See [packages/sdk/README.md](packages/sdk/README.md). The web app's `/partner` page is a stand-in partner app whose checkout is only the SDK's `PayButton`.

## Contract (MetaMask path)

`contracts/contracts/PotCheckout.sol` takes pUSD through Portaldot's Assets ERC-20 precompile. On V3 the precompile address is the asset id in the first 4 bytes and `0x0001` in bytes 16-17: pUSD (7777) is `0x00001E6100000000000000000000000000010000`. It also exposes `name`/`symbol`/`decimals` and EIP-2612 `permit`, so a wallet signs once and sends one transaction.

- `pay` / `permitAndPay`: one payment per (merchant, invoice id), from any device; a replay reverts `InvoiceAlreadyUsed`
- `hold` / `permitAndHold` → `capture(id, amount)`: the merchant takes up to the hold and the rest returns to the payer in the same call; `voidHold` by the merchant, or by anyone after expiry
- `refund(id, amount)`: merchant only, capped at what is left

```bash
pnpm --filter @stabletap/contracts test          # 6 Hardhat tests (node:test + viem)
pnpm --filter @stabletap/contracts fork:check    # deploy + all flows against the real runtime and precompile on the Chopsticks fork
pnpm --filter @stabletap/contracts live          # deploy + flows on the testnet (needs contracts/.env, see .env.example)
```

Costs on V3 (pallet-revive storage deposits, in tPOT, reserved from the caller): deploying the 3.3 KB contract ≈ 260, each new invoice ≈ 3.84 (one 32-byte slot). That's why the native Substrate path stays the main one: it needs no contract and no tPOT. EVM gas is also paid in tPOT.

## Indexer (history, stats, webhooks)

The chain stays the source of truth; the indexer is a read model. It follows finalized blocks from a start block and decodes every successful extrinsic whose memo is `stabletap:<id>` or `stabletap:refund:<id>`. The memo text comes from the call and is checked against the `Remarked` hash; amounts come only from `assets.Transferred` events. Each block is stored in one SQLite transaction together with the cursor, so a restart resumes at the next block and no block is skipped.

```bash
cp apps/indexer/.env.example apps/indexer/.env      # no secrets
pnpm --filter @stabletap/indexer start              # or start:fork against the local fork
pnpm --filter @stabletap/indexer test
```

| Endpoint | |
|---|---|
| `GET /health` | cursor, finalized head, last error |
| `GET /v1/stats` | payments, volume, refunds, fees paid in pUSD vs tPOT, payers, merchants, live pool reserves, latest 20 |
| `GET /v1/merchants/:address/records` | payments to and refunds by a merchant, with refunded totals (`limit`, `before`) |
| `GET /v1/merchants/:address/webhook` | configured host and last deliveries (no secret, no full URL) |
| `PUT` / `DELETE /v1/merchants/:address/webhook` | set or remove the webhook; body signed by the merchant key |
| `POST /v1/terminals` | register a tap terminal for `{ merchant }`; returns its id and a write token (shown once) |
| `GET /v1/terminals/:id/charge` | `{ charge }`: the open charge behind a counter tag, or `null` (dropped once paid or expired) |
| `PUT` / `DELETE /v1/terminals/:id/charge` | publish or withdraw the current charge; `Authorization: Bearer <token>` |

Webhooks follow [Standard Webhooks](https://www.standardwebhooks.com/): headers `webhook-id`, `webhook-timestamp`, `webhook-signature: v1,<base64 HMAC-SHA256>`, events `payment.succeeded` and `refund.succeeded`, sent once the block is final.

- Events go to an outbox in the same transaction as the block and are delivered at least once with backoff (8 retries, up to 10 h). The `webhook-id` stays the same across retries, so receivers can deduplicate.
- Registration needs an sr25519 signature by the merchant address over `stabletap:webhook:v1 / merchant / url / signedAt`, fresh within 5 minutes and newer than the last one. The `whsec_` secret is returned once.
- Targets must be `https` and resolve to public addresses, checked again at connect time (DNS rebinding). Redirects are not followed. `INDEXER_ALLOW_INSECURE_WEBHOOKS=1` lifts this for local testing only.

The read API is public; it only exposes chain data. Webhook writes are rate limited per client. Put it behind TLS and your host's rate limiting when deployed.

## Live on the V3 testnet

| | |
|---|---|
| pUSD | asset id `7777`, 6 decimals, issuer `5Eph8MeAG5mBCZCN5nsX3bdgx9LeFMnaUJnRFfo9eVaTseZv` |
| Setup tx | `0x50ac433717eddffaacb9e5a1e28006c714805a1c21435975747878cf43d0059f` (block 148225): asset, metadata, mint, pool, liquidity |
| Pool | 150 tPOT : 150 pUSD |
| Payment tx | `0x144a9a16d9d03c5008acf70a1c7134ee28438e7b9cefa7714a9f2f63ced31813` (block 148241): 4.50 pUSD, fee 0.01837 pUSD, customer tPOT spent 0 |
| PORT (test community token) | asset id `7780`, 6 decimals, pool 100 tPOT : 200 PORT, setup tx `0xe4200733…f602` (block 149633) |
| Split payment | `149659-1`: 4.50 pUSD → merchant 4.455, platform 0.045, fee 0.022498 pUSD |
| Refund | `149662-1`: 4.455 pUSD back to the customer, signed by the merchant, fee 0.019087 pUSD |
| Paid with PORT | `149665-1`: customer holding only PORT spent 9.784205 PORT, merchant got exactly 4.50 pUSD, fee 0.052614 PORT, tPOT spent 0 |
| Team payout | `149671-1`: 4.00 pUSD to a 2-of-3 multisig, fee 0.014466 pUSD |

Explorer links: `https://scanner-testnet-v3.portaldot.dev/#/extrinsics/<block>-<index>` (e.g. the setup tx is `148225-1`). The explorer's own indexer lags the chain, so a fresh tx can show "Page not found" for a while.

Raw records are in `evidence/`. To repeat: `pnpm --filter @stabletap/engine live:payment --evidence ../../evidence/testnet-payment.json` and `pnpm --filter @stabletap/engine live:flows --pay-asset 7780 --evidence ../../evidence/testnet-flows.json` (both need `packages/engine/.env.setup`; every guarantee is a hard check). PORT itself: `pnpm --filter @stabletap/engine setup:port` (plan in `packages/engine/port.env`).

## Network

| | |
|---|---|
| Substrate RPC | `wss://test-node-v3.portaldot.dev` |
| EVM RPC | `https://test-evm-rpc-v3.portaldot.dev` |
| EVM chain ID | `420420777` |
| Node console | https://node-console.portaldot.dev/ |
