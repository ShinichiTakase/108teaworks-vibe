"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROMO_VIDEO_TEXTS } from "@/lib/promoVideoTexts";
import type { Locale } from "@/lib/i18n";

const THUMB_SRC = "/images/thumbnail/green-tea-latte.jpg";
const VIDEO_SRC = "/mp4/houjicha_latte.mp4";

const linkClass = "text-tea no-underline hover:text-tea-deep focus:outline-none focus:underline";

function getLocaleFromPath(pathname: string | null): Locale {
  if (!pathname) return "ja";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/zh")) return "zh";
  return "ja";
}

export default function PromoVideoBanner() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = PROMO_VIDEO_TEXTS[locale];

  const [popupOpen, setPopupOpen] = useState(false);

  const openPopup = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setPopupOpen(false);
  }, []);

  return (
    <>
      <section
        aria-label={t.sectionAria}
        className="border-b border-border bg-washi px-3 py-3 w-[90%] max-w-4xl mx-auto"
      >
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={openPopup}
            className="flex-shrink-0 rounded overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-tea focus:ring-offset-1"
            aria-label={t.playAria}
          >
            <Image
              src={THUMB_SRC}
              alt={t.thumbAlt}
              width={100}
              height={75}
              className="w-[100px] h-[75px] object-cover"
            />
          </button>
          <div className="flex-1 min-w-0 text-[0.9375rem] md:text-base leading-relaxed text-ink">
            <p className="m-0">
              {t.prefix}
              <a
                href="https://www.instagram.com/__newwa__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t.cafeName}
              </a>
              {t.ownerIntro}
              <a
                href="https://www.instagram.com/__wadakanami__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                @__wadakanami__
              </a>
              {t.mid}
              <Link href={t.productLink} className={linkClass}>
                {t.productName}
              </Link>
              {t.afterProduct}
              <a
                href="https://www.instagram.com/__newwa__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t.cafeNameShort}
              </a>
              {t.end}{" "}
              <button
                type="button"
                onClick={openPopup}
                className="inline-flex items-center gap-1 mt-1.5 rounded-full border border-tea bg-transparent px-3 py-1 text-[0.875rem] font-medium text-tea no-underline cursor-pointer hover:bg-tea hover:text-cream hover:border-tea transition-colors focus:outline-none focus:ring-2 focus:ring-tea focus:ring-offset-1"
                aria-label={t.playAria}
              >
                <span aria-hidden="true">▶</span>
                {t.watchCta}
              </button>
            </p>
          </div>
        </div>
      </section>

      {popupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.dialogAria}
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-lg bg-ink rounded overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-ink/70 text-cream flex items-center justify-center text-lg leading-none hover:bg-ink"
              aria-label={t.closeAria}
            >
              ×
            </button>
            <video
              src={VIDEO_SRC}
              autoPlay
              playsInline
              controls
              className="w-full h-auto"
              onEnded={handleVideoEnded}
            />
          </div>
        </div>
      )}
    </>
  );
}
