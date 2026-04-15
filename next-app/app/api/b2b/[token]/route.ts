import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getB2bByTokenHash, patchB2bByIdDetailed } from "@/lib/microcmsB2b";

const STATUS_IS_ARRAY =
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

const STATUS_FIELD_ID = process.env.MICROCMS_B2B_STATUS_FIELD_ID?.trim() || "status";
const OPENED_AT_FIELD_ID = process.env.MICROCMS_B2B_OPENEDAT_FIELD_ID?.trim() || "openedAt";

function selectValue(value: string, isArray: boolean): string | string[] {
  const v = value.trim();
  return isArray ? [v] : v;
}

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const raw = (token ?? "").trim();
  if (!raw || raw.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }

  const tokenHash = sha256Hex(raw);
  const item = await getB2bByTokenHash(tokenHash);
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  // 期限切れ
  if (item.expiresAt) {
    const exp = new Date(item.expiresAt);
    if (Number.isFinite(exp.getTime()) && exp.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }
  }

  // 初回閲覧時に openedAt を記録（失敗しても閲覧は継続）
  if (!item.openedAt && item.id) {
    const nowIso = new Date().toISOString();
    const firstIsArray = STATUS_IS_ARRAY;
    const first = await patchB2bByIdDetailed(item.id, {
      [OPENED_AT_FIELD_ID]: nowIso,
      [STATUS_FIELD_ID]: selectValue("opened", firstIsArray),
    });
    if (!first.ok) {
      await patchB2bByIdDetailed(item.id, {
        [OPENED_AT_FIELD_ID]: nowIso,
        [STATUS_FIELD_ID]: selectValue("opened", !firstIsArray),
      });
    }
  }

  // 公開側に不要な情報を落とす
  const safe = {
    id: item.id,
    title: item.title,
    customerName: item.customerName,
    customerEmail: item.customerEmail,
    lines: item.lines ?? [],
    itemsTotal: item.itemsTotal,
    shippingFee: item.shippingFee,
    taxAmount: item.taxAmount,
    grandTotal: item.grandTotal,
    taxMode: item.taxMode,
    taxRate: item.taxRate,
    expiresAt: item.expiresAt,
    openedAt: item.openedAt,
    sentAt: item.sentAt,
    paidAt: item.paidAt,
    status: item.status,
    stripePaymentIntentId: item.stripePaymentIntentId,
  };

  return NextResponse.json({ ok: true, item: safe }, { headers: { "Cache-Control": "no-store" } });
}

