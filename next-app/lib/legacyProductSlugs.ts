/**
 * 旧 URL /product/{slug} を /ise-cha/{slug} へ寄せる対象（slug は現行と同一）。
 * 追加・削除は Merchant / 検索で実際に残っているパスを確認してから行う。
 */
export const LEGACY_PRODUCT_SLUGS = [
  "ise-tea-deep-steamed-bulkpack",
  "roasted-isecha",
  "roasted-isecha-powder-unsweetened",
  "deep-steamed-isecha",
  "isecha-powder-unsweetened",
  "3teabag-ise-wakocha",
  "teasampler-3teabag-variety-pack",
  "ise-tea-powder-unsweetened-bulkpack",
  "3teabag-ise-roasted",
  "3teabag-ise-deeproasted",
  "decaf_green_tea",
] as const;

export const LEGACY_PRODUCT_SLUG_SET: Set<string> = new Set(LEGACY_PRODUCT_SLUGS);
