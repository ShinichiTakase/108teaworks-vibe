import FukamushiLpPage from "@/components/pages/FukamushiLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "伊勢の深蒸し茶｜冷やしても濃厚。夏に効く一杯 - 藤八茶寮";
  const description =
    "深蒸し茶ティーバッグ、水出し・氷出しでも美味しい。渋み少なくとろりと濃厚な旨み。この夏の一杯に。伊勢茶発祥の地・川俣谷産シングルオリジンです。";
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
