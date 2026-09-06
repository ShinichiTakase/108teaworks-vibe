import FaqPage from "@/components/pages/FaqPage";
import PageEndProductList from "@/components/PageEndProductList";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  const seo = getFixedSeo("/faq");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/faq"),
  };
}

export default function FaqPageJa() {
  return (
    <>
      <FaqPage />
      <PageEndProductList />
    </>
  );
}
