"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-17844204061";

/**
 * GA4 と Google 広告用の Google タグ（gtag.js）。スクリプトは1本だけ読み込む。
 * - GA4: NEXT_PUBLIC_GA_MEASUREMENT_ID があれば gtag('config', G-…)
 * - 広告: NEXT_PUBLIC_GOOGLE_ADS_ID（未設定時は AW-17844204061）
 */
export default function GoogleAnalytics() {
  const loaderId = GA_MEASUREMENT_ID || GOOGLE_ADS_ID;
  if (!loaderId) return null;

  const configLines: string[] = [];
  if (GA_MEASUREMENT_ID) {
    configLines.push(`gtag('config', '${GA_MEASUREMENT_ID}');`);
  }
  if (GOOGLE_ADS_ID) {
    configLines.push(`gtag('config', '${GOOGLE_ADS_ID}');`);
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="lazyOnload"
      />
      {/*
        next/script の strategy="lazyOnload"/"afterInteractive" は実際には <body> 末尾に
        動的挿入されるため、<head> に literal に置く必要があるこの設定スクリプトは
        素の <script> タグで出力する（このコンポーネント自体は layout.tsx の <head> 内から呼ばれている）。
      */}
      <script
        id="google-gtag-config"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configLines.join("\n")}
        `,
        }}
      />
    </>
  );
}
