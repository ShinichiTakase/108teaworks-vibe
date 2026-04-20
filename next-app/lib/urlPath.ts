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

