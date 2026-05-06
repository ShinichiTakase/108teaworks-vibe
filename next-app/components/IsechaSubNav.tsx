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

const linkBase =
  "inline-flex items-center rounded-md border px-3 py-2 text-[0.9375rem] font-medium no-underline transition-colors";
/** 非アクティブ（メイン `/ise-cha/` と同じトーン） */
const linkIdle = "border-tea-light bg-cream/80 text-tea-deep hover:border-tea-deep hover:bg-cream";
/** 現在地：目立ちすぎないが判別できる薄い地色＋わずかなリング */
const linkActive =
  "border-tea-light/50 bg-tea-deep/[0.09] text-tea-deep shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] ring-1 ring-tea-deep/15 pointer-events-none cursor-default";

export default function IsechaSubNav({ locale, current }: Props) {
  const t = COMMON_TEXTS[locale].nav;
  const mainHref = buildLocalizedPath(locale, "/ise-cha");
  const booksHref = buildLocalizedPath(locale, "/ise-cha/books");
  const americaHref = buildLocalizedPath(locale, "/ise-cha/america");
  const howToBrewHref = locale === "ja" ? "/how-to-brew" : buildLocalizedPath(locale, "/ise-cha/how-to-brew");
  const macchaHref = locale === "ja" ? "/maccha" : buildLocalizedPath(locale, "/ise-cha/maccha");
  const caffeineHref = buildLocalizedPath(locale, "/ise-cha/caffeine");
  const catechinHref = buildLocalizedPath(locale, "/ise-cha/catechin");

  return (
    <nav
      className="mb-8 border-b border-tea-light/30 pb-6"
      aria-label={navAriaLabel[locale]}
    >
      <ul className="m-0 flex flex-wrap gap-3 p-0 list-none md:gap-4">
        <li>
          {current === "main" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isecha}
            </span>
          ) : (
            <Link href={mainHref} className={`${linkBase} ${linkIdle}`}>
              {t.isecha}
            </Link>
          )}
        </li>
        <li>
          {current === "catechin" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaCatechin}
            </span>
          ) : (
            <Link href={catechinHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaCatechin}
            </Link>
          )}
        </li>
        <li>
          {current === "caffeine" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaCaffeine}
            </span>
          ) : (
            <Link href={caffeineHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaCaffeine}
            </Link>
          )}
        </li>
        <li>
          {current === "maccha" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaMaccha}
            </span>
          ) : (
            <Link href={macchaHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaMaccha}
            </Link>
          )}
        </li>
        <li>
          {current === "america" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaAmerica}
            </span>
          ) : (
            <Link href={americaHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaAmerica}
            </Link>
          )}
        </li>
        <li>
          {current === "howToBrew" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaHowToBrew}
            </span>
          ) : (
            <Link href={howToBrewHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaHowToBrew}
            </Link>
          )}
        </li>
        <li>
          {current === "books" ? (
            <span className={`${linkBase} ${linkActive}`} aria-current="page">
              {t.isechaBooks}
            </span>
          ) : (
            <Link href={booksHref} className={`${linkBase} ${linkIdle}`}>
              {t.isechaBooks}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
