import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";
export const metadata: Metadata = { title: "Sales · StableTap Business" };
export default function Page() {
  return <Dashboard />;
}
