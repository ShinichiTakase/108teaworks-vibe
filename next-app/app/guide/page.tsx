import GuidePage from "@/components/pages/GuidePage";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/guide");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/guide"),
  };
}

export default function GuidePageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/guide")} />
      <GuidePage />
    </>
  );
}

