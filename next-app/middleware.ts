import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LEGACY_PRODUCT_SLUG_SET } from "@/lib/legacyProductSlugs";

function localeFromPathname(pathname: string): "ja" | "en" | "ko" | "zh" {
  const m = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  const loc = (m ? m[1] : "ja") as "ja" | "en" | "ko" | "zh";
  return loc;
}

function isB2bAdminPath(pathname: string): boolean {
  return pathname === "/admin/b2b" || pathname.startsWith("/admin/b2b/");
}

function isB2bAdminApiPath(pathname: string): boolean {
  return pathname === "/api/admin/b2b" || pathname.startsWith("/api/admin/b2b/");
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

/** 旧 /product/{slug} → /ise-cha/{slug}/（trailingSlash: true 前提） */
function legacyProductDestPathname(pathname: string): string | null {
  const withLocale = pathname.match(/^\/(en|ko|zh)\/product\/([^/]+)\/?$/);
  if (withLocale) {
    const slug = withLocale[2];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/${withLocale[1]}/ise-cha/${slug}/`;
  }
  const jaPath = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (jaPath) {
    const slug = jaPath[1];
    if (!LEGACY_PRODUCT_SLUG_SET.has(slug)) return null;
    return `/ise-cha/${slug}/`;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Basic Auth for /admin/b2b and its API endpoints
  if (isB2bAdminPath(pathname) || isB2bAdminApiPath(pathname)) {
    if (!checkBasicAuth(request)) {
      return unauthorizedBasicAuth();
    }
    // Allow request to continue without modifying headers
    return NextResponse.next();
  }

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
    // Admin API needs middleware
    "/api/admin/b2b/:path*",
  ],
};

