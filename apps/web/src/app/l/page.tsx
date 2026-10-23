import type { Metadata } from "next";
import { LinkCheckout } from "./Checkout";

export const metadata: Metadata = { title: "Checkout · StableTap" };

export default function LinkPage() {
  return <LinkCheckout />;
}
