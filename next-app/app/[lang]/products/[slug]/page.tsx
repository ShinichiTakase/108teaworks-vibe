import { getProductBySlug } from "@/lib/microcms";
import ProductDetailContent from "@/components/ProductDetailContent";
import type { Locale } from "@/lib/i18n";
import { buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

function getProductSeo(product: any, locale: Locale): { title?: string; description?: string } {
  const seoTitle =
    locale === "ja"
      ? product.SEO_TITLE_JA ?? product.SEO_TITLE ?? null
      : locale === "en"
        ? product.SEO_TITLE_EN ?? null
        : locale === "ko"
          ? product.SEO_TITLE_KO ?? null
          : product.SEO_TITLE_ZH ?? null;
  const seoDesc =
    locale === "ja"
      ? product.SEO_DESC_JA ?? product.SEO_DESC ?? null
      : locale === "en"
        ? product.SEO_DESC_EN ?? null
        : locale === "ko"
          ? product.SEO_DESC_KO ?? null
          : product.SEO_DESC_ZH ?? null;
  return { title: seoTitle ?? undefined, description: seoDesc ?? undefined };
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  const product = await getProductBySlug(slug);
  const baseTitle = product?.TITLE ?? "商品";
  const baseDesc = product?.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160);
  const seo = product ? getProductSeo(product, locale) : {};
  return {
    title: seo.title ?? `${baseTitle}｜伊勢茶の藤八茶寮`,
    description: seo.description ?? baseDesc,
    alternates: buildAlternatesForLocales(`/products/${slug}`),
  };
}

export default async function LocalizedProductDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  return <ProductDetailContent locale={locale} slug={slug} />;
}
