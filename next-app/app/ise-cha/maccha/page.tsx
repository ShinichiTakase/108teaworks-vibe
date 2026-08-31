import IsechaMacchaPage from "@/components/pages/IsechaMacchaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/ise-cha/maccha");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha/maccha"),
  };
}

export default function IsechaMacchaPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/maccha")} />
      <IsechaMacchaPage />
      <PageEndProductList />
    </>
  );
}
