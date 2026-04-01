import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function localeFromPathname(pathname: string): "ja" | "en" | "ko" | "zh" {
  const m = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  const loc = (m ? m[1] : "ja") as "ja" | "en" | "ko" | "zh";
  return loc;
}

export function middleware(request: NextRequest) {
  const locale = localeFromPathname(request.nextUrl.pathname);
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

