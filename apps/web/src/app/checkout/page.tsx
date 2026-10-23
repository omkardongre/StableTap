import type { Metadata } from "next";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "StableTap: MetaMask checkout" };

export default function CheckoutPage() {
  return <Checkout />;
}
