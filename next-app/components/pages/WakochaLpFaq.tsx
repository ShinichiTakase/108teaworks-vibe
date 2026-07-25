"use client";

import { useRef, useState } from "react";
import styles from "./WakochaLpPage.module.css";

type FaqItem = { q: string; a: string };

type Props = {
  items: readonly FaqItem[];
};

/**
 * 元HTML末尾の <script> にあった faq-item クリック開閉ロジックの機械的移植。
 * ・同時に開くのは1つだけ（他を閉じてから開く）
 * ・開閉のアニメーションは max-height を scrollHeight 実測値で切り替える元の方式のまま
 */
export default function WakochaLpFaq({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className={styles["faq-list"]}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className={`${styles["faq-item"]} ${isOpen ? styles.open : ""}`}>
            <button type="button" className={styles["faq-q"]} onClick={() => handleToggle(i)}>
              <span>{item.q}</span>
              <span className={styles.plus} />
            </button>
            <div
              className={styles["faq-a"]}
              ref={(el) => {
                answerRefs.current[i] = el;
              }}
              style={{
                maxHeight: isOpen ? `${answerRefs.current[i]?.scrollHeight ?? 0}px` : undefined,
              }}
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
