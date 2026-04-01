import type { Locale } from "@/lib/i18n";
import fixed from "@/lib/seoFixedPages.json";

type FixedSeoEntry = {
  title?: Partial<Record<Locale, string>>;
  description?: Partial<Record<Locale, string>>;
};

type FixedSeoJson = {
  pages?: Record<string, FixedSeoEntry>;
};

const FIXED = fixed as unknown as FixedSeoJson;

function normalizePathKey(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p === "/" ? "/" : p;
}

function withTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function withoutTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

const ALIASES: Record<string, string[]> = {
  "/how-to-brew": ["/how2brew/", "/how2brew"],
  /** 旧スラッグ rekushi で getFixedSeo した場合も新キーを参照 */
  "/isecha_no_rekushi": ["/isecha_no_rekishi/", "/isecha_no_rekishi"],
};

export function getFixedSeo(
  pathname: string,
  locale: Locale
): { title?: string; description?: string } | null {
  const pages = FIXED.pages ?? {};
  const key0 = normalizePathKey(pathname);
  const candidates = [
    key0,
    withTrailingSlash(key0),
    withoutTrailingSlash(key0),
    ...(ALIASES[withoutTrailingSlash(key0)] ?? []),
  ].map((k) => normalizePathKey(k));

  for (const key of candidates) {
    const entry = pages[key];
    if (!entry) continue;
    const title = entry.title?.[locale] ?? entry.title?.ja;
    const description = entry.description?.[locale] ?? entry.description?.ja;
    if (title || description) return { title, description };
  }
  return null;
}

export type BuildAlternatesOptions = {
  /** 現在表示しているページの言語（canonical を決めるために使用）。未指定は "ja" 扱い。 */
  currentLocale?: Locale;
  /**
   * true のとき hreflang を ja-JP / en-JP / ko-JP / zh-JP にする（Google Merchant Center Next 向け）。
   * false または未指定は従来どおり ja / en / ko / zh（伊勢茶など情報ページ用）。
   */
  jpRegionHreflang?: boolean;
};

export function buildAlternatesForLocales(pathname: string, options?: BuildAlternatesOptions) {
  const loc0: Locale = options?.currentLocale ?? "ja";
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "https://108teaworks.com";
  const path0 = normalizePathKey(pathname);
  const path = withTrailingSlash(path0);

  const make = (loc: Locale) => {
    if (loc === "ja") return `${base}${path}`;
    return `${base}/${loc}${path}`;
  };
  const urls = {
    ja: make("ja"),
    en: make("en"),
    ko: make("ko"),
    zh: make("zh"),
  };
  const languages = options?.jpRegionHreflang
    ? {
        "ja-JP": urls.ja,
        "en-JP": urls.en,
        "ko-JP": urls.ko,
        "zh-JP": urls.zh,
      }
    : {
        ja: urls.ja,
        en: urls.en,
        ko: urls.ko,
        zh: urls.zh,
      };
  return {
    canonical: urls[loc0],
    languages,
  };
}

