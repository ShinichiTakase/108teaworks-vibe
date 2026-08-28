import { ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type Props = {
  name: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
  price: number;
  inLanguage?: string;
  sku?: string;
};

export default function ProductJsonLd({
  name,
  description,
  imageUrl,
  canonicalUrl,
  price,
  inLanguage = "ja",
  sku,
}: Props) {
  const absImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_BASE_URL}${imageUrl}`;

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [absImageUrl],
    inLanguage,
    brand: {
      "@type": "Organization",
      name: ORGANIZATION_NAME_JA,
    },
    ...(sku ? { sku } : {}),
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "JPY",
      price: Number(price),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
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
