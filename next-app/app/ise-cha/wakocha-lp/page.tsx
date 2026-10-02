import WakochaLpPage from "@/components/pages/WakochaLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢茶の和紅茶｜味わい・飲み方とティーバッグ｜藤八茶寮";
  const description =
    "三重県松阪市飯南町・川俣谷の伊勢茶から仕上げた国産和紅茶。味わいと飲み方、お菓子や食事との合わせ方をご紹介。日常用8個入り、お試し・プチギフト用3個セットのティーバッグから選べます。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/wakocha-lp-ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/wakocha-lp"),
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function IseChaWakochaLpPageJa() {
  return <WakochaLpPage />;
}
