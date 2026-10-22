import type { Metadata } from "next";
import { Pos } from "./Pos";

export const metadata: Metadata = { title: "StableTap POS" };

export default function PosPage() {
  return <Pos />;
}
