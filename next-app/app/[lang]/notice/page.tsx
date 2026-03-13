import type { Locale } from "@/lib/i18n";
import NoticeListContent from "@/components/NoticeListContent";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const seo = getFixedSeo("/notice", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/notice"),
  };
}

export default async function LocalizedNoticeListPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10) || 1);
  return <NoticeListContent locale={locale} page={page} />;
}
