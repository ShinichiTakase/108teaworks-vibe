import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";
import type { Locale } from "@/lib/i18n";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const seo = getFixedSeo("/inquery", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/inquery"),
  };
}

export default async function LocalizedInqueryPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <InquiryForm locale={locale} />
      </div>
    </main>
  );
}
