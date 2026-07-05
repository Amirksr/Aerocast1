import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/weather";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/geocode?q=Berlin
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await geocode(q, 6);
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Geocoding failed." },
      { status: 502 }
    );
  }
}
