export const dynamic = "force-dynamic";

import IsechaPage from "@/components/pages/IsechaPage";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  const seo = getFixedSeo("/isecha", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/isecha"),
  };
}

export default function IsechaPageJa() {
  return <IsechaPage locale="ja" />;
}

