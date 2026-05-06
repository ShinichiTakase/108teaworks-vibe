import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildLocalizedPath } from "@/lib/urlPath";

export type IsechaSubNavCurrent = "main" | "books" | "america" | "howToBrew" | "maccha" | "caffeine" | "catechin";

type Props = {
  locale: Locale;
  /** 現在地。`/ise-cha/` では `main` */
  current?: IsechaSubNavCurrent;
};

const navAriaLabel: Record<Locale, string> = {
  ja: "伊勢茶関連のサブページ",
  en: "Ise Tea section navigation",
  ko: "이세차 관련 하위 페이지",
  zh: "伊势茶相关子页面",
};

const mobileNavTexts: Record<
  Locale,
  {
    menuButton: string;
  }
> = {
  ja: {
    menuButton: "トピックス一覧",
  },
  en: {
    menuButton: "Browse pages",
  },
  ko: {
    menuButton: "목록 보기",
  },
  zh: {
    menuButton: "查看列表",
  },
};

const linkBase =
  "inline-flex items-center rounded-md border px-3 py-2 text-[0.9375rem] font-medium no-underline transition-colors";
/** 非アクティブ（メイン `/ise-cha/` と同じトーン） */
const linkIdle = "border-tea-light bg-cream/80 text-tea-deep hover:border-tea-deep hover:bg-cream";
/** 現在地：目立ちすぎないが判別できる薄い地色＋わずかなリング */
const linkActive =
  "border-tea-light/50 bg-tea-deep/[0.09] text-tea-deep shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] ring-1 ring-tea-deep/15 pointer-events-none cursor-default";

export default function IsechaSubNav({ locale, current }: Props) {
  const t = COMMON_TEXTS[locale].nav;
  const mobileText = mobileNavTexts[locale];
  const items: Array<{ key: IsechaSubNavCurrent; label: string; href: string }> = [
    { key: "main", label: t.isecha, href: buildLocalizedPath(locale, "/ise-cha") },
    { key: "catechin", label: t.isechaCatechin, href: buildLocalizedPath(locale, "/ise-cha/catechin") },
    { key: "caffeine", label: t.isechaCaffeine, href: buildLocalizedPath(locale, "/ise-cha/caffeine") },
    {
      key: "maccha",
      label: t.isechaMaccha,
      href: locale === "ja" ? "/maccha" : buildLocalizedPath(locale, "/ise-cha/maccha"),
    },
    { key: "america", label: t.isechaAmerica, href: buildLocalizedPath(locale, "/ise-cha/america") },
    {
      key: "howToBrew",
      label: t.isechaHowToBrew,
      href: locale === "ja" ? "/how-to-brew" : buildLocalizedPath(locale, "/ise-cha/how-to-brew"),
    },
    { key: "books", label: t.isechaBooks, href: buildLocalizedPath(locale, "/ise-cha/books") },
  ];
  const currentKey = current ?? "main";
  const currentItem = items.find((item) => item.key === currentKey) ?? items[0];

  const renderDesktopItems = (listClassName: string) => (
    <ul className={listClassName}>
      {items.map((item) => (
        <li key={item.key}>
          {item.key === currentKey ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className={`${linkBase} ${linkIdle}`}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const renderMobileItems = () => (
    <ul className="m-0 grid list-none gap-1 p-0">
      {items.map((item) => (
        <li key={item.key}>
          {item.key === currentKey ? (
            <span
              className="block rounded-md px-2 py-1 text-sm font-semibold text-tea-deep"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="block rounded-md px-2 py-1 text-sm font-medium text-tea-deep no-underline hover:bg-cream/70"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      className="mb-8 border-b border-tea-light/30 pb-6"
      aria-label={navAriaLabel[locale]}
    >
      <details className="group rounded-2xl border border-tea-light/50 bg-white/80 shadow-sm md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-semibold text-tea-deep">
              {currentItem.label}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-tea-light bg-cream px-3 py-1 text-xs font-medium text-tea-deep">
            {mobileText.menuButton}
          </span>
        </summary>
        <div className="border-t border-tea-light/40 px-3 pb-3 pt-3">
          {renderMobileItems()}
        </div>
      </details>

      <div className="hidden md:block">
        {renderDesktopItems("m-0 flex list-none flex-wrap gap-3 p-0 md:gap-4")}
      </div>
    </nav>
  );
}
