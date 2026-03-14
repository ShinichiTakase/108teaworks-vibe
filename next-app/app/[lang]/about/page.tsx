import AboutPage from "@/components/pages/AboutPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
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

  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/about`, locale)} />
      <AboutPage locale={locale} />
      <PageEndProductList locale={locale} />
    </>
  );
}

