import { NextRequest, NextResponse } from "next/server";
import { getProductImagePath } from "@/lib/productImage";

export async function GET(req: NextRequest) {
  try {
    const slugsParam = req.nextUrl.searchParams.get("slugs");
    if (!slugsParam) {
      return NextResponse.json({}, { status: 200 });
    }

    const slugs = Array.from(
      new Set(
        slugsParam
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !!s && !s.includes("..") && !s.includes("/") && !s.includes("\\"))
      )
    );

    const result: Record<string, string> = {};
    for (const slug of slugs) {
      result[slug] = getProductImagePath(slug);
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[product-images] error", e);
    return NextResponse.json({}, { status: 500 });
  }
}
