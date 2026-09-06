import { COMMON_TEXTS } from "@/lib/commonTexts";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export type BreadcrumbItem = { name: string; url: string };

/** pathKey → ラベルキー（commonTexts のドット区切り） */
const PATH_LABEL_KEYS: Record<string, string> = {
  "/": "nav.top",
  "/about": "nav.about",
  "/ise-cha": "nav.isecha",
  "/how-to-brew": "nav.howToBrew",
  "/faq": "nav.faq",
  "/user-guide": "nav.userGuide",
  "/notice": "nav.notice",
  "/wholesale": "nav.wholesale",
  "/cart": "cart.title",
  "/inquiry": "header.inquiry",
  "/guide": "nav.userGuide",
  "/legal": "footer.legal",
  "/privacy-policy": "footer.privacyPolicy",
};

/** パスごとの固定ラベル */
const PATH_LITERALS: Record<string, string> = {
  "/kabatadani_no_ocha": "かぶただにの茶",
  "/isecha_no_rekishi": "伊勢茶の歴史 お茶のおもしろ知識",
};

function getLabelFromKey(key: string): string {
  const [section, sub] = key.split(".");
  const obj = COMMON_TEXTS as Record<string, unknown>;
  const subObj = obj?.[section] as Record<string, string> | undefined;
  return (subObj?.[sub] as string) ?? key;
}

function makeUrl(path: string): string {
  const normalized = path === "/" ? "" : path;
  return `${SITE_BASE_URL}${normalized || "/"}`;
}

/**
 * pathname（例: /about）から BreadcrumbList 用の項目を生成する。
 * options.productName: 商品ページの最終段の名前
 * options.noticeTitle: お知らせ記事の最終段の名前
 */
export function getBreadcrumbItems(
  pathname: string,
  options?: { productName?: string; noticeTitle?: string }
): BreadcrumbItem[] {
  const pathKeyNorm = (pathname.replace(/\/$/, "") || "/") as string;

  const items: BreadcrumbItem[] = [];
  const homeUrl = makeUrl("/");
  const homeLabel = getLabelFromKey("nav.top");
  items.push({ name: homeLabel, url: homeUrl });

  if (pathKeyNorm === "/") return items;

  if (pathKeyNorm === "/ise-cha/catechin") {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: getLabelFromKey("nav.isechaCatechin"),
      url: makeUrl("/ise-cha/catechin"),
    });
    return items;
  }

  if (pathKeyNorm === "/ise-cha/books") {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: getLabelFromKey("nav.isechaBooks"),
      url: makeUrl("/ise-cha/books"),
    });
    return items;
  }

  if (pathKeyNorm === "/ise-cha/america") {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: getLabelFromKey("nav.isechaAmerica"),
      url: makeUrl("/ise-cha/america"),
    });
    return items;
  }

  if (pathKeyNorm === "/ise-cha/how-to-brew") {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: getLabelFromKey("nav.isechaHowToBrew"),
      url: makeUrl("/ise-cha/how-to-brew"),
    });
    return items;
  }

  if (pathKeyNorm === "/ise-cha/maccha") {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: getLabelFromKey("nav.isechaMaccha"),
      url: makeUrl("/ise-cha/maccha"),
    });
    return items;
  }

  const kabatadaniChapterMatch = pathKeyNorm.match(/^\/kabatadani_no_ocha\/(.+)$/);
  if (kabatadaniChapterMatch) {
    items.push({
      name: PATH_LITERALS["/kabatadani_no_ocha"],
      url: makeUrl("/kabatadani_no_ocha"),
    });
    items.push({
      name: options?.productName ?? kabatadaniChapterMatch[1],
      url: makeUrl(pathKeyNorm),
    });
    return items;
  }

  const isechaChapterMatch = pathKeyNorm.match(/^\/isecha_no_rekishi\/(.+)$/);
  if (isechaChapterMatch) {
    items.push({
      name: PATH_LITERALS["/isecha_no_rekishi"],
      url: makeUrl("/isecha_no_rekishi"),
    });
    items.push({
      name: options?.productName ?? isechaChapterMatch[1],
      url: makeUrl(pathKeyNorm),
    });
    return items;
  }

  const productMatch = pathKeyNorm.match(/^\/ise-cha\/(.+)$/);
  if (productMatch) {
    items.push({
      name: getLabelFromKey("nav.isecha"),
      url: makeUrl("/ise-cha"),
    });
    items.push({
      name: options?.productName ?? "商品",
      url: makeUrl(pathKeyNorm),
    });
    return items;
  }

  const noticeMatch = pathKeyNorm.match(/^\/notice\/(.+)$/);
  if (noticeMatch) {
    items.push({
      name: getLabelFromKey("nav.notice"),
      url: makeUrl("/notice"),
    });
    items.push({
      name: options?.noticeTitle ?? "お知らせ",
      url: makeUrl(pathKeyNorm),
    });
    return items;
  }

  const literal = PATH_LITERALS[pathKeyNorm];
  if (literal) {
    items.push({ name: literal, url: makeUrl(pathKeyNorm) });
    return items;
  }

  const labelKey = PATH_LABEL_KEYS[pathKeyNorm];
  if (labelKey) {
    items.push({
      name: getLabelFromKey(labelKey),
      url: makeUrl(pathKeyNorm),
    });
    return items;
  }

  return items;
}
