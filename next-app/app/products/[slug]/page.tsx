import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths } from "@/lib/productImage";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductAddToCart from "@/components/ProductAddToCart";

export const dynamic = "force-dynamic";

function formatPrice(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "商品｜伊勢茶の藤八茶寮" };
  return {
    title: `${product.TITLE ?? "商品"}｜伊勢茶の藤八茶寮`,
    description: product.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

const RELATED_KEYS = [
  { label: "RELATED01", url: "RELATED_URL01" },
  { label: "RELATED02", url: "RELATED_URL02" },
  { label: "RELATED03", url: "RELATED_URL03" },
  { label: "RELATED04", url: "RELATED_URL04" },
] as const;

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const imagePaths = getProductImagePaths(slug);
  const related = RELATED_KEYS.map(({ label, url }) => ({
    label: product[label as keyof typeof product] as string | undefined,
    href: product[url as keyof typeof product] as string | undefined,
  })).filter((r): r is { label: string; href: string } => typeof r.label === "string" && !!r.label && typeof r.href === "string" && !!r.href);

  return (
    <article className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <ProductImageGallery imagePaths={imagePaths} alt={product.TITLE ?? ""} />
            </div>
            <div>
              <h1 className="m-0 mb-2 font-heading text-lg md:text-xl font-semibold text-tea-deep text-right">
                {product.TITLE ?? "—"}
              </h1>
              <p className="m-0 mb-4 text-[1.125rem] font-bold text-tea-deep text-right">
                {formatPrice(product.PRICE)}{" "}
                <span className="text-base font-normal text-ink-muted">(税込)</span>
              </p>
              {product.DESCRIPTION01 && (
                <div
                  className="product-description mb-4 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(product.DESCRIPTION01) }}
                />
              )}
              <p className="m-0 text-[0.8125rem] text-ink-muted">
                {product.SKU && <>商品コード: {product.SKU}</>}
                {product.SKU && product.GTIN && " / "}
                {product.GTIN && <>JANコード: {product.GTIN}</>}
              </p>
              <ProductAddToCart
                slug={slug}
                price={product.PRICE}
                title={product.TITLE ?? ""}
                imagePath={imagePaths[0]}
              />
              {related.length > 0 && (
                <div className="mt-6">
                  <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">関連商品</h2>
                  <ul className="list-none m-0 p-0 flex flex-col gap-2">
                    {related.map((r, i) => (
                      <li key={i}>
                        <Link
                          href={r.href.startsWith("/") ? r.href : `/products/${r.href}`}
                          className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                        >
                          <span>{r.label}</span>
                          <span className="shrink-0 text-tea font-semibold" aria-hidden="true">詳しく見る &gt;&gt;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {product.DESCRIPTION02 && (
            <div
              className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(product.DESCRIPTION02) }}
            />
          )}
    </article>
  );
}
