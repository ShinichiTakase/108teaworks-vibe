import { getProductBySlug } from "@/lib/microcms";
import ProductDetailContent from "@/components/ProductDetailContent";
import type { Locale } from "@/lib/i18n";
import { buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
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
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "商品｜伊勢茶の藤八茶寮",
      alternates: buildAlternatesForLocales(`/products/${slug}`),
    };
  }
  const seo = getProductSeo(product, "ja");
  return {
    title: seo.title ?? `${product.TITLE ?? "商品"}｜伊勢茶の藤八茶寮`,
    description:
      seo.description ?? product.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: buildAlternatesForLocales(`/products/${slug}`),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailContent locale="ja" slug={slug} />;
}
