import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { getAddress, keccak256, parseSignature, stringToHex } from "viem";

const usd = (n: number) => BigInt(Math.round(n * 1e6));
const invoice = (s: string) => keccak256(stringToHex(s));

describe("PotCheckout", async () => {
  const { viem, networkHelpers } = await network.create();
  const [, customer, shop, stranger] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  async function deploy() {
    const token = await viem.deployContract("MockPermitToken");
    const checkout = await viem.deployContract("PotCheckout", [token.address]);
    await token.write.mint([customer.account.address, usd(100)]);
    await token.write.mint([shop.account.address, usd(10)]);
    return { token, checkout };
  }
  const now = async () => BigInt(await networkHelpers.time.latest());

  it("pays an invoice once; a replay from any account is rejected", async () => {
    const { token, checkout } = await deploy();
    const t = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: customer } });
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    await t.write.approve([checkout.address, usd(9)]);
    const id = invoice("inv-coffee1");
    const key = await checkout.read.keyOf([shop.account.address, id]);
    await viem.assertions.emitWithArgs(c.write.pay([shop.account.address, id, usd(4.5), (await now()) + 300n]), checkout, "Paid", [
      key, id, getAddress(shop.account.address), getAddress(customer.account.address), usd(4.5),
    ]);
    assert.equal(await token.read.balanceOf([shop.account.address]), usd(14.5));
    await viem.assertions.revertWithCustomErrorWithArgs(c.write.pay([shop.account.address, id, usd(4.5), (await now()) + 300n]), checkout, "InvoiceAlreadyUsed", [key]);
    const other = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: stranger } });
    await viem.assertions.revertWithCustomError(other.write.pay([shop.account.address, id, 1n, (await now()) + 300n]), checkout, "InvoiceAlreadyUsed");
    // The same id at another merchant is a different invoice.
    await t.write.approve([checkout.address, usd(1)]);
    await c.write.pay([stranger.account.address, id, usd(1), (await now()) + 300n]);
  });

  it("refuses expired invoices, zero amounts and the zero merchant", async () => {
    const { token, checkout } = await deploy();
    const t = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: customer } });
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    await t.write.approve([checkout.address, usd(10)]);
    await viem.assertions.revertWithCustomError(c.write.pay([shop.account.address, invoice("a"), usd(1), (await now()) - 1n]), checkout, "InvoiceExpired");
    await viem.assertions.revertWithCustomError(c.write.pay([shop.account.address, invoice("b"), 0n, (await now()) + 60n]), checkout, "BadAmount");
    await viem.assertions.revertWithCustomError(c.write.pay(["0x0000000000000000000000000000000000000000", invoice("c"), 1n, (await now()) + 60n]), checkout, "BadAmount");
    await viem.assertions.revertWithCustomError(c.write.hold([shop.account.address, invoice("d"), 1n, Number(await now())]), checkout, "InvoiceExpired");
  });

  it("holds $50, captures $42 and returns $8 to the payer in the same call", async () => {
    const { token, checkout } = await deploy();
    const t = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: customer } });
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    const m = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: shop } });
    await t.write.approve([checkout.address, usd(50)]);
    const id = invoice("inv-bike1");
    await c.write.hold([shop.account.address, id, usd(50), Number((await now()) + 3600n)]);
    const key = await checkout.read.keyOf([shop.account.address, id]);
    assert.equal(await token.read.balanceOf([checkout.address]), usd(50));
    // The customer can't capture: from its address the key points at nothing.
    await viem.assertions.revertWithCustomError(c.write.capture([id, usd(42)]), checkout, "WrongStatus");
    await viem.assertions.revertWithCustomError(m.write.capture([id, usd(51)]), checkout, "BadAmount");
    await viem.assertions.emitWithArgs(m.write.capture([id, usd(42)]), checkout, "Captured", [key, usd(42), usd(8)]);
    assert.equal(await token.read.balanceOf([checkout.address]), 0n);
    assert.equal(await token.read.balanceOf([shop.account.address]), usd(52));
    assert.equal(await token.read.balanceOf([customer.account.address]), usd(58));
    await viem.assertions.revertWithCustomError(m.write.capture([id, 1n]), checkout, "WrongStatus");
    const [, amount, status] = await checkout.read.payments([key]);
    assert.equal(amount, usd(42));
    assert.equal(status, 3);
  });

  it("voids a hold: merchant any time, anyone only after expiry", async () => {
    const { token, checkout } = await deploy();
    const t = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: customer } });
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    const s = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: stranger } });
    await t.write.approve([checkout.address, usd(20)]);
    const exp = (await now()) + 600n;
    await c.write.hold([shop.account.address, invoice("h1"), usd(20), Number(exp)]);
    const key = await checkout.read.keyOf([shop.account.address, invoice("h1")]);
    await viem.assertions.revertWithCustomError(s.write.voidHold([shop.account.address, invoice("h1")]), checkout, "HoldNotExpired");
    await networkHelpers.time.increaseTo(exp + 1n);
    await viem.assertions.emitWithArgs(s.write.voidHold([shop.account.address, invoice("h1")]), checkout, "Voided", [key, usd(20)]);
    assert.equal(await token.read.balanceOf([customer.account.address]), usd(100));
  });

  it("refunds up to what was paid, only by the merchant", async () => {
    const { token, checkout } = await deploy();
    const t = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: customer } });
    const tm = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: shop } });
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    const m = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: shop } });
    await t.write.approve([checkout.address, usd(4.5)]);
    await c.write.pay([shop.account.address, invoice("r1"), usd(4.5), (await now()) + 60n]);
    await tm.write.approve([checkout.address, usd(10)]);
    await viem.assertions.revertWithCustomError(c.write.refund([invoice("r1"), 1n]), checkout, "WrongStatus");
    await m.write.refund([invoice("r1"), usd(2)]);
    await viem.assertions.revertWithCustomError(m.write.refund([invoice("r1"), usd(3)]), checkout, "BadAmount");
    await m.write.refund([invoice("r1"), usd(2.5)]);
    assert.equal(await token.read.balanceOf([customer.account.address]), usd(100));
  });

  it("pays with a single EIP-2612 permit signature and survives a front-run permit", async () => {
    const { token, checkout } = await deploy();
    const c = await viem.getContractAt("PotCheckout", checkout.address, { client: { wallet: customer } });
    const amount = usd(4.5);
    const deadline = (await now()) + 600n;
    const sig = await customer.signTypedData({
      domain: { name: "Portaldot USD (test)", version: "1", chainId: await publicClient.getChainId(), verifyingContract: token.address },
      types: { Permit: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }, { name: "value", type: "uint256" }, { name: "nonce", type: "uint256" }, { name: "deadline", type: "uint256" }] },
      primaryType: "Permit",
      message: { owner: customer.account.address, spender: checkout.address, value: amount, nonce: await token.read.nonces([customer.account.address]), deadline },
    });
    const { r, s, v } = parseSignature(sig);

    // Someone submits the permit first: the allowance exists, so the payment still goes through.
    const front = await viem.getContractAt("MockPermitToken", token.address, { client: { wallet: stranger } });
    await front.write.permit([customer.account.address, checkout.address, amount, deadline, Number(v), r, s]);
    await c.write.permitAndPay([shop.account.address, invoice("p1"), amount, (await now()) + 300n, deadline, Number(v), r, s]);
    assert.equal(await token.read.balanceOf([shop.account.address]), usd(14.5));
    assert.equal(await token.read.allowance([customer.account.address, checkout.address]), 0n);
  });
});
