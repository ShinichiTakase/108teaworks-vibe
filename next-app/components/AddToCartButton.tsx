"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { fbTrack } from "@/lib/metaPixel";

type Props = {
  slug: string;
  price: number | undefined;
  title: string;
  imagePath?: string;
  /** ボタンの表示テキスト（省略時は COMMON_TEXTS の addToCart を使用） */
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  slug,
  price,
  title,
  imagePath,
  label,
  className,
  disabled,
}: Props) {
  const t = COMMON_TEXTS;
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  const addedMessage = "カートに追加しました ✓";

  const handleClick = () => {
    addToCart(slug, title, price ?? 0, 1, imagePath);
    fbTrack("AddToCart", {
      content_ids: [slug],
      content_type: "product",
      value: price ?? 0,
      currency: "JPY",
    });
    setAdded(true);
  };

  const defaultClassName =
    "w-full py-2 rounded-lg border-2 border-tea bg-tea text-white text-[0.875rem] font-semibold transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || added}
      className={className ?? defaultClassName}
      aria-live="polite"
    >
      {added ? addedMessage : (label ?? t.product.addToCart)}
    </button>
  );
}
