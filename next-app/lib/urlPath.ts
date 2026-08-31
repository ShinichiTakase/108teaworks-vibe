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

export function buildHref(href: string): string {
  const hrefNorm = href.startsWith("/") ? href : `/${href}`;
  return withTrailingSlashPath(hrefNorm);
}

/** 日本語のみのコンテンツ（書籍系ページ） */
const JA_ONLY_BOOK_PATH_RE = /^\/(mie_chagyo_shi|kabatadani_no_ocha|isecha_no_rekishi)(\/|$)/;

export function isJaOnlyBookPath(pathname: string): boolean {
  return JA_ONLY_BOOK_PATH_RE.test(pathname);
}

/** 通常のヘッダー/グローバルナビ/フッターを持たない、独立デザインのLPページ */
const BARE_LP_PATH_RE = /^\/ise-cha\/(?:wakocha-lp|decafe-lp|roasted-powder-lp|fukamushi-lp|fukamushi-powder-lp)(\/|$)/;

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
  "fukamushi-lp",
  "fukamushi-powder-lp",
];

/** 商品詳細ページ（/ise-cha/[slug]/ および旧URL /products/[slug]/）のみに一致。一覧・静的カテゴリページ・/reviews/ 等は除外 */
const PRODUCT_DETAIL_PATH_RE = new RegExp(
  `^/(?:ise-cha|products)/(?!(?:${ISE_CHA_STATIC_SLUGS.join("|")})(?:/|$))([^/]+)/?$`
);

export function isProductDetailPath(pathname: string): boolean {
  return PRODUCT_DETAIL_PATH_RE.test(pathname);
}
