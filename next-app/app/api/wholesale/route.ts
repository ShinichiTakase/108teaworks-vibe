import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { WHOLESALE_EMAIL_CLIENT } from "@/lib/emailClientTexts";
import { getMailFrom } from "@/lib/mailFrom";
import type { Locale } from "@/lib/i18n";

const REQUIRED = [
  "company",
  "lastName",
  "firstName",
  "phone",
  "email",
  "message",
] as const;

type WholesaleBody = {
  company?: string;
  department?: string;
  lastName?: string;
  firstName?: string;
  phone?: string;
  email?: string;
  message?: string;
  locale?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WholesaleBody;
    const {
      company,
      department,
      lastName,
      firstName,
      phone,
      email,
      message,
      locale: localeParam,
    } = body;
    const locale: Locale = ["ja", "en", "ko", "zh"].includes(localeParam ?? "") ? (localeParam as Locale) : "ja";

    for (const key of REQUIRED) {
      const v = body[key];
      if (v == null || String(v).trim() === "") {
        return NextResponse.json(
          { ok: false, error: "missing_fields" },
          { status: 400 },
        );
      }
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

    const subject = "藤八茶寮 - パートナー募集フォームからのお問い合わせ";

    const text = [
      "パートナー募集（卸売り）フォームよりお問い合わせがありました。",
      "",
      `事業者名: ${company ?? ""}`,
      department ? `部署名: ${department}` : null,
      `名前: ${lastName ?? ""} ${firstName ?? ""}`,
      `電話番号: ${phone ?? ""}`,
      `メールアドレス: ${email ?? ""}`,
      "",
      "お問い合わせ内容:",
      message ?? "",
      "",
      "（このメールはサイトのパートナー募集フォームから自動送信されています）",
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email ?? undefined,
    });

    const clientTpl = WHOLESALE_EMAIL_CLIENT[locale];
    const clientSubject = clientTpl.subject;
    const clientText = clientTpl.body(
      company ?? "",
      department ?? "",
      lastName ?? "",
      firstName ?? "",
      phone ?? "",
      email ?? "",
      message ?? ""
    );

    const clientFromAddr = process.env.CLIENT_MAIL_FROM || fromAddr;
    const clientFrom = getMailFrom(clientFromAddr);
    try {
      await transporter.sendMail({
        from: clientFrom,
        to: email ?? "",
        subject: clientSubject,
        text: clientText,
        replyTo: fromAddr,
      });
    } catch (clientErr) {
      console.error("Failed to send wholesale auto-reply to client:", clientErr);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send wholesale inquiry email:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }
}
