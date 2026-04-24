"use client";

import { useEffect } from "react";

/**
 * 茶々丸ウィジェット用 CSS。
 * 初期レンダリングをブロックしないよう、ハイドレーション後に一度だけ追加する。
 */
export default function ChachamaruDeferredStylesheet() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const existing = document.querySelector<HTMLLinkElement>(
      'link[data-chachamaru-stylesheet="true"]',
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/chachamaru-widget.css";
    link.dataset.chachamaruStylesheet = "true";
    document.head.appendChild(link);
  }, []);

  return null;
}
