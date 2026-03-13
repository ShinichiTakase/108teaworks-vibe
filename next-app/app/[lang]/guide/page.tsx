import GuidePage from "@/components/pages/GuidePage";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

type Params = {
  lang: string;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";
  const seo = getFixedSeo("/guide", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/guide"),
  };
}

export default function LocalizedGuide({
  params,
}: {
  params: Params;
}) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return <GuidePage locale={locale} />;
}

