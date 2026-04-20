import type { Locale } from "@/lib/i18n";

export function formatPriceYen(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
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
