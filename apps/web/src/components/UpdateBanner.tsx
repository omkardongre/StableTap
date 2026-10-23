"use client";
import { useEffect, useState } from "react";

const CHECK_MS = 5 * 60_000;

/** "New version available" after a deploy, so a tab left open doesn't keep running old code. */
export function UpdateBanner() {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const mine = process.env.NEXT_PUBLIC_BUILD_ID;
    if (!mine) return;
    const check = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/version", { cache: "no-store" })
        .then((r) => r.json() as Promise<{ build: string | null }>)
        .then(({ build }) => build && build !== mine && setStale(true))
        .catch(() => undefined);
    };
    check();
    const t = setInterval(check, CHECK_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  if (!stale) return null;
  return (
    <div className="update-banner" role="status">
      <span>A new version is available.</span>
      <button type="button" onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  );
}
