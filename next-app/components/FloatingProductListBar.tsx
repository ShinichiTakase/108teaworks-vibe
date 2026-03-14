"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

function buildLocalizedHref(locale: Locale, href: string): string {
  if (locale === "ja") return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/**
 * 左端から突き出る「商品一覧」フローティングバー。
 * トップページへのリンク。
 * スマホ: 画面下部から40%、コンパクト表示・文字間標準・アイコン非表示。
 */
export default function FloatingProductListBar() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const t = COMMON_TEXTS[locale];
  const href = buildLocalizedHref(locale, "/");

  return (
    <Link
      href={href}
      className="fixed left-0 z-50 flex items-center justify-center gap-2 rounded-r-full bg-lime-600 text-white no-underline shadow-lg transition-colors hover:bg-lime-500 max-md:h-12 max-md:min-w-0 max-md:pl-3 max-md:pr-3 max-md:py-0 max-md:text-[0.9375rem] md:h-14 md:min-w-[152px] md:pl-4 md:pr-4 md:py-3 md:text-[0.875rem]"
      style={{ bottom: "40%" }}
      aria-label={t.nav.products}
    >
      <span className="whitespace-nowrap font-bold text-center max-md:tracking-[0.08em] md:tracking-[0.2rem]">{t.nav.products}</span>
      <span className="hidden h-8 w-8 shrink-0 items-center justify-center md:inline-flex" aria-hidden="true">
        <Image
          src="/images/kyuusu-icon.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          unoptimized
        />
      </span>
    </Link>
  );
}
