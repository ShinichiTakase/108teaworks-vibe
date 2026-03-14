import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  // 開発時に気付きやすくするためのログ
  console.warn("[api/checkout/pay] STRIPE_SECRET_KEY is not set.");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(req: NextRequest) {
  try {
    if (!stripe || !stripeSecretKey) {
      return NextResponse.json(
        { ok: false, error: "stripe_not_configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      amount,
      billing,
      cancelPreviousId,
    } = body as {
      amount?: number;
      billing?: { name?: string; email?: string };
      cancelPreviousId?: string;
    };

    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 }
      );
    }

    const yenAmount = Math.round(amount);
    if (!Number.isFinite(yenAmount) || yenAmount < 1) {
      return NextResponse.json(
        { ok: false, error: "invalid_amount" },
        { status: 400 }
      );
    }

    if (cancelPreviousId && typeof cancelPreviousId === "string" && cancelPreviousId.startsWith("pi_")) {
      try {
        await stripe.paymentIntents.cancel(cancelPreviousId);
      } catch {
        // すでに確定済みやキャンセル済みは無視
      }
    }

    const receiptEmail = billing?.email?.trim();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: yenAmount,
      currency: "jpy",
      automatic_payment_methods: { enabled: true },
      description: "藤八茶寮 オンラインショップご注文",
      ...(receiptEmail ? { receipt_email: receiptEmail } : {}),
    });

    return NextResponse.json({
      ok: true,
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e: any) {
    const message = typeof e?.message === "string" ? e.message : undefined;
    console.error("[api/checkout/pay]", message ?? e);
    return NextResponse.json(
      {
        ok: false,
        error: "payment_error",
        message: process.env.NODE_ENV !== "production" ? message : undefined,
      },
      { status: 500 }
    );
  }
}

