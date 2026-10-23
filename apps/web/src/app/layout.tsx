import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { TopBar } from "@/components/TopBar";
import { UpdateBanner } from "@/components/UpdateBanner";
import "./globals.css";

// Self-hosted at build time by next/font, so the CSP's font-src 'self' still holds.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "StableTap",
  description: "Pay in dollars on Portaldot. The fee is paid in dollars too.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <TopBar />
        <main className="shell">{children}</main>
        <UpdateBanner />
      </body>
    </html>
  );
}
