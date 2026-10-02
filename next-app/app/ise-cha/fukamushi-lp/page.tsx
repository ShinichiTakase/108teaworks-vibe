import FukamushiLpPage from "@/components/pages/FukamushiLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "深蒸し茶の水出し・氷出し｜伊勢茶ティーバッグの淹れ方｜藤八茶寮";
  const description =
    "川俣谷産シングルオリジン伊勢茶を、水出し・氷出しで楽しむ淹れ方をご紹介。深蒸し茶のまろやかな旨みを日々の一杯に。お試し3個・日常用10個・業務用50個から、用途に合うティーバッグの商品詳細へ進めます。";
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
