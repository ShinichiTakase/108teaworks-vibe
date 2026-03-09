"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import PaymentRequestButtons from "@/components/PaymentRequestButtons";

type Props = {
  slug: string;
  price: number | undefined;
  title: string;
  imagePath?: string;
};

export default function ProductAddToCart({ slug, price, title, imagePath }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(slug, title, price ?? 0, quantity, imagePath);
  };

  const handleBuyNow = () => {
    // TODO: Stripe Checkout 連携
    console.log("今すぐ買う", { slug, quantity, price });
  };

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  return (
    <div className="mt-4 w-full">
      <div className="flex gap-2 w-full mb-3">
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <label htmlFor="product-quantity" className="text-[0.875rem] font-medium text-ink">
            数量
          </label>
          <div className="flex items-stretch border-2 border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="w-10 flex items-center justify-center bg-washi text-ink text-lg font-bold border-r border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors"
            aria-label="数量を減らす"
          >
            −
          </button>
          <span
            id="product-quantity"
            role="spinbutton"
            aria-valuenow={quantity}
            aria-valuemin={1}
            aria-valuemax={99}
            aria-label="数量"
            className="w-12 flex items-center justify-center bg-white text-[0.9375rem] font-medium text-ink border-r border-border"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= 99}
            className="w-10 flex items-center justify-center bg-washi text-ink text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream transition-colors"
            aria-label="数量を増やす"
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
          カートに追加
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 min-w-0 py-3 rounded-lg border-2 border-tea bg-cream text-tea text-[0.9375rem] font-semibold transition-colors hover:bg-washi hover:border-tea-deep"
        >
          今すぐ買う
        </button>
      </div>
      <div className="mt-3 w-full">
        <PaymentRequestButtons amount={(price ?? 0) * quantity} />
      </div>
    </div>
  );
}
