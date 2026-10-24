import type { NextConfig } from "next";
import { loadNetwork } from "@stabletap/engine/config";
import { loadAppOptions } from "./src/lib/options.ts";

const isDev = process.env.NODE_ENV === "development";

// Fail the build early on a bad or missing network config.
const net = loadNetwork({
  STABLETAP_WS: process.env.NEXT_PUBLIC_STABLETAP_WS,
  STABLETAP_ASSET_ID: process.env.NEXT_PUBLIC_STABLETAP_ASSET_ID,
  STABLETAP_ASSET_DECIMALS: process.env.NEXT_PUBLIC_STABLETAP_ASSET_DECIMALS,
});
const opts = loadAppOptions(process.env, net.ss58);
if (opts.payAssets.includes(net.assetId)) throw new Error("NEXT_PUBLIC_STABLETAP_PAY_ASSETS must not include the stablecoin itself");

// 'wasm-unsafe-eval': sr25519 crypto and the QR decoder are WebAssembly.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self' ${net.ws}${opts.indexer ? ` ${new URL(opts.indexer).origin}` : ""}${opts.evm ? ` ${new URL(opts.evm.rpc).origin}` : ""}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only on a TLS deployment; it would also rewrite a local ws:// node URL to wss://.
  ...(net.ws.startsWith("wss://") ? ["upgrade-insecure-requests"] : []),
].join("; ");

// One id per build, baked into the page bundle and the /api/version route, so an open tab can tell a new deploy went out.
const buildId = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString(36);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BUILD_ID: buildId },
  poweredByHeader: false,
  typedRoutes: true,
  // Old route names (shared links, bookmarks, docs) keep working.
  async redirects() {
    return [
      { source: "/pos", destination: "/shop", permanent: true },
      { source: "/dashboard", destination: "/sales", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Permissions-Policy", value: "camera=(self), publickey-credentials-get=(self), publickey-credentials-create=(self)" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
