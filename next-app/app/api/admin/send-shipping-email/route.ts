import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailFrom } from "@/lib/mailFrom";
import { SHIPPING_COMPLETE_EMAIL } from "@/lib/emailClientTexts";
import { getOrderSnapshotByOrderNoAndEmail } from "@/lib/orderSnapshotsStorage";

const ADMIN_SECRET = process.env.ADMIN_SHIPPING_SECRET?.trim();

export async function POST(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: { adminKey?: string; toEmail?: string; orderNo?: string; trackingNumber?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (body.adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const toEmail = typeof body.toEmail === "string" ? body.toEmail.trim() : "";
  if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const orderNo = typeof body.orderNo === "string" ? body.orderNo.trim() : "";
  if (!orderNo) {
    return NextResponse.json({ ok: false, error: "invalid_order_no" }, { status: 400 });
  }
  const trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber.trim() : undefined;

  let orderSummaryHtml: string | undefined;
  {
    const snapshot = await getOrderSnapshotByOrderNoAndEmail(orderNo, toEmail);
    if (snapshot?.body) orderSummaryHtml = snapshot.body;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromAddr = process.env.CLIENT_MAIL_FROM || process.env.ORDER_FROM || process.env.INQUERY_FROM;

  if (!host || !user || !pass || !fromAddr) {
    return NextResponse.json({ ok: false, error: "smtp_not_configured" }, { status: 500 });
  }

  const from = getMailFrom(fromAddr);
  const adminTo = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || "";
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const mailOptions: Parameters<typeof transporter.sendMail>[0] = {
    from,
    to: toEmail,
    subject: SHIPPING_COMPLETE_EMAIL.subject,
    html: SHIPPING_COMPLETE_EMAIL.bodyHtml(orderNo, trackingNumber, orderSummaryHtml),
  };
  if (adminTo.trim() && adminTo !== toEmail) {
    mailOptions.cc = adminTo.trim();
  }

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/send-shipping-email]", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
