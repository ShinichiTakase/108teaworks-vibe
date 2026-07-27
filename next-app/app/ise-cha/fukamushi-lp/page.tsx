import FukamushiLpPage from "@/components/pages/FukamushiLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "伊勢の深蒸し茶｜冷やしても濃厚。夏に効く一杯 - 藤八茶寮",
    description:
      "三重県松阪市・川俣谷産シングルオリジン伊勢茶を使った深蒸し茶ティーバッグ。渋みが少なくとろりとした旨み、水出しでも美味しさそのまま。この夏、冷たい一杯を伊勢の深蒸し茶で。",
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi-lp"),
  };
}

export default function IseChaFukamushiLpPageJa() {
  return <FukamushiLpPage />;
}
