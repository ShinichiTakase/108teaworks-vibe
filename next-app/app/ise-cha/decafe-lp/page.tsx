import DecafeLpPage from "@/components/pages/DecafeLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "カフェイン70%カット緑茶｜ティーバッグで楽しむ伊勢茶｜藤八茶寮";
  const description =
    "三重県松阪市飯南町・川俣谷の伊勢茶を使った、カフェイン70%カットの緑茶ティーバッグ。深蒸し茶のコクや味わい、商品の特徴をご紹介し、8個入りの商品詳細へご案内します。カフェインはゼロではありません。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/decaf_green_tea_lp_ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/decafe-lp"),
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function IseChaDecafeLpPageJa() {
  return <DecafeLpPage />;
}
