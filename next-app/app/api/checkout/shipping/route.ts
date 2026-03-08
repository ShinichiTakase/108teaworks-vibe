import { NextRequest, NextResponse } from "next/server";
import { getProducts, getShippingByPrefecture } from "@/lib/microcms";

const FREE_SHIPPING_THRESHOLD = 20000;
const FLAT_SHIPPING = 280;
const RANK_THRESHOLD = 6.0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prefecture,
      items,
      subtotal,
    } = body as {
      prefecture?: string;
      items?: { slug: string; quantity: number }[];
      subtotal?: number;
    };

    if (typeof prefecture !== "string" || !Array.isArray(items) || typeof subtotal !== "number") {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 }
      );
    }

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return NextResponse.json({ ok: true, shipping: 0 });
    }

    const { contents: products } = await getProducts();
    const rankBySlug = new Map<string, number>();
    for (const p of products) {
      const slug = p.SLUG ?? p.id;
      if (slug && p.SHIP_RANK != null) rankBySlug.set(slug, p.SHIP_RANK);
    }

    let rankSum = 0;
    for (const { slug, quantity } of items) {
      const rank = rankBySlug.get(slug) ?? 0;
      rankSum += rank * (quantity || 0);
    }

    if (rankSum <= RANK_THRESHOLD) {
      return NextResponse.json({ ok: true, shipping: FLAT_SHIPPING });
    }

    const shippingAmount = await getShippingByPrefecture(prefecture.trim());
    const shipping = shippingAmount !== null ? shippingAmount : FLAT_SHIPPING;
    return NextResponse.json({ ok: true, shipping });
  } catch (e) {
    console.error("[api/checkout/shipping]", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
