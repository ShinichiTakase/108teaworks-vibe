import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export type BreadcrumbItem = { name: string; url: string };

/** pathKey（ロケールなし）→ ラベルキー（commonTexts のドット区切り） */
const PATH_LABEL_KEYS: Record<string, string> = {
  "/": "nav.top",
  "/about": "nav.about",
  "/isecha": "nav.isecha",
  "/how-to-brew": "nav.howToBrew",
  "/user-guide": "nav.userGuide",
  "/notice": "nav.notice",
  "/wholesale": "nav.wholesale",
  "/cart": "cart.title",
  "/inquery": "header.inquiry",
  "/guide": "nav.userGuide",
  "/legal": "footer.legal",
  "/privacy-policy": "footer.privacyPolicy",
};

/** パスごとの固定ラベル（多言語） */
const PATH_LITERALS: Record<string, Record<Locale, string>> = {
  "/kabatadani_no_ocha": {
    ja: "かぶただにの茶",
    en: "Kabatadani no Ocha",
    ko: "카바타다니의 차",
    zh: "蕪谷之茶",
  },
};

function getLabelFromKey(key: string, locale: Locale): string {
  const [section, sub] = key.split(".");
  const obj = COMMON_TEXTS[locale] as Record<string, unknown>;
  const subObj = obj?.[section] as Record<string, string> | undefined;
  return (subObj?.[sub] as string) ?? key;
}

function makeUrl(path: string, locale: Locale): string {
  const normalized = path === "/" ? "" : path;
  if (locale === "ja") return `${SITE_BASE_URL}${normalized || "/"}`;
  return `${SITE_BASE_URL}/${locale}${normalized || ""}`;
}

/**
 * pathname（例: /about または /en/about）と locale から BreadcrumbList 用の項目を生成する。
 * options.productName: 商品ページの最終段の名前
 * options.noticeTitle: お知らせ記事の最終段の名前
 */
export function getBreadcrumbItems(
  pathname: string,
  locale: Locale,
  options?: { productName?: string; noticeTitle?: string }
): BreadcrumbItem[] {
  const pathKey = pathname.replace(/^\/(en|ko|zh)(\/|$)/, "$2") || "/";
  const pathKeyNorm = pathKey.replace(/\/$/, "") || "/";

  const items: BreadcrumbItem[] = [];
  const homeUrl = makeUrl("/", locale);
  const homeLabel = getLabelFromKey("nav.top", locale);
  items.push({ name: homeLabel, url: homeUrl });

  if (pathKeyNorm === "/") return items;

  const productMatch = pathKeyNorm.match(/^\/products\/(.+)$/);
  if (productMatch) {
    items.push({
      name: getLabelFromKey("nav.products", locale),
      url: makeUrl("/products", locale),
    });
    items.push({
      name: options?.productName ?? (locale === "ja" ? "商品" : "Product"),
      url: makeUrl(pathKeyNorm, locale),
    });
    return items;
  }

  const noticeMatch = pathKeyNorm.match(/^\/notice\/(.+)$/);
  if (noticeMatch) {
    items.push({
      name: getLabelFromKey("nav.notice", locale),
      url: makeUrl("/notice", locale),
    });
    items.push({
      name: options?.noticeTitle ?? (locale === "ja" ? "お知らせ" : "News"),
      url: makeUrl(pathKeyNorm, locale),
    });
    return items;
  }

  const literal = PATH_LITERALS[pathKeyNorm];
  if (literal) {
    items.push({ name: literal[locale] ?? literal.ja, url: makeUrl(pathKeyNorm, locale) });
    return items;
  }

  const labelKey = PATH_LABEL_KEYS[pathKeyNorm];
  if (labelKey) {
    items.push({
      name: getLabelFromKey(labelKey, locale),
      url: makeUrl(pathKeyNorm, locale),
    });
    return items;
  }

  return items;
}
