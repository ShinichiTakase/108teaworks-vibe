import { ORGANIZATION_LOGO_URL, ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type Props = {
  headline: string;
  description: string;
  /** 絶対URL または ルート相対パス（/images/...）どちらも可 */
  imageUrl: string;
  canonicalUrl: string;
  inLanguage?: string;
};

export default function ArticleJsonLd({
  headline,
  description,
  imageUrl,
  canonicalUrl,
  inLanguage = "ja",
}: Props) {
  const absImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_BASE_URL}${imageUrl}`;

  const json = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: [absImageUrl],
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
      "@id": canonicalUrl,
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
