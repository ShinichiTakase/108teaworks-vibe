export const dynamic = "force-dynamic";

import GuidePage from "@/components/pages/GuidePage";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/guide", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/guide"),
  };
}

export default function GuidePageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/guide", "ja")} />
      <GuidePage locale={"ja" satisfies Locale} />
    </>
  );
}

