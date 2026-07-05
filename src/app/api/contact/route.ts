import { NextRequest, NextResponse } from "next/server";
import { contacts } from "@/lib/store";
import { validateContact } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateContact(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const created = await contacts.submit(result.value);
    return NextResponse.json(
      { success: true, id: created._id ?? created.id },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
