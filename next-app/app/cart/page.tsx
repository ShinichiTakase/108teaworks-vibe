"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const FALLBACK_IMAGE = "/images/products/product-01.webp";

function formatPrice(price: number): string {
  return `¥${Number(price).toLocaleString()}`;
}

const FREE_SHIPPING_THRESHOLD = 20000; // 税込2万円以上で送料無料

/** 税込金額から消費税額を算出（10%込の場合） */
function taxIncluded(amount: number): number {
  return Math.floor(amount * 10 / 110);
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const shippingKnown = false; // TODO: 住所がわかっている場合は true にし送料を計算
  const shipping = 0; // TODO: 住所に応じて自動計算
  const total = subtotal + shipping;
  const taxAmount = taxIncluded(total);

  return (
    <article className="mb-10">
      <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep">ショッピングカート</h1>
      {items.length === 0 ? (
        <p className="text-ink-muted mb-6">カートに商品はありません。</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Link
              href="/"
              className="text-[0.9375rem] text-tea font-semibold no-underline hover:underline"
            >
              買い物を続ける
            </Link>
          </div>
          <ul className="list-none m-0 p-0 flex flex-col gap-4 mb-6">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border border-border bg-washi"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                  <Link
                    href={`/products/${item.slug}`}
                    className="shrink-0 w-20 h-20 rounded overflow-hidden bg-cream self-start"
                  >
                    <Image
                      src={item.imagePath ?? FALLBACK_IMAGE}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1 w-full sm:min-w-[8rem]">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-tea-deep no-underline hover:underline block break-words text-[0.9375rem]"
                    >
                      {item.title}
                    </Link>
                    <p className="m-0 mt-1 text-[0.875rem] text-ink-muted">
                      {formatPrice(item.price)}（税込） × {item.quantity} = {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label="数量を減らす"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[0.9375rem] font-medium" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label="数量を増やす"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-[0.8125rem] text-ink-muted underline hover:text-tea-deep self-start sm:self-center"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-6 space-y-2 max-w-md ml-auto">
            <div className="flex justify-between text-[0.9375rem]">
              <span className="text-ink-muted">小計</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">送料</span>
              <span className="font-medium">{shippingKnown ? formatPrice(shipping) : "計算中"}</span>
            </div>
            <div className="flex justify-between items-center text-base font-semibold text-tea-deep pt-2">
              <span>合計（税込）</span>
              <span>{shippingKnown ? formatPrice(total) : formatPrice(subtotal)}</span>
            </div>
            <p className="m-0 text-[0.8125rem] text-ink-muted text-right">
              （消費税{formatPrice(taxAmount)}を含む）
            </p>
            <div className="pt-4 space-y-3">
              <Link
                href="/checkout"
                className="inline-block w-full py-3 px-6 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold text-center no-underline transition-colors hover:bg-tea-light hover:border-tea-light"
              >
                購入手続きに進む
              </Link>
            </div>
            <p className="m-0 pt-2 text-[0.9375rem] font-bold text-tea-deep text-right">
              {subtotal >= FREE_SHIPPING_THRESHOLD
                ? "送料無料です"
                : `あと ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} のお買い上げで送料無料です`}
            </p>
          </div>
        </>
      )}
    </article>
  );
}
