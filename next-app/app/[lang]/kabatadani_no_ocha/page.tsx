import KabatadaniNoOchaPage from "@/app/kabatadani_no_ocha/page";
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
  const seo = getFixedSeo("/kabatadani_no_ocha", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/kabatadani_no_ocha"),
  };
}

export default async function LocalizedKabatadaniPage({ params }: Props) {
  const { lang } = await params;
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const locale: Locale = supported.includes(lang as Locale) ? (lang as Locale) : "ja";
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/kabatadani_no_ocha`, locale)} />
      <KabatadaniNoOchaPage />
    </>
  );
}
