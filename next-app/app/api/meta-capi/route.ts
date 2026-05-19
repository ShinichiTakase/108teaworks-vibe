import { type NextRequest, NextResponse } from "next/server";
import { getCapiToken } from "@/lib/meta-capi-token";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export async function POST(req: NextRequest) {
  if (!PIXEL_ID) {
    return NextResponse.json({ error: "CAPI not configured" }, { status: 503 });
  }

  const ACCESS_TOKEN = await getCapiToken();
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: "CAPI access token not available" }, { status: 503 });
  }

  const body = await req.json() as {
    event_id: string;
    event_source_url?: string;
    value?: number;
    currency?: string;
    content_ids?: string[];
    content_type?: string;
    fbc?: string;
    fbp?: string;
  };

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const userAgent = req.headers.get("user-agent") ?? "";

  const userData: Record<string, string> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  };
  if (body.fbc) userData.fbc = body.fbc;
  if (body.fbp) userData.fbp = body.fbp;

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    action_source: "website",
    event_source_url: body.event_source_url ?? "",
    user_data: userData,
    custom_data: {
      value: body.value,
      currency: body.currency ?? "JPY",
      content_ids: body.content_ids ?? [],
      content_type: body.content_type ?? "product",
    },
  };

  try {
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] }),
    });
    const json = await res.json();
    console.log("CAPI response status:", res.status);
    console.log("CAPI response body:", JSON.stringify(json));
    if (!res.ok) {
      return NextResponse.json({ error: json }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
