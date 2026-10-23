import type { Metadata } from "next";
import { Links } from "./Links";

export const metadata: Metadata = { title: "Payment links · StableTap Business" };

export default function LinksPage() {
  return <Links />;
}
