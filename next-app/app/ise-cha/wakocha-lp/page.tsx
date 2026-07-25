import WakochaLpPage from "@/components/pages/WakochaLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "和紅茶 ティーバッグ｜アフタヌーンティーで人気の和紅茶を、ご自宅で。｜藤八茶寮",
    description:
      "渋みが少なく、やさしい甘みと花のような香り。ホテルのアフタヌーンティーで出会うあの一杯を、ティーバッグひとつで、いつもの午後に。三重県松阪市飯南町産シングルオリジン伊勢茶を完全発酵させた和紅茶。",
    alternates: buildAlternatesForLocales("/ise-cha/wakocha-lp"),
  };
}

export default function IseChaWakochaLpPageJa() {
  return <WakochaLpPage />;
}
