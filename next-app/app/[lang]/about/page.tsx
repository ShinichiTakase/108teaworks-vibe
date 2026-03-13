import AboutPage from "@/components/pages/AboutPage";
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
  const seo = getFixedSeo("/about", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/about"),
  };
}

export default function LocalizedAbout({
  params,
}: {
  params: Params;
}) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return <AboutPage locale={locale} />;
}

