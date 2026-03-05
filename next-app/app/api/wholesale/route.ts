import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    } = body;

    for (const key of REQUIRED) {
      const v = body[key];
      if (v == null || String(v).trim() === "") {
        return NextResponse.json(
          { ok: false, error: "missing_fields" },
          { status: 400 },
        );
      }
    }

    const host = process.env.SMTP_HOST || "mail.edgeailab.jp";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.INQUERY_TO || "info@108teaworks.com";
    const from = process.env.INQUERY_FROM || to;

    if (!user || !pass) {
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

    const clientSubject = "藤八茶寮 - お問合せありがとうございました";
    const clientNameLine = [company, department].filter(Boolean).join(" ") + " 様";
    const clientText = [
      clientNameLine,
      "",
      "この度はお問い合わせいただきありがとうございました。",
      "下記内容にて承りました。",
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
      "担当者より数日中に返信いたしますので、しばらくお待ちください。",
    ]
      .filter(Boolean)
      .join("\n");

    const clientFrom = process.env.CLIENT_MAIL_FROM || from;
    await transporter.sendMail({
      from: clientFrom,
      to: email ?? "",
      subject: clientSubject,
      text: clientText,
      replyTo: from,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send wholesale inquiry email:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }
}
