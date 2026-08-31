import CaffeinePage from "@/components/pages/CaffeinePage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "カフェインカット緑茶の通販｜夜でも飲める低カフェイン伊勢茶｜藤八茶寮",
    description:
      "薬剤不使用・超臨界CO2抽出でカフェイン70%オフ。伊勢茶本来の旨みはそのままに、夜のティータイムや低カフェインを気にする方に。三重県川俣谷産シングルオリジン。",
    alternates: buildAlternatesForLocales("/ise-cha/caffeine"),
  };
}

export default function IseChaCaffeinePageJa() {
  return <CaffeinePage />;
}
