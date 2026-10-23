"use client";
import { useEffect, useRef, useState } from "react";
interface Detector {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
}
/** Pause between detection attempts. */
const SCAN_INTERVAL_MS = 150;
/**
 * Native BarcodeDetector where it supports QR (Chrome, Android), otherwise the
 * ZXing WebAssembly ponyfill served from our own origin.
 */
async function createDetector(): Promise<Detector> {
  const Native = (globalThis as { BarcodeDetector?: { new (o: { formats: string[] }): Detector; getSupportedFormats(): Promise<string[]> } }).BarcodeDetector;
  if (Native && (await Native.getSupportedFormats().catch((): string[] => [])).includes("qr_code")) return new Native({ formats: ["qr_code"] });
  const { BarcodeDetector, prepareZXingModule } = await import("barcode-detector/ponyfill");
  prepareZXingModule({
    overrides: { locateFile: (path: string, prefix: string) => (path.endsWith(".wasm") ? `/wasm/${path}` : prefix + path) },
  });
  return new BarcodeDetector({ formats: ["qr_code"] });
}
/** Rear camera at high resolution with continuous focus, so a QR on another screen resolves. */
async function openCamera(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
  });
  const [track] = stream.getVideoTracks();
  const caps = (track?.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { focusMode?: string[] };
  if (track && caps.focusMode?.includes("continuous")) {
    await track.applyConstraints({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] }).catch(() => undefined);
  }
  return stream;
}
function cameraError(e: unknown): string {
  const name = e instanceof DOMException ? e.name : "";
  if (name === "NotAllowedError") return "Camera access is blocked. Allow the camera for this site in your browser settings, then try again.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No camera was found on this device.";
  if (name === "NotReadableError") return "The camera is in use by another app. Close it and try again.";
  return "The camera could not be started.";
}
/**
 * Full-screen camera QR scanner with a viewfinder. Calls onResult once with the first decoded
 * text. `extra` renders a secondary action under the hint (e.g. "Paste a link instead").
 */
export function Scanner({
  title,
  hint,
  onResult,
  onCancel,
  extra,
}: {
  title: string;
  hint: string;
  onResult: (text: string) => void;
  onCancel: () => void;
  extra?: React.ReactNode;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  // Read through a ref so a parent re-render never restarts the camera.
  const handlers = useRef({ onResult, onCancel });
  handlers.current = { onResult, onCancel };
  useEffect(() => {
    let stopped = false;
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      const [detector, s] = await Promise.all([createDetector(), openCamera()]);
      stream = s;
      const el = video.current;
      if (stopped || !el) return;
      el.srcObject = stream;
      await el.play();
      setReady(true);
      const tick = async () => {
        if (stopped) return;
        try {
          if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            const [hit] = await detector.detect(el);
            if (hit?.rawValue && !stopped) {
              stopped = true;
              navigator.vibrate?.(60);
              handlers.current.onResult(hit.rawValue);
              return;
            }
          }
        } catch {
          // A frame that can't be analysed is skipped; the next one is tried.
        }
        timer = setTimeout(tick, SCAN_INTERVAL_MS);
      };
      void tick();
    })().catch((e: unknown) => {
      if (!stopped) setError(cameraError(e));
    });
    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  // Modal: focus the close button, close on Escape, keep the page behind still.
  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handlers.current.onCancel();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div className="scanner" role="dialog" aria-modal="true" aria-labelledby="scanner-title">
      <video ref={video} className="scanner-video" muted playsInline aria-label="Camera preview" />
      <div className="scanner-top">
        <h2 id="scanner-title">{title}</h2>
        <button ref={closeButton} type="button" className="scanner-close" aria-label="Close scanner" onClick={onCancel}>
          ×
        </button>
      </div>
      {!error && (
        <div className="scanner-frame" aria-hidden="true">
          <span className="scanner-corner top-left" />
          <span className="scanner-corner top-right" />
          <span className="scanner-corner bottom-left" />
          <span className="scanner-corner bottom-right" />
          {ready && <span className="scanner-line" />}
        </div>
      )}
      <div className="scanner-bottom">
        <p role="status">{error ?? (ready ? hint : "Starting camera…")}</p>
        {extra}
        <button type="button" className="scanner-cancel" onClick={onCancel}>
          {error ? "Close" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
