import RoastedPowderLpPage from "@/components/pages/RoastedPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "伊勢茶 ほうじ茶パウダー（無糖）｜藤八茶寮",
    description:
      "三重・川俣谷産（松阪市飯南町）の一番茶を丸ごと焙じて微粉末にした、藤八茶寮のほうじ茶パウダー。お湯にも牛乳にもすっと溶けて、伊勢のほうじ茶ラテが自宅で仕上がります。香料・着色料・保存料は不使用です。",
    alternates: buildAlternatesForLocales("/ise-cha/roasted-powder-lp"),
  };
}

export default function IseChaRoastedPowderLpPageJa() {
  return <RoastedPowderLpPage />;
}
