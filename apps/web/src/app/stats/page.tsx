import type { Metadata } from "next";
import { Stats } from "./Stats";

export const metadata: Metadata = { title: "Stats · StableTap" };

export default function StatsPage() {
  return <Stats />;
}
