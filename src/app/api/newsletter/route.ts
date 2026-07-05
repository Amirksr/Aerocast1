import { NextRequest, NextResponse } from "next/server";
import { newsletter } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const tags = Array.isArray(body.tags) ? body.tags.map(String) : [];

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { status } = await newsletter.subscribe(email, tags);
    return NextResponse.json(
      { success: true, status },
      { status: status === "created" ? 201 : 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
