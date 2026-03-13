export const dynamic = "force-dynamic";

import UserGuidePage from "@/components/pages/UserGuidePage";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  const seo = getFixedSeo("/user-guide", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/user-guide"),
  };
}

export default function UserGuidePageJa() {
  return <UserGuidePage locale="ja" />;
}

