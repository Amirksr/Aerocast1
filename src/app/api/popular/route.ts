import { NextResponse } from "next/server";
import { popularCities } from "@/lib/seed-data";

export const runtime = "nodejs";

// GET /api/popular — curated starting cities for the homepage.
export async function GET() {
  return NextResponse.json(
    { cities: popularCities },
    { headers: { "Cache-Control": "public, s-maxage=86400" } }
  );
}
