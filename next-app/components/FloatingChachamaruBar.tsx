"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { CHACHAMARU_TEXTS } from "@/lib/chachamaruTexts";
import type { Locale } from "@/lib/i18n";

/**
 * AIコンシェルジュ茶々丸のフローティングバー。
 * useReactBar: true のとき表示。クリックで window.openChachamaru() を呼ぶ。
 */
const useCustomIcon = true;

function getLocaleFromPath(pathname: string | null): Locale {
  if (!pathname) return "ja";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/zh")) return "zh";
  return "ja";
}

const BAR_BASE =
  "fixed right-0 z-[999999] flex items-center justify-center md:justify-start gap-2 rounded-l-full border-2 border-r-0 text-[0.875rem] font-semibold shadow-lg transition-colors cursor-pointer";
const BAR_SIZE = "h-12 w-12 md:h-14 md:min-w-[152px] md:w-auto p-0 md:py-3 md:pl-4 md:pr-3";

/** 元アイコン風：黒背景に白線・上の弧・目（2点）・口・胴の線 */
const ChachamaruIconSvg = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M8 10 Q12 6 16 10" />
    <circle cx="10" cy="7" r="0.9" fill="currentColor" />
    <circle cx="14" cy="7" r="0.9" fill="currentColor" />
    <line x1="10" y1="13" x2="14" y2="13" />
    <line x1="12" y1="14" x2="9" y2="18" />
    <line x1="12" y1="14" x2="15" y2="18" />
    <line x1="12" y1="18" x2="10" y2="21" />
    <line x1="12" y1="18" x2="14" y2="21" />
  </svg>
);

function openChachamaru() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { openChachamaru?: () => void };
  if (typeof w.openChachamaru === "function") {
    w.openChachamaru();
    return;
  }
  window.dispatchEvent(new CustomEvent("chachamaru-open"));
}

export default function FloatingChachamaruBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = CHACHAMARU_TEXTS[locale];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openChachamaru();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${BAR_BASE} ${BAR_SIZE} border-tea-deep bg-tea-deep text-white hover:bg-tea hover:border-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2`}
      style={{ bottom: "230px" }}
      aria-label={t.fabAriaLabel}
      data-chachamaru-trigger
    >
      <span className="flex h-6 w-6 md:h-9 md:w-9 shrink-0 items-center justify-center text-white">
        {useCustomIcon ? (
          <Image
            src="/images/chachamaru-icon.png"
            alt=""
            width={36}
            height={36}
            className="h-6 w-6 md:h-9 md:w-9 object-contain"
            unoptimized
          />
        ) : (
          <ChachamaruIconSvg className="h-full w-full" />
        )}
      </span>
      <span className="hidden md:inline whitespace-nowrap">{t.fabLabel}</span>
    </button>
  );
}
