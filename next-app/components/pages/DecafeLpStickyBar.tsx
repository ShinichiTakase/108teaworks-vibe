"use client";

import DecafeLpBuy, { type PurchaseProduct } from "./DecafeLpBuy";
import { formatPriceYen } from "@/lib/formatters";
import styles from "./DecafeLpPage.module.css";

type Props = {
  product: PurchaseProduct;
};

/** ページ下部に常時表示する固定購入バー。内容表示＋数量ステッパー＋購入するボタン（既存の.hero-buyピルを流用） */
export default function DecafeLpStickyBar({ product }: Props) {
  return (
    <div className={styles["sticky-bar"]}>
      <div className={styles.wrap}>
        <div className={styles["sticky-row"]}>
          <div className={styles["sticky-label"]}>
            <span>ティーバッグ8個入り</span>
            <strong>
              {formatPriceYen(product.price)}
              <small>（税込）</small>
            </strong>
          </div>
          <DecafeLpBuy product={product} ctaLabel="購入する" />
        </div>
      </div>
    </div>
  );
}
