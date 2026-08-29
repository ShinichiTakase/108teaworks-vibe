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

/**
 * 全LP共通の配送・返品ポリシー（特商法ページ https://108teaworks.com/legal/ に準拠）。
 * 送料はクリックポスト基本額(¥380)のみを表現し、¥10,000以上無料・60サイズ¥880等の
 * 分岐はschema.org単体では正確に表せないため含めない。発送は支払い確定後5日以内。
 * 返品はお客様都合不可（食品のため）。瑕疵・誤配送時の法定対応は別枠でありここには含めない。
 */
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "380",
    currency: "JPY",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "JP",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 5,
      unitCode: "DAY",
    },
  },
} as const;

const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "JP",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
} as const;

function withShippingAndReturnPolicy(offer: OfferPrice) {
  return {
    ...offer,
    shippingDetails: SHIPPING_DETAILS,
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
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const resolvedOffers = offers ?? defaultOffer;
  const offersWithPolicy = Array.isArray(resolvedOffers)
    ? resolvedOffers.map(withShippingAndReturnPolicy)
    : withShippingAndReturnPolicy(resolvedOffers);

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
