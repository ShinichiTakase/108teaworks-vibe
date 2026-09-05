import RoastedPowderLpPage from "@/components/pages/RoastedPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢茶 ほうじ茶パウダー（無糖）｜藤八茶寮";
  const description =
    "ほうじ茶パウダー、お湯にも牛乳にもすっと溶ける。無添加・無着色で低カフェイン、夜でも安心。伊勢茶発祥の地・川俣谷産一番茶を丸ごと焙じて微粉末に。";
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
