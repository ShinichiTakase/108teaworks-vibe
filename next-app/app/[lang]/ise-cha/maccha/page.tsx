import IsechaMacchaPage from "@/components/pages/IsechaMacchaPage";
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
  const seo = getFixedSeo("/ise-cha/maccha", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/ise-cha/maccha", { currentLocale: locale }),
  };
}

export default function LocalizedIsechaMaccha({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/ise-cha/maccha`, locale)} />
      <IsechaMacchaPage locale={locale} />
      <PageEndProductList locale={locale} />
    </>
  );
}
