"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { formatPriceYen } from "@/lib/formatters";
import { buildHref } from "@/lib/urlPath";

const FREE_SHIPPING_THRESHOLD = 10000;

function taxIncluded(amount: number): number {
  return Math.floor(amount * 10 / 110);
}

export default function CartPageContent() {
  const t = COMMON_TEXTS.cart;
  const { items, updateQuantity, removeFromCart } = useCart();
  const [resolvedImagePaths, setResolvedImagePaths] = useState<Record<string, string>>({});

  const missingImageSlugs = useMemo(() => {
    return Array.from(new Set(items.filter((i) => !i.imagePath).map((i) => i.slug)));
  }, [items]);

  useEffect(() => {
    if (missingImageSlugs.length === 0) {
      setResolvedImagePaths({});
      return;
    }
    const params = new URLSearchParams({ slugs: missingImageSlugs.join(",") });
    fetch(`/api/product-images?${params}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Record<string, string>) => setResolvedImagePaths(data ?? {}))
      .catch(() => setResolvedImagePaths({}));
  }, [missingImageSlugs]);

  const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const shippingKnown = false;
  const shipping = 0;
  const total = subtotal + shipping;
  const taxAmount = taxIncluded(total);
  const homeHref = buildHref("/");
  const checkoutHref = buildHref("/checkout");

  return (
    <article className="mb-10">
      <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep">{t.title}</h1>
      {items.length === 0 ? (
        <p className="text-ink-muted mb-6">{t.empty}</p>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Link
              href={homeHref}
              className="text-[0.9375rem] text-tea font-semibold no-underline hover:underline"
            >
              {t.continueShopping}
            </Link>
          </div>
          <ul className="list-none m-0 p-0 flex flex-col gap-4 mb-6">
            {items.map((item) => {
              const displayTitle = item.title;
              const imageSrc = item.imagePath ?? resolvedImagePaths[item.slug] ?? "";
              return (
              <li
                key={item.slug}
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border border-border bg-washi"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                  <Link
                    href={buildHref(`/ise-cha/${item.slug}`)}
                    className="shrink-0 w-20 h-20 rounded overflow-hidden bg-cream self-start"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={displayTitle}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-cream" aria-hidden="true" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1 w-full sm:min-w-[8rem]">
                    <Link
                      href={buildHref(`/ise-cha/${item.slug}`)}
                      className="font-medium text-tea-deep no-underline hover:underline block break-words text-[0.9375rem]"
                    >
                      {displayTitle}
                    </Link>
                    <p className="m-0 mt-1 text-[0.875rem] text-ink-muted">
                      {formatPriceYen(item.price)}{t.taxIncluded} × {item.quantity} = {formatPriceYen(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label={t.decreaseQty}
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
                    aria-label={t.increaseQty}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-[0.8125rem] text-ink-muted underline hover:text-tea-deep self-start sm:self-center"
                >
                  {t.remove}
                </button>
              </li>
            );
            })}
          </ul>
          <div className="border-t border-border pt-6 space-y-2 max-w-md ml-auto">
            <div className="flex justify-between text-[0.9375rem]">
              <span className="text-ink-muted">{t.subtotal}</span>
              <span className="font-medium">{formatPriceYen(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">{t.shipping}</span>
              <span className="font-medium">{shippingKnown ? formatPriceYen(shipping) : t.shippingCalculating}</span>
            </div>
            <div className="flex justify-between items-center text-base font-semibold text-tea-deep pt-2">
              <span>{t.total}</span>
              <span>{shippingKnown ? formatPriceYen(total) : formatPriceYen(subtotal)}</span>
            </div>
            <p className="m-0 text-[0.8125rem] text-ink-muted text-right">
              {t.taxNote}{formatPriceYen(taxAmount)}{t.taxNoteSuffix}
            </p>
            <div className="pt-4 space-y-3">
              <Link
                href={checkoutHref}
                className="inline-block w-full py-3 px-6 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold text-center no-underline transition-colors hover:bg-tea-light hover:border-tea-light"
              >
                {t.proceedToCheckout}
              </Link>
            </div>
            <p className="m-0 pt-2 text-[0.9375rem] font-bold text-tea-deep text-right">
              {subtotal >= FREE_SHIPPING_THRESHOLD
                ? t.freeShipping
                : `${t.freeShippingRemainPrefix}${formatPriceYen(FREE_SHIPPING_THRESHOLD - subtotal)}${t.freeShippingRemain}`}
            </p>
          </div>
        </>
      )}
    </article>
  );
}
