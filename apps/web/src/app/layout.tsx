import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { TabBar, TopBar } from "@/components/TopBar";
import { UpdateBanner } from "@/components/UpdateBanner";
import "./globals.css";

// Self-hosted at build time by next/font, so the CSP's font-src 'self' still holds.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// Absolute URLs for chat previews (og:image). Vercel sets the production host; locally it's the dev server.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "StableTap",
  description: "Pay in dollars on Portaldot. The fee is paid in dollars too.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  // Lets the bottom tab bar sit above the iPhone home bar (env(safe-area-inset-bottom)).
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <TopBar />
        <main className="shell">{children}</main>
        <TabBar />
        <UpdateBanner />
      </body>
    </html>
  );
}
