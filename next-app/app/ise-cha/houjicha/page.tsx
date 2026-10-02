import HoujichaPage from "@/components/pages/HoujichaPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "ほうじ茶｜伊勢茶の茶葉・ティーバッグ通販｜藤八茶寮",
    description:
      "三重県松阪市飯南町・川俣谷産の伊勢茶を焙煎したほうじ茶。香ばしい味わいと、茶葉・ティーバッグ・無糖パウダーの選び方をご案内します。",
    alternates: buildAlternatesForLocales("/ise-cha/houjicha"),
  };
}

export default function IseChaHoujichaPageJa() {
  return <HoujichaPage />;
}
