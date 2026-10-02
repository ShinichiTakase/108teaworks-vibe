import { ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type OfferPrice = {
  "@type": "Offer";
  url: string;
  price: number;
  priceCurrency?: string;
  availability?: string;
  itemCondition?: string;
  name?: string;
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

const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "JP",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
} as const;

function withReturnPolicy(offer: OfferPrice) {
  return {
    ...offer,
    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
  };
}

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

  const defaultOffer: OfferPrice = {
    "@type": "Offer",
    url: canonicalUrl,
    priceCurrency: "JPY",
    price: Number(price ?? 0),
    itemCondition: "https://schema.org/NewCondition",
  };

  const resolvedOffers = offers ?? defaultOffer;
  const offersWithPolicy = Array.isArray(resolvedOffers)
    ? resolvedOffers.map(withReturnPolicy)
    : withReturnPolicy(resolvedOffers);

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [absImageUrl],
    inLanguage,
    brand: {
      "@type": "Brand",
      name: ORGANIZATION_NAME_JA,
    },
    ...(sku ? { sku } : {}),
    offers: offersWithPolicy,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
