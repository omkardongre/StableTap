"use client";

import { useEffect } from "react";

/** How long a success message stays: long enough to read, short enough to stay out of the way. */
const TOAST_MS = 3_000;

/** Short green confirmation at the bottom of the screen ("Refunded $1.00 to customer ✓"), like Square and Cash App. */
export function Toast({ text, onDone }: { text: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(t);
  }, [text, onDone]);
  if (!text) return null;
  return (
    <p className="toast" role="status">
      {text}
    </p>
  );
}
