import type { Locale } from "@/lib/i18n";

const LOCALE_RE = /^\/(ja|en|ko|zh)(?=\/|$)/;

/**
 * 末尾スラッシュ正規化（`trailingSlash: true` 前提）。
 * - `/` はそのまま
 * - クエリ/ハッシュがあっても `/` をパス末尾に付与（`/notice?page=2` -> `/notice/?page=2`）
 */
export function withTrailingSlashPath(path: string): string {
  if (!path) return "/";

  const idxQ = path.indexOf("?");
  const idxH = path.indexOf("#");
  const cut =
    idxQ === -1 ? idxH : idxH === -1 ? idxQ : Math.min(idxQ, idxH);

  const base = cut === -1 ? path : path.slice(0, cut);
  const suffix = cut === -1 ? "" : path.slice(cut);

  if (base === "/") return "/" + suffix;
  const baseNorm = base.endsWith("/") ? base : `${base}/`;
  return baseNorm + suffix;
}

export function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(LOCALE_RE);
  return (match ? match[1] : "ja") as Locale;
}

export function buildLocalizedPath(locale: Locale, href: string): string {
  const hrefNorm = href.startsWith("/") ? href : `/${href}`;
  if (locale === "ja") return withTrailingSlashPath(hrefNorm);
  if (hrefNorm === "/") return `/${locale}/`;
  return withTrailingSlashPath(`/${locale}${hrefNorm}`);
}

export function buildLocalizedHref(locale: Locale, href: string): string {
  return buildLocalizedPath(locale, href);
}

/** 日本語のみのコンテンツ（多言語ルートを持たない書籍系ページ） */
const JA_ONLY_BOOK_PATH_RE =
  /^\/(?:(?:en|ko|zh)\/)?(mie_chagyo_shi|kabatadani_no_ocha|isecha_no_rekishi)(\/|$)/;

export function isJaOnlyBookPath(pathname: string): boolean {
  return JA_ONLY_BOOK_PATH_RE.test(pathname);
}

/** 通常のヘッダー/グローバルナビ/フッターを持たない、独立デザインのLPページ */
const BARE_LP_PATH_RE = /^\/(?:(?:en|ko|zh)\/)?ise-cha\/(?:wakocha-lp|decafe-lp|roasted-powder-lp)(\/|$)/;

export function isBareLpPath(pathname: string): boolean {
  return BARE_LP_PATH_RE.test(pathname);
}

/** /ise-cha/ 配下の静的ページ（カテゴリ・LP等）。商品詳細（[slug]）ではないもの一覧 */
const ISE_CHA_STATIC_SLUGS = [
  "america",
  "books",
  "caffeine",
  "catechin",
  "decaf",
  "fukamushi",
  "houjicha",
  "how-to-brew",
  "maccha",
  "wakocha",
  "wakocha-lp",
  "decafe-lp",
  "roasted-powder-lp",
];

/** 商品詳細ページ（/ise-cha/[slug]/ および旧URL /products/[slug]/）のみに一致。一覧・静的カテゴリページ・/reviews/ 等は除外 */
const PRODUCT_DETAIL_PATH_RE = new RegExp(
  `^/(?:(?:en|ko|zh)/)?(?:ise-cha|products)/(?!(?:${ISE_CHA_STATIC_SLUGS.join("|")})(?:/|$))([^/]+)/?$`
);

export function isProductDetailPath(pathname: string): boolean {
  return PRODUCT_DETAIL_PATH_RE.test(pathname);
}

