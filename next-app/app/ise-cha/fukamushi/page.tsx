import FukamushiPage from "@/components/pages/FukamushiPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "深蒸し茶とは｜三重県川俣谷産の伊勢茶・通販｜藤八茶寮",
    description:
      "深蒸し茶の製法と味わい、茶葉・ティーバッグ・パウダーの違いをご案内。三重県松阪市飯南町・川俣谷産の伊勢茶から、用途に合う商品を選べます。",
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi"),
  };
}

export default function IseChaFukamushiPageJa() {
  return <FukamushiPage />;
}
