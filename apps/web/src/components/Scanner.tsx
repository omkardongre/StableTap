"use client";

import { useEffect, useRef, useState } from "react";

interface Detector {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
}

/**
 * Native BarcodeDetector where it supports QR (Chrome, Android), otherwise the
 * ZXing WebAssembly ponyfill served from our own origin.
 */
async function createDetector(): Promise<Detector> {
  const Native = (globalThis as { BarcodeDetector?: { new (o: { formats: string[] }): Detector; getSupportedFormats(): Promise<string[]> } }).BarcodeDetector;
  if (Native && (await Native.getSupportedFormats()).includes("qr_code")) return new Native({ formats: ["qr_code"] });
  const { BarcodeDetector, prepareZXingModule } = await import("barcode-detector/ponyfill");
  prepareZXingModule({
    overrides: { locateFile: (path: string, prefix: string) => (path.endsWith(".wasm") ? `/wasm/${path}` : prefix + path) },
  });
  return new BarcodeDetector({ formats: ["qr_code"] });
}

/** Camera QR scanner. Calls onResult once with the first decoded text. */
export function Scanner({ onResult }: { onResult: (text: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const done = useRef(false);
  const cb = useRef(onResult);
  cb.current = onResult;

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let live = true;

    (async () => {
      const detector = await createDetector();
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (!live || !video.current) return;
      video.current.srcObject = stream;
      await video.current.play();
      const tick = async () => {
        if (!live || done.current || !video.current) return;
        if (video.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
          const [hit] = await detector.detect(video.current);
          if (hit?.rawValue && !done.current) {
            done.current = true;
            cb.current(hit.rawValue);
            return;
          }
        }
        timer = setTimeout(tick, 200);
      };
      void tick();
    })().catch((e: unknown) => {
      if (!live) return;
      const name = e instanceof DOMException ? e.name : "";
      setError(name === "NotAllowedError" ? "Camera permission was denied." : `Camera unavailable: ${e instanceof Error ? e.message : String(e)}`);
    });

    return () => {
      live = false;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="scanner">
      {error ? <p role="alert">{error}</p> : <video ref={video} muted playsInline aria-label="Camera view for scanning a payment QR code" />}
    </div>
  );
}
