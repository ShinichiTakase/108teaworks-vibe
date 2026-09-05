import FukamushiPowderLpPage from "@/components/pages/FukamushiPowderLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢茶 深蒸し茶パウダー｜三重県産 一番茶100% 無糖・無添加｜藤八茶寮";
  const description =
    "深蒸し茶パウダー、緑茶ラテやお菓子作りに。無糖・無添加、800メッシュの微粉末。ご家庭用100gから業務用500gまで。伊勢茶一番茶100%使用です。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/fukamushi-powder-lp-ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi-powder-lp"),
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function IseChaFukamushiPowderLpPageJa() {
  return <FukamushiPowderLpPage />;
}
