import { NextRequest, NextResponse } from "next/server";
import { sendShippingCompleteEmail } from "@/lib/shippingEmail";
import { markOrderShipped } from "@/lib/microcmsOrders";

export async function POST(req: NextRequest) {
  let body: { id?: string; toEmail?: string; orderNo?: string; trackingNumber?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const trackingNumber =
    typeof body.trackingNumber === "string" ? body.trackingNumber : undefined;

  const result = await sendShippingCompleteEmail({
    toEmail: typeof body.toEmail === "string" ? body.toEmail : "",
    orderNo: typeof body.orderNo === "string" ? body.orderNo : "",
    trackingNumber,
  });

  if (!result.ok) {
    const status =
      result.error === "smtp_not_configured" || result.error === "send_failed" ? 500 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  await markOrderShipped(id, trackingNumber);

  return NextResponse.json({ ok: true });
}
