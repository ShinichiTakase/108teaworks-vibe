export const dynamic = "force-dynamic";

import IsechaPage from "@/components/pages/IsechaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/isecha", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/isecha"),
  };
}

export default function IsechaPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/isecha", "ja")} />
      <IsechaPage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}

