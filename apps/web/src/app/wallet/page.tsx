import type { Metadata } from "next";
import { Wallet } from "./Wallet";

export const metadata: Metadata = { title: "StableTap wallet" };

export default function WalletPage() {
  return <Wallet />;
}
