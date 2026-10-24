"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Same key the till uses to remember the shop on this device. */
const SHOP_KEY = "stabletap.pos.shop.v1";

/** "Set up my shop" for new owners. An owner whose shop is on this phone goes straight to the till, like a POS app. */
export function ShopButton() {
  const router = useRouter();
  const [hasShop, setHasShop] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(SHOP_KEY) === null) return;
      setHasShop(true);
      router.replace("/shop");
    } catch {
      // Storage blocked: treat as a new owner.
    }
  }, [router]);
  return (
    <Link className="btn primary hero-btn" href="/shop">
      {hasShop ? "Open my shop" : "Set up my shop"}
    </Link>
  );
}
