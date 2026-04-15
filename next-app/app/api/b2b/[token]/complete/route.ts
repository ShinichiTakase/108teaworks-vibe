import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { getB2bByTokenHash, patchB2bByIdDetailed } from "@/lib/microcmsB2b";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const STATUS_IS_ARRAY =
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim() === "1" ||
  (process.env.MICROCMS_B2B_STATUS_IS_ARRAY ?? "").trim().toLowerCase() === "true";

function selectValue(value: string, isArray: boolean): string | string[] {
  const v = value.trim();
  return isArray ? [v] : v;
}

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const raw = (token ?? "").trim();
  if (!raw || raw.length < 10) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });
  }
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 500 });
  }

  let body: { paymentIntentId?: string } = {};
  try {
    body = (await req.json()) as any;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const piId = typeof body.paymentIntentId === "string" ? body.paymentIntentId : "";
  if (!piId.startsWith("pi_")) {
    return NextResponse.json({ ok: false, error: "invalid_payment_intent" }, { status: 400 });
  }

  const tokenHash = sha256Hex(raw);
  const item = await getB2bByTokenHash(tokenHash);
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const pi = await stripe.paymentIntents.retrieve(piId);
  if (pi.status !== "succeeded") {
    return NextResponse.json({ ok: false, error: "payment_not_succeeded", status: pi.status }, { status: 400 });
  }

  const expected = Math.round(item.grandTotal ?? 0);
  if (expected < 1 || pi.amount !== expected) {
    return NextResponse.json({ ok: false, error: "amount_mismatch" }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const firstIsArray = STATUS_IS_ARRAY;
  const first = await patchB2bByIdDetailed(item.id, {
    paidAt: nowIso,
    stripePaymentIntentId: piId,
    status: selectValue("paid", firstIsArray),
  });
  if (!first.ok) {
    const second = await patchB2bByIdDetailed(item.id, {
      paidAt: nowIso,
      stripePaymentIntentId: piId,
      status: selectValue("paid", !firstIsArray),
    });
    if (!second.ok) {
      return NextResponse.json({ ok: false, error: "update_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

