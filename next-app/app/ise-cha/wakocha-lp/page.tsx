import WakochaLpPage from "@/components/pages/WakochaLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "和紅茶 ティーバッグ｜アフタヌーンティーで人気の和紅茶を、ご自宅で。｜藤八茶寮",
    description:
      "ふわっと紅茶の香りが鼻に抜けたあと、緑茶ゆずりの旨味とコクが広がる和紅茶。渋みが少なく繊細な味わいなので、まずはストレートがおすすめです。洋菓子だけでなく和食にも合う一杯を、ティーバッグひとつで、いつもの食卓に。三重県松阪市飯南町産シングルオリジン伊勢茶を完全発酵させた和紅茶。",
    alternates: buildAlternatesForLocales("/ise-cha/wakocha-lp"),
  };
}

export default function IseChaWakochaLpPageJa() {
  return <WakochaLpPage />;
}
