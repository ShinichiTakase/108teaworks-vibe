import DecafeLpPage from "@/components/pages/DecafeLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export async function generateMetadata() {
  const title = "デカフェ緑茶ティーバッグ8個 カフェイン70%カット｜藤八茶寮";
  const description =
    "デカフェ緑茶ティーバッグ8個、カフェイン70%カット。深蒸し茶のコクはそのまま。夜も妊娠中も家族みんなで安心。薬品不使用の抽出製法です。";
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
