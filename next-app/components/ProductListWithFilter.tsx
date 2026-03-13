"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import type { ProductItem } from "@/lib/microcms";
import type { Locale } from "@/lib/i18n";
import { HOME_PRODUCTS_TEXTS } from "@/lib/homeSectionTexts";
import { COMMON_TEXTS } from "@/lib/commonTexts";

function getLocaleFromPath(pathname: string | null): Locale {
  if (!pathname) return "ja";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/zh")) return "zh";
  return "ja";
}

function productHref(locale: Locale, slug: string): string {
  return locale === "ja" ? `/products/${slug}` : `/${locale}/products/${slug}`;
}

const FILTER_OPTIONS: { value: string; labelKey: keyof Omit<typeof HOME_PRODUCTS_TEXTS.ja, "sectionAria" | "filterLabel" | "filterAria" | "noProducts" | "outOfStock"> }[] = [
  { value: "", labelKey: "filterAll" },
  { value: "深蒸し茶", labelKey: "filterFukamushi" },
  { value: "ほうじ茶", labelKey: "filterHoujicha" },
  { value: "和紅茶", labelKey: "filterWakoucha" },
  { value: "リーフ（茶葉）", labelKey: "filterLeaf" },
  { value: "ティーバッグ", labelKey: "filterTeabag" },
  { value: "パウダー", labelKey: "filterPowder" },
];

function formatPrice(price: number | undefined): string {
  if (price == null || Number.isNaN(price)) return "—";
  return `¥${Number(price).toLocaleString()}`;
}

/** TAG を LIKE %filterValue% で部分一致判定 */
function productMatchesTag(product: ProductItem, filterValue: string): boolean {
  if (!filterValue) return true;
  const tagStr = product.tag ?? "";
  const tagStrs = product.tags ?? (tagStr ? [tagStr] : []);
  const all = tagStr ? [tagStr, ...tagStrs] : tagStrs;
  return all.some((s) => s.includes(filterValue));
}

export type ProductWithImage = ProductItem & { imagePath: string };

type Props = {
  products: ProductWithImage[];
};

export default function ProductListWithFilter({ products }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = getLocaleFromPath(pathname);
  const t = HOME_PRODUCTS_TEXTS[locale];
  const taxLabel = COMMON_TEXTS[locale].product.taxIncluded;
  const initialFilter = searchParams.get("filter") ?? "";
  const [filter, setFilter] = useState(initialFilter);
  useEffect(() => {
    setFilter(searchParams.get("filter") ?? "");
  }, [searchParams]);
  const filtered =
    filter === ""
      ? products
      : products.filter((p) => productMatchesTag(p, filter));

  return (
    <section className="mb-12" id="products" aria-label={t.sectionAria}>
      <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
        <label htmlFor="product-filter" className="text-[0.875rem] text-ink-muted">
          {t.filterLabel}
        </label>
        <select
          id="product-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-border bg-washi px-3 py-1.5 text-[0.875rem] text-ink focus:border-tea focus:outline-none focus:ring-1 focus:ring-tea"
          aria-label={t.filterAria}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {t[opt.labelKey]}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-muted m-0">{t.noProducts}</p>
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((product) => {
            const slug = product.SLUG ?? product.id;
            const outOfStock = product.STOCK === 0;
            return (
              <li key={product.id} className="m-0">
                <Link
                  href={productHref(locale, slug)}
                  className="flex flex-col h-full p-3 bg-washi border border-border rounded transition-colors hover:border-tea-light hover:bg-white text-ink no-underline"
                >
                  <span className="relative block mb-3">
                    <Image
                      src={product.imagePath}
                      alt={product.TITLE ?? ""}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover rounded bg-cream"
                      loading="lazy"
                    />
                    {outOfStock && (
                      <span
                        className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 text-base font-semibold text-cream"
                        aria-hidden="true"
                      >
                        {t.outOfStock}
                      </span>
                    )}
                  </span>
                  <span className="block text-right text-base font-normal mb-1">
                    {product.TITLE ?? "—"}
                  </span>
                  <span className="block text-right text-[0.9375rem] font-bold text-tea-deep">
                    {formatPrice(product.PRICE)}{" "}
                    <span className="text-[0.8125rem] text-ink-muted font-normal">
                      {taxLabel}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
