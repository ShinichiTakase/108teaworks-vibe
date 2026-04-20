import IsechaPage from "@/components/pages/IsechaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

type Params = {
  lang: string;
};

export async function generateMetadata({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";
  const seo = getFixedSeo("/ise-cha", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha", { currentLocale: locale }),
  };
}

export default function LocalizedIsecha({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/ise-cha`, locale)} />
      <IsechaPage locale={locale} />
      <PageEndProductList locale={locale} />
    </>
  );
}

