import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { getMailFrom } from "@/lib/mailFrom";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { getB2bById, patchB2bByIdDetailed } from "@/lib/microcmsB2b";

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function selectValue(value: string, isArray: boolean): string | string[] {
  const v = value.trim();
  return isArray ? [v] : v;
}

function formatYen(n: number | undefined): string {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0;
  return `¥${v.toLocaleString()}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMailHtml(params: {
  customerName: string;
  title: string;
  lines: { productName?: string; quantity?: number; unitPrice?: number; lineTotal?: number }[];
  itemsTotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  grandTotal?: number;
  payUrl: string;
  expiresAtIso: string;
}) {
  const rows = params.lines
    .map((l) => {
      const name = escapeHtml((l.productName ?? "").trim() || "商品");
      const qty = typeof l.quantity === "number" && Number.isFinite(l.quantity) ? l.quantity : 0;
      const unit = typeof l.unitPrice === "number" && Number.isFinite(l.unitPrice) ? l.unitPrice : 0;
      const amt =
        typeof l.lineTotal === "number" && Number.isFinite(l.lineTotal) ? l.lineTotal : unit * qty;
      return `
<tr>
  <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${name}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;">${qty}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
        unit
      )}</td>
  <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
        amt
      )}</td>
</tr>`;
    })
    .join("");

  const exp = new Date(params.expiresAtIso);
  const expLine = Number.isFinite(exp.getTime())
    ? `有効期限：${exp.getFullYear()}-${String(exp.getMonth() + 1).padStart(2, "0")}-${String(
        exp.getDate()
      ).padStart(2, "0")} ${String(exp.getHours()).padStart(2, "0")}:${String(exp.getMinutes()).padStart(
        2,
        "0"
      )}`
    : `有効期限：${escapeHtml(params.expiresAtIso)}`;

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif; color:#111827; line-height:1.7;">
  <p>${escapeHtml(params.customerName)}様</p>
  <p>以下の内容をご確認の上、下のボタンからお支払いをお願いいたします。</p>

  <div style="font-weight:700;font-size:16px;margin:18px 0 10px;">${escapeHtml(params.title)}</div>

  <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="text-align:left;padding:8px 10px;border-bottom:1px solid #e5e7eb;">商品</th>
        <th style="text-align:center;padding:8px 10px;border-bottom:1px solid #e5e7eb;">数量</th>
        <th style="text-align:right;padding:8px 10px;border-bottom:1px solid #e5e7eb;">単価</th>
        <th style="text-align:right;padding:8px 10px;border-bottom:1px solid #e5e7eb;">金額</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr>
        <td style="padding:8px 10px;"></td><td></td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">商品合計</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">${formatYen(params.itemsTotal)}</td>
      </tr>
      <tr>
        <td style="padding:8px 10px;"></td><td></td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">送料</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">${formatYen(params.shippingFee)}</td>
      </tr>
      <tr>
        <td style="padding:8px 10px;"></td><td></td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">消費税</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;">${formatYen(params.taxAmount)}</td>
      </tr>
      <tr>
        <td style="padding:8px 10px;"></td><td></td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;font-weight:700;">総合計</td>
        <td style="padding:8px 10px;text-align:right;white-space:nowrap;font-weight:700;">${formatYen(
          params.grandTotal
        )}</td>
      </tr>
    </tbody>
  </table>

  <div style="margin:18px 0 8px;font-weight:700;">お支払いページ</div>
  <div style="margin:0 0 14px;">
    <a href="${escapeHtml(params.payUrl)}" style="display:inline-block;background:#0f766e;color:#fff;padding:12px 16px;border-radius:8px;text-decoration:none;font-weight:700;">
      支払いページを開く
    </a>
  </div>
  <div style="font-size:12px;color:#6b7280;">${escapeHtml(expLine)}</div>
  <div style="font-size:12px;color:#6b7280;margin-top:6px;">このメールに心当たりがない場合は破棄してください。</div>
</div>`;
}

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getB2bById(id);
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  if (item.paidAt || item.status === "paid") {
    return NextResponse.json({ ok: false, error: "already_paid" }, { status: 409 });
  }

  const toEmail = (item.customerEmail ?? "").trim();
  if (!toEmail || !isEmail(toEmail)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromAddr = process.env.CLIENT_MAIL_FROM || process.env.ORDER_FROM || process.env.INQUERY_FROM;
  if (!host || !user || !pass || !fromAddr) {
    return NextResponse.json({ ok: false, error: "smtp_not_configured" }, { status: 500 });
  }

  // token: 生トークンは保存せずメール本文にだけ載せる
  const rawToken = crypto.randomBytes(32).toString("hex"); // 64 chars
  const tokenHash = crypto.createHash("sha256").update(rawToken, "utf8").digest("hex");

  const now = new Date();
  const expiresAt = item.expiresAt ? new Date(item.expiresAt) : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const expiresAtIso = Number.isFinite(expiresAt.getTime())
    ? expiresAt.toISOString()
    : new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const payUrl = `${SITE_BASE_URL.replace(/\/$/, "")}/b2b/${rawToken}/`;

  const subjectTitle = (item.title ?? "").trim() || "お支払いのご案内";
  const subject = `【藤八茶寮】お支払いのご案内：${subjectTitle}`;
  const html = buildMailHtml({
    customerName: (item.customerName ?? "").trim() || "お客様",
    title: subjectTitle,
    lines: item.lines ?? [],
    itemsTotal: item.itemsTotal,
    shippingFee: item.shippingFee,
    taxAmount: item.taxAmount,
    grandTotal: item.grandTotal,
    payUrl,
    expiresAtIso,
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: getMailFrom(fromAddr),
      to: toEmail,
      subject,
      html,
      // 必要ならBccで管理者も受け取れるように
      bcc: process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || undefined,
    });
  } catch (e) {
    console.error("[api/admin/b2b/send] sendMail failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }

  // status が「単一選択（string）」か「複数選択（string[]）」かで失敗することがあるため、両方を試す
  const patchBase = {
    tokenHash,
    sentAt: now.toISOString(),
    expiresAt: expiresAtIso,
  };

  const firstIsArray =
    (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
    (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

  const first = await patchB2bByIdDetailed(id, {
    ...patchBase,
    status: selectValue("sent", firstIsArray),
  });
  const second =
    first.ok
      ? first
      : await patchB2bByIdDetailed(id, {
          ...patchBase,
          status: selectValue("sent", !firstIsArray),
        });

  if (!second.ok) {
    // メール送信後にDB更新が失敗した場合は運用上困るのでエラーにする
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

