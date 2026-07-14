import { getProductBySlug } from "@/lib/microcms";
import ProductDetailContent from "@/components/ProductDetailContent";
import type { Locale } from "@/lib/i18n";
import { buildAlternatesForLocales } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const JA_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  "roasted-isecha-powder-unsweetened": {
    title: "ほうじ茶パウダー(無糖)｜ラテにも使える伊勢茶｜藤八茶寮",
    description:
      "砂糖不使用のほうじ茶パウダーです。お湯や牛乳に溶かすだけでほうじ茶ラテに。お菓子作りにも使える香ばしい伊勢茶を、国産・無添加にこだわってお届けします。",
  },
  "isecha-powder-unsweetened": {
    title: "緑茶パウダー(無糖)｜料理・お菓子にも｜伊勢茶の藤八茶寮",
    description:
      "砂糖不使用の伊勢茶100%緑茶パウダーです。お茶として飲むだけでなく、料理やスイーツ作りにも使える万能パウダー。国産茶葉・無添加にこだわっています。",
  },
};

function getProductSeo(product: any, locale: Locale): { title?: string; description?: string } {
  const seoTitle =
    locale === "ja"
      ? product.SEO_TITLE_JP ?? product.SEO_TITLE ?? null
      : locale === "en"
        ? product.SEO_TITLE_EN ?? null
        : locale === "ko"
          ? product.SEO_TITLE_KO ?? null
          : product.SEO_TITLE_ZH ?? null;
  const seoDesc =
    locale === "ja"
      ? product.SEO_DESC_JP ?? product.SEO_DESC ?? null
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
      alternates: buildAlternatesForLocales(`/ise-cha/${slug}`, { jpRegionHreflang: true }),
    };
  }
  const override = JA_SEO_OVERRIDES[slug];
  const seo = getProductSeo(product, "ja");
  return {
    title: override?.title ?? seo.title ?? `${product.TITLE ?? "商品"}｜伊勢茶の藤八茶寮`,
    description:
      override?.description ??
      seo.description ??
      product.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: buildAlternatesForLocales(`/ise-cha/${slug}`, { jpRegionHreflang: true }),
  };
}

export default async function IseChaProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailContent locale="ja" slug={slug} />;
}

