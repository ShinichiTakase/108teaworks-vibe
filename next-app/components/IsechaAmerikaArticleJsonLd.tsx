import { buildAlternatesForLocales, getFixedSeo } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import { ORGANIZATION_LOGO_URL, ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type Props = {
  locale: Locale;
};

/** Google 検索向け Article 構造化データ（本文ページと title/description を一致させる） */
export default function IsechaAmerikaArticleJsonLd({ locale }: Props) {
  const seo = getFixedSeo("/ise-cha/amerika", locale);
  const alternates = buildAlternatesForLocales("/ise-cha/amerika", { currentLocale: locale });
  const headline = seo?.title ?? "";
  const description = seo?.description ?? "";
  const imageUrl = `${SITE_BASE_URL}/images/tea_garden.jpg`;
  const inLanguage = locale === "ja" ? "ja" : locale === "en" ? "en" : locale === "ko" ? "ko" : "zh";

  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: [imageUrl],
    inLanguage,
    author: {
      "@type": "Organization",
      name: ORGANIZATION_NAME_JA,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME_JA,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": alternates.canonical,
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
