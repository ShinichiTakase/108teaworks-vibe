import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths, getProductTasteImagePaths } from "@/lib/productImage";
import ProductTasteImages from "@/components/ProductTasteImages";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductAddToCart from "@/components/ProductAddToCart";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateForLocale, translateManyForLocale } from "@/lib/translateForLocale";
import { loadReviewsForSlug } from "@/lib/reviewsStorage";
import { formatReviewDate } from "@/lib/reviewDisplay";
import { buildLocalizedPath } from "@/lib/urlPath";
import { ORGANIZATION_NAME_JA } from "@/lib/siteConstants";

export const dynamic = "force-dynamic";

function formatPrice(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
}

function productHref(locale: Locale, path: string): string {
  const slug = path.replace(/^\/*(products|ise-cha)\/*/, "") || path;
  return buildLocalizedPath(locale, `/ise-cha/${slug}`);
}

const RELATED_KEYS = [
  { label: "RELATED01", url: "RELATED_URL01" },
  { label: "RELATED02", url: "RELATED_URL02" },
  { label: "RELATED03", url: "RELATED_URL03" },
  { label: "RELATED04", url: "RELATED_URL04" },
] as const;

/** Product/Offer 用。Google リッチリザルトで推奨される価格の有効期限 */
const OFFER_PRICE_VALID_UNTIL = "2027-12-31";
const SCHEMA_RATING_BEST = 5;
const SCHEMA_RATING_WORST = 1;

/** 商品の販売・配送対象を日本国内のみと JSON-LD で明示 */
const OFFER_ELIGIBLE_REGION_JP = "JP";
/** リッチリザルト用。実送料は都道府県・配送ランク・2万円以上無料等で変動（api/checkout/shipping と整合） */
const SCHEMA_SHIPPING_RATE_JPY = 280;
/** 注文確定メール等の「本日より2～5営業日」に合わせた日数レンジ（calendar DAY 表現） */
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
  ja: "お茶（アルコール非含有）",
  en: "Tea (non-alcoholic)",
  ko: "차(茶) · 무알코올 음료",
  zh: "茶（无酒精）",
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
  const relatedRaw = RELATED_KEYS.map(({ label, url }) => ({
    label: product[label as keyof typeof product] as string | undefined,
    href: product[url as keyof typeof product] as string | undefined,
  })).filter((r): r is { label: string; href: string } => typeof r.label === "string" && !!r.label && typeof r.href === "string" && !!r.href);

  const titleJa = product.TITLE ?? "";
  const desc01Ja = product.DESCRIPTION01 ? decodeHtmlEntities(product.DESCRIPTION01) : "";
  const desc02Ja = product.DESCRIPTION02 ? decodeHtmlEntities(product.DESCRIPTION02) : "";

  const [displayTitleRaw, displayDesc01, displayDesc02, translatedLabels] =
    locale === "ja"
      ? [titleJa, desc01Ja, desc02Ja, relatedRaw.map((r) => r.label) as string[]]
      : await Promise.all([
          translateForLocale(titleJa, locale),
          desc01Ja ? translateForLocale(desc01Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
          desc02Ja ? translateForLocale(desc02Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
          translateManyForLocale(relatedRaw.map((r) => r.label), locale),
        ]).then(([t1, d1, d2, labels]) => [t1, d1, d2, labels ?? []]);

  const displayTitle =
    typeof displayTitleRaw === "string"
      ? displayTitleRaw
      : Array.isArray(displayTitleRaw)
        ? displayTitleRaw[0] ?? ""
        : "";

  const related =
    locale === "ja"
      ? relatedRaw
      : relatedRaw.map((r, i) => ({ ...r, label: translatedLabels[i] ?? r.label }));

  const reviews = await loadReviewsForSlug(slug);
  const latest = reviews.slice(0, 3);
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
    typeof displayDesc01 === "string"
      ? displayDesc01.replace(/<[^>]+>/g, "").slice(0, 300)
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
          reviewBody: r.review?.trim() || "（コメントなし）",
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

  const howToBrewHref = buildLocalizedPath(locale, "/how-to-brew");
  const isechaHref = buildLocalizedPath(locale, "/ise-cha");
  const showDescription02Ctas =
    !!displayDesc02 &&
    !String(displayDesc02).includes("/how-to-brew") &&
    !String(displayDesc02).includes("/ise-cha");

  return (
    <>
    <BreadcrumbListSchema items={breadcrumbItems} />
    <article className="mb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <ProductImageGallery imagePaths={imagePaths} alt={displayTitle || ""} />
        </div>
        <div>
          <h1 className="m-0 mb-2 font-heading text-lg md:text-xl font-semibold text-tea-deep text-right">
            {displayTitle || "—"}
          </h1>
          <p className="m-0 mb-4 text-[1.125rem] font-bold text-tea-deep text-right">
            {formatPrice(product.PRICE)} <span className="text-base font-normal text-ink-muted">{t.taxIncluded}</span>
          </p>
          {displayDesc01 && !tasteWithDesc01Only && (
            <div
              className="product-description mb-4 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: displayDesc01 }}
            />
          )}
          {displayDesc01 && tasteWithDesc01Only && (
            <div className="mb-4 grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-start md:gap-5">
              <div
                className="product-description min-w-0 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: displayDesc01 }}
              />
              <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} className="min-w-0" />
            </div>
          )}
          <p className="m-0 text-[0.8125rem] text-ink-muted">
            {product.SKU && <>{t.productCode}: {product.SKU}</>}
            {product.SKU && product.GTIN && " / "}
            {product.GTIN && <>{t.janCode}: {product.GTIN}</>}
          </p>
          <ProductAddToCart
            slug={slug}
            price={product.PRICE}
            title={displayTitle}
            imagePath={imagePaths[0]}
            locale={locale}
          />
          {related.length > 0 && (
            <div className="mt-6">
              <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">{t.relatedProducts}</h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {related.map((r, i) => (
                  <li key={i}>
                    <Link
                      href={r.href.startsWith("/") ? productHref(locale, r.href) : productHref(locale, r.href)}
                      className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span>{r.label}</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">{t.viewDetails}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {(displayDesc02 || tasteStandalone) && (
        <div
          className={
            tasteWithDesc02
              ? "grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-start md:gap-8"
              : tasteStandalone
                ? "flex justify-center md:justify-end"
                : undefined
          }
        >
          {displayDesc02 && (
            <div className="min-w-0">
              <div
                className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: displayDesc02 }}
              />
              {showDescription02Ctas && (
                <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start">
                  <li className="md:w-1/5 md:flex-none">
                    <Link
                      href={howToBrewHref}
                      className="flex items-center justify-between gap-2 w-full md:min-w-[11rem] py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="whitespace-nowrap">お茶の淹れ方</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                        {t.viewDetails}
                      </span>
                    </Link>
                  </li>
                  <li className="md:w-1/5 md:flex-none">
                    <Link
                      href={isechaHref}
                      className="flex items-center justify-between gap-2 w-full md:min-w-[11rem] py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="whitespace-nowrap">伊勢茶とは</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                        {t.viewDetails}
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
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
      {latest.length > 0 && (
        <section className="mt-10 border-t border-border pt-6">
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">
            レビュー（{reviews.length}件）
          </h2>
          <ul className="m-0 p-0 list-none space-y-4">
            {latest.map((r, idx) => (
              <li key={idx} className="border border-border rounded-xl p-4 bg-washi">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-tea-deep">
                    <span className="shrink-0 w-5 h-5 text-ink-muted" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    {r.nickname}
                  </span>
                  <span className="text-[0.875rem] text-amber-500" aria-label={`評価 ${r.rating} / 5`}>
                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="m-0 mb-1 text-[0.875rem] text-ink leading-relaxed whitespace-pre-wrap">
                  {r.review}
                </p>
                <p className="m-0 text-[0.75rem] text-ink-muted">
                  {formatReviewDate(r.createdAt)}
                </p>
              </li>
            ))}
          </ul>
          {reviews.length > 3 && (
            <div className="mt-4">
              <Link
                href={productHref(locale, `/ise-cha/${slug}/reviews`)}
                className="inline-flex items-center text-[0.875rem] font-semibold text-tea no-underline hover:underline"
              >
                ...もっと読む
              </Link>
            </div>
          )}
        </section>
      )}
    </article>
    <PageEndProductList locale={locale} />
  </>
  );
}
