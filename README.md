# StableTap

Pay in dollars on Portaldot V3 without spending the network token. The fee is paid in the stablecoin too.

## Current state

- Workspace setup (pnpm monorepo, Node 24)
- `spike/`: proof that a payment's fee can be paid in a stablecoin on the Portaldot V3 runtime, on a local fork
- `packages/engine/`: shared payment logic (invoice link, pay with fee in pUSD, paid-watcher)

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
pnpm --filter @stabletap/engine test:fork   # needs the fork running and `pnpm spike:fee` run once
```

The engine reads `STABLETAP_WS`, `STABLETAP_ASSET_ID` and `STABLETAP_ASSET_DECIMALS`; there are no defaults. Fork values are in `packages/engine/test/fork.env`.

Chain types in `packages/engine/src/interfaces/` are generated from the live runtime: `pnpm --filter @stabletap/engine typegen`.

## Network

| | |
|---|---|
| Substrate RPC | `wss://test-node-v3.portaldot.dev` |
| EVM RPC | `https://test-evm-rpc-v3.portaldot.dev` |
| EVM chain ID | `420420777` |
| Node console | https://node-console.portaldot.dev/ |
