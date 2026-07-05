import { NextRequest, NextResponse } from "next/server";
import { geocode, getWeather, reverseGeocode } from "@/lib/weather";
import { searchHistory, stats } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/weather?q=Tehran
//   or
// GET /api/weather?lat=35.6&lon=51.4&name=Tehran&country=Iran&admin1=Tehran
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    let place;
    if (lat && lon) {
      place = {
        id: 0,
        name: searchParams.get("name") || "Selected location",
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        country: searchParams.get("country") || undefined,
        admin1: searchParams.get("admin1") || undefined,
        country_code: searchParams.get("cc") || undefined,
      };
    } else if (q) {
      const results = await geocode(q, 1);
      if (!results.length) {
        return NextResponse.json(
          { error: "No matching location found." },
          { status: 404 }
        );
      }
      place = results[0];
      // Log the search in the (Mongo or in-memory) history + bump counters.
      await searchHistory.add({
        name: place.name,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
      });
      await stats.bump("searches");
      await stats.bump("forecasts");
    } else {
      return NextResponse.json(
        { error: "Provide either ?q= or ?lat=&lon=." },
        { status: 400 }
      );
    }

    const weather = await getWeather(place);
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch weather." },
      { status: 502 }
    );
  }
}
