import type { Metadata } from "next";
import { formatAmount } from "@stabletap/engine/config";
import { previewText, type LinkInfo } from "@/lib/linkCore";
import { network } from "@/lib/network";

const GENERIC: Metadata = { title: "Checkout · StableTap", description: "Pay in dollars on Portaldot." };

/** Title, text and picture chat apps show for a shared payment link (Open Graph tags). */
export function linkMetadata(link: Pick<LinkInfo, "item" | "amount" | "shop"> | null): Metadata {
  if (!link) return GENERIC;
  const { title, description } = previewText(link);
  const q = new URLSearchParams({ i: link.item, a: formatAmount(link.amount, network.decimals), s: link.shop });
  const image = { url: `/og?${q.toString()}`, width: 1200, height: 630, alt: `${link.item} from ${link.shop}` };
  return {
    title,
    description,
    openGraph: { type: "website", siteName: "StableTap", title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
