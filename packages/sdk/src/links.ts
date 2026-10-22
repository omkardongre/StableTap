/** URL that opens a StableTap wallet on the confirm screen for a `portaldot:pay?…` link. */
export function walletPayUrl(walletUrl: string, link: string): string {
  const base = new URL(walletUrl);
  if (base.protocol !== "https:" && base.hostname !== "localhost" && base.hostname !== "127.0.0.1") throw new Error("walletUrl must use https");
  if (!link.startsWith("portaldot:pay?")) throw new Error("Not a Portaldot payment link");
  const url = new URL("/wallet", base);
  url.searchParams.set("pay", link);
  return url.toString();
}
