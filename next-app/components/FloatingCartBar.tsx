"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
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

export default function FloatingCartBar() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const { items } = useCart();
  const t = COMMON_TEXTS[locale];
  const cartHref = buildLocalizedHref(locale, "/cart");
  const isCartOrCheckout = pathname === "/cart" || pathname === "/checkout" || /^\/(en|ko|zh)\/(cart|checkout)(?:\/|$)/.test(pathname || "");
  if (isCartOrCheckout || items.length === 0) return null;

  return (
    <Link
      href={cartHref}
      className="fixed right-0 z-50 flex h-14 min-w-[56px] md:min-w-[152px] items-center justify-center md:justify-start gap-2 rounded-l-full border-2 border-r-0 border-tea bg-tea py-3 pl-3 pr-3 md:pl-4 text-white no-underline font-semibold text-[0.875rem] shadow-lg transition-colors hover:bg-tea-light hover:border-tea-light"
      style={{ bottom: "35%" }}
      aria-label={t.floatingCart}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-white" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </span>
      <span className="hidden md:inline whitespace-nowrap">{t.floatingCart}</span>
    </Link>
  );
}
