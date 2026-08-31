import IsechaPage from "@/components/pages/IsechaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/ise-cha");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha"),
  };
}

export default function IsechaPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha")} />
      <IsechaPage />
      <PageEndProductList />
    </>
  );
}

