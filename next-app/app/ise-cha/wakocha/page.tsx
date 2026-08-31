import WakochaPage from "@/components/pages/WakochaPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "和紅茶の通販なら伊勢茶の藤八茶寮｜川俣谷産シングルオリジン",
    description:
      "三重県川俣谷産・シングルオリジン伊勢茶の和紅茶をティーバッグでお届け。日本の緑茶品種を完全発酵させた、やさしい甘みと繊細な香りの国産紅茶。ストレートでもミルクティーでもお楽しみいただけます。",
    alternates: buildAlternatesForLocales("/ise-cha/wakocha"),
  };
}

export default function IseChaWakochaPageJa() {
  return <WakochaPage />;
}
