import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths, getProductTasteImagePaths } from "@/lib/productImage";
import ProductTasteImages from "@/components/ProductTasteImages";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductBuyBar from "@/components/ProductBuyBar";
import ShipRankInfo from "@/components/ShipRankInfo";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import styles from "@/components/ProductDetailContent.module.css";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateForLocale } from "@/lib/translateForLocale";
import { loadReviewsForSlug } from "@/lib/reviewsStorage";
import { formatPriceYen } from "@/lib/formatters";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { buildLocalizedPath } from "@/lib/urlPath";
import { ORGANIZATION_NAME_JA } from "@/lib/siteConstants";

/** Product/Offer 用。Google リッチリザルトで推奨される価格の有効期限 */
const OFFER_PRICE_VALID_UNTIL = "2027-12-31";
const SCHEMA_RATING_BEST = 5;
const SCHEMA_RATING_WORST = 1;

/** 商品の販売・配送対象を日本国内のみと JSON-LD で明示 */
const OFFER_ELIGIBLE_REGION_JP = "JP";
/** リッチリザルト用。実送料はランク・1万円以上無料等で変動(api/checkout/shipping と整合) */
const SCHEMA_SHIPPING_RATE_JPY = 380;
/** 注文確定メール等の「本日より2～5営業日」に合わせた日数レンジ(calendar DAY 表現) */
const OFFER_SHIPPING_DETAILS_JP = [
  {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "JP",
    },
    shippingRate: {
      "@type": "MonetaryAmount",
      value: SCHEMA_SHIPPING_RATE_JPY,
      currency: "JPY",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 2,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
    },
  },
];

/** Google 等が飲料をアルコール類と誤認しにくいよう、茶・非アルコールを明示 */
const SCHEMA_ADDITIONAL_TYPE_TEA = "https://schema.org/Tea";
const SCHEMA_PRODUCT_CATEGORY: Record<Locale, string> = {
  ja: "お茶(アルコール非含有)",
  en: "Tea (non-alcoholic)",
  ko: "차(茶) · 무알코올 음료",
  zh: "茶(无酒精)",
};

type Props = {
  locale: Locale;
  slug: string;
};

export default async function ProductDetailContent({ locale, slug }: Props) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = COMMON_TEXTS[locale].product;
  const imagePaths = getProductImagePaths(slug);
  const tasteImagePaths = getProductTasteImagePaths(slug);

  const titleJa = product.TITLE ?? "";
  const desc01Ja = product.DESCRIPTION01 ? decodeHtmlEntities(product.DESCRIPTION01) : "";
  const desc02Ja = product.DESCRIPTION02 ? decodeHtmlEntities(product.DESCRIPTION02) : "";

  const localizedContent: [string, string, string] =
    locale === "ja"
      ? [titleJa, desc01Ja, desc02Ja]
      : await Promise.all([
          translateForLocale(titleJa, locale),
          desc01Ja ? translateForLocale(desc01Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
          desc02Ja ? translateForLocale(desc02Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
        ]);

  const [displayTitleRaw, displayDesc01, displayDesc02] = localizedContent;

  const displayTitle = displayTitleRaw;
  const safeDisplayDesc01 = sanitizeRichHtml(displayDesc01);
  const safeDisplayDesc02 = sanitizeRichHtml(displayDesc02);

  const reviews = await loadReviewsForSlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://108teaworks.com";
  const productUrl =
    locale === "ja"
      ? `${baseUrl}/ise-cha/${slug}/`
      : `${baseUrl}/${locale}/ise-cha/${slug}/`;
  const legalUrl = `${baseUrl}/legal/`;
  const schemaAvailability =
    typeof product.STOCK === "number" && product.STOCK <= 0
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
  const descriptionForSchema =
    typeof safeDisplayDesc01 === "string"
      ? safeDisplayDesc01.replace(/<[^>]+>/g, "").slice(0, 300)
      : "";
  const reviewsForSchema = reviews.filter(
    (r) =>
      typeof r.rating === "number" &&
      r.rating >= SCHEMA_RATING_WORST &&
      r.rating <= SCHEMA_RATING_BEST
  );
  const reviewCount = reviewsForSchema.length;
  const avgRating =
    reviewCount > 0
      ? reviewsForSchema.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;
  const schemaReviews =
    reviewCount > 0
      ? reviewsForSchema.slice(0, 50).map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.nickname.trim() || "anonymous" },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: SCHEMA_RATING_BEST,
            worstRating: SCHEMA_RATING_WORST,
          },
          reviewBody: r.review?.trim() || "(コメントなし)",
          datePublished: r.createdAt,
        }))
      : undefined;
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    additionalType: SCHEMA_ADDITIONAL_TYPE_TEA,
    category: SCHEMA_PRODUCT_CATEGORY[locale],
    name: displayTitle || titleJa,
    image: imagePaths.length > 0 ? imagePaths.map((p) => `${baseUrl}${p}`) : undefined,
    description: descriptionForSchema || undefined,
    brand: { "@type": "Brand", name: ORGANIZATION_NAME_JA },
    sku: product.SKU || undefined,
    gtin13: product.GTIN || undefined,
    url: productUrl,
    offers:
      typeof product.PRICE === "number"
        ? {
            "@type": "Offer",
            priceCurrency: "JPY",
            price: product.PRICE,
            availability: schemaAvailability,
            url: productUrl,
            priceValidUntil: OFFER_PRICE_VALID_UNTIL,
            eligibleRegion: OFFER_ELIGIBLE_REGION_JP,
            shippingDetails: OFFER_SHIPPING_DETAILS_JP,
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "JP",
              merchantReturnLink: legalUrl,
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 7,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            },
          }
        : undefined,
  };
  if (reviewCount > 0 && avgRating !== null && schemaReviews) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(avgRating.toFixed(2)),
      reviewCount,
      bestRating: SCHEMA_RATING_BEST,
      worstRating: SCHEMA_RATING_WORST,
    };
    productSchema.review = schemaReviews;
  }

  const pathname = buildLocalizedPath(locale, `/ise-cha/${slug}`);
  const breadcrumbItems = getBreadcrumbItems(pathname, locale, { productName: displayTitle || titleJa });

  const hasTaste = tasteImagePaths.length > 0;
  /** DESCRIPTION02 が無い商品は淹れ方などが DESCRIPTION01 に入ることが多い → その右に味わい画像 */
  const tasteWithDesc01Only = hasTaste && !!displayDesc01 && !displayDesc02;
  const tasteWithDesc02 = hasTaste && !!displayDesc02;
  const tasteStandalone = hasTaste && !displayDesc01 && !displayDesc02;

  return (
    <>
    <BreadcrumbListSchema items={breadcrumbItems} />
    <article className={["mb-10", styles.scope].join(" ")}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mb-8">
        <h1 className="m-0 mb-2 font-heading text-lg md:text-xl font-semibold text-tea-deep">
          {displayTitle || "—"}
        </h1>
        <p className="m-0 text-right text-2xl font-bold text-tea-deep">
          {formatPriceYen(product.PRICE)} <span className="text-base font-normal text-ink-muted">{t.taxIncluded}</span>
        </p>
        <ProductBuyBar
          slug={slug}
          price={product.PRICE}
          title={displayTitle}
          imagePath={imagePaths[0]}
          locale={locale}
          shipRank={product.SHIP_RANK}
        />
        {/* 商品画像とDESCRIPTION01：スマホは画像の下、タブレット・PCは画像の右に説明文を配置 */}
        <div className={safeDisplayDesc01 ? "mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start md:gap-8" : "mt-5"}>
          <div className={safeDisplayDesc01 ? undefined : "mx-auto max-w-xl md:mx-0 md:max-w-none"}>
            <ProductImageGallery imagePaths={imagePaths} alt={displayTitle || ""} />
          </div>
          {safeDisplayDesc01 && (
            <div className="min-w-0">
              <div
                className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: safeDisplayDesc01 }}
              />
              {product.SHIP_RANK !== undefined && (
                <ShipRankInfo shipRank={product.SHIP_RANK} locale={locale} className="mt-4" />
              )}
            </div>
          )}
        </div>
        {!safeDisplayDesc01 && product.SHIP_RANK !== undefined && (
          <ShipRankInfo shipRank={product.SHIP_RANK} locale={locale} className="mt-4 ml-auto w-full md:max-w-sm" />
        )}
        {safeDisplayDesc01 && tasteWithDesc01Only && (
          <div className="mt-6 flex justify-center md:justify-end">
            <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} />
          </div>
        )}
      </div>
      {(safeDisplayDesc02 || tasteStandalone) && (
        <div
          className={
            tasteWithDesc02
              ? "grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-start md:gap-8"
              : tasteStandalone
                ? "flex justify-center md:justify-end"
                : undefined
          }
        >
          {safeDisplayDesc02 && (
            <div className="min-w-0">
              <div
                className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: safeDisplayDesc02 }}
              />
            </div>
          )}
          {tasteWithDesc02 && (
            <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} />
          )}
          {tasteStandalone && (
            <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} />
          )}
        </div>
      )}
    </article>
  </>
  );
}
