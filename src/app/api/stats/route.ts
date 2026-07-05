import { NextResponse } from "next/server";
import { stats } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await stats.get();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
