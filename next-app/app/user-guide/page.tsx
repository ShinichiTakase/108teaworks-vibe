export const dynamic = "force-dynamic";

import UserGuidePage from "@/components/pages/UserGuidePage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/user-guide", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/user-guide"),
  };
}

export default function UserGuidePageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/user-guide", "ja")} />
      <UserGuidePage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}

