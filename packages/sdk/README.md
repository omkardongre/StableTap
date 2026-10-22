# @stabletap/sdk

Take dollar payments on Portaldot V3. The customer pays in pUSD and the network fee is paid in pUSD too, so they never need the native token.

```bash
npm i @stabletap/sdk @polkadot/api@17.0.2
```

## Pay button (React)

```tsx
import { PayButton } from "@stabletap/sdk/react";
import { loadNetwork } from "@stabletap/sdk";

const net = loadNetwork({ STABLETAP_WS: "wss://test-node-v3.portaldot.dev", STABLETAP_ASSET_ID: "7777", STABLETAP_ASSET_DECIMALS: "6" });

<PayButton network={net} to="5…shop address" amount="12.00" walletUrl="https://<stabletap-host>" onPaid={(p) => confirmOrder(p.txHash)} />
```

The button creates an invoice that expires after 5 minutes of chain time, opens the customer's StableTap wallet on it, and watches finalized blocks. `onPaid` fires only when one successful extrinsic carries the invoice memo and transfers the exact amount to `to`. Nothing is trusted from the wallet window.

Props: `network`, `to`, `amount` (dollars), `walletUrl`, and optionally `merchant` (name shown in the wallet), `split` (`{ to, bps }` platform share), `ttlSec`, `label`, `className`, `onPaid`, `onError`.

## Core API

```ts
import { connect, encodeInvoice, decodeInvoice, newInvoiceId, parseAmount, watchInvoice, pay, refund } from "@stabletap/sdk";

const api = await connect(net);
const invoice = { to: shop, amount: parseAmount("4.50", net.decimals), id: newInvoiceId() };
const link = encodeInvoice(invoice, net.ss58); // portaldot:pay?to=…&amount=…&id=…  (put it in a QR)
const stop = await watchInvoice(api, net, invoice, { onPaid, onError });
```

- `pay(api, net, invoice, signer)`: one `batchAll[transfer, memo]`, fee in pUSD, resolves on finality, rejects on any failure or if the fee wasn't charged in pUSD
- `payWithAsset` / `quoteSwapPay`: pay a pUSD invoice with another token that has a pool against the native token; the shop still gets exact pUSD
- `refund(api, net, { to, amount, invoiceId }, merchant)`: reverse transfer with a refund memo, fee in pUSD
- `scanBlock` / `decodeBlock`: decode StableTap payments and refunds from a finalized block
- `multisigAddress`: pallet-multisig account for a team wallet

## Payment link format

`portaldot:pay?to=<ss58>&amount=<smallest units>&id=<[a-z0-9_-]{1,32}>[&m=<shop name>][&exp=<unix seconds, chain time>][&st=<ss58>&sb=<bps>]`

On chain the memo is `system.remarkWithEvent("stabletap:<id>")` (refunds: `stabletap:refund:<id>`).

## Notes

- ESM only. Node ≥ 20.19 or any modern bundler.
- Receivers of pUSD must already exist on chain (hold the native existential deposit).

MIT
