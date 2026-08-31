import IsechaHowToBrewPage from "@/components/pages/IsechaHowToBrewPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/ise-cha/how-to-brew");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha/how-to-brew"),
  };
}

export default function IsechaHowToBrewPageJa() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/how-to-brew")} />
      <IsechaHowToBrewPage />
      <PageEndProductList />
    </>
  );
}
