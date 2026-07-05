import { NextRequest, NextResponse } from "next/server";
import { favorites } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await favorites.list();
    return NextResponse.json({ favorites: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      typeof body.name !== "string" ||
      typeof body.latitude !== "number" ||
      typeof body.longitude !== "number"
    ) {
      return NextResponse.json(
        { error: "name, latitude and longitude are required." },
        { status: 400 }
      );
    }
    const created = await favorites.add({
      placeId: body.placeId,
      name: body.name,
      admin1: body.admin1,
      country: body.country,
      countryCode: body.countryCode,
      latitude: body.latitude,
      longitude: body.longitude,
      note: body.note,
    });
    return NextResponse.json({ favorite: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  try {
    const ok = await favorites.remove(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
