import { NextRequest, NextResponse } from "next/server";
import { searchHistory } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await searchHistory.list(10);
    return NextResponse.json({ history: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.name !== "string" || typeof body.latitude !== "number") {
      return NextResponse.json(
        { error: "name and latitude are required." },
        { status: 400 }
      );
    }
    const created = await searchHistory.add({
      name: body.name,
      country: body.country,
      latitude: body.latitude,
      longitude: body.longitude,
    });
    return NextResponse.json({ entry: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
