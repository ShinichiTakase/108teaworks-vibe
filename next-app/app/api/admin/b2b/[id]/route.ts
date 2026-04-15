import { NextRequest, NextResponse } from "next/server";
import { getB2bById, patchB2bById } from "@/lib/microcmsB2b";

const LINES_FIELD_ID = process.env.MICROCMS_B2B_LINES_FIELD_ID?.trim() || "lines";
const TAXMODE_IS_ARRAY =
  (process.env.MICROCMS_B2B_TAXMODE_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_TAXMODE_IS_ARRAY ?? "").trim().toLowerCase() === "true";
const STATUS_IS_ARRAY =
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

function selectValue(value: unknown, isArray: boolean): unknown {
  if (!isArray) return value;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return value;
}

function pickPatch(body: Record<string, unknown>): Record<string, unknown> {
  const allowed = [
    "title",
    "customerName",
    "customerEmail",
    "note",
    "itemsTotal",
    "shippingFee",
    "taxAmount",
    "grandTotal",
    "taxMode",
    "taxRate",
    "expiresAt",
    "lines",
    "status",
  ];
  const out: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) out[k] = body[k];
  }
  return out;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getB2bById(id);
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, item }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const current = await getB2bById(id);
  if (!current) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  // 送信後は変更不可（再送/無効化などの運用は別エンドポイントで扱う）
  if (current.sentAt) {
    return NextResponse.json({ ok: false, error: "already_sent" }, { status: 409 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const patch = pickPatch(body);
  if ("taxMode" in patch) {
    patch.taxMode = selectValue(patch.taxMode, TAXMODE_IS_ARRAY);
  }
  if ("status" in patch) {
    patch.status = selectValue(patch.status, STATUS_IS_ARRAY);
  }
  if ("lines" in patch && LINES_FIELD_ID !== "lines") {
    patch[LINES_FIELD_ID] = patch.lines;
    delete patch.lines;
  }
  const ok = await patchB2bById(id, patch);
  if (!ok) return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

