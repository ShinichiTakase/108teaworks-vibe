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
  /** トグルボタンに表示する容量ラベル（例: "80g"） */
  sizeLabel: string;
};

type Props = {
  /** トグルの並び順で表示 */
  products: readonly PurchaseProduct[];
  /** 初期選択インデックス */
  defaultIndex?: number;
};

/** 容量トグル・価格・数量ステッパー・購入ボタンの1ブロック。買い付けブロック（ヒーロー・最終CTA）とスティッキーバーで共通使用 */
export default function RoastedPowderLpBuy({ products, defaultIndex = 0 }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const selected = products[selectedIndex] ?? products[0];

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  /** /ise-cha/roasted-isecha-powder-unsweetened/ の「今すぐ買う」と同じ動作：カートに追加してチェックアウトへ */
  const handleBuyNow = () => {
    addToCart(selected.slug, selected.title, selected.price ?? 0, quantity, selected.imagePath, selected.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles["buy-block"]}>
      <div className={styles["size-toggle"]} role="group" aria-label="容量を選択">
        {products.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelectedIndex(i)}
            aria-pressed={selectedIndex === i}
            className={`${styles["size-btn"]} ${selectedIndex === i ? styles["is-active"] : ""}`}
          >
            {p.sizeLabel} {formatPriceYen(p.price)}
            <span className={styles["size-btn-tax"]}>（税込）</span>
          </button>
        ))}
      </div>
      <div className={styles["purchase-row"]}>
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
    </div>
  );
}
