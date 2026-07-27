"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPriceYen } from "@/lib/formatters";
import styles from "./FukamushiPowderLpPage.module.css";

export type PurchaseProduct = {
  slug: string;
  title: string;
  price: number;
  imagePath: string;
  shipRank?: number;
  /** 固定バーの選択ボタンに表示する短いラベル（例: "100g"） */
  selectLabel: string;
};

type Props = {
  /** 選択ボタンの並び順で表示 */
  products: readonly PurchaseProduct[];
  /** 初期選択インデックス */
  defaultIndex?: number;
};

/**
 * ページ下部に常時表示する固定購入バー。商品選択＋数量ステッパー＋購入するボタン。
 * 元HTMLでは購入ボタンは商品ページへの単純なリンクだったが、他LP（wakocha-lp等）と同様に
 * カートに追加してチェックアウト画面（/checkout）へ遷移するよう変更している（ユーザー指示）。
 */
export default function FukamushiPowderLpBuy({ products, defaultIndex = 0 }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const selected = products[selectedIndex] ?? products[0];

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  const handleBuy = () => {
    addToCart(selected.slug, selected.title, selected.price, quantity, selected.imagePath, selected.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles["buy-bar"]}>
      <div className={styles["buy-bar-inner"]}>
        <div className={styles["buy-select"]} role="group" aria-label="商品を選択">
          {products.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-pressed={selectedIndex === i}
              className={`${styles["sel-btn"]} ${selectedIndex === i ? styles["is-active"] : ""}`}
            >
              {p.selectLabel}
              <span>{formatPriceYen(p.price)}</span>
            </button>
          ))}
        </div>

        <div className={styles["buy-row2"]}>
          <div className={styles["buy-qty"]} role="group" aria-label="数量を選択">
            <button type="button" onClick={decrement} disabled={quantity <= 1} className={styles["qty-btn"]} aria-label="数量を減らす">
              −
            </button>
            <span
              className={styles["qty-value"]}
              role="spinbutton"
              aria-valuenow={quantity}
              aria-valuemin={1}
              aria-valuemax={99}
              aria-label="数量"
            >
              {quantity}
            </span>
            <button type="button" onClick={increment} disabled={quantity >= 99} className={styles["qty-btn"]} aria-label="数量を増やす">
              ＋
            </button>
          </div>

          <button type="button" onClick={handleBuy} className={styles["buy-cta"]}>
            <span className={styles["cta-label"]}>購入する</span>
          </button>
        </div>
      </div>
    </div>
  );
}
