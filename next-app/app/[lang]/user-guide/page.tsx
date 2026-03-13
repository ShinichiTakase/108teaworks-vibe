import UserGuidePage from "@/components/pages/UserGuidePage";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const seo = getFixedSeo("/user-guide", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/user-guide"),
  };
}

export default async function LocalizedUserGuidePage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  return <UserGuidePage locale={locale} />;
}

