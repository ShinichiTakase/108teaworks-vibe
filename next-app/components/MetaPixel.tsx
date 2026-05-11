"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const fromEnv = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const META_PIXEL_ID = fromEnv === "" ? "" : fromEnv || "1725497478865844";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;

    // 初回：fbevents.js をロードして初期化
    if (!initialized.current) {
      initialized.current = true;

      // fbq スタブを作成
      if (!window.fbq) {
        const fbq: any = function (...args: unknown[]) {
          if (fbq.callMethod) {
            fbq.callMethod(...args);
          } else {
            fbq.queue.push(args);
          }
        };
        fbq.push = fbq;
        fbq.loaded = true;
        fbq.version = "2.0";
        fbq.queue = [];
        window.fbq = fbq;
        if (!window._fbq) window._fbq = fbq;
      }

      // fbevents.js を動的ロード
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.onload = () => {
        window.fbq!("init", META_PIXEL_ID);
        window.fbq!("track", "PageView");
      };
      document.head.appendChild(script);
      return;
    }

    // ページ遷移時
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
