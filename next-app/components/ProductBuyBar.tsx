"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { fbTrack } from "@/lib/metaPixel";

type Props = {
  slug: string;
  price: number | undefined;
  title: string;
  imagePath?: string;
  shipRank?: number;
};

/** Amazon 準拠のCVR最適化配色：カートに追加＝黄、今すぐ買う＝オレンジ、共に黒文字 */
const ADD_TO_CART_STYLE = { backgroundColor: "#FFD814", color: "#000000" };
const BUY_NOW_STYLE = { backgroundColor: "#FFA41C", color: "#000000" };

export default function ProductBuyBar({ slug, price, title, imagePath, shipRank }: Props) {
  const t = COMMON_TEXTS;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath, shipRank);
    fbTrack("AddToCart", {
      content_ids: [slug],
      content_type: "product",
      value: (price ?? 0) * quantity,
      currency: "JPY",
    });
  };

  const handleBuyNow = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath, shipRank);
    router.push("/checkout");
  };

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  const QuantityStepper = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex items-stretch border-2 border-border rounded-lg overflow-hidden bg-white shrink-0">
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= 1}
        className={`${compact ? "w-9" : "w-10"} flex items-center justify-center bg-washi text-ink text-lg font-bold border-r border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors`}
        aria-label={t.cart.decreaseQty}
      >
        −
      </button>
      <span
        role="spinbutton"
        aria-valuenow={quantity}
        aria-valuemin={1}
        aria-valuemax={99}
        aria-label={t.product.quantity}
        className={`${compact ? "w-10" : "w-12"} flex items-center justify-center text-[0.9375rem] font-medium text-ink border-r border-border`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={quantity >= 99}
        className={`${compact ? "w-9" : "w-10"} flex items-center justify-center bg-washi text-ink text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors`}
        aria-label={t.cart.increaseQty}
      >
        +
      </button>
    </div>
  );

  return (
    <>
      {/* 画面下部固定の購入バー：スマホ・タブレット・PC共通。数量・カートに追加・今すぐ買うはここに一本化 */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 h-[68px] border-t-2 border-border bg-white/97 backdrop-blur-sm shadow-[0_-6px_20px_rgba(30,60,26,0.12)]"
        role="region"
        aria-label={`${t.product.quantity}・${t.product.addToCart}・${t.product.buyNow}`}
      >
        <div className="mx-auto flex h-full max-w-wide items-center justify-end gap-2 px-3 sm:gap-3 sm:px-4">
          <QuantityStepper compact />
          <button
            type="button"
            onClick={handleAddToCart}
            style={ADD_TO_CART_STYLE}
            className="h-11 w-24 shrink-0 rounded-lg border-2 border-[#FFD814] text-[0.8125rem] sm:w-32 sm:text-[0.9375rem] font-semibold transition-opacity hover:opacity-90"
          >
            {t.product.addToCart}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            style={BUY_NOW_STYLE}
            className="h-11 w-24 shrink-0 rounded-lg border-2 border-[#FFA41C] text-[0.8125rem] sm:w-32 sm:text-[0.9375rem] font-semibold transition-opacity hover:opacity-90"
          >
            {t.product.buyNow}
          </button>
        </div>
      </div>
    </>
  );
}
