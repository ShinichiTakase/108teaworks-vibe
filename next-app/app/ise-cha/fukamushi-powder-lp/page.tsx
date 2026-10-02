import FukamushiPowderLpPage from "@/components/pages/FukamushiPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "深蒸し茶パウダー｜無糖の緑茶ラテ・製菓に｜藤八茶寮";
  const description =
    "三重県松阪市飯南町・川俣谷の深蒸し茶パウダーを、緑茶ラテやお菓子作りに。無糖緑茶パウダーの使い方と容量の選び方をご紹介。家庭用100g・業務用・製菓用500gの商品詳細へご案内します。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/fukamushi-powder-lp-ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi-powder-lp"),
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

export default function IseChaFukamushiPowderLpPageJa() {
  return <FukamushiPowderLpPage />;
}
