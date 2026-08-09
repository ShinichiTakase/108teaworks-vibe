import { NextRequest, NextResponse } from "next/server";
import { softDeleteOrder } from "@/lib/microcmsOrders";

export async function POST(req: NextRequest) {
  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const ok = await softDeleteOrder(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
