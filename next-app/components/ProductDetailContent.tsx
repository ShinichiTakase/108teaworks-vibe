import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths } from "@/lib/productImage";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductAddToCart from "@/components/ProductAddToCart";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateForLocale, translateManyForLocale } from "@/lib/translateForLocale";
import { loadReviewsForSlug } from "@/lib/reviewsStorage";
import { formatReviewDate } from "@/lib/reviewDisplay";

export const dynamic = "force-dynamic";

function formatPrice(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
}

function productHref(locale: Locale, path: string): string {
  const slug = path.replace(/^\/*products\/*/, "") || path;
  return locale === "ja" ? `/products/${slug}` : `/${locale}/products/${slug}`;
}

const RELATED_KEYS = [
  { label: "RELATED01", url: "RELATED_URL01" },
  { label: "RELATED02", url: "RELATED_URL02" },
  { label: "RELATED03", url: "RELATED_URL03" },
  { label: "RELATED04", url: "RELATED_URL04" },
] as const;

type Props = {
  locale: Locale;
  slug: string;
};

export default async function ProductDetailContent({ locale, slug }: Props) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = COMMON_TEXTS[locale].product;
  const imagePaths = getProductImagePaths(slug);
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
      ? `${baseUrl}/products/${slug}`
      : `${baseUrl}/${locale}/products/${slug}`;
  const descriptionForSchema =
    typeof displayDesc01 === "string"
      ? displayDesc01.replace(/<[^>]+>/g, "").slice(0, 300)
      : "";
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : null;
  const schemaReviews =
    reviewCount > 0
      ? reviews.slice(0, 50).map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.nickname || "anonymous" },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: r.review,
          datePublished: r.createdAt,
        }))
      : undefined;
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayTitle || titleJa,
    image: imagePaths.length > 0 ? `${baseUrl}${imagePaths[0]}` : undefined,
    description: descriptionForSchema || undefined,
    sku: product.SKU || undefined,
    gtin13: product.GTIN || undefined,
    url: productUrl,
    offers:
      typeof product.PRICE === "number"
        ? {
            "@type": "Offer",
            priceCurrency: "JPY",
            price: product.PRICE,
            availability: "https://schema.org/InStock",
            url: productUrl,
          }
        : undefined,
  };
  if (reviewCount > 0 && avgRating !== null) {
    (productSchema as any).aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(avgRating.toFixed(2)),
      reviewCount,
    };
    if (schemaReviews) {
      (productSchema as any).review = schemaReviews;
    }
  }

  return (
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
          {displayDesc01 && (
            <div
              className="product-description mb-4 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: displayDesc01 }}
            />
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
      {displayDesc02 && (
        <div
          className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: displayDesc02 }}
        />
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
                href={productHref(locale, `/products/${slug}/reviews`)}
                className="inline-flex items-center text-[0.875rem] font-semibold text-tea no-underline hover:underline"
              >
                ...もっと読む
              </Link>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
