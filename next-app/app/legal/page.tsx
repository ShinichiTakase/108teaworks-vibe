import LegalPageContent from "@/components/LegalPageContent";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/legal", "ja");
  return {
    title: seo?.title ?? "特定商取引法に基づく表記｜伊勢茶の藤八茶寮",
    description: seo?.description ?? "特定商取引法に基づく表記",
    alternates: buildAlternatesForLocales("/legal"),
  };
}

export default function LegalPage() {
  return <LegalPageContent locale="ja" />;
}
