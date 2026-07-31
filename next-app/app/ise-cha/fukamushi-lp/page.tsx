import FukamushiLpPage from "@/components/pages/FukamushiLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢の深蒸し茶｜冷やしても濃厚。夏に効く一杯 - 藤八茶寮";
  const description =
    "三重県松阪市・川俣谷産シングルオリジン伊勢茶を使った深蒸し茶ティーバッグ。渋みが少なくとろりとした旨み、水出しでも美味しさそのまま。この夏、冷たい一杯を伊勢の深蒸し茶で。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/isecha_fukamushi_lp_ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi-lp"),
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

export default function IseChaFukamushiLpPageJa() {
  return <FukamushiLpPage />;
}
