import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/microcms";
import { translateManyForLocale } from "@/lib/translateForLocale";
import type { Locale } from "@/lib/i18n";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

export async function GET(req: NextRequest) {
  try {
    const slugsParam = req.nextUrl.searchParams.get("slugs");
    const localeParam = req.nextUrl.searchParams.get("locale") ?? "ja";
    const locale = SUPPORTED.includes(localeParam as Locale) ? (localeParam as Locale) : "ja";

    if (!slugsParam) {
      return NextResponse.json({}, { status: 200 });
    }

    const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (slugs.length === 0) {
      return NextResponse.json({}, { status: 200 });
    }

    const products = await Promise.all(slugs.map((slug) => getProductBySlug(slug)));
    const titlesJa = products.map((p) => p?.TITLE ?? "");

    const titles =
      locale === "ja"
        ? titlesJa
        : await translateManyForLocale(titlesJa, locale);

    const result: Record<string, string> = {};
    slugs.forEach((slug, i) => {
      result[slug] = titles[i] ?? products[i]?.TITLE ?? "";
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[product-titles] error", e);
    return NextResponse.json({}, { status: 500 });
  }
}
