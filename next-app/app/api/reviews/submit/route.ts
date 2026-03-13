import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { consumeToken, appendReviewsForSlug } from "@/lib/reviewsStorage";
import { getMailFrom } from "@/lib/mailFrom";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    const record = await consumeToken(token);
    if (!record) {
      return NextResponse.json({ ok: false, error: "invalid_or_expired_token" }, { status: 400 });
    }

    const formData = await req.formData();
    const nickname = String(formData.get("nickname") ?? "").trim() || "藤八茶寮のお客様";

    const reviewsBySlug: Record<
      string,
      {
        productName: string;
        nickname: string;
        rating: number;
        review: string;
      }[]
    > = {};

    for (let i = 0; i < record.items.length; i++) {
      const slug = String(formData.get(`items[${i}][slug]`) ?? "").trim();
      const title = String(formData.get(`items[${i}][title]`) ?? "").trim();
      const review = String(formData.get(`items[${i}][review]`) ?? "").trim();
      const ratingRaw = String(formData.get(`items[${i}][rating]`) ?? "").trim();
      const rating = Math.min(5, Math.max(1, Number(ratingRaw || 0) || 0));

      if (!slug || rating < 1) continue;

      if (!reviewsBySlug[slug]) {
        reviewsBySlug[slug] = [];
      }
      reviewsBySlug[slug].push({
        productName: title || slug,
        nickname,
        rating,
        review,
      });
    }

    const nowIso = new Date().toISOString();
    const tasks = Object.entries(reviewsBySlug).map(([slug, list]) =>
      appendReviewsForSlug(
        slug,
        list.map((r) => ({
          ...r,
          name: record.name,
          email: record.email,
          createdAt: nowIso,
        }))
      )
    );
    await Promise.all(tasks);

    const toNotify = process.env.ORDER_ADMIN_TO || process.env.INQUERY_TO || "info@108teaworks.com";
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && user && pass) {
      const fromAddr = process.env.ORDER_FROM || process.env.INQUERY_FROM || toNotify;
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      const lines: string[] = [
        "藤八茶寮 サイトに新しい商品レビューが投稿されました。",
        "",
        `投稿者: ${record.name} (${record.email})`,
        `ニックネーム: ${nickname}`,
        "",
        "--- レビュー内容 ---",
      ];
      for (const [slug, list] of Object.entries(reviewsBySlug)) {
        for (const r of list) {
          lines.push(`商品: ${r.productName} (${slug})`);
          lines.push(`評価: ${r.rating} / 5`);
          if (r.review) lines.push(`コメント: ${r.review}`);
          lines.push("");
        }
      }
      lines.push("（このメールはレビュー投稿時に自動送信されています）");
      try {
        await transporter.sendMail({
          from: getMailFrom(fromAddr),
          to: toNotify,
          subject: "【藤八茶寮】新しい商品レビューが投稿されました",
          text: lines.join("\n"),
        });
      } catch (mailErr) {
        console.error("[api/reviews/submit] notify email failed", mailErr);
      }
    }

    const publicBase = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, "");
    const baseUrl = publicBase || url.origin;
    const redirectUrl = `${baseUrl}/review-submitted`;
    console.log("[api/reviews/submit] redirect to", redirectUrl);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (e) {
    console.error("[api/reviews/submit] error", e);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

