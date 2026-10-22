import type { Metadata } from "next";
import { Partner } from "./Partner";

export const metadata: Metadata = { title: "Hacker House Merch · demo partner" };

export default function PartnerPage() {
  return <Partner />;
}
