import WakochaLpPage from "@/components/pages/WakochaLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "和紅茶 ティーバッグ｜アフタヌーンティーで人気の和紅茶を、ご自宅で。｜藤八茶寮";
  const description =
    "国産和紅茶、アフタヌーンティーの人気の味をご自宅で。渋み少なく上品な甘み、洋菓子にも和食にも。三重県松阪市飯南町産シングルオリジン伊勢茶を完全発酵。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/wakocha-lp-ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/wakocha-lp"),
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

export default function IseChaWakochaLpPageJa() {
  return <WakochaLpPage />;
}
