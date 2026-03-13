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
 * トップページへのリンク。スマホでも常にバー全体を表示。
 */
export default function FloatingProductListBar() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const t = COMMON_TEXTS[locale];
  const href = buildLocalizedHref(locale, "/");

  return (
    <Link
      href={href}
      className="fixed left-0 z-50 flex h-14 min-w-[152px] items-center justify-center gap-2 rounded-r-full bg-lime-600 pl-4 pr-4 py-3 text-white no-underline text-[0.875rem] shadow-lg transition-colors hover:bg-lime-500"
      style={{ bottom: "50%" }}
      aria-label={t.nav.products}
    >
      <span className="whitespace-nowrap font-bold text-center tracking-[0.2rem]">{t.nav.products}</span>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden="true">
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
