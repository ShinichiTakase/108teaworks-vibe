import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailFrom } from "@/lib/mailFrom";
import { moveDueQueueToTokens, ReviewQueueItem } from "@/lib/reviewsStorage";

const REQUEST_AFTER_DAYS = 8;
const TOKEN_VALID_DAYS = 10;

const TEMPLATE = {
  subject: (shop: string) => `【${shop}】商品レビューのご協力のお願い`,
  body: ({ shopName, name, url }: { shopName: string; name: string; url: string }) =>
    [
      `${name} 様`,
      "",
      `${shopName} です。`,
      "",
      "このたびはお買い上げいただき、誠にありがとうございます。",
      "よろしければ、以下のURLから商品のレビューにご協力ください。",
      "",
      url,
      "",
      "※本メールのURLは10日間有効です。",
      "",
      `${shopName}`,
    ].join("\n"),
};

const SHOP_NAME = "藤八茶寮";
/** レビュー依頼メールの控え（購入者宛と同文面が BCC で届く） */
const REVIEW_REQUEST_BCC = "info@108teaworks.com";

async function sendMailForQueueItem(
  item: ReviewQueueItem,
  baseUrl: string,
  transporter: nodemailer.Transporter
) {
  const url = `${baseUrl.replace(/\/+$/, "")}/review/${item.token}`;

  const subject = TEMPLATE.subject(SHOP_NAME);
  const text = TEMPLATE.body({ shopName: SHOP_NAME, name: item.name, url });

  const fromAddr = process.env.REVIEW_FROM || process.env.ORDER_FROM || process.env.INQUERY_FROM;
  const adminTo = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || fromAddr;
  const senderAddr = fromAddr || adminTo;

  if (!senderAddr) {
    throw new Error("no sender address configured for review mails");
  }

  const sender = getMailFrom(senderAddr);

  await transporter.sendMail({
    from: sender,
    to: item.email,
    bcc: REVIEW_REQUEST_BCC,
    subject,
    text,
  });
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.REVIEW_CRON_SECRET;
    if (secret) {
      const url = new URL(req.url);
      const token = url.searchParams.get("secret");
      if (token !== secret) {
        return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
      }
    }

    const hostUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://108teaworks.com";

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return NextResponse.json({ ok: false, error: "smtp_not_configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const now = new Date();
    const reqUrl = new URL(req.url);
    const isTest = reqUrl.searchParams.get("test") === "1"; // テスト時: 8日待たずにキューを即トークン化して送信
    const daysAfter = isTest ? 0 : REQUEST_AFTER_DAYS;
    const { moved: targets } = await moveDueQueueToTokens(now, daysAfter, TOKEN_VALID_DAYS);

    let sent = 0;
    for (const item of targets) {
      try {
        await sendMailForQueueItem(item, hostUrl, transporter);
        sent += 1;
      } catch (e) {
        console.error("[api/reviews/send-requests] send failed", e);
      }
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e) {
    console.error("[api/reviews/send-requests] error", e);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

