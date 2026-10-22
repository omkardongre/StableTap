import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Dashboard · StableTap" };

export default function Page() {
  return <Dashboard />;
}
