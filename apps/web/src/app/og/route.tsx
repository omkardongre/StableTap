import { ImageResponse } from "next/og";
import { usd } from "@/lib/format";
import { previewFromQuery } from "@/lib/linkCore";

/**
 * Chat preview picture for a payment link (WhatsApp, Instagram, Telegram, iMessage): shop, item and
 * big price. 1200×630 works on every app; WhatsApp needs under 600 KB, this PNG is ~30 KB.
 * Values come from the link and are only drawn as text.
 */
export function GET(req: Request) {
  const link = previewFromQuery(new URL(req.url).searchParams);
  const initial = link ? [...link.shop][0]!.toUpperCase() : "$";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #eef1ff 0%, #ffffff 60%)", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 104, height: 104, borderRadius: 52, background: "#4f46e5", color: "#fff", fontSize: 56, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{initial}</div>
          <div style={{ fontSize: 48, fontWeight: 600, color: "#1e293b", display: "flex" }}>{link?.shop ?? "StableTap"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 56, color: "#334155", display: "flex" }}>{link?.item ?? "Payment link"}</div>
          <div style={{ fontSize: 150, fontWeight: 800, color: "#0f172a", letterSpacing: -4, display: "flex" }}>{link ? usd(link.amount) : "Pay in dollars"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: "#64748b" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#4f46e5", color: "#fff", fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>$</div>
          Pay in dollars with StableTap
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, immutable" } },
  );
}
