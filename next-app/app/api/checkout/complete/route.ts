import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { buildReceiptPdf } from "@/lib/receiptPdf";
import { translateManyForLocale } from "@/lib/translateForLocale";
import { ORDER_EMAIL_LABELS, ORDER_EMAIL_SUBJECT } from "@/lib/emailClientTexts";
import { getMailFrom } from "@/lib/mailFrom";
import type { Locale } from "@/lib/i18n";
import { upsertCustomerOnce } from "@/lib/microcmsCustomers";
import { enqueueReviewRequest } from "@/lib/reviewsStorage";

type OrderEmailLabels = (typeof ORDER_EMAIL_LABELS)[Locale];

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

type OrderLine = { slug?: string; name: string; quantity: number; unitPrice: number; amount: number };
type Address = {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phone: string;
  email: string;
};
type ShipAddress = {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  phone?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function formatOrderNoFromUnixSeconds(sec: number): string {
  const d = new Date(sec * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `R-${y}${m}${day}${hh}${mm}${ss}`;
}

function buildOrderHtml(params: {
  intro: string;
  titleLine: string;
  lines: OrderLine[];
  shipping: number;
  total: number;
  includedTax: number;
  billing: Address;
  shippingAddr: ShipAddress;
  memoText: string;
  orderNo: string;
  labels?: OrderEmailLabels;
}): string {
  const {
    intro,
    titleLine,
    lines,
    shipping,
    total,
    includedTax,
    billing,
    shippingAddr,
    memoText,
    orderNo,
    labels: L,
  } = params;

  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
            l.name
          )}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center;white-space:nowrap;">${l.quantity}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
            l.unitPrice
          )}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">${formatYen(
            l.amount
          )}</td>
        </tr>`
    )
    .join("");

  const addrBlock = (a: {
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
    phone?: string;
    email?: string;
  }) => {
    const lines = [
      `${a.name}様`,
      `〒${a.postalCode}`,
      `${a.prefecture}${a.city}${a.addressLine}`,
      a.phone ? a.phone : null,
      a.email ? a.email : null,
    ].filter(Boolean) as string[];
    return lines.map((x) => `<div>${escapeHtml(x)}</div>`).join("");
  };

  const orderContent = L?.orderContent ?? "ご注文内容：";
  const thProduct = L?.thProduct ?? "商品";
  const thQty = L?.thQty ?? "数量";
  const thUnitPrice = L?.thUnitPrice ?? "単価";
  const thAmount = L?.thAmount ?? "金額";
  const shipLabel = L?.shipping ?? "送料";
  const totalLabel = L?.total ?? "合計";
  const taxLabel = L?.taxIncluded ?? "内消費税";
  const shippingDate = L?.shippingDate ?? "発送予定日：本日より2～5営業日";
  const billingLabel = L?.billingLabel ?? "請求先住所：";
  const shippingAddrLabel = L?.shippingAddrLabel ?? "お届け先：";
  const memoLabel = L?.memoLabel ?? "注文に関するメモ：";
  const orderNoLabel = L?.orderNoLabel ?? "注文番号：";

  return `
  <div style="font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif; color:#111827; line-height:1.7;">
    <p>${escapeHtml(intro)}</p>

    <div style="font-weight:700;font-size:18px;margin:18px 0 10px;">${escapeHtml(titleLine)}</div>

    <div style="font-weight:700;margin:16px 0 8px;">${escapeHtml(orderContent)}</div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="text-align:left;padding:8px 10px;border-bottom:1px solid #e5e7eb;">${escapeHtml(thProduct)}</th>
          <th style="text-align:center;padding:8px 10px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(thQty)}</th>
          <th style="text-align:right;padding:8px 10px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(thUnitPrice)}</th>
          <th style="text-align:right;padding:8px 10px;border-bottom:1px solid #e5e7eb;white-space:nowrap;">${escapeHtml(thAmount)}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td style="padding:8px 10px;"></td>
          <td style="padding:8px 10px;"></td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;">${escapeHtml(shipLabel)}</td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;">${formatYen(shipping)}</td>
        </tr>
        <tr>
          <td style="padding:8px 10px;"></td>
          <td style="padding:8px 10px;"></td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;font-weight:700;">${escapeHtml(totalLabel)}</td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;font-weight:700;">${formatYen(total)}</td>
        </tr>
        <tr>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;"></td>
          <td style="padding:8px 10px;border-top:1px solid #e5e7eb;"></td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;border-top:1px solid #e5e7eb;">${escapeHtml(taxLabel)}</td>
          <td style="padding:8px 10px;text-align:right;white-space:nowrap;border-top:1px solid #e5e7eb;">${formatYen(
            includedTax
          )}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin:14px 0 0;">${escapeHtml(shippingDate)}</div>

    <div style="font-weight:700;margin:18px 0 6px;">${escapeHtml(billingLabel)}</div>
    ${addrBlock(billing)}

    <div style="font-weight:700;margin:18px 0 6px;">${escapeHtml(shippingAddrLabel)}</div>
    ${addrBlock(shippingAddr)}

    <div style="font-weight:700;margin:18px 0 6px;">${escapeHtml(memoLabel)}</div>
    <div style="white-space:pre-wrap;">${escapeHtml(memoText)}</div>

    <div style="font-weight:700;margin:18px 0 6px;">${escapeHtml(orderNoLabel)}</div>
    <div>${escapeHtml(orderNo)}</div>
  </div>`;
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 500 });
    }

    const body = (await req.json()) as {
      paymentIntentId?: string;
      locale?: string;
      customer?: {
        email?: string;
        name?: string;
        tel?: string;
        zipcode?: string;
        prefectures?: string;
        city?: string;
        address?: string;
        approval?: 0 | 1;
      };
      order?: {
        lines?: OrderLine[];
        shipping?: number;
        billingAddress?: Address;
        shippingAddress?: ShipAddress;
        giftNoInvoice?: boolean;
        memo?: string;
      };
    };

    const paymentIntentId = body.paymentIntentId;
    const locale: Locale = ["ja", "en", "ko", "zh"].includes(body.locale ?? "") ? (body.locale as Locale) : "ja";
    if (!paymentIntentId) {
      return NextResponse.json({ ok: false, error: "missing_payment_intent" }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") {
      return NextResponse.json({ ok: false, error: "payment_not_succeeded", status: pi.status }, { status: 400 });
    }

    const order = body.order ?? {};
    const lines = (order.lines ?? []).filter((x) => x && typeof x.name === "string");
    const shipping = Math.max(0, Math.round(order.shipping ?? 0));
    const total = lines.reduce((s, l) => s + Math.round(l.amount ?? 0), 0) + shipping;
    const net = Math.floor(total / 1.08);
    const includedTax = total - net;

    const billingAddr = order.billingAddress;
    const shipAddr = order.shippingAddress;
    if (!billingAddr || !shipAddr || !billingAddr.email) {
      return NextResponse.json({ ok: false, error: "missing_order_fields" }, { status: 400 });
    }

    const orderNo = formatOrderNoFromUnixSeconds(pi.created);
    const memoParts: string[] = [];
    if (order.giftNoInvoice) {
      memoParts.push("金額記載の明細書は不要（ギフト用）");
    }
    if (order.memo?.trim()) {
      memoParts.push(order.memo.trim());
    }
    const memoText = memoParts.join("\n");

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const adminTo = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || "info@108teaworks.com";
    const fromAddr = process.env.ORDER_FROM || process.env.INQUERY_FROM || adminTo;
    const from = getMailFrom(fromAddr);
    const clientFromAddr = process.env.CLIENT_MAIL_FROM || fromAddr;
    const clientFrom = getMailFrom(clientFromAddr);

    if (!host || !user || !pass) {
      return NextResponse.json({ ok: false, error: "smtp_not_configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const firstName = lines[0]?.name ?? "ご注文";
    const others = Math.max(0, lines.length - 1);
    const subjectSuffix = others > 0 ? `${firstName} 他 ${others} 点` : firstName;

    // 管理者（領収書PDF添付あり）
    const adminSubject = `藤八茶寮から${billingAddr.name}様のご注文 ${subjectSuffix}`;
    const adminHtml = buildOrderHtml({
      intro: "藤八茶寮 から注文が入りました。",
      titleLine: "ご注文の確認",
      lines,
      shipping,
      total,
      includedTax,
      billing: billingAddr,
      shippingAddr: shipAddr,
      memoText,
      orderNo,
    });

    const receiptPdf = await buildReceiptPdf({
      transactionAt: new Date(pi.created * 1000),
      recipientName: billingAddr.name,
      items: lines.map((l) => ({
        name: l.name,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        amount: l.amount,
      })),
      shipping,
      subtotal: total,
      taxAmount: includedTax,
      total,
    });

    await transporter.sendMail({
      from,
      to: adminTo,
      subject: adminSubject,
      html: adminHtml,
      replyTo: billingAddr.email,
      attachments: [
        {
          filename: `${orderNo}.pdf`,
          content: receiptPdf,
          contentType: "application/pdf",
        },
      ],
    });

    // レビュー依頼用キューに購入情報を登録（失敗しても注文処理は継続）
    try {
      const reviewItems =
        lines
          .filter((l) => l.slug && l.name)
          .map((l) => ({ slug: l.slug as string, title: l.name })) ?? [];
      if (reviewItems.length > 0) {
        await enqueueReviewRequest({
          email: billingAddr.email,
          name: billingAddr.name,
          locale,
          items: reviewItems,
        });
      }
    } catch (e) {
      console.error("[api/checkout/complete] enqueueReviewRequest failed", e);
    }

    // customers 登録（重複: email + tel）。失敗しても注文完了自体は妨げない。
    try {
      const c = body.customer;
      if (c?.email && c?.tel) {
        await upsertCustomerOnce({
          email: c.email,
          name: c.name ?? billingAddr.name,
          tel: c.tel,
          zipcode: c.zipcode ?? billingAddr.postalCode,
          prefectures: c.prefectures ?? billingAddr.prefecture,
          city: c.city ?? billingAddr.city,
          address: c.address ?? billingAddr.addressLine,
          approval: c.approval === 0 ? 0 : 1,
        });
      } else if (billingAddr.email && billingAddr.phone) {
        await upsertCustomerOnce({
          email: billingAddr.email,
          name: billingAddr.name,
          tel: billingAddr.phone,
          zipcode: billingAddr.postalCode,
          prefectures: billingAddr.prefecture,
          city: billingAddr.city,
          address: billingAddr.addressLine,
          approval: 1,
        });
      }
    } catch (e) {
      console.error("[api/checkout/complete] customers upsert failed", e);
    }

    const itemNamesForSummary = locale === "ja" ? lines.map((l) => l.name) : await translateManyForLocale(lines.map((l) => l.name), locale);
    const summaryLines = lines.map((l, i) => ({ ...l, name: itemNamesForSummary[i] ?? l.name }));

    const orderLabels = ORDER_EMAIL_LABELS[locale];
    const clientSubject = ORDER_EMAIL_SUBJECT[locale](summaryLines[0]?.name ?? "", Math.max(0, summaryLines.length - 1));

    const clientHtml = buildOrderHtml({
      intro: orderLabels.intro,
      titleLine: orderLabels.titleLine,
      lines: summaryLines,
      shipping,
      total,
      includedTax,
      billing: billingAddr,
      shippingAddr: shipAddr,
      memoText,
      orderNo,
      labels: orderLabels,
    });

    try {
      await transporter.sendMail({
        from: clientFrom,
        to: billingAddr.email,
        subject: clientSubject,
        html: clientHtml,
        replyTo: fromAddr,
      });
    } catch (clientErr) {
      console.error("[api/checkout/complete] client mail failed", clientErr);
    }

    return NextResponse.json({
      ok: true,
      orderNo,
      clientHtml,
      summary: {
        items: summaryLines.map((l) => ({
          name: l.name,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          amount: l.amount,
        })),
        shipping,
        total,
        includedTax,
        orderNo,
      },
    });
  } catch (e) {
    console.error("[api/checkout/complete]", e);
    return NextResponse.json({ ok: false, error: "complete_failed" }, { status: 500 });
  }
}

