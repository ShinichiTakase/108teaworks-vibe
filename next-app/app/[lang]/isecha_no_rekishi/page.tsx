import IsechaNoRekishiPage from "@/app/isecha_no_rekishi/page";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const locale: Locale = supported.includes(lang as Locale) ? (lang as Locale) : "ja";
  const seo = getFixedSeo("/isecha_no_rekishi", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/isecha_no_rekishi", { currentLocale: locale }),
  };
}

export default async function LocalizedIsechaNoRekishiPage({ params }: Props) {
  const { lang } = await params;
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const locale: Locale = supported.includes(lang as Locale) ? (lang as Locale) : "ja";
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/isecha_no_rekishi`, locale)} />
      <IsechaNoRekishiPage />
    </>
  );
}
