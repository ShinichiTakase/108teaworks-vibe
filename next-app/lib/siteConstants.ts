/** サイトのベースURL（末尾スラッシュなし） */
export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, "") ?? "https://108teaworks.com";

/** Organization / WebSite スキーマ用 */
export const ORGANIZATION_NAME_JA = "藤八茶寮";
export const ORGANIZATION_NAME_EN = "108 Teaworks";
export const ORGANIZATION_URL = "https://108teaworks.com";
export const ORGANIZATION_INSTAGRAM = "108teaworks"; // sameAs: https://www.instagram.com/108teaworks/
export const ORGANIZATION_LOGO_URL = `${SITE_BASE_URL}/images/Organization.png`;
export const OG_IMAGE_URL = `${SITE_BASE_URL}/images/ogimage.png`;

/** 特定商取引法ページと Organization スキーマで共用 */
export const ORGANIZATION_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "浅間町1丁目4番3号ウィザードビル402",
  addressLocality: "横浜市西区",
  postalCode: "220-0072",
  addressCountry: "JP",
} as const;
export const ORGANIZATION_TELEPHONE = "050-6860-7347";
