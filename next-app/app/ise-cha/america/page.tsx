import IsechaAmericaPage from "@/components/pages/IsechaAmericaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildIseChaAmericaMetadata } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import IsechaAmericaArticleJsonLd from "@/components/IsechaAmericaArticleJsonLd";

export async function generateMetadata() {
  return buildIseChaAmericaMetadata();
}

export default function IsechaAmericaPageJa() {
  return (
    <>
      <IsechaAmericaArticleJsonLd />
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/america")} />
      <IsechaAmericaPage />
      <PageEndProductList />
    </>
  );
}
