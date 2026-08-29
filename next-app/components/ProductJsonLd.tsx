import { ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type OfferPrice =
  | {
      "@type": "Offer";
      url: string;
      price: number;
      priceCurrency?: string;
      availability?: string;
      itemCondition?: string;
      name?: string;
    }
  | {
      "@type": "AggregateOffer";
      priceCurrency?: string;
      lowPrice: number;
      highPrice: number;
      offerCount: number;
      availability?: string;
    };

type Props = {
  name: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
  price?: number;
  inLanguage?: string;
  sku?: string;
  offers?: OfferPrice | OfferPrice[];
};

export default function ProductJsonLd({
  name,
  description,
  imageUrl,
  canonicalUrl,
  price,
  inLanguage = "ja",
  sku,
  offers,
}: Props) {
  const absImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_BASE_URL}${imageUrl}`;

  const defaultOffer = {
    "@type": "Offer",
    url: canonicalUrl,
    priceCurrency: "JPY",
    price: Number(price ?? 0),
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  } as const;

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
    offers: offers ?? defaultOffer,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
