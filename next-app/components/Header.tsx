 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderCartAccountLinks from "./HeaderCartAccountLinks";

type Locale = "ja" | "en" | "ko" | "zh";

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

function buildLocalizedHref(locale: Locale, href: string): string {
  if (locale === "ja") return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

const TAGLINES: Record<Locale, string> = {
  ja: "シングルオリジン伊勢茶・お茶の魅力を三重から世界へ",
  en: "Single-origin Ise tea – sharing the charm of Japanese tea from Mie to the world",
  ko: "싱글 오리진 이세차, 미에에서 세계로 전하는 일본 차의 매력",
  zh: "单一产地伊势茶——将日本茶的魅力从三重传向世界",
};

export default function Header() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const tagline = TAGLINES[locale];
  const homeHref = buildLocalizedHref(locale, "/");

  return (
    <header
      className="py-4 md:py-6 px-4 bg-washi border-b border-border text-center"
      role="banner"
    >
      <div className="max-w-[min(90vw,1200px)] mx-auto">
        <h1 className="m-0 font-heading text-[clamp(1.25rem,4vw,1.5rem)] font-semibold tracking-wider">
          <Link href={homeHref} className="text-tea-deep no-underline hover:text-tea">
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="/images/logo/logo-desktop.png"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-mobile.png"
                alt="伊勢茶の藤八茶寮"
                className="block w-full max-w-full h-auto mx-auto md:w-full md:max-w-wide"
                decoding="async"
              />
            </picture>
          </Link>
        </h1>
        <div className="mt-0.5 md:mt-1 flex items-center justify-end md:justify-center">
          <div className="hidden md:block flex-1 min-w-0" aria-hidden="true" />
          <p className="hidden md:block flex-shrink-0 text-[0.8125rem] leading-snug text-ink-muted tracking-wide text-center">
            {tagline}
          </p>
          <div className="flex-1 min-w-0 flex justify-end items-center">
            <HeaderCartAccountLinks />
          </div>
        </div>
      </div>
    </header>
  );
}
