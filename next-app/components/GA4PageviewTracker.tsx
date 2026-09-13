"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function PageviewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * App Router のクライアントサイド遷移（<Link> によるページ切り替え）では
 * <head> 内の gtag 初期化スクリプトが再実行されないため、GA4 の自動ページビュー
 * だけでは遷移後のページが計測されない。このコンポーネントが遷移のたびに
 * page_view イベントを送信する。
 */
export default function GA4PageviewTracker() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <Suspense fallback={null}>
      <PageviewTrackerInner />
    </Suspense>
  );
}
