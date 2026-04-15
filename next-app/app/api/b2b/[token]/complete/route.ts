import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { getB2bByTokenHash, patchB2bByIdDetailed } from "@/lib/microcmsB2b";
import nodemailer from "nodemailer";
import { getMailFrom } from "@/lib/mailFrom";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const STATUS_IS_ARRAY =
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

const STATUS_FIELD_ID = process.env.MICROCMS_B2B_STATUS_FIELD_ID?.trim() || "status";
const PAID_AT_FIELD_ID = process.env.MICROCMS_B2B_PAIDAT_FIELD_ID?.trim() || "paidAt";
const STRIPE_PI_FIELD_ID =
  process.env.MICROCMS_B2B_STRIPE_PI_FIELD_ID?.trim() || "stripePaymentIntentId";

function selectValue(value: string, isArray: boolean): string | string[] {
  const v = value.trim();
  return isArray ? [v] : v;
}

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatYen(n: number | undefined): string {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0;
  return `¥${v.toLocaleString()}`;
}

async function notifyAdminPaid(params: {
  title: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentIntentId: string;
  lines: { productName?: string; quantity?: number; unitPrice?: number; lineTotal?: number }[];
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminTo = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || "info@108teaworks.com";
  const fromAddr = process.env.ORDER_FROM || process.env.INQUERY_FROM || adminTo;
  if (!host || !user || !pass) {
    console.warn("[api/b2b/complete] smtp_not_configured (skip admin notify)");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const rows = (params.lines ?? [])
    .map((l) => {
      const name = escapeHtml((l.productName ?? "").trim() || "商品");
      const qty = typeof l.quantity === "number" && Number.isFinite(l.quantity) ? l.quantity : 0;
      const unit = typeof l.unitPrice === "number" && Number.isFinite(l.unitPrice) ? l.unitPrice : 0;
      const amt =
        typeof l.lineTotal === "number" && Number.isFinite(l.lineTotal) ? l.lineTotal : unit * qty;
      return `<tr>
  <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;">${name}</td>
  <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:center;">${qty}</td>
  <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
        unit
      )}</td>
  <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
        amt
      )}</td>
</tr>`;
    })
    .join("");

  const subject = `【B2B支払い完了】${params.customerName}様 ${formatYen(params.amount)}`;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif;line-height:1.7;color:#111827;">
  <p>B2B取引の支払いが完了しました。</p>
  <div><b>タイトル</b>: ${escapeHtml(params.title)}</div>
  <div><b>顧客</b>: ${escapeHtml(params.customerName)}（${escapeHtml(params.customerEmail)}）</div>
  <div><b>総合計</b>: ${formatYen(params.amount)}</div>
  <div><b>PaymentIntent</b>: ${escapeHtml(params.paymentIntentId)}</div>
  <div style="margin-top:14px;font-weight:700;">明細</div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="text-align:left;padding:6px 10px;border-bottom:1px solid #e5e7eb;">商品</th>
        <th style="text-align:center;padding:6px 10px;border-bottom:1px solid #e5e7eb;">数量</th>
        <th style="text-align:right;padding:6px 10px;border-bottom:1px solid #e5e7eb;">単価</th>
        <th style="text-align:right;padding:6px 10px;border-bottom:1px solid #e5e7eb;">金額</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td style="padding:8px 10px;" colspan="4">（明細なし）</td></tr>`}
    </tbody>
  </table>
</div>`;

  await transporter.sendMail({
    from: getMailFrom(fromAddr),
    to: adminTo,
    subject,
    html,
    replyTo: params.customerEmail,
  });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const raw = (token ?? "").trim();
  if (!raw || raw.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 500 });
  }

  let body: { paymentIntentId?: string } = {};
  try {
    body = (await req.json()) as any;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const piId = typeof body.paymentIntentId === "string" ? body.paymentIntentId : "";
  if (!piId.startsWith("pi_")) {
    return NextResponse.json({ ok: false, error: "invalid_payment_intent" }, { status: 400 });
  }

  const tokenHash = sha256Hex(raw);
  const item = await getB2bByTokenHash(tokenHash);
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const pi = await stripe.paymentIntents.retrieve(piId);
  if (pi.status !== "succeeded") {
    return NextResponse.json({ ok: false, error: "payment_not_succeeded", status: pi.status }, { status: 400 });
  }

  const expected = Math.round(item.grandTotal ?? 0);
  if (expected < 1 || pi.amount !== expected) {
    return NextResponse.json({ ok: false, error: "amount_mismatch" }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const firstIsArray = STATUS_IS_ARRAY;
  const basePatch: Record<string, unknown> = {
    [PAID_AT_FIELD_ID]: nowIso,
    [STRIPE_PI_FIELD_ID]: piId,
    [STATUS_FIELD_ID]: selectValue("paid", firstIsArray),
  };
  const first = await patchB2bByIdDetailed(item.id, basePatch);
  if (!first.ok) {
    const second = await patchB2bByIdDetailed(item.id, {
      ...basePatch,
      [STATUS_FIELD_ID]: selectValue("paid", !firstIsArray),
    });
    if (!second.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "update_failed",
          // 反映失敗時に切り分けしやすいようにキー名だけ返す（値は返さない）
          fields: {
            paidAt: PAID_AT_FIELD_ID,
            stripePaymentIntentId: STRIPE_PI_FIELD_ID,
            status: STATUS_FIELD_ID,
          },
        },
        { status: 500 }
      );
    }
  }

  // 管理者へ支払い完了通知（失敗しても決済完了扱いは維持）
  try {
    await notifyAdminPaid({
      title: (item.title ?? "").trim() || "B2B取引",
      customerName: (item.customerName ?? "").trim() || "お客様",
      customerEmail: (item.customerEmail ?? "").trim() || "",
      amount: expected,
      paymentIntentId: piId,
      lines: item.lines ?? [],
    });
  } catch (e) {
    console.error("[api/b2b/complete] admin notify failed", e);
  }

  return NextResponse.json({ ok: true });
}

