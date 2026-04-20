import HomePage from "@/components/pages/HomePage";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const seo = getFixedSeo("/", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/", { currentLocale: locale }),
  };
}

export default async function LocalizedHomePage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}`, locale)} />
      <HomePage locale={locale} />
    </>
  );
}

