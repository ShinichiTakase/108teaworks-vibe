"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPriceYen } from "@/lib/formatters";
import styles from "./FukamushiLpPage.module.css";

export type PurchaseProduct = {
  slug: string;
  title: string;
  price: number;
  imagePath: string;
  shipRank?: number;
  /** 固定バーのトグルに表示する短いラベル（例: "お試し3個入り"） */
  toggleLabel: string;
};

type Props = {
  /** トグルの並び順で表示 */
  products: readonly PurchaseProduct[];
  /** 初期選択インデックス（元HTMLでは10個入りがデフォルト選択） */
  defaultIndex?: number;
};

/**
 * ページ下部に常時表示する固定購入バー。商品トグル＋数量ステッパー＋購入するボタン。
 * 元HTMLでは購入ボタンは商品ページへの単純なリンクだったが、他LP（wakocha-lp等）と同様に
 * カートに追加してチェックアウト画面（/checkout）へ遷移するよう変更している（ユーザー指示）。
 */
export default function FukamushiLpBuy({ products, defaultIndex = 0 }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const selected = products[selectedIndex] ?? products[0];
  const total = selected.price * quantity;

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  const handleBuy = () => {
    addToCart(selected.slug, selected.title, selected.price, quantity, selected.imagePath, selected.shipRank);
    router.push("/checkout");
  };

  return (
    <div className={styles.buybar} role="region" aria-label="購入バー">
      <div className={styles["buybar-inner"]}>
        <div className={styles["toggle-group"]} role="group" aria-label="商品を選択">
          {products.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedIndex(i)}
              aria-pressed={selectedIndex === i}
              className={`${styles["toggle-btn"]} ${selectedIndex === i ? styles["is-active"] : ""}`}
            >
              <span className={styles.tname}>{p.toggleLabel}</span>
              <span className={styles.tprice}>{formatPriceYen(p.price)}</span>
            </button>
          ))}
        </div>
        <div className={styles["buybar-qty"]}>
          <button type="button" onClick={decrement} disabled={quantity <= 1} aria-label="数量を減らす">
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
          <button type="button" onClick={increment} disabled={quantity >= 99} aria-label="数量を増やす">
            ＋
          </button>
        </div>
        <button type="button" onClick={handleBuy} className={styles["buybar-buy"]}>
          購入する
          <span className={styles.yen}>{formatPriceYen(total)}</span>
        </button>
      </div>
    </div>
  );
}
