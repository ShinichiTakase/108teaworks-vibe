"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPriceYen } from "@/lib/formatters";
import styles from "./WakochaLpPage.module.css";

export type PurchaseProduct = {
  slug: string;
  title: string;
  price: number | undefined;
  imagePath: string;
  shipRank?: number;
  bagLabel: string;
};

type Props = {
  /** トグルの並び順で表示（例: [3個入り, 8個入り]） */
  products: readonly PurchaseProduct[];
};

/** ページ下部に常時表示する固定購入バー。内容量トグル＋数量ステッパー＋購入するボタン */
export default function WakochaLpStickyBar({ products }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const selected = products[selectedIndex] ?? products[0];

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  /** /ise-cha/roasted-powder-lp/ の固定バーと同じ動作：カートに追加してチェックアウトへ */
  const handleBuyNow = () => {
    addToCart(selected.slug, selected.title, selected.price ?? 0, quantity, selected.imagePath, selected.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles["sticky-bar"]}>
      <div className={styles.wrap}>
        <div className={styles["sticky-row"]}>
          <div className={styles["sticky-toggle"]} role="group" aria-label="内容量を選択">
            {products.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setSelectedIndex(i)}
                aria-pressed={selectedIndex === i}
                className={styles["toggle-option"]}
              >
                <span>{p.bagLabel}</span>
                <span className={styles["toggle-price"]}>
                  <strong>{formatPriceYen(p.price)}</strong>
                  <small>（税込）</small>
                </span>
              </button>
            ))}
          </div>
          <div className={styles["sticky-qty"]}>
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= 1}
              className={styles["sticky-qty-btn"]}
              aria-label="数量を減らす"
            >
              −
            </button>
            <span
              className={styles["sticky-qty-value"]}
              role="spinbutton"
              aria-valuenow={quantity}
              aria-valuemin={1}
              aria-valuemax={99}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= 99}
              className={styles["sticky-qty-btn"]}
              aria-label="数量を増やす"
            >
              +
            </button>
          </div>
          <button type="button" onClick={handleBuyNow} className={styles["sticky-buy-btn"]}>
            購入する
          </button>
        </div>
      </div>
    </div>
  );
}
