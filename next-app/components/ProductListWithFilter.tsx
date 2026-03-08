"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductItem } from "@/lib/microcms";

const FILTER_OPTIONS = [
  { value: "", label: "すべて表示" },
  { value: "深蒸し茶", label: "深蒸し茶" },
  { value: "ほうじ茶", label: "ほうじ茶" },
  { value: "和紅茶", label: "和紅茶" },
  { value: "リーフ（茶葉）", label: "リーフ（茶葉）" },
  { value: "ティーバッグ", label: "ティーバッグ" },
  { value: "パウダー", label: "パウダー" },
] as const;

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
  const [filter, setFilter] = useState("");
  const filtered =
    filter === ""
      ? products
      : products.filter((p) => productMatchesTag(p, filter));

  return (
    <section className="mb-12" id="products" aria-label="商品一覧">
      <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
        <label htmlFor="product-filter" className="text-[0.875rem] text-ink-muted">
          絞り込み:
        </label>
        <select
          id="product-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-border bg-washi px-3 py-1.5 text-[0.875rem] text-ink focus:border-tea focus:outline-none focus:ring-1 focus:ring-tea"
          aria-label="商品の絞り込み"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-muted m-0">該当する商品はありません。</p>
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((product) => {
            const slug = product.SLUG ?? product.id;
            const outOfStock = product.STOCK === 0;
            return (
              <li key={product.id} className="m-0">
                <Link
                  href={`/products/${slug}`}
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
                        在庫切れ
                      </span>
                    )}
                  </span>
                  <span className="block text-right text-base font-normal mb-1">
                    {product.TITLE ?? "—"}
                  </span>
                  <span className="block text-right text-[0.9375rem] font-bold text-tea-deep">
                    {formatPrice(product.PRICE)}{" "}
                    <span className="text-[0.8125rem] text-ink-muted font-normal">
                      (税込)
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
