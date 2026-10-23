import type { Metadata } from "next";
import { Developers } from "./Developers";

export const metadata: Metadata = { title: "Developers · StableTap Business" };

export default function DevelopersPage() {
  return <Developers />;
}
