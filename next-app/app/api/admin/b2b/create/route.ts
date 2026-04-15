import { NextRequest, NextResponse } from "next/server";
import { createB2b } from "@/lib/microcmsB2b";

// b2b スキーマの「繰り返しフィールド」のフィールドID（例: lines）
const LINES_FIELD_ID = process.env.MICROCMS_B2B_LINES_FIELD_ID?.trim() || "lines";
// 繰り返し内で使う「カスタムフィールド」のID（例: products）
const LINE_CUSTOM_FIELD_ID = process.env.MICROCMS_B2B_LINE_CUSTOM_FIELD_ID?.trim() || "products";
const TAXMODE_IS_ARRAY =
  (process.env.MICROCMS_B2B_TAXMODE_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_TAXMODE_IS_ARRAY ?? "").trim().toLowerCase() === "true";
const STATUS_IS_ARRAY =
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

function selectValue(value: string, isArray: boolean): string | string[] {
  const v = value.trim();
  return isArray ? [v] : v;
}

function roundYen(n: unknown): number {
  const v = typeof n === "number" ? n : typeof n === "string" ? Number(n) : NaN;
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.round(v));
}

function normalizeLines(lines: unknown): {
  fieldId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : {}))
    .map((o) => {
      const productName = typeof o.productName === "string" ? o.productName.trim() : "";
      const quantity = Math.max(0, roundYen(o.quantity));
      const unitPrice = Math.max(0, roundYen(o.unitPrice));
      const lineTotal = Math.max(0, roundYen(o.lineTotal ?? unitPrice * quantity));
      return { fieldId: LINE_CUSTOM_FIELD_ID, productName, quantity, unitPrice, lineTotal };
    })
    .filter((l) => l.productName && l.quantity > 0);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  const note = typeof body.note === "string" ? body.note : "";
  const taxModeRaw = typeof body.taxMode === "string" ? body.taxMode : "inclusive";
  const taxRate = typeof body.taxRate === "number" ? body.taxRate : typeof body.taxRate === "string" ? Number(body.taxRate) : 0.1;

  const lines = normalizeLines(body.lines);
  const itemsTotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shippingFee = roundYen(body.shippingFee);
  const baseTotal = itemsTotal + shippingFee;

  // taxAmount は入力があれば採用、なければ taxMode に応じて自動計算（最小限）
  const taxAmountInput = roundYen(body.taxAmount);
  const taxAmount =
    taxAmountInput > 0
      ? taxAmountInput
      : taxModeRaw === "exclusive"
        ? Math.round(baseTotal * (Number.isFinite(taxRate) ? taxRate : 0.1))
        : Math.max(0, baseTotal - Math.floor(baseTotal / (1 + (Number.isFinite(taxRate) ? taxRate : 0.1))));

  const grandTotalInput = roundYen(body.grandTotal);
  const grandTotal =
    grandTotalInput > 0
      ? grandTotalInput
      : taxModeRaw === "exclusive"
        ? baseTotal + taxAmount
        : baseTotal;

  if (!customerName || !customerEmail || !title || lines.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const created = await createB2b({
    title,
    customerName,
    customerEmail,
    note,
    [LINES_FIELD_ID]: lines,
    itemsTotal,
    shippingFee,
    taxAmount,
    grandTotal,
    taxMode: selectValue(taxModeRaw, TAXMODE_IS_ARRAY),
    taxRate: Number.isFinite(taxRate) ? taxRate : 0.1,
    status: selectValue("draft", STATUS_IS_ARRAY),
  });

  if (!created.ok) {
    return NextResponse.json({ ok: false, error: "create_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: created.id });
}

