import type { Metadata } from "next";
import { Tap } from "./Tap";

export const metadata: Metadata = { title: "StableTap: tap to pay" };

export default async function TapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Tap id={id} />;
}
