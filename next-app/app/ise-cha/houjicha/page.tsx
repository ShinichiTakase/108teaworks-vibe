import HoujichaPage from "@/components/pages/HoujichaPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "ほうじ茶の通販なら伊勢茶の藤八茶寮｜茶葉・ティーバッグ・パウダー",
    description:
      "三重県川俣谷産・シングルオリジン伊勢茶のほうじ茶をティーバッグ・茶葉・パウダーでお届け。高温焙煎が生む香ばしい香りと低カフェイン。夜のティータイムや食事のお供に。",
    alternates: buildAlternatesForLocales("/ise-cha/houjicha"),
  };
}

export default function IseChaHoujichaPageJa() {
  return <HoujichaPage />;
}
