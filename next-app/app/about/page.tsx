export const dynamic = "force-dynamic";

import AboutPage from "@/components/pages/AboutPage";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  const seo = getFixedSeo("/about", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/about"),
  };
}

export default function AboutPageJa() {
  return <AboutPage locale="ja" />;
}
