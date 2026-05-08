import FukamushiPage from "@/components/pages/FukamushiPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "深蒸し茶の通販なら伊勢茶の藤八茶寮｜川俣谷産シングルオリジン",
    description:
      "三重県川俣谷産・シングルオリジンの深蒸し茶をティーバッグ・茶葉でお届け。独自の地形が生む自然かぶせに近い濃厚な旨みが特徴。藤八茶寮の自家茶畑から直送します。",
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi"),
  };
}

export default function IseChaFukamushiPageJa() {
  return <FukamushiPage locale="ja" />;
}
