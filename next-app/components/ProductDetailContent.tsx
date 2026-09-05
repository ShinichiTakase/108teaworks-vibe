import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths, getProductTasteImagePaths } from "@/lib/productImage";
import ProductTasteImages from "@/components/ProductTasteImages";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductBuyBar from "@/components/ProductBuyBar";
import ShipRankInfo from "@/components/ShipRankInfo";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import styles from "@/components/ProductDetailContent.module.css";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { loadReviewsForSlug, summarizeReviews } from "@/lib/reviewsStorage";
import { formatReviewDate } from "@/lib/reviewDisplay";
import { formatPriceYen } from "@/lib/formatters";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { buildHref } from "@/lib/urlPath";
import { ORGANIZATION_NAME_JA } from "@/lib/siteConstants";
import { getProductFaqs } from "@/lib/productFaqs";

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
const SCHEMA_PRODUCT_CATEGORY = "お茶(アルコール非含有)";

/** レビュー一覧（商品説明下部に埋め込み）1ページあたりの件数 */
const REVIEWS_PER_PAGE = 5;

type Props = {
  slug: string;
  /** 商品説明下部のレビュー一覧のページ番号（1始まり）。省略時は1ページ目 */
  reviewsPage?: number;
};

export default async function ProductDetailContent({ slug, reviewsPage }: Props) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = COMMON_TEXTS.product;
  const imagePaths = getProductImagePaths(slug);
  const tasteImagePaths = getProductTasteImagePaths(slug);

  const titleJa = product.TITLE ?? "";
  const desc01Ja = product.DESCRIPTION01 ? decodeHtmlEntities(product.DESCRIPTION01) : "";
  const desc02Ja = product.DESCRIPTION02 ? decodeHtmlEntities(product.DESCRIPTION02) : "";

  const displayTitle = titleJa;
  const safeDisplayDesc01 = sanitizeRichHtml(desc01Ja);
  const safeDisplayDesc02 = sanitizeRichHtml(desc02Ja);

  const reviews = await loadReviewsForSlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://108teaworks.com";
  const productUrl = `${baseUrl}/ise-cha/${slug}/`;
  const schemaAvailability =
    typeof product.STOCK === "number" && product.STOCK <= 0
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
  const descriptionForSchema =
    typeof safeDisplayDesc01 === "string"
      ? safeDisplayDesc01.replace(/<[^>]+>/g, "").slice(0, 300)
      : "";
  /** JSON-LD・価格下の★サマリー・商品説明下部のレビュー一覧、いずれもここを唯一のデータソースとして参照する */
  const { validReviews: reviewsForSchema, reviewCount, avgRating } = summarizeReviews(reviews);
  const totalReviewPages = Math.max(1, Math.ceil(reviewCount / REVIEWS_PER_PAGE));
  const currentReviewPage = Math.min(Math.max(1, reviewsPage ?? 1), totalReviewPages);
  const reviewPageStart = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviewsForSchema.slice(reviewPageStart, reviewPageStart + REVIEWS_PER_PAGE);
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
    category: SCHEMA_PRODUCT_CATEGORY,
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
            /** 食品のためお客様都合の返品不可（瑕疵・誤配送時の法定対応は別枠）。LP側と同一の値に統一 */
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "JP",
              returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
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

  const pathname = buildHref(`/ise-cha/${slug}`);
  const breadcrumbItems = getBreadcrumbItems(pathname, { productName: displayTitle || titleJa });
  const faqs = getProductFaqs(slug);

  const hasTaste = tasteImagePaths.length > 0;
  /** DESCRIPTION02 が無い商品は淹れ方などが DESCRIPTION01 に入ることが多い → その右に味わい画像 */
  const tasteWithDesc01Only = hasTaste && !!desc01Ja && !desc02Ja;
  const tasteWithDesc02 = hasTaste && !!desc02Ja;
  const tasteStandalone = hasTaste && !desc01Ja && !desc02Ja;

  return (
    <>
    <BreadcrumbListSchema items={breadcrumbItems} />
    {faqs && faqs.length > 0 && <FaqJsonLd questions={faqs} />}
    <article className={["mb-10", styles.scope].join(" ")}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mb-8">
        <h1 className="m-0 mb-2 text-right font-heading text-lg md:text-xl font-semibold text-tea-deep">
          {displayTitle || "—"}
        </h1>
        <p className="m-0 text-right text-2xl font-bold text-tea-deep">
          {formatPriceYen(product.PRICE)} <span className="text-base font-normal text-ink-muted">{t.taxIncluded}</span>
        </p>
        {(product.SKU || product.GTIN) && (
          <p className="m-0 mt-1 text-right text-[0.8125rem] text-ink-muted">
            {product.SKU && <span>商品番号：{product.SKU}</span>}
            {product.SKU && product.GTIN && <span> </span>}
            {product.GTIN && <span className="text-[0.6875rem]">JANコード：{product.GTIN}</span>}
          </p>
        )}
        {/* レビューは本ページ下部(#reviews)に埋め込み表示。翻訳未対応のため日本語かつ1件以上の場合のみ表示 */}
        {reviewCount > 0 && avgRating !== null && (
          <a
            href="#reviews"
            className="mb-3 flex items-center justify-end gap-1.5 text-[0.8125rem] text-ink-muted no-underline transition-colors hover:text-tea-deep"
          >
            <span className="text-[0.9375rem] leading-none text-amber-500" aria-hidden="true">
              {"★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="font-semibold text-ink">{avgRating.toFixed(2)}</span>
            <span className="underline underline-offset-2">{reviewCount}件のレビューを見る</span>
          </a>
        )}
        <ProductBuyBar
          slug={slug}
          price={product.PRICE}
          title={displayTitle}
          imagePath={imagePaths[0]}
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
                <ShipRankInfo shipRank={product.SHIP_RANK} className="mt-4" />
              )}
            </div>
          )}
        </div>
        {!safeDisplayDesc01 && product.SHIP_RANK !== undefined && (
          <ShipRankInfo shipRank={product.SHIP_RANK} className="mt-4 ml-auto w-full md:max-w-sm" />
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
      {/* レビュー一覧を商品説明の下部に直接埋め込み表示（翻訳未対応のため日本語かつ1件以上の場合のみ） */}
      {reviewCount > 0 && avgRating !== null && (
        <div id="reviews" className="mt-10 border-t border-border pt-8">
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">レビュー</h2>
          <div className="mb-5 flex items-center gap-1.5">
            <span className="text-base leading-none text-amber-500" aria-hidden="true">
              {"★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-[0.9375rem] font-semibold text-ink">{avgRating.toFixed(2)}</span>
            <span className="text-[0.8125rem] text-ink-muted">（{reviewCount}件）</span>
          </div>
          <ul className="m-0 list-none space-y-4 p-0">
            {pageReviews.map((r, idx) => (
              <li key={reviewPageStart + idx} className="rounded-xl border border-border bg-washi p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-tea-deep">
                    <span className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    {r.nickname}
                  </span>
                  <span className="text-[0.875rem] text-amber-500" aria-label={`評価 ${r.rating} / 5`}>
                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="m-0 mb-1 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink">
                  {r.review}
                </p>
                <p className="m-0 text-[0.75rem] text-ink-muted">{formatReviewDate(r.createdAt)}</p>
              </li>
            ))}
          </ul>
          {totalReviewPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-3 text-[0.875rem]" aria-label="レビューのページ">
              {currentReviewPage > 1 && (
                <Link
                  href={`?page=${currentReviewPage - 1}#reviews`}
                  className="rounded border border-border px-3 py-1 text-ink no-underline hover:bg-cream"
                >
                  前へ
                </Link>
              )}
              <span className="text-ink-muted">
                {currentReviewPage} / {totalReviewPages}
              </span>
              {currentReviewPage < totalReviewPages && (
                <Link
                  href={`?page=${currentReviewPage + 1}#reviews`}
                  className="rounded border border-border px-3 py-1 text-ink no-underline hover:bg-cream"
                >
                  次へ
                </Link>
              )}
            </nav>
          )}
        </div>
      )}
    </article>
  </>
  );
}
