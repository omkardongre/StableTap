import type { Metadata } from "next";
import { previewFromQuery } from "@/lib/linkCore";
import { LinkCheckout } from "./Checkout";
import { linkMetadata } from "./meta";

type Search = Promise<Record<string, string | string[] | undefined>>;

const query = (sp: Record<string, string | string[] | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) if (typeof v === "string") q.set(k, v);
  return q;
};

/** Long-form payment links (everything in the URL). Links shared before short links keep working. */
export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  return linkMetadata(previewFromQuery(query(await searchParams)));
}

export default function LinkPage() {
  return <LinkCheckout />;
}
