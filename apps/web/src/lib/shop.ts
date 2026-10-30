"use client";

import { useEffect, useState } from "react";

/** The shop on this phone (name + payout address), saved by the till. */
export const SHOP_KEY = "stabletap.pos.shop.v1";
/** Fired on this page when the shop is saved, so the tab bar shows up without a reload. */
const SHOP_EVENT = "stabletap:shop";

export function notifyShopChanged() {
  window.dispatchEvent(new Event(SHOP_EVENT));
}

/** True once this phone has a shop. null until it has been read (first render on the client). */
export function useHasShop(): boolean | null {
  const [has, setHas] = useState<boolean | null>(null);
  useEffect(() => {
    const read = () => {
      try {
        setHas(localStorage.getItem(SHOP_KEY) !== null);
      } catch {
        setHas(false);
      }
    };
    read();
    window.addEventListener(SHOP_EVENT, read);
    // Another tab signing in or out.
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(SHOP_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return has;
}
