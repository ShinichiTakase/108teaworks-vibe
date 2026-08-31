import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_PRODUCT_SLUG_SET } from "@/lib/legacyProductSlugs";

/** 旧多言語ルート（/en, /ko, /zh）配下で、日本語版が同一パス構造で存在するトップレベルセグメント */
const KNOWN_JA_TOP_SEGMENTS = new Set([
  "about",
  "cart",
  "checkout",
  "guide",
  "how-to-brew",
  "inquiry",
  "ise-cha",
  "isecha_no_rekishi",
  "kabatadani_no_ocha",
  "legal",
  "mie_chagyo_shi",
  "notice",
  "privacy-policy",
  "products",
  "user-guide",
  "wholesale",
]);

/**
 * 廃止した多言語ルート（/en/*, /ko/*, /zh/*）への旧アクセス救済。
 * 対応する日本語ページが存在する場合はそのページへ、存在しない場合はトップページへ。
 */
function legacyLocalePrefixDestPathname(pathname: string): string | null {
  const m = pathname.match(/^\/(en|ko|zh)(\/.*)?$/);
  if (!m) return null;
  const rest = m[2] ?? "";
  if (!rest || rest === "/") return "/";
  const firstSegment = rest.split("/").filter(Boolean)[0];
  if (firstSegment && KNOWN_JA_TOP_SEGMENTS.has(firstSegment)) {
    return rest.endsWith("/") ? rest : `${rest}/`;
  }
  return "/";
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApiPath(pathname: string): boolean {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

function unauthorizedBasicAuth(): NextResponse {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="108teaworks admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function checkBasicAuth(req: NextRequest): boolean {
  const expectedUser = process.env.ADMIN_B2B_USER?.trim() ?? "";
  const expectedPass = process.env.ADMIN_B2B_PASS?.trim() ?? "";
  if (!expectedUser || !expectedPass) return false;

  const auth = req.headers.get("authorization") ?? "";
  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) return false;
  let decoded = "";
  try {
    decoded = Buffer.from(m[1], "base64").toString("utf8");
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  const a = `${user}:${pass}`;
  const b = `${expectedUser}:${expectedPass}`;
  if (a.length !== b.length) return false;
  // edge runtime 向けに自前で定数時間比較
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** 旧 /product/{slug}（多言語プレフィックス付きも含む）→ 日本語版 /ise-cha/{slug}/（trailingSlash: true 前提） */
function legacyProductDestPathname(pathname: string): string | null {
  const withLocale = pathname.match(/^\/(en|ko|zh)\/product\/([^/]+)\/?$/);
  if (withLocale) {
    const slug = withLocale[2];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/ise-cha/${slug}/`;
  }
  const jaPath = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (jaPath) {
    const slug = jaPath[1];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/ise-cha/${slug}/`;
  }
  return null;
}

/** 旧 WooCommerce 単数形 /product/...（多言語プレフィックス付きも含む）のうち、既知スラッグ以外はすべてトップページへ */
const PRODUCT_SINGULAR_FALLBACK_RE = /^\/(?:(?:en|ko|zh)\/)?product(?:\/.*)?$/;

function legacyProductFallbackHomePathname(pathname: string): string | null {
  return PRODUCT_SINGULAR_FALLBACK_RE.test(pathname) ? "/" : null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Basic Auth for all /admin pages and API endpoints
  if (isAdminPath(pathname) || isAdminApiPath(pathname)) {
    if (!checkBasicAuth(request)) {
      return unauthorizedBasicAuth();
    }
    return NextResponse.next();
  }

  const destPath = legacyProductDestPathname(pathname);
  if (destPath) {
    const url = request.nextUrl.clone();
    url.pathname = destPath;
    return NextResponse.redirect(url, 308);
  }

  const fallbackHomePath = legacyProductFallbackHomePathname(pathname);
  if (fallbackHomePath) {
    const url = request.nextUrl.clone();
    url.pathname = fallbackHomePath;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  const localePrefixDest = legacyLocalePrefixDestPathname(pathname);
  if (localePrefixDest) {
    const url = request.nextUrl.clone();
    url.pathname = localePrefixDest;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * 静的ファイル/_next/api を除外してページルートのみ対象
     * - /images, /css, /js, /pdf なども除外
     */
    "/((?!_next|api|images|css|js|pdf|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
    // Admin API needs middleware
    "/api/admin/:path*",
  ],
};

