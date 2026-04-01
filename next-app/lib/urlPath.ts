import type { Locale } from "@/lib/i18n";

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

export function buildLocalizedPath(locale: Locale, href: string): string {
  const hrefNorm = href.startsWith("/") ? href : `/${href}`;
  if (locale === "ja") return withTrailingSlashPath(hrefNorm);
  if (hrefNorm === "/") return `/${locale}/`;
  return withTrailingSlashPath(`/${locale}${hrefNorm}`);
}

