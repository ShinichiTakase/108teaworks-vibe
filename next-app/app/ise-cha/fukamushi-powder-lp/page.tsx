import FukamushiPowderLpPage from "@/components/pages/FukamushiPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "伊勢茶 深蒸し茶パウダー｜三重県産 一番茶100% 無糖・無添加｜藤八茶寮",
    description:
      "三重県産の伊勢茶一番茶を丸ごと粉末にした深蒸し茶パウダー。無糖・無添加、800メッシュの微粉末で緑茶ラテやお菓子作りにも。100g・500g業務用をご用意。",
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi-powder-lp"),
  };
}

export default function IseChaFukamushiPowderLpPageJa() {
  return <FukamushiPowderLpPage />;
}
