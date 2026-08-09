import nodemailer from "nodemailer";
import { getMailFrom } from "@/lib/mailFrom";
import { SHIPPING_COMPLETE_EMAIL } from "@/lib/emailClientTexts";
import { getOrderSnapshotByOrderNoAndEmail } from "@/lib/orderSnapshotsStorage";

export type SendShippingCompleteEmailInput = {
  toEmail: string;
  orderNo: string;
  trackingNumber?: string;
};

export type SendShippingCompleteEmailResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "invalid_email"
        | "invalid_order_no"
        | "self_send"
        | "smtp_not_configured"
        | "send_failed";
    };

/** 発送完了メールを送信する（管理画面の各送信フローで共通利用） */
export async function sendShippingCompleteEmail(
  input: SendShippingCompleteEmailInput
): Promise<SendShippingCompleteEmailResult> {
  const toEmail = input.toEmail.trim();
  if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return { ok: false, error: "invalid_email" };
  }

  const fromAddr =
    process.env.CLIENT_MAIL_FROM || process.env.ORDER_FROM || process.env.INQUERY_FROM || "";
  const adminTo = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || "";
  const blockedAddresses = [fromAddr, adminTo].filter(Boolean).map((a) => a.trim().toLowerCase());
  if (blockedAddresses.includes(toEmail.toLowerCase())) {
    return { ok: false, error: "self_send" };
  }

  const orderNo = input.orderNo.trim();
  if (!orderNo) {
    return { ok: false, error: "invalid_order_no" };
  }
  const trackingNumber = input.trackingNumber?.trim() || undefined;

  let orderSummaryHtml: string | undefined;
  {
    const snapshot = await getOrderSnapshotByOrderNoAndEmail(orderNo, toEmail);
    if (snapshot?.body) orderSummaryHtml = snapshot.body;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !fromAddr) {
    return { ok: false, error: "smtp_not_configured" };
  }

  const from = getMailFrom(fromAddr);
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
    return { ok: true };
  } catch (e) {
    console.error("[shippingEmail] sendShippingCompleteEmail error", e);
    return { ok: false, error: "send_failed" };
  }
}
