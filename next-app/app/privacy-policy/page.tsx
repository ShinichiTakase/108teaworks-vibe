import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

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
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/privacy-policy", "ja")} />
      <PrivacyPolicyContent locale="ja" />
    </>
  );
}
