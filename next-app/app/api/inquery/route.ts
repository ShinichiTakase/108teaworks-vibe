import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 },
      );
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

    const clientSubject = "藤八茶寮 - お問合せありがとうございました";
    const clientText = [
      `${name} 様`,
      "",
      "この度はお問い合わせいただきありがとうございました。",
      "下記内容にて承りました。",
      "",
      `お名前: ${name}`,
      `Eメール: ${email}`,
      "",
      "メッセージ:",
      message,
      "",
      "担当者より数日中に返信いたしますので、しばらくお待ちください。",
    ].join("\n");

    const clientFrom = process.env.CLIENT_MAIL_FROM || from;
    await transporter.sendMail({
      from: clientFrom,
      to: email,
      subject: clientSubject,
      text: clientText,
      replyTo: from,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send inquiry email:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }
}

