/** The build this server runs. Open tabs compare it with the build they loaded to offer a reload after a deploy. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ build: process.env.NEXT_PUBLIC_BUILD_ID ?? null }, { headers: { "cache-control": "no-store" } });
}
