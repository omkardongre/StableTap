import { normalizeAddress } from "@stabletap/engine";
import type { Store, StoredLink } from "./db.ts";
import { HttpError } from "./webhooks.ts";

/**
 * Short payment links (`/l/<id>`), like Stripe's buy.stripe.com/<id>. The web app keeps the item,
 * price, shop name and payout address here so the shared URL stays short and doesn't show the
 * address. A link only says where money goes and how much; the customer still checks the shop name
 * and price before paying, exactly as with the long form of the link.
 */
export const LINK_ID = /^[a-z0-9]{6}$/;
const ITEM_MAX = 30;
const SHOP_MAX = 40;
// Control characters would break the chat preview and the checkout page.
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/;
/** Up to $9,999,999.99 at the asset's decimals: plenty for a shop item, small enough for SQLite text sorting not to matter. */
const AMOUNT = /^[1-9]\d{0,19}$/;

function text(v: unknown, max: number, what: string): string {
  if (typeof v !== "string") throw new HttpError(400, `Send ${what}`);
  const t = v.trim();
  if (t.length < 1 || t.length > max || CONTROL.test(t)) throw new HttpError(400, `${what} must be 1 to ${max} characters`);
  return t;
}

/** Validates a new link. Same id and same content again is fine (a retried request); another link with that id is a conflict. */
export function saveLink(store: Store, ss58: number, body: Record<string, unknown>, nowMs: number): StoredLink {
  if (typeof body.id !== "string" || !LINK_ID.test(body.id)) throw new HttpError(400, "id must be 6 characters a-z0-9");
  if (typeof body.amount !== "string" || !AMOUNT.test(body.amount)) throw new HttpError(400, "amount must be a positive integer in the asset's smallest unit");
  let merchant: string;
  try {
    merchant = normalizeAddress(String(body.merchant ?? ""), ss58);
  } catch {
    throw new HttpError(400, "Invalid merchant address");
  }
  const link: StoredLink = {
    id: body.id,
    item: text(body.item, ITEM_MAX, "item"),
    shop: text(body.shop, SHOP_MAX, "shop"),
    amount: body.amount,
    merchant,
    createdAt: nowMs,
  };
  if (store.insertLink(link)) return link;
  const have = store.getLink(link.id)!;
  const same = have.item === link.item && have.shop === link.shop && have.amount === link.amount && have.merchant === link.merchant;
  if (!same) throw new HttpError(409, "Link id already taken");
  return have;
}
