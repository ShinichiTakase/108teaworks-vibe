import IsechaAmericaPage from "@/components/pages/IsechaAmericaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildIseChaAmericaMetadata } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import IsechaAmericaArticleJsonLd from "@/components/IsechaAmericaArticleJsonLd";

export async function generateMetadata() {
  return buildIseChaAmericaMetadata("ja");
}

export default function IsechaAmericaPageJa() {
  return (
    <>
      <IsechaAmericaArticleJsonLd locale="ja" />
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/america", "ja")} />
      <IsechaAmericaPage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}
