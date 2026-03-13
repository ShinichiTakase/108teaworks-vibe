"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

type Props = {
  slug: string;
  price: number | undefined;
  title: string;
  imagePath?: string;
  locale?: Locale;
};

export default function ProductAddToCart({ slug, price, title, imagePath, locale: localeProp }: Props) {
  const locale = localeProp ?? "ja";
  const t = COMMON_TEXTS[locale];
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath);
  };

  const handleBuyNow = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath);
    const checkoutPath = locale === "ja" ? "/checkout" : `/${locale}/checkout`;
    router.push(checkoutPath);
  };

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  return (
    <div className="mt-4 w-full">
      <div className="flex gap-2 w-full mb-3">
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <label htmlFor="product-quantity" className="text-[0.875rem] font-medium text-ink">
            {t.product.quantity}
          </label>
          <div className="flex items-stretch border-2 border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="w-10 flex items-center justify-center bg-washi text-ink text-lg font-bold border-r border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors"
            aria-label={t.cart.decreaseQty}
          >
            −
          </button>
          <span
            id="product-quantity"
            role="spinbutton"
            aria-valuenow={quantity}
            aria-valuemin={1}
            aria-valuemax={99}
            aria-label={t.product.quantity}
            className="w-12 flex items-center justify-center bg-white text-[0.9375rem] font-medium text-ink border-r border-border"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= 99}
            className="w-10 flex items-center justify-center bg-washi text-ink text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors"
            aria-label={t.cart.increaseQty}
          >
            +
          </button>
        </div>
        </div>
        <div className="flex-1 min-w-0" aria-hidden="true" />
      </div>
      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 min-w-0 py-3 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold transition-colors hover:bg-tea-light hover:border-tea-light"
        >
          {t.product.addToCart}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 min-w-0 py-3 rounded-lg border-2 border-tea bg-cream text-tea text-[0.9375rem] font-semibold transition-colors hover:bg-washi hover:border-tea-deep"
        >
          {t.product.buyNow}
        </button>
      </div>
    </div>
  );
}
