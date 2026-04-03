export const dynamic = "force-dynamic";

import IsechaBooksPage from "@/components/pages/IsechaBooksPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/ise-cha/books", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha/books"),
  };
}

export default function IsechaBooksPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/books", "ja")} />
      <IsechaBooksPage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}
