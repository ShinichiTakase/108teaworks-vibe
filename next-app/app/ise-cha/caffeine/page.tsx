import CaffeinePage from "@/components/pages/CaffeinePage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "緑茶のカフェインとカフェインカットの違い｜藤八茶寮",
    description:
      "緑茶に含まれるカフェインの特徴と、カフェインカット緑茶・デカフェ緑茶との違いを解説します。藤八茶寮の商品は完成品でカフェイン70%カットですが、ゼロではありません。",
    alternates: buildAlternatesForLocales("/ise-cha/caffeine"),
  };
}

export default function IseChaCaffeinePageJa() {
  return <CaffeinePage />;
}
