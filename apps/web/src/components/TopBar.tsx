"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
/** Pages of the business side (shop till, sales, business landing). Everything else is the customer side. */
const BUSINESS = ["/business", "/shop", "/sales", "/links", "/developers"];
const BUSINESS_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/sales", label: "Sales" },
  { href: "/links", label: "Links" },
] as const;
export function TopBar() {
  const path = usePathname();
  const business = BUSINESS.some((p) => path === p || path.startsWith(`${p}/`));
  // A checkout page shows only the shop and the price, like a hosted checkout.
  if (path === "/l") return null;
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
        {/* Customers have one screen (the wallet), so only the business side needs tabs.
            Switching sides lives in settings: the shop's gear menu, the wallet's "Account and backup". */}
        {business && (
          <nav className="nav" aria-label="Main">
            {BUSINESS_LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path.startsWith(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
