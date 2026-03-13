/**
 * microCMS API クライアント（お知らせ）
 * 要: MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY（.env.local）
 */

const getBaseUrl = () => {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}.microcms.io/api/v1`;
};

const getApiKey = () => process.env.MICROCMS_API_KEY?.trim();

export type NoticeItem = {
  id: string;
  title: string;
  body?: string;
  publishedAt?: string;
  revisedAt?: string;
  slug?: string;
};

export type NoticeListResponse = {
  contents: NoticeItem[];
  totalCount: number;
};

/** 商品（products API）※microCMS のフィールドIDがそのままキーになる */
export type ProductItem = {
  id: string;
  ORDER?: number;
  TITLE?: string;
  PRICE?: number;
  SLUG?: string;
  slug?: string;
  tag?: string;
  tags?: string[];
  STOCK?: number;
  /** 商品説明（HTML可） */
  DESCRIPTION01?: string;
  DESCRIPTION02?: string;
  /** 商品コード・JAN */
  SKU?: string;
  GTIN?: string;
  /** 関連商品（最大4） */
  RELATED01?: string;
  RELATED_URL01?: string;
  RELATED02?: string;
  RELATED_URL02?: string;
  RELATED03?: string;
  RELATED_URL03?: string;
  RELATED04?: string;
  RELATED_URL04?: string;
  /** 配送ランク（送料計算用。数値） */
  SHIP_RANK?: number;
  /** SEO: microCMS 側で持つ（言語別） */
  SEO_TITLE?: string;
  SEO_DESC?: string;
  SEO_TITLE_JA?: string;
  SEO_DESC_JA?: string;
  SEO_TITLE_EN?: string;
  SEO_DESC_EN?: string;
  SEO_TITLE_KO?: string;
  SEO_DESC_KO?: string;
  SEO_TITLE_ZH?: string;
  SEO_DESC_ZH?: string;
};

export type ProductListResponse = {
  contents: ProductItem[];
  totalCount: number;
};

const DEFAULT_LIMIT = 10;
const PRODUCTS_LIMIT = 100;

/** お知らせ一覧を取得（新しい順、ページネーション対応） */
export async function getNotices(
  limit: number = DEFAULT_LIMIT,
  offset: number = 0
): Promise<NoticeListResponse> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) {
    return { contents: [], totalCount: 0 };
  }
  const url = new URL(`${base}/notice`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("orders", "-publishedAt");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      console.error("[microcms] list failed", res.status, await res.text());
      return { contents: [], totalCount: 0 };
    }
    const json = (await res.json()) as { contents?: NoticeItem[]; totalCount?: number };
    return {
      contents: Array.isArray(json.contents) ? json.contents : [],
      totalCount: typeof json.totalCount === "number" ? json.totalCount : 0,
    };
  } catch (e) {
    console.error("[microcms] list error", e);
    return { contents: [], totalCount: 0 };
  }
}

/** スラッグで1件取得（詳細表示用） */
export async function getNoticeBySlug(slug: string): Promise<NoticeItem | null> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return null;
  const url = new URL(`${base}/notice`);
  url.searchParams.set("filters", `slug[equals]${encodeURIComponent(slug)}`);
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { contents?: NoticeItem[] };
    const list = Array.isArray(json.contents) ? json.contents : [];
    return list.length > 0 ? list[0] : null;
  } catch (e) {
    console.error("[microcms] getBySlug error", e);
    return null;
  }
}

/** IDで1件取得（スラッグがない場合の詳細表示用） */
export async function getNoticeById(id: string): Promise<NoticeItem | null> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return null;
  try {
    const res = await fetch(`${base}/notice/${encodeURIComponent(id)}`, {
      headers: { "X-MICROCMS-API-KEY": key },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as NoticeItem;
    return json?.id ? json : null;
  } catch (e) {
    console.error("[microcms] getById error", e);
    return null;
  }
}

/** 生コンテンツからスラッグを取得（microCMS のフィールドIDは大文字・小文字の違いがあり得る） */
function getSlugFromContent(c: Record<string, unknown>): string | undefined {
  const s = c["SLUG"] ?? c["slug"];
  return typeof s === "string" ? s : undefined;
}

function str(c: Record<string, unknown>, key: string): string | undefined {
  const v = c[key] ?? c[key.toLowerCase()];
  return typeof v === "string" ? v : undefined;
}

/** 生コンテンツを ProductItem に変換 */
function mapRawToProduct(c: Record<string, unknown>): ProductItem {
  const order = c["ORDER"] ?? c["order"];
  const title = c["TITLE"] ?? c["title"];
  const price = c["PRICE"] ?? c["price"];
  const tagRaw = c["TAG"] ?? c["tag"];
  const tagStrings: string[] = [];
  if (typeof tagRaw === "string") tagStrings.push(tagRaw);
  else if (Array.isArray(tagRaw)) {
    for (const t of tagRaw) {
      if (typeof t === "string") tagStrings.push(t);
      else if (t && typeof t === "object" && "name" in t && typeof (t as { name: unknown }).name === "string")
        tagStrings.push((t as { name: string }).name);
    }
  } else if (tagRaw && typeof tagRaw === "object" && "name" in tagRaw && typeof (tagRaw as { name: unknown }).name === "string") {
    tagStrings.push((tagRaw as { name: string }).name);
  }
  const stockRaw = c["STOCK"] ?? c["stock"];
  const STOCK = typeof stockRaw === "number" ? stockRaw : typeof stockRaw === "string" ? parseInt(stockRaw, 10) : undefined;
  return {
    id: typeof c["id"] === "string" ? c["id"] : "",
    ORDER: typeof order === "number" ? order : undefined,
    TITLE: typeof title === "string" ? title : undefined,
    PRICE: typeof price === "number" ? price : undefined,
    SLUG: getSlugFromContent(c),
    tag: tagStrings[0],
    tags: tagStrings.length > 1 ? tagStrings : undefined,
    STOCK: Number.isNaN(STOCK) ? undefined : STOCK,
    DESCRIPTION01: str(c, "DESCRIPTION01"),
    DESCRIPTION02: str(c, "DESCRIPTION02"),
    SKU: str(c, "SKU"),
    GTIN: str(c, "GTIN"),
    RELATED01: str(c, "RELATED01"),
    RELATED_URL01: str(c, "RELATED_URL01"),
    RELATED02: str(c, "RELATED02"),
    RELATED_URL02: str(c, "RELATED_URL02"),
    RELATED03: str(c, "RELATED03"),
    RELATED_URL03: str(c, "RELATED_URL03"),
    RELATED04: str(c, "RELATED04"),
    RELATED_URL04: str(c, "RELATED_URL04"),
    SHIP_RANK:
      num(c, "DELIVERY") ??
      num(c, "DERIVERY") ??
      num(c, "SHIP_RANK") ??
      num(c, "配送ランク") ??
      num(c, "ship_rank") ??
      num(c, "SHIPRANK"),
    SEO_TITLE: str(c, "SEO_TITLE"),
    SEO_DESC: str(c, "SEO_DESC") ?? str(c, "SEO_DESCRIPTION"),
    SEO_TITLE_JA: str(c, "SEO_TITLE_JA"),
    SEO_DESC_JA: str(c, "SEO_DESC_JA"),
    SEO_TITLE_EN: str(c, "SEO_TITLE_EN"),
    SEO_DESC_EN: str(c, "SEO_DESC_EN"),
    SEO_TITLE_KO: str(c, "SEO_TITLE_KO"),
    SEO_DESC_KO: str(c, "SEO_DESC_KO"),
    SEO_TITLE_ZH: str(c, "SEO_TITLE_ZH"),
    SEO_DESC_ZH: str(c, "SEO_DESC_ZH"),
  };
}

function num(c: Record<string, unknown>, key: string): number | undefined {
  const v = c[key] ?? c[key.toLowerCase()];
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

/** 商品一覧を取得（ORDER 昇順）。noCache: true でキャッシュを使わない（送料計算用） */
export async function getProducts(options?: { noCache?: boolean }): Promise<ProductListResponse> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) {
    return { contents: [], totalCount: 0 };
  }
  const url = new URL(`${base}/products`);
  url.searchParams.set("limit", String(PRODUCTS_LIMIT));
  url.searchParams.set("orders", "ORDER");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      ...(options?.noCache ? { cache: "no-store" as RequestCache } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) {
      console.error("[microcms] products list failed", res.status, await res.text());
      return { contents: [], totalCount: 0 };
    }
    const json = (await res.json()) as {
      contents?: Record<string, unknown>[];
      totalCount?: number;
    };
    const raw = Array.isArray(json.contents) ? json.contents : [];
    const contents: ProductItem[] = raw.map((c) => mapRawToProduct(c));
    contents.sort((a, b) => (a.ORDER ?? 999) - (b.ORDER ?? 999));
    return {
      contents,
      totalCount: typeof json.totalCount === "number" ? json.totalCount : 0,
    };
  } catch (e) {
    console.error("[microcms] products list error", e);
    return { contents: [], totalCount: 0 };
  }
}

/** 都道府県名を正規化（末尾の 都・道・府・県 を除いた部分。マッチング用） */
function normalizePrefectureName(s: string): string {
  const t = s.trim();
  if (t.endsWith("県") || t.endsWith("府") || t.endsWith("都")) return t.slice(0, -1);
  if (t.endsWith("道") && t !== "北海道") return t.slice(0, -1);
  return t;
}

export type ShippingByPrefectureResult = { fee: number; matchedPrefecture: string } | null;

/** 都道府県をキーに送料を取得（shipping API）。全件取得して prefectures を正規化マッチで検索。noCache: true でキャッシュを使わない */
export async function getShippingByPrefecture(
  prefecture: string,
  options?: { noCache?: boolean }
): Promise<ShippingByPrefectureResult> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key || !prefecture.trim()) return null;
  const url = new URL(`${base}/shipping`);
  url.searchParams.set("limit", "100");
  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      ...(options?.noCache ? { cache: "no-store" as RequestCache } : { next: { revalidate: 300 } }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      contents?: { prefectures?: string; fee?: number; [k: string]: unknown }[];
    };
    const list = Array.isArray(json.contents) ? json.contents : [];
    const input = prefecture.trim();
    const inputNorm = normalizePrefectureName(input);
    for (const row of list) {
      const p = (row.prefectures ?? (row as { PREFECTURES?: string }).PREFECTURES ?? "").trim();
      if (!p) continue;
      if (p === input) {
        const amount = row.fee ?? (row as { FEE?: number }).FEE;
        if (typeof amount === "number" && !Number.isNaN(amount)) return { fee: amount, matchedPrefecture: p };
        return null;
      }
      if (normalizePrefectureName(p) === inputNorm) {
        const amount = row.fee ?? (row as { FEE?: number }).FEE;
        if (typeof amount === "number" && !Number.isNaN(amount)) return { fee: amount, matchedPrefecture: p };
        return null;
      }
    }
    return null;
  } catch (e) {
    console.error("[microcms] getShippingByPrefecture error", e);
    return null;
  }
}

/** スラッグで商品1件取得（詳細ページ用） */
export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return null;
  const url = new URL(`${base}/products`);
  url.searchParams.set("filters", `SLUG[equals]${encodeURIComponent(slug)}`);
  url.searchParams.set("limit", "1");
  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { contents?: Record<string, unknown>[] };
    const list = Array.isArray(json.contents) ? json.contents : [];
    return list.length > 0 ? mapRawToProduct(list[0]) : null;
  } catch (e) {
    console.error("[microcms] getProductBySlug error", e);
    return null;
  }
}

/** HTML エンティティのみデコード（タグはそのまま。詳細ページの本文表示でリンクを残す用） */
export function decodeHtmlEntities(html: string | undefined): string {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * microCMS 登録ミスで href に <a> タグごと入っているものを修復する
 * 例: href="<a href="https://...">テキスト</a>" → href="https://..."
 */
export function repairMalformedHrefs(html: string): string {
  return html.replace(
    /href="<a\s+href="([^"]+)"[^>]*>[^<]*<\/a>"/gi,
    'href="$1"'
  );
}

/**
 * 詳細ページ本文用：エンティティをデコードし、表示されてしまう属性の断片（" target="_blank"> など）を
 * 取り除いてリンクが有効な HTML にする
 */
export function prepareBodyForDetail(html: string | undefined): string {
  if (!html || typeof html !== "string") return "";
  let s = decodeHtmlEntities(html);
  s = s.replace(/"\s*target="_blank"\s*>/gi, '">');
  s = s.replace(/"\s*rel="[^"]*"\s*target="_blank"\s*>/gi, '">');
  s = s.replace(/"\s*rel="[^"]*"\s*>/gi, '">');
  s = s.replace(/'\s*target="_blank"\s*>/gi, "'>");
  // 表示されてしまう "> の重複を削除（例: .../">">link → .../">link）
  s = s.replace(/">\s*">/g, '">');
  // "/"> を "> に（URL 直後の断片が表示される場合。タグは正しく閉じる）
  s = s.replace(/\/"\s*>/g, '">');
  // タグとタグのあいだに残る "> を削除
  s = s.replace(/>\s*">\s*</g, '><');
  // 開始タグ直後の "> を削除（リンク本文の先頭に表示される断片。例: >">カフェ → >カフェ）
  s = s.replace(/>\s*">\s*([^<\s])/g, '>$1');
  return s;
}

/**
 * 引用符で囲まれた属性値（中に > や " が含まれうる）を含むタグを正しく除去する
 * 例: <a href="url?x=1>2" target="_blank"> を丸ごと削除
 */
function removeHtmlTags(s: string): string {
  return s.replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, "");
}

/** HTML タグをすべて除去し、エンティティをデコードしてプレーンテキストにする */
export function stripHtml(html: string | undefined): string {
  if (!html || typeof html !== "string") return "";
  let s = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p/gi, "\n\n")
    .replace(/<\/div>\s*<div/gi, "\n\n")
    .replace(/<\/[^>]+>/g, "\n");
  s = removeHtmlTags(s);
  s = s
    // microCMS が URL + target=\"_blank\" を素のテキストとして残してしまう断片を削除
    .replace(/https?:\/\/[^\s]+?\s+target="_blank">/g, " ")
    .replace(/"\s*target="_[^"]*"\s*>/g, " ")
    .replace(/"\s*rel="[^"]*"\s*>/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .trim();
  return s;
}

/** HTML からタグを除きテキストのみにし、指定文字数で切る（…付き） */
export function bodyToExcerpt(html: string | undefined, maxLength: number = 120): string {
  const stripped = stripHtml(html);
  if (!stripped) return "";
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength) + "…";
}
