import { NextRequest, NextResponse } from "next/server";

function parseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { code?: string; subtotal?: number };
    const rawCode = body.code?.trim() ?? "";
    const subtotal = Number(body.subtotal ?? 0);

    if (!rawCode) {
      return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
    }
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json({ ok: false, error: "no_subtotal" }, { status: 400 });
    }

    const envCode = process.env.COUPON_CODE?.trim();
    if (!envCode) {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 400 });
    }

    const code = rawCode.toUpperCase();
    const expected = envCode.toUpperCase();
    if (code !== expected) {
      return NextResponse.json({ ok: false, error: "mismatch" }, { status: 400 });
    }

    const now = new Date();
    const start = parseDate(process.env.COUPON_START_AT);
    const end = parseDate(process.env.COUPON_END_AT);
    if (start && now < start) {
      return NextResponse.json({ ok: false, error: "not_started" }, { status: 400 });
    }
    if (end && now > end) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 400 });
    }

    const type = (process.env.COUPON_TYPE ?? "percent").toLowerCase();
    const value = Number(process.env.COUPON_VALUE ?? "0");
    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json({ ok: false, error: "invalid_config" }, { status: 400 });
    }

    let discountAmount = 0;
    let label = "";
    if (type === "amount") {
      discountAmount = Math.round(value);
      if (discountAmount > subtotal) discountAmount = subtotal;
      label = `¥${discountAmount.toLocaleString()}引き`;
    } else {
      const percent = value;
      discountAmount = Math.floor((subtotal * percent) / 100);
      if (discountAmount > subtotal) discountAmount = subtotal;
      label = `${percent}%OFF`;
    }

    if (discountAmount <= 0) {
      return NextResponse.json({ ok: false, error: "zero_discount" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      code: envCode,
      type,
      value,
      discountAmount,
      label,
    });
  } catch (e) {
    console.error("[api/coupon/validate]", e);
    return NextResponse.json({ ok: false, error: "error" }, { status: 500 });
  }
}

