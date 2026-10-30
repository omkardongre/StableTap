import type { Metadata } from "next";
import { cache } from "react";
import { formatAmount } from "@stabletap/engine/config";
import { fetchShortLink } from "@/lib/linkCore";
import { network } from "@/lib/network";
import { LinkCheckout } from "../Checkout";
import { linkMetadata } from "../meta";

type Params = Promise<{ id: string }>;

// A link never changes once made, so its details can be cached; one lookup serves the page and its preview.
const load = cache((id: string) => fetchShortLink(id, { next: { revalidate: 3600 } }));

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return linkMetadata(await load((await params).id));
}

/** Short payment link, like buy.stripe.com/<id>: /l/ab12cd. */
export default async function ShortLinkPage({ params }: { params: Params }) {
  const link = await load((await params).id);
  return (
    <LinkCheckout
      link={link && { id: link.id, item: link.item, shop: link.shop, to: link.to, amount: formatAmount(link.amount, network.decimals) }}
    />
  );
}
