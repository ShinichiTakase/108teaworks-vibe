import DecafPage from "@/components/pages/DecafPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "カフェインカット緑茶の通販｜薬剤不使用・超臨界CO2抽出｜伊勢茶 藤八茶寮",
    description:
      "薬剤不使用・超臨界CO2抽出でカフェイン75%オフ。三重県川俣谷産シングルオリジン伊勢茶の旨みそのままに、夜のティータイムや低カフェインを気にする方へ。",
    alternates: buildAlternatesForLocales("/ise-cha/decaf"),
  };
}

export default function IseChaDecafPageJa() {
  return <DecafPage />;
}
