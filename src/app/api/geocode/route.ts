import { NextRequest, NextResponse } from "next/server";
import { geocode, mergeWithEnglishNames } from "@/lib/weather";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/geocode?q=Berlin&lang=fa
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const lang = searchParams.get("lang")?.trim() || "en";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    if (lang === "en") {
      const results = await geocode(q, 6, "en");
      return NextResponse.json(
        { results },
        { headers: { "Cache-Control": "public, s-maxage=86400" } }
      );
    }

    // Non-English UI: fetch localized + English in parallel and merge, so
    // the dropdown can show both (e.g. "اصفهان · Isfahan") instead of only
    // the localized name, which was confusing on its own.
    const [localized, english] = await Promise.all([
      geocode(q, 6, lang),
      geocode(q, 6, "en"),
    ]);
    const results = mergeWithEnglishNames(localized, english);
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
