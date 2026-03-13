import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailFrom } from "@/lib/mailFrom";
import { moveDueQueueToTokens, ReviewQueueItem } from "@/lib/reviewsStorage";
import type { Locale } from "@/lib/i18n";

const REQUEST_AFTER_DAYS = 8;
const TOKEN_VALID_DAYS = 10;

type Template = {
  subject: (shopName: string) => string;
  body: (params: { shopName: string; name: string; url: string }) => string;
};

const TEMPLATES: Record<Locale, Template> = {
  ja: {
    subject: (shop) => `【${shop}】商品レビューのご協力のお願い`,
    body: ({ shopName, name, url }) =>
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
  },
  en: {
    subject: (shop) => `[${shop}] Please review your purchase`,
    body: ({ shopName, name, url }) =>
      [
        `Dear ${name},`,
        "",
        `Thank you for shopping with ${shopName}.`,
        "We would appreciate it if you could leave a review for your recent purchase:",
        "",
        url,
        "",
        "※ The link is valid for 10 days.",
        "",
        shopName,
      ].join("\n"),
  },
  ko: {
    subject: (shop) => `【${shop}】구매 상품에 대한 리뷰 요청`,
    body: ({ shopName, name, url }) =>
      [
        `${name} 님께,`,
        "",
        `${shopName}를 이용해 주셔서 감사합니다.`,
        "아래 링크에서 구매하신 상품에 대한 리뷰를 남겨 주시면 감사하겠습니다.",
        "",
        url,
        "",
        "※ 이 링크는 10일 동안 유효합니다.",
        "",
        shopName,
      ].join("\n"),
  },
  zh: {
    subject: (shop) => `【${shop}】商品评价请求`,
    body: ({ shopName, name, url }) =>
      [
        `${name} 您好：`,
        "",
        `感谢您在 ${shopName} 的购买。`,
        "如果方便的话，欢迎通过以下链接为本次购买的商品留下评价：",
        "",
        url,
        "",
        "※ 此链接在 10 日内有效。",
        "",
        shopName,
      ].join("\n"),
  },
};

const SHOP_NAME = "藤八茶寮";

async function sendMailForQueueItem(
  item: ReviewQueueItem,
  baseUrl: string,
  transporter: nodemailer.Transporter
) {
  const locale: Locale = ["ja", "en", "ko", "zh"].includes(item.locale) ? item.locale : "ja";
  const tmpl = TEMPLATES[locale] ?? TEMPLATES.ja;
  const url = `${baseUrl.replace(/\/+$/, "")}/review/${item.token}`;

  const subject = tmpl.subject(SHOP_NAME);
  const text = tmpl.body({ shopName: SHOP_NAME, name: item.name, url });

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
    const tokens = await moveDueQueueToTokens(now, daysAfter, TOKEN_VALID_DAYS);

    // 直近でトークン化された分のうち、今回が初回メールとなるものだけ抽出
    // moveDueQueueToTokens は「既存トークン + 今回分」を返すため、
    // createdAt が threshold より前のもののうち、今まさに queue から移されたものを判定する。
    const threshold = now.getTime() - TOKEN_VALID_DAYS * 24 * 60 * 60 * 1000;
    const targets = tokens.filter((t) => {
      const created = new Date(t.createdAt).getTime();
      return created <= now.getTime() && created >= threshold;
    });

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

