import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ChachamaruDeferredStylesheet from "@/components/ChachamaruDeferredStylesheet";
import { CHACHAMARU_TEXTS } from "@/lib/chachamaruTexts";
import { OG_IMAGE_URL, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME_JA, ORGANIZATION_NAME_EN, ORGANIZATION_URL, ORGANIZATION_INSTAGRAM } from "@/lib/siteConstants";

// 基本フォントを Noto Serif JP に統一（Regular 400 / SemiBold 600 / Bold 700）
const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
});

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
const METADATA_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.trim()
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL.trim())
    : new URL("https://108teaworks.com");

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: "伊勢茶の藤八茶寮｜シングルオリジン伊勢茶・お茶の魅力を三重から世界へ",
  description:
    "幕末より続く日本茶の伝統を日常に。三重県産茶葉のみにこだわった希少な日本茶「シングルオリジン伊勢茶」を産地直送でお届けします。深蒸し茶・ほうじ茶・和紅茶。",
  openGraph: {
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE_URL],
  },
  ...(GSC_VERIFICATION && {
    verification: { google: GSC_VERIFICATION },
  }),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORGANIZATION_NAME_JA,
  alternateName: ORGANIZATION_NAME_EN,
  url: ORGANIZATION_URL,
  logo: ORGANIZATION_LOGO_URL,
  sameAs: [`https://www.instagram.com/${ORGANIZATION_INSTAGRAM}/`],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: ORGANIZATION_NAME_JA,
  alternateName: ORGANIZATION_NAME_EN,
  url: ORGANIZATION_URL,
  publisher: { "@type": "Organization", name: ORGANIZATION_NAME_JA, logo: ORGANIZATION_LOGO_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = headers();
  const loc = h.get("x-locale") ?? "ja";
  // Merchant Center / 地域ターゲティングの誤解を避けるため、言語 + JP 地域で明示
  const htmlLang =
    loc === "ja" ? "ja" : loc === "en" ? "en-JP" : loc === "ko" ? "ko-JP" : "zh-JP";

  return (
    <html lang={htmlLang} className={notoSerif.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <ChachamaruDeferredStylesheet />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <GoogleAnalytics />
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
