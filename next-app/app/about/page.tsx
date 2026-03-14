export const dynamic = "force-dynamic";

import AboutPage from "@/components/pages/AboutPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/about", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/about"),
  };
}

export default function AboutPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/about", "ja")} />
      <AboutPage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}
