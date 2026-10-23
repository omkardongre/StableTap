import type { Metadata } from "next";
import { Pos } from "./Pos";
export const metadata: Metadata = { title: "Shop · StableTap Business" };
export default function PosPage() {
  return <Pos />;
}
