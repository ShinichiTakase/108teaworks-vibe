import RoastedPowderLpPage from "@/components/pages/RoastedPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢茶 ほうじ茶パウダー（無糖）｜藤八茶寮";
  const description =
    "三重・川俣谷産（松阪市飯南町）の一番茶を丸ごと焙じて微粉末にした、藤八茶寮のほうじ茶パウダー。お湯にも牛乳にもすっと溶けて、伊勢のほうじ茶ラテが自宅で仕上がります。香料・着色料・保存料は不使用です。";
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
