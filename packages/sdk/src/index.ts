/**
 * @stabletap/sdk: dollar payments on Portaldot V3 with the fee paid in the
 * stablecoin. Same code the StableTap wallet, POS and indexer run.
 *
 *   const api = await connect(net);
 *   const link = encodeInvoice({ to, amount: parseAmount("4.50", net.decimals), id: newInvoiceId() }, net.ss58);
 *   const stop = await watchInvoice(api, net, decodeInvoice(link, net.ss58), { onPaid, onError });
 */
export {
  // network
  connect, assertNetwork, chainNow, getBalances, loadNetwork, parseAmount, formatAmount, TESTNET_WS,
  type NetworkConfig, type Balances,
  // invoices
  encodeInvoice, decodeInvoice, newInvoiceId, splitAmounts, assertNotExpired, normalizeAddress, parseMemo, memoFor, refundMemoFor,
  InvoiceExpiredError, MAX_SPLIT_BPS, type Invoice, type Split,
  // paying and refunding
  pay, quoteFee, buildPayCall, refund, buildRefundCall, quoteCallFee, payWithAsset, quoteSwapPay, buildSwapPayCall, transferStable,
  type Receipt, type PayStage, type RefundRequest, type SwapQuote,
  // watching and reading the chain
  watchInvoice, scanBlock, decodeBlock, settlesInvoice, type PaidEvent, type WatchOptions, type ChainRecord, type ScannedBlock, type StableTransfer,
  // team wallets and webhooks
  multisigAddress, webhookRegistrationMessage, type MultisigSpec,
} from "@stabletap/engine";
export { walletPayUrl } from "./links.ts";
