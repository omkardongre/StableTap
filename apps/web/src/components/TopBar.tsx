"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHasShop } from "@/lib/shop";

/** Pages of the business side (shop till, sales, business landing). Everything else is the customer side. */
const BUSINESS = ["/business", "/shop", "/sales", "/links", "/developers"];
/** The shop app's three screens; the business landing page and developer docs have no tab bar. */
const TABS = [
  { href: "/shop", label: "Shop", icon: <path d="M4 7h16l-1.5 10.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 7Zm4 0V6a4 4 0 0 1 8 0v1" /> },
  { href: "/sales", label: "Sales", icon: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" /> },
  { href: "/links", label: "Links", icon: <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /> },
] as const;

const isBusiness = (path: string) => BUSINESS.some((p) => path === p || path.startsWith(`${p}/`));
// A checkout page shows only the shop and the price, like a hosted checkout.
const isCheckout = (path: string) => path === "/l" || path.startsWith("/l/");

const isShopTab = (path: string) => TABS.some((t) => path === t.href || path.startsWith(`${t.href}/`));

export function TopBar() {
  const path = usePathname();
  const hasShop = useHasShop();
  if (isCheckout(path)) return null;
  // Inside the shop app the shop's own name is the header, like Square: no app logo bar.
  // Before a shop exists (first screen) the logo stays, so a new owner knows which app this is.
  if (isShopTab(path) && hasShop !== false) return null;
  const business = isBusiness(path);
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href={business ? "/business" : "/"}>
          <span className="brand-logo" aria-hidden="true">
            $
          </span>
          <span className="brand-name">StableTap</span>
          {business && <span className="brand-tag">Business</span>}
        </Link>
      </div>
    </header>
  );
}

/**
 * Bottom tab bar for the shop app, like Square, Cash App and WhatsApp: in reach of the thumb,
 * icon plus label, above the phone's home bar. Customers have one screen, so they get none.
 */
export function TabBar() {
  const path = usePathname();
  const hasShop = useHasShop();
  // No tabs until there is a shop: Sales and Links have nothing to show before that.
  if (!isShopTab(path) || !hasShop) return null;
  return (
    <nav className="tabbar" aria-label="Shop">
      {TABS.map((t) => {
        const current = path === t.href || path.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} aria-current={current ? "page" : undefined}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {t.icon}
            </svg>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
