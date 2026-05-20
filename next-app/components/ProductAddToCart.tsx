"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { fbTrack } from "@/lib/metaPixel";

type Props = {
  slug: string;
  price: number | undefined;
  title: string;
  imagePath?: string;
  locale?: Locale;
  shipRank?: number;
};

export default function ProductAddToCart({ slug, price, title, imagePath, locale: localeProp, shipRank }: Props) {
  const locale = localeProp ?? "ja";
  const t = COMMON_TEXTS[locale];
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string>("");
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(""), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const addedToCartMessage =
    locale === "ja"
      ? "カートに追加しました"
      : locale === "en"
        ? "Added to cart"
        : locale === "ko"
          ? "장바구니에 담았습니다"
          : "已加入购物车";

  const handleAddToCart = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath, shipRank);
    fbTrack("AddToCart", {
      content_ids: [slug],
      content_type: "product",
      value: (price ?? 0) * quantity,
      currency: "JPY",
    });
    setFeedback(addedToCartMessage);
  };

  const handleBuyNow = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath, shipRank);
    const checkoutPath = locale === "ja" ? "/checkout" : `/${locale}/checkout`;
    router.push(checkoutPath);
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);

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
      <p className="mt-2 min-h-[1.25rem] text-[0.8125rem] text-tea-deep" aria-live="polite">
        {feedback}
      </p>
      {shipRank !== undefined && (
        <div className="mt-3 rounded-lg border-2 border-tea/30 bg-washi px-3 py-2.5 text-[0.8125rem] text-ink-muted space-y-1.5">
          <p className="m-0 leading-relaxed text-[0.9375rem] text-ink">
            {t.product.shipRankPre}
            <span className="relative inline-block">
              <button
                type="button"
                onClick={() => setTooltipOpen((v) => !v)}
                onBlur={() => setTooltipOpen(false)}
                className="underline decoration-dotted decoration-tea/60 cursor-help font-medium text-tea-deep"
                aria-describedby="ship-rank-tooltip"
              >
                {t.product.shipRankLink}
              </button>
              <span
                id="ship-rank-tooltip"
                role="tooltip"
                className={`absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-ink/90 text-white text-[0.75rem] leading-snug px-3 py-2 z-20 shadow-xl pointer-events-none whitespace-normal text-left transition-opacity ${tooltipOpen ? "opacity-100" : "opacity-0"}`}
              >
                {t.product.shipRankTooltip}
              </span>
            </span>
            {t.product.shipRankMid && <>{t.product.shipRankMid} </>}
            <strong className="font-bold text-tea-deep">{shipRank.toFixed(1)}</strong>
            {t.product.shipRankSuffix && <> {t.product.shipRankSuffix}</>}
          </p>
          <p className="m-0 leading-relaxed">{t.product.shipRankDetail}</p>
          <p className="m-0 leading-relaxed font-semibold text-ink">{t.product.shipRankFree}</p>
        </div>
      )}
    </div>
  );
}
