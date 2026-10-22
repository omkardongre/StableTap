import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/react.tsx"],
  format: "esm",
  platform: "neutral",
  target: "es2022",
  // Eager emit: the engine is TS source with .ts imports, which the lazy per-file mode cannot declare.
  dts: { eager: true },
  clean: true,
  // The engine is a private workspace package, so its code ships inside the SDK.
  // polkadot.js and React stay external: consumers install them once.
  noExternal: ["@stabletap/engine"],
  external: [/^@polkadot\//, "react", "react/jsx-runtime"],
});
