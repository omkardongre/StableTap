// Self-host the QR decoder's WebAssembly so the app never loads code from a CDN.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const src = require.resolve("zxing-wasm/reader/zxing_reader.wasm");
const dest = join(import.meta.dirname, "../public/wasm/zxing_reader.wasm");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`copied ${src} -> public/wasm/`);
