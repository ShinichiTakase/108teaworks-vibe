import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_PRODUCT_SLUG_SET } from "@/lib/legacyProductSlugs";

function localeFromPathname(pathname: string): "ja" | "en" | "ko" | "zh" {
  const m = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  const loc = (m ? m[1] : "ja") as "ja" | "en" | "ko" | "zh";
  return loc;
}

/** 旧 /product/{slug} → /products/{slug}/（trailingSlash: true 前提） */
function legacyProductDestPathname(pathname: string): string | null {
  const withLocale = pathname.match(/^\/(en|ko|zh)\/product\/([^/]+)\/?$/);
  if (withLocale) {
    const slug = withLocale[2];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/${withLocale[1]}/products/${slug}/`;
  }
  const jaPath = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (jaPath) {
    const slug = jaPath[1];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/products/${slug}/`;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const destPath = legacyProductDestPathname(pathname);
  if (destPath) {
    const url = request.nextUrl.clone();
    url.pathname = destPath;
    return NextResponse.redirect(url, 308);
  }

  const locale = localeFromPathname(pathname);
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /**
     * 静的ファイル/_next/api を除外してページルートのみ対象
     * - /images, /css, /js, /pdf なども除外
     */
    "/((?!_next|api|images|css|js|pdf|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};

