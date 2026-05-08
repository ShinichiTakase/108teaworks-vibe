import CaffeinePage from "@/components/pages/CaffeinePage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "カフェインレス緑茶の通販｜妊婦・夜でも飲める伊勢茶デカフェ｜藤八茶寮",
    description:
      "薬剤不使用・超臨界CO2抽出でカフェイン75%オフ。伊勢茶本来の旨みはそのままに、妊娠中・授乳中・夜のティータイムも安心して楽しめるカフェインカット緑茶。三重県川俣谷産シングルオリジン。",
    alternates: buildAlternatesForLocales("/ise-cha/caffeine"),
  };
}

export default function IseChaCaffeinePageJa() {
  return <CaffeinePage locale="ja" />;
}
