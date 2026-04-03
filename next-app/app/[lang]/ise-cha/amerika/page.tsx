import IsechaAmerikaPage from "@/components/pages/IsechaAmerikaPage";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { buildIseChaAmerikaMetadata } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import IsechaAmerikaArticleJsonLd from "@/components/IsechaAmerikaArticleJsonLd";

type Params = {
  lang: string;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";
  return buildIseChaAmerikaMetadata(locale);
}

export default function LocalizedIsechaAmerika({ params }: { params: Params }) {
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return (
    <>
      <IsechaAmerikaArticleJsonLd locale={locale} />
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/ise-cha/amerika`, locale)} />
      <IsechaAmerikaPage locale={locale} />
      <PageEndProductList locale={locale} />
    </>
  );
}
