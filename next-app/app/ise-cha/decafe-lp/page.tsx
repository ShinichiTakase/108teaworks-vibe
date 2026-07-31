import DecafeLpPage from "@/components/pages/DecafeLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "デカフェ緑茶ティーバッグ8個 カフェイン70%カット｜藤八茶寮";
  const description =
    "「緑茶は好きだけど、カフェインが気になる」——そんな声から生まれた、藤八茶寮のデカフェ緑茶ティーバッグ。三重県松阪市飯南町産の伊勢茶100%を、化学薬品を使わない超臨界二酸化炭素抽出法でやさしくカフェインカットしました。";
  const ogImageUrl = `${SITE_BASE_URL}/images/lp/decaf_green_tea_lp_ogimage.webp`;
  return {
    title,
    description,
    alternates: buildAlternatesForLocales("/ise-cha/decafe-lp"),
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function IseChaDecafeLpPageJa() {
  return <DecafeLpPage />;
}
