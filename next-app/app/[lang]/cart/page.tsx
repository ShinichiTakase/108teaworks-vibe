import CartPageContent from "@/components/CartPageContent";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import type { Locale } from "@/lib/i18n";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export const dynamic = "force-dynamic";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LocalizedCartPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems(`/${locale}/cart`, locale)} />
      <CartPageContent />
      <PageEndProductList locale={locale} />
    </>
  );
}
