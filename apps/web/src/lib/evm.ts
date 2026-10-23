"use client";

import {
  BaseError, ContractFunctionRevertedError, createPublicClient, createWalletClient, custom, defineChain, getAddress, http, keccak256, parseAbi, parseSignature, stringToHex,
  type Address, type EIP1193Provider, type Hex, type PublicClient, type WalletClient,
} from "viem";
import { options } from "./network";

/**
 * MetaMask path: the same pUSD through Portaldot's ERC-20 precompile, paid
 * into PotCheckout (hold, capture, void, refund). Gas is paid in tPOT here.
 */
export const CHECKOUT_ABI = parseAbi([
  "function token() view returns (address)",
  "function keyOf(address merchant, bytes32 invoiceId) pure returns (bytes32)",
  "function payments(bytes32 key) view returns (address payer, uint56 amount, uint8 status, uint32 expiresAt)",
  "function permitAndPay(address merchant, bytes32 invoiceId, uint256 amount, uint256 deadline, uint256 permitDeadline, uint8 v, bytes32 r, bytes32 s) returns (bytes32)",
  "function permitAndHold(address merchant, bytes32 invoiceId, uint256 amount, uint32 expiresAt, uint256 permitDeadline, uint8 v, bytes32 r, bytes32 s) returns (bytes32)",
  "function capture(bytes32 invoiceId, uint256 amount)",
  "function voidHold(address merchant, bytes32 invoiceId)",
  "function refund(bytes32 invoiceId, uint256 amount)",
  "event Paid(bytes32 indexed key, bytes32 indexed invoiceId, address indexed merchant, address payer, uint256 amount)",
  "event Held(bytes32 indexed key, bytes32 indexed invoiceId, address indexed merchant, address payer, uint256 amount, uint32 expiresAt)",
  "error InvoiceAlreadyUsed(bytes32 key)",
  "error InvoiceExpired()",
  "error BadAmount()",
  "error WrongStatus(uint8 status)",
  "error HoldNotExpired()",
  "error TransferFailed()",
]);

export const TOKEN_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function nonces(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]);

export const STATUS = ["None", "Paid", "Held", "Captured", "Voided"] as const;

export const evmEnabled = () => options.evm !== null;

export function evmChain() {
  const e = options.evm;
  if (!e) throw new Error("The MetaMask checkout is not configured (NEXT_PUBLIC_STABLETAP_EVM_*)");
  return defineChain({
    id: e.chainId,
    name: e.chainName,
    nativeCurrency: { name: "tPOT", symbol: "tPOT", decimals: 18 },
    rpcUrls: { default: { http: [e.rpc] } },
  });
}

let publicClient: PublicClient | null = null;
export function evmPublic(): PublicClient {
  // pallet-revive's eth-rpc caps concurrent requests and answers bursts with errors that carry no CORS headers.
  // Batching keeps the page to a few requests at a time; retries with backoff cover the rest.
  publicClient ??= createPublicClient({
    chain: evmChain(),
    transport: http(options.evm!.rpc, { batch: { batchSize: 50, wait: 16 }, retryCount: 5, retryDelay: 400 }),
  });
  return publicClient;
}

export const checkoutAddress = (): Address => options.evm!.checkout;

/** Invoice ids are hashed into the contract's bytes32 id. */
export const invoiceKey = (id: string): Hex => keccak256(stringToHex(id));

// EIP-6963: find every injected wallet instead of racing for window.ethereum.
export interface WalletInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}
export interface DiscoveredWallet {
  info: WalletInfo;
  provider: EIP1193Provider;
}

export function discoverWallets(onChange: (w: DiscoveredWallet[]) => void): () => void {
  const found = new Map<string, DiscoveredWallet>();
  const onAnnounce = (e: Event) => {
    const d = (e as CustomEvent<DiscoveredWallet>).detail;
    if (!d?.info?.uuid || !d.provider || found.has(d.info.uuid)) return;
    found.set(d.info.uuid, { info: d.info, provider: d.provider });
    onChange([...found.values()]);
  };
  window.addEventListener("eip6963:announceProvider", onAnnounce);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  return () => window.removeEventListener("eip6963:announceProvider", onAnnounce);
}

/** Connect, then make sure the wallet is on the Portaldot EVM chain (adds it if missing). */
export async function connectWallet(provider: EIP1193Provider): Promise<{ wallet: WalletClient; account: Address }> {
  const chain = evmChain();
  const wallet = createWalletClient({ chain, transport: custom(provider) });
  const [account] = await wallet.requestAddresses();
  if (!account) throw new Error("No account was shared by the wallet");
  if ((await wallet.getChainId()) !== chain.id) {
    try {
      await wallet.switchChain({ id: chain.id });
    } catch (e) {
      if ((e as { code?: number }).code !== 4902 && !/Unrecognized chain|4902/.test(String(e))) throw e;
      await wallet.addChain({ chain });
    }
  }
  return { wallet: createWalletClient({ account, chain, transport: custom(provider) }), account: getAddress(account) };
}

/** One EIP-2612 signature lets the contract pull exactly `value`; no separate approve transaction. */
export async function signPermit(wallet: WalletClient, owner: Address, token: Address, spender: Address, value: bigint) {
  const pub = evmPublic();
  const [name, nonce] = await Promise.all([
    pub.readContract({ address: token, abi: TOKEN_ABI, functionName: "name" }),
    pub.readContract({ address: token, abi: TOKEN_ABI, functionName: "nonces", args: [owner] }),
  ]);
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 900);
  const sig = await wallet.signTypedData({
    account: owner,
    domain: { name, version: "1", chainId: evmChain().id, verifyingContract: token },
    types: {
      Permit: [
        { name: "owner", type: "address" }, { name: "spender", type: "address" }, { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" }, { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Permit",
    message: { owner, spender, value, nonce, deadline },
  });
  const { r, s, v, yParity } = parseSignature(sig);
  return { deadline, v: Number(v ?? BigInt(yParity + 27)), r, s };
}

/**
 * Simulate first (decodes the contract's custom errors and fails before the
 * wallet prompt), then send exactly the simulated request and wait for it.
 */
export async function send(
  wallet: WalletClient,
  account: Address,
  call: { address: Address; abi: typeof CHECKOUT_ABI | typeof TOKEN_ABI; functionName: string; args: readonly unknown[] },
): Promise<{ hash: Hex; blockNumber: bigint }> {
  const { request } = await evmPublic().simulateContract({ ...call, account } as Parameters<PublicClient["simulateContract"]>[0]);
  return settle(await wallet.writeContract({ ...request, chain: wallet.chain } as Parameters<WalletClient["writeContract"]>[0]));
}

/** Wait for the receipt and fail loudly on a revert. */
export async function settle(hash: Hex): Promise<{ hash: Hex; blockNumber: bigint }> {
  const r = await evmPublic().waitForTransactionReceipt({ hash, timeout: 180_000 });
  if (r.status !== "success") throw new Error(`Transaction reverted (${hash})`);
  return { hash, blockNumber: r.blockNumber };
}

/** Holds and payments made to `merchant`, newest first, with their current state. */
export async function merchantPayments(merchant: Address, fromBlock: bigint) {
  const pub = evmPublic();
  const address = checkoutAddress();
  const [held, paid] = await Promise.all([
    pub.getContractEvents({ address, abi: CHECKOUT_ABI, eventName: "Held", args: { merchant }, fromBlock }),
    pub.getContractEvents({ address, abi: CHECKOUT_ABI, eventName: "Paid", args: { merchant }, fromBlock }),
  ]);
  const rows = [...held, ...paid].sort((a, b) => Number((b.blockNumber ?? 0n) - (a.blockNumber ?? 0n)));
  return Promise.all(
    rows.map(async (ev) => {
      const [payer, amount, status, expiresAt] = await pub.readContract({ address, abi: CHECKOUT_ABI, functionName: "payments", args: [ev.args.key!] });
      return {
        invoiceId: ev.args.invoiceId!,
        kind: ev.eventName,
        txHash: ev.transactionHash,
        blockNumber: ev.blockNumber,
        payer,
        original: ev.args.amount!,
        amount: BigInt(amount),
        status: STATUS[status] ?? "None",
        expiresAt,
      };
    }),
  );
}

/** Revert reason for a contract error, in plain words. */
export function evmErrorText(e: unknown): string {
  const reverted = e instanceof BaseError ? e.walk((x) => x instanceof ContractFunctionRevertedError) : null;
  const name = reverted instanceof ContractFunctionRevertedError ? (reverted.data?.errorName ?? "") : "";
  const short = e instanceof Error ? ((e as { shortMessage?: string }).shortMessage ?? e.message) : String(e);
  const s = `${name} ${e instanceof Error ? e.message : short}`;
  if (/InvoiceAlreadyUsed/.test(s)) return "Rejected: this invoice is already paid";
  if (/InvoiceExpired/.test(s)) return "Rejected: this invoice has expired";
  if (/HoldNotExpired/.test(s)) return "Only the shop can release a hold before it expires";
  if (/WrongStatus/.test(s)) return "Not possible in this state";
  if (/BadAmount/.test(s)) return "Amount is not allowed (zero, or more than held or paid)";
  if (/User rejected|denied/i.test(s)) return "Cancelled in the wallet";
  // Portaldot's eth-rpc answers an unaffordable transaction with a bare 1010 "Invalid Transaction".
  if (/Invalid Transaction|insufficient funds|unknown RPC error/i.test(s)) return "The network refused the transaction. Usually this means not enough tPOT for gas.";
  return short;
}
