/**
 * Save the runtime's latest metadata (v16, includes runtime APIs) in the
 * `state_getMetadata` response shape that @polkadot/typegen reads.
 * state_getMetadata itself returns v14, which has no runtime-API section.
 *
 *   node scripts/fetch-metadata.ts <ws/http endpoint> <out.json>
 */
import { writeFile } from "node:fs/promises";

const [endpoint, out] = process.argv.slice(2);
if (!endpoint || !out) throw new Error("usage: fetch-metadata.ts <endpoint> <out.json>");
const url = endpoint.replace(/^ws/, "http");

async function rpc(method: string, params: unknown[]): Promise<string> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: 1, jsonrpc: "2.0", method, params }) });
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`);
  const body = (await res.json()) as { result?: string; error?: { message: string } };
  if (body.error || typeof body.result !== "string") throw new Error(`${method}: ${body.error?.message ?? "no result"}`);
  return body.result;
}

/** Decode SCALE Option<Vec<u8>>: 0x01 ++ compact(len) ++ bytes. */
function unwrapOptionBytes(hex: string): string {
  const b = Buffer.from(hex.slice(2), "hex");
  if (b[0] !== 1) throw new Error("Metadata version not available");
  const mode = b[1]! & 3;
  const offset = 1 + (mode === 0 ? 1 : mode === 1 ? 2 : mode === 2 ? 4 : 1 + (b[1]! >> 2) + 4);
  return `0x${b.subarray(offset).toString("hex")}`;
}

const versions = (await rpc("state_call", ["Metadata_metadata_versions", "0x"]));
const list = Buffer.from(versions.slice(2), "hex");
const count = list[0]! >> 2;
const available = Array.from({ length: count }, (_, i) => list.readUInt32LE(1 + i * 4)).filter((v) => v < 0xffff_ffff);
const latest = Math.max(...available);
const arg = Buffer.alloc(4);
arg.writeUInt32LE(latest);
const metadata = unwrapOptionBytes(await rpc("state_call", ["Metadata_metadata_at_version", `0x${arg.toString("hex")}`]));
if (!metadata.startsWith("0x6d657461")) throw new Error("Unexpected metadata prefix");
await writeFile(out, JSON.stringify({ jsonrpc: "2.0", id: 1, result: metadata }));
console.log(`metadata v${latest}, ${(metadata.length - 2) / 2} bytes -> ${out}`);
