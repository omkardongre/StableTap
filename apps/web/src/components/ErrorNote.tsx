"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How long an action error stays: about 6 s is the shortest readable time for a short message
 * (5 s + reading time, per Adobe Spectrum); 8 s leaves room for a two-line one.
 */
const ERROR_MS = 8_000;

/**
 * Red box for an action that failed ("No connection…", "Not confirmed on your phone"). It hides by
 * itself after a few seconds and can be closed. Blockers (browser not supported, link not found)
 * use a plain `.alert` instead, because the person can't go on without reading them.
 */
export function ErrorNote({ text, onClose }: { text: string | null | undefined; onClose?: () => void }) {
  // Without a parent setter, remember which message was hidden so a new one still shows.
  const [hidden, setHidden] = useState<string | null>(null);
  // Parents pass a new arrow on every render; the timer must not restart because of that.
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!text) return;
    setHidden(null);
    const t = setTimeout(() => (close.current ? close.current() : setHidden(text)), ERROR_MS);
    return () => clearTimeout(t);
  }, [text]);
  if (!text || hidden === text) return null;
  return (
    <p className="alert alert-dismiss" role="alert">
      <span>{text}</span>
      <button type="button" className="alert-close" onClick={() => (close.current ? close.current() : setHidden(text))} aria-label="Close">
        ×
      </button>
    </p>
  );
}
