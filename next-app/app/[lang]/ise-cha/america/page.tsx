import IsechaAmericaPage from "@/components/pages/IsechaAmericaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { buildIseChaAmericaMetadata } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import IsechaAmericaArticleJsonLd from "@/components/IsechaAmericaArticleJsonLd";

type Params = {
  lang: string;
};

export async function generateMetadata({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";
  return buildIseChaAmericaMetadata(locale);
}

export default function LocalizedIsechaAmerica({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return (
    <>
      <IsechaAmericaArticleJsonLd locale={locale} />
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/ise-cha/america`, locale)} />
      <IsechaAmericaPage locale={locale} />
      <PageEndProductList locale={locale} />
    </>
  );
}
