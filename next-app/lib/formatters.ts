import type { Locale } from "@/lib/i18n";

export function formatPriceYen(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
}

/**
 * 複数バリエーション（個数・容量違い）を持つLPのProduct JSON-LD用：
 * 商品名から「10個」「100g」等の個数・容量表記のみを取り除く。
 * Productは商品全体を表すべきで、特定バリエーションの個数・容量が名前に
 * 混入すると不正確になるため（バリエーションの違いは offers[].name 側で表現する）。
 * ページ表示用・カート用の商品名（同じ変数を共有）はこの関数では変更しない。
 */
export function stripVariantSizeFromProductName(name: string): string {
  return name
    .replace(/\s*\d+(?:個|g)(?=\s|$|（)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** 管理画面向け：日本時間の日付・時刻表示（例: 2026/08/09 14:18） */
export function formatDateTimeJST(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function formatDateByLocale(iso: string | undefined, locale: Locale): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const loc =
      locale === "ja"
        ? "ja-JP"
        : locale === "zh"
          ? "zh-CN"
          : locale === "ko"
            ? "ko-KR"
            : "en-US";
    return d.toLocaleDateString(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
