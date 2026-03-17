"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

export default function CouponBanner() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const text = COMMON_TEXTS[locale].couponBanner;

  if (!text?.trim()) return null;

  return (
    <div
      className="border-b-2 border-rose-700/80 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-700 py-2.5 text-center shadow-sm"
      role="complementary"
      aria-label="クーポンセールのご案内"
    >
      <div className="max-w-[min(90vw,1200px)] mx-auto px-2">
        <Link
          href="#"
          className="text-[0.9375rem] md:text-[1rem] font-bold text-white no-underline hover:opacity-95 hover:underline underline-offset-2 tracking-wide drop-shadow-sm"
        >
          {text}
        </Link>
      </div>
    </div>
  );
}
