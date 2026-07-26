"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./DecafeLpPage.module.css";

export type PurchaseProduct = {
  slug: string;
  title: string;
  price: number;
  imagePath: string;
  shipRank?: number;
};

type Props = {
  product: PurchaseProduct;
  ctaLabel: string;
};

/**
 * 購入コントロール。数量+/-を独立したステッパー箱にせず、
 * 購入ボタン自体の中に組み込んだ一体型のピル（ヒーロー・商品情報・最終CTAで共通使用）。
 */
export default function DecafeLpBuy({ product, ctaLabel }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  const handleBuyNow = () => {
    addToCart(product.slug, product.title, product.price, quantity, product.imagePath, product.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles["hero-buy"]}>
      <button type="button" onClick={decrement} disabled={quantity <= 1} className={styles["hero-buy-qtybtn"]} aria-label="数量を減らす">
        −
      </button>
      <span className={styles["hero-buy-qty"]} role="spinbutton" aria-valuenow={quantity} aria-valuemin={1} aria-valuemax={99}>
        {quantity}
      </span>
      <button type="button" onClick={increment} disabled={quantity >= 99} className={styles["hero-buy-qtybtn"]} aria-label="数量を増やす">
        +
      </button>
      <button type="button" onClick={handleBuyNow} className={styles["hero-buy-cta"]}>
        {ctaLabel}
      </button>
    </div>
  );
}
