"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildHref } from "@/lib/urlPath";

/**
 * 左端から突き出る「商品一覧」フローティングバー。
 * トップページへのリンク。
 * スマホでは非表示。タブレット・デスクトップで表示。
 */
export default function FloatingProductListBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mediaQuery.matches);
    onChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  if (isMobile) return null;

  const t = COMMON_TEXTS;
  const href = buildHref("/");

  return (
    <Link
      href={href}
      className="hidden fixed left-0 z-50 items-center justify-center gap-2 rounded-r-full bg-tea-deep text-white no-underline shadow-lg transition-colors hover:bg-tea md:flex md:h-14 md:min-w-[152px] md:pl-4 md:pr-4 md:py-3 md:text-[0.875rem]"
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
