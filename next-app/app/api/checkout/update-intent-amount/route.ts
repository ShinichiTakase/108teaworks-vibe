import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * Apple Pay / Google Pay でウォレットの配送先が選ばれたあと、
 * 送料を反映した金額で PaymentIntent を更新する。
 */
export async function POST(req: NextRequest) {
  try {
    if (!stripe || !stripeSecretKey) {
      return NextResponse.json(
        { ok: false, error: "stripe_not_configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { paymentIntentId, amount } = body as {
      paymentIntentId?: string;
      amount?: number;
    };

    if (
      typeof paymentIntentId !== "string" ||
      !paymentIntentId.startsWith("pi_") ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount < 1
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 }
      );
    }

    const yenAmount = Math.round(amount);
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "requires_payment_method") {
      return NextResponse.json(
        { ok: false, error: "intent_not_updatable" },
        { status: 400 }
      );
    }

    await stripe.paymentIntents.update(paymentIntentId, { amount: yenAmount });

    return NextResponse.json({ ok: true, amount: yenAmount });
  } catch (e: any) {
    const message = typeof e?.message === "string" ? e.message : undefined;
    console.error("[api/checkout/update-intent-amount]", message ?? e);
    return NextResponse.json(
      {
        ok: false,
        error: "update_error",
        message: process.env.NODE_ENV !== "production" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
