import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/privacy-policy", "ja");
  return {
    title: seo?.title ?? "プライバシーポリシー｜伊勢茶の藤八茶寮",
    description: seo?.description ?? "個人情報の取扱いについて",
    alternates: buildAlternatesForLocales("/privacy-policy"),
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent locale="ja" />;
}
