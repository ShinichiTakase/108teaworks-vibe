"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPriceYen } from "@/lib/formatters";
import styles from "./RoastedPowderLpPage.module.css";

export type PurchaseProduct = {
  slug: string;
  title: string;
  price: number | undefined;
  imagePath: string;
  shipRank?: number;
};

type Props = {
  product: PurchaseProduct;
};

/** 価格・数量ステッパー・購入ボタンの1行。買い付けブロック（ヒーロー・最終CTA）とスティッキーバーで共通使用 */
export default function RoastedPowderLpBuy({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  /** /ise-cha/roasted-isecha-powder-unsweetened/ の「今すぐ買う」と同じ動作：カートに追加してチェックアウトへ */
  const handleBuyNow = () => {
    addToCart(product.slug, product.title, product.price ?? 0, quantity, product.imagePath, product.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles["purchase-row"]}>
      <div className={styles["price-row"]}>
        <span className={styles.price}>{formatPriceYen(product.price)}</span>
        <span className={styles["price-tax"]}>（税込）</span>
      </div>
      <div className={styles["qty-stepper"]}>
        <button type="button" onClick={decrement} disabled={quantity <= 1} className={styles["qty-btn"]} aria-label="数量を減らす">
          −
        </button>
        <span className={styles["qty-value"]} role="spinbutton" aria-valuenow={quantity} aria-valuemin={1} aria-valuemax={99}>
          {quantity}
        </span>
        <button type="button" onClick={increment} disabled={quantity >= 99} className={styles["qty-btn"]} aria-label="数量を増やす">
          ＋
        </button>
      </div>
      <button type="button" onClick={handleBuyNow} className={styles["buy-btn"]}>
        購入する
      </button>
    </div>
  );
}
