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

    const { contents: products } = await getProducts({ noCache: true });
    const rankBySlug = new Map<string, number>();
    const normalizeSlug = (s: string) => s.replace(/-/g, "_");
    const normalizeSlugHyphen = (s: string) => s.replace(/_/g, "-");
    for (const p of products) {
      const slug = (p.SLUG ?? p.id ?? "").trim();
      if (!slug || p.SHIP_RANK == null) continue;
      const rank = Number(p.SHIP_RANK);
      if (Number.isNaN(rank)) continue;
      rankBySlug.set(slug, rank);
      rankBySlug.set(normalizeSlug(slug), rank);
      rankBySlug.set(normalizeSlugHyphen(slug), rank);
    }

    let rankSum = 0;
    for (const { slug, quantity } of items) {
      const s = (slug || "").trim();
      const rank =
        rankBySlug.get(s) ??
        rankBySlug.get(normalizeSlug(s)) ??
        rankBySlug.get(normalizeSlugHyphen(s)) ??
        0;
      rankSum += rank * (quantity || 0);
    }

    if (rankSum <= RANK_THRESHOLD) {
      return NextResponse.json({ ok: true, shipping: FLAT_SHIPPING });
    }

    const shippingResult = await getShippingByPrefecture(prefecture.trim(), { noCache: true });
    const shipping = shippingResult !== null ? shippingResult.fee : FLAT_SHIPPING;
    return NextResponse.json({ ok: true, shipping });
  } catch (e) {
    console.error("[api/checkout/shipping]", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
