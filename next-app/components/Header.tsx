"use client";

import Link from "next/link";
import HeaderCartAccountLinks from "./HeaderCartAccountLinks";
import { buildHref } from "@/lib/urlPath";

const TAGLINE = "シングルオリジン伊勢茶・お茶の魅力を三重から世界へ";

export default function Header() {
  const tagline = TAGLINE;
  const homeHref = buildHref("/");

  return (
    <header
      className="py-4 md:py-6 px-4 bg-washi border-b border-border text-center"
      role="banner"
    >
      <div className="max-w-[min(90vw,1200px)] mx-auto">
        <div className="m-0 font-heading text-[clamp(1.25rem,4vw,1.5rem)] font-semibold tracking-wider">
          <Link href={homeHref} className="text-tea-deep no-underline hover:text-tea">
            <picture>
              <source
                type="image/webp"
                media="(min-width: 768px)"
                srcSet="/images/logo/logo-desktop.webp"
              />
              <source
                media="(min-width: 768px)"
                srcSet="/images/logo/logo-desktop.png"
              />
              <source type="image/webp" srcSet="/images/logo/logo-mobile.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo-mobile.png"
                alt="伊勢茶の藤八茶寮"
                width={1023}
                height={298}
                className="block w-full max-w-full h-auto mx-auto md:w-full md:max-w-wide"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </picture>
          </Link>
        </div>
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
