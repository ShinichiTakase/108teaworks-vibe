import WakochaPage from "@/components/pages/WakochaPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "和紅茶とは｜三重県飯南町の国産紅茶・通販｜藤八茶寮",
    description:
      "和紅茶の味わいと飲み方、食事やお菓子との合わせ方をご案内。三重県松阪市飯南町・川俣谷産の伊勢茶で作る国産紅茶を選べます。",
    alternates: buildAlternatesForLocales("/ise-cha/wakocha"),
  };
}

export default function IseChaWakochaPageJa() {
  return <WakochaPage />;
}
