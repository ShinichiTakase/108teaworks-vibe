import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import { HOME_PRODUCTS_TEXTS } from "@/lib/homeSectionTexts";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { formatPriceYen } from "@/lib/formatters";
import { buildHref } from "@/lib/urlPath";

function productHref(slug: string): string {
  return buildHref(`/ise-cha/${slug}`);
}

/**
 * ページ末尾用の商品一覧。ORDER 順・1行6商品で表示（トップより軽い雰囲気）。
 * microCMS products を取得して表示する。
 */
export default async function PageEndProductList() {
  const { contents: products } = await getProducts();

  const productsWithImage = products.map((p) => {
    const slug = p.SLUG ?? p.id;
    return {
      ...p,
      imagePath: getProductImagePath(slug),
      slug,
    };
  });

  const t = HOME_PRODUCTS_TEXTS;
  const taxLabel = COMMON_TEXTS.product.taxIncluded;

  if (productsWithImage.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-16 mb-12"
      id="page-end-products"
      aria-label={t.sectionAria}
    >
      <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">
        {t.sectionAria}
      </h2>
      <ul className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {productsWithImage.map((product) => {
          const outOfStock = product.STOCK === 0;
          return (
            <li key={product.id} className="m-0">
              <Link
                href={productHref(product.slug)}
                className="flex flex-col h-full p-2 bg-washi border border-border rounded transition-colors hover:border-tea-light hover:bg-white text-ink no-underline"
              >
                <span className="relative block mb-2 aspect-square">
                  <Image
                    src={product.imagePath}
                    alt={product.TITLE ?? ""}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded bg-cream"
                  />
                  {outOfStock && (
                    <span
                      className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[0.75rem] font-semibold text-cream"
                      aria-hidden
                    >
                      {t.outOfStock}
                    </span>
                  )}
                </span>
                <span className="block text-right text-[0.8125rem] font-normal mb-0.5 line-clamp-2">
                  {product.TITLE ?? "—"}
                </span>
                <span className="block text-right text-[0.8125rem] font-bold text-tea-deep">
                  {formatPriceYen(product.PRICE)}{" "}
                  <span className="text-[0.6875rem] text-ink-muted font-normal">
                    {taxLabel}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
