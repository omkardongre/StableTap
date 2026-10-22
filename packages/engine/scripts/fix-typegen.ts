/**
 * @polkadot/typegen 17 references the runtime's outer call enum
 * (`<Runtime>RuntimeCall`) in runtime-API signatures without generating it.
 * polkadot.js models that enum as its generic `Call`, so point the reference there.
 */
import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../src/interfaces/augment-api-runtime.ts", import.meta.url);
let src = await readFile(file, "utf8");
const missing = "PortaldotV3RuntimeRuntimeCall";
if (src.includes(missing)) {
  src = src.replaceAll(missing, "Call");
  if (!/import type \{[^}]*\bCall\b[^}]*\} from '@polkadot\/types\/interfaces\/runtime'/.test(src)) {
    src = src.replace(/^(import '@polkadot\/api-base\/types\/calls';\n)/m, "$1\nimport type { Call } from '@polkadot/types/interfaces/runtime';\n");
  }
  await writeFile(file, src);
  console.log(`fix-typegen: ${missing} -> Call`);
}
