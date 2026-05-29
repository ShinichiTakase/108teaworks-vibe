import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Layout from "@/components/Layout";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import ChachamaruDeferredStylesheet from "@/components/ChachamaruDeferredStylesheet";
import { CHACHAMARU_TEXTS } from "@/lib/chachamaruTexts";
import { OG_IMAGE_URL, ORGANIZATION_ADDRESS, ORGANIZATION_LOGO_URL, ORGANIZATION_NAME_JA, ORGANIZATION_NAME_EN, ORGANIZATION_TELEPHONE, ORGANIZATION_URL, ORGANIZATION_INSTAGRAM } from "@/lib/siteConstants";

const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
const METADATA_BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.trim()
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL.trim())
    : new URL("https://108teaworks.com");

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: "伊勢茶の藤八茶寮｜シングルオリジン伊勢茶・お茶の魅力を三重から世界へ",
  description:
    "幕末より続く日本茶の伝統を日常に。深蒸し茶の名産地三重県松阪市飯南町産の茶葉のみにこだわった希少な日本茶「シングルオリジン伊勢茶」を産地直送でお届けします。深蒸し茶・ほうじ茶・和紅茶。",
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
  logo: { "@type": "ImageObject", url: ORGANIZATION_LOGO_URL },
  address: ORGANIZATION_ADDRESS,
  telephone: ORGANIZATION_TELEPHONE,
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
    loc === "ja" ? "ja" : loc === "en" ? "en-JP" : loc === "ko" ? "ko-JP" : "zh-Hans-JP";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
        <MetaPixel />
        <MicrosoftClarity />
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
        <ChachamaruDeferredStylesheet />
        {/* 茶々丸: アイコンURLを渡してからスクリプト読み込み */}
        <Script id="chachamaru-vars" strategy="afterInteractive">
          {`window.chachamaruVars={iconUrl:"/images/chachamaru-icon.webp",proxyUrl:"/api/chachamaru/ask",texts:${JSON.stringify(CHACHAMARU_TEXTS)},useReactBar:true};`}
        </Script>
        <Script src="/js/chachamaru.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
