import { NextRequest, NextResponse } from "next/server";
import { listB2b } from "@/lib/microcmsB2b";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Number(searchParams.get("limit") ?? "50");
  const offset = Number(searchParams.get("offset") ?? "0");

  const data = await listB2b({
    search: q || undefined,
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
  });

  return NextResponse.json(
    { ok: true, ...data },
    { headers: { "Cache-Control": "no-store" } }
  );
}

