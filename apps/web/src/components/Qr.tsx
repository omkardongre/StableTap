"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

/** QR code rendered locally as an SVG data URL (no network). */
export function Qr({ value, label }: { value: string; label: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    QRCode.toString(value, { type: "svg", errorCorrectionLevel: "M", margin: 2 })
      .then((svg) => live && setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`))
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      live = false;
    };
  }, [value]);

  if (error) return <p role="alert">QR error: {error}</p>;
  return src ? <img className="qr" src={src} alt={label} width={280} height={280} /> : <div className="qr" aria-busy="true" />;
}
