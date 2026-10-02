import RoastedPowderLpPage from "@/components/pages/RoastedPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "ほうじ茶パウダー｜無糖でラテ・製菓に使える伊勢茶｜藤八茶寮";
  const description =
    "川俣谷産伊勢茶の香ばしさを、ほうじ茶ラテやお菓子作りに。無糖ほうじ茶パウダーの使い方と、ご家庭用80g・業務用・製菓用500gの違いをご紹介。用途に合う容量の商品詳細から選べます。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/hoji_powder_lp_ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/roasted-powder-lp"),
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

export default function IseChaRoastedPowderLpPageJa() {
  return <RoastedPowderLpPage />;
}
