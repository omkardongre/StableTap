"use client";

import { useEffect, useState } from "react";

/** True once `active` has lasted `ms`, so a slow step can say "Still working…" instead of looking stuck. */
export function useSlow(active: boolean, ms = 20_000): boolean {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setSlow(false);
    if (!active) return;
    const t = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return slow;
}
