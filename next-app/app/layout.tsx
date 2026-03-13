import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import Providers from "@/components/Providers";
import { CHACHAMARU_TEXTS } from "@/lib/chachamaruTexts";

// 基本フォントを Noto Serif JP に統一（Regular 400 / SemiBold 600 / Bold 700）
const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "伊勢茶の藤八茶寮｜シングルオリジン伊勢茶・お茶の魅力を三重から世界へ",
  description:
    "幕末より続く日本茶の伝統を日常に。三重県産茶葉のみにこだわった希少な日本茶「シングルオリジン伊勢茶」を産地直送でお届けします。深蒸し茶・ほうじ茶・和紅茶。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSerif.variable}>
      <head>
        <link rel="stylesheet" href="/css/chachamaru-widget.css" />
      </head>
      <body className="font-body">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        {/* 茶々丸: アイコンURLを渡してからスクリプト読み込み */}
        <Script id="chachamaru-vars" strategy="beforeInteractive">
          {`window.chachamaruVars={iconUrl:"/images/chachamaru-icon.png",proxyUrl:"/api/chachamaru/ask",texts:${JSON.stringify(CHACHAMARU_TEXTS)},useReactBar:true};`}
        </Script>
        <Script src="/js/chachamaru.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
