import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { INQUIRY_EMAIL_CLIENT } from "@/lib/emailClientTexts";
import { getMailFrom } from "@/lib/mailFrom";
import type { Locale } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, locale: localeParam } = body as {
      name?: string;
      email?: string;
      message?: string;
      locale?: string;
    };
    const locale: Locale = ["ja", "en", "ko", "zh"].includes(localeParam ?? "") ? (localeParam as Locale) : "ja";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 },
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.INQUERY_TO || "info@108teaworks.com";
    const fromAddr = process.env.INQUERY_FROM || to;
    const from = getMailFrom(fromAddr);

    if (!host || !user || !pass) {
      console.error("SMTP_USER or SMTP_PASS is not set");
      return NextResponse.json(
        { ok: false, error: "smtp_not_configured" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = "藤八茶寮 - お客様よりお問い合わせ";

    const text = [
      "108teaworks サイトよりお問い合わせがありました。",
      "",
      `お名前: ${name}`,
      `Eメール: ${email}`,
      "",
      "メッセージ:",
      message,
      "",
      "（このメールはサイトのお問い合わせフォームから自動送信されています）",
    ].join("\n");

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email,
    });

    const clientTpl = INQUIRY_EMAIL_CLIENT[locale];
    const clientSubject = clientTpl.subject;
    const clientText = clientTpl.body(name ?? "", email ?? "", message ?? "");

    const clientFromAddr = process.env.CLIENT_MAIL_FROM || fromAddr;
    const clientFrom = getMailFrom(clientFromAddr);
    try {
      await transporter.sendMail({
        from: clientFrom,
        to: email,
        subject: clientSubject,
        text: clientText,
        replyTo: fromAddr,
      });
    } catch (clientErr) {
      console.error("Failed to send inquiry auto-reply to client:", clientErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send inquiry email:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }
}

