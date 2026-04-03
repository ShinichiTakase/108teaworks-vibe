export const dynamic = "force-dynamic";

import IsechaAmerikaPage from "@/components/pages/IsechaAmerikaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildIseChaAmerikaMetadata } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import IsechaAmerikaArticleJsonLd from "@/components/IsechaAmerikaArticleJsonLd";

export async function generateMetadata() {
  return buildIseChaAmerikaMetadata("ja");
}

export default function IsechaAmerikaPageJa() {
  return (
    <>
      <IsechaAmerikaArticleJsonLd locale="ja" />
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/amerika", "ja")} />
      <IsechaAmerikaPage locale="ja" />
      <PageEndProductList locale="ja" />
    </>
  );
}
