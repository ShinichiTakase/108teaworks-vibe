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

function PurchaseRow({ product, showDivider }: { product: PurchaseProduct; showDivider: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const decrement = () => setQuantity((q) => (q <= 1 ? 1 : q - 1));
  const increment = () => setQuantity((q) => (q >= 99 ? 99 : q + 1));

  /** /ise-cha/3teabag-ise-wakocha/ の「今すぐ買う」と同じ動作：カートに追加してチェックアウトへ */
  const handleBuyNow = () => {
    addToCart(product.slug, product.title, product.price ?? 0, quantity, product.imagePath, product.shipRank);
    router.push("/checkout");
  };

  return (
    <>
      {showDivider && <div className={styles["purchase-divider"]} aria-hidden="true" />}
      {/* display:contents で label/stepper/button を親グリッドの直接の子にし、行間で列位置をそろえる */}
      <div className={styles["purchase-row"]}>
        <span className={styles["purchase-label"]}>
          {product.bagLabel} <strong>{formatPriceYen(product.price)}</strong>（税込）
        </span>
        <div className={styles["qty-stepper"]}>
          <button type="button" onClick={decrement} disabled={quantity <= 1} className={styles["qty-btn"]} aria-label="数量を減らす">
            −
          </button>
          <span className={styles["qty-value"]} role="spinbutton" aria-valuenow={quantity} aria-valuemin={1} aria-valuemax={99}>
            {quantity}
          </span>
          <button type="button" onClick={increment} disabled={quantity >= 99} className={styles["qty-btn"]} aria-label="数量を増やす">
            +
          </button>
        </div>
        <button type="button" onClick={handleBuyNow} className={styles["purchase-btn"]}>
          購入する
        </button>
      </div>
    </>
  );
}

type Props = {
  products: readonly PurchaseProduct[];
  /** 明るい背景（spotlightセクションなど）に置く場合はtrue。背景は常に透過で周囲に合わせ、文字色だけ切り替える */
  onLight?: boolean;
};

export default function WakochaLpPurchase({ products, onLight }: Props) {
  return (
    <div className={`${styles["purchase-list"]} ${onLight ? styles["purchase-list--onLight"] : ""}`}>
      {products.map((p, i) => (
        <PurchaseRow key={p.slug} product={p} showDivider={i > 0} />
      ))}
    </div>
  );
}
