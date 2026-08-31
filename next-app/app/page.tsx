import HomePage from "@/components/pages/HomePage";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/"),
  };
}

export default function Home() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/")} />
      <HomePage />
    </>
  );
}

