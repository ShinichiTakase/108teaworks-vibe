import { getProductBySlug } from "@/lib/microcms";
import ProductDetailContent from "@/components/ProductDetailContent";
import { buildAlternatesForLocales } from "@/lib/seo";
import { parseReviewsPage } from "@/lib/reviewsStorage";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const JA_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  "roasted-isecha-powder-unsweetened": {
    title: "ほうじ茶パウダー(無糖)｜ラテにも使える伊勢茶 三重県松阪市飯南町産100% | 藤八茶寮",
    description:
      "砂糖不使用のほうじ茶パウダーです。お湯や牛乳に溶かすだけでほうじ茶ラテに。お菓子作りにも使える香ばしい伊勢茶を、国産・無添加にこだわってお届けします。",
  },
  "isecha-powder-unsweetened": {
    title: "緑茶パウダー(無糖)｜料理・お菓子にも 三重県松阪市飯南町産100% | 藤八茶寮",
    description:
      "砂糖不使用の伊勢茶100%緑茶パウダーです。お茶として飲むだけでなく、料理やスイーツ作りにも使える万能パウダー。国産茶葉・無添加にこだわっています。",
  },
};

function getProductSeo(product: any): { title?: string; description?: string } {
  const seoTitle = product.SEO_TITLE_JP ?? product.SEO_TITLE ?? null;
  const seoDesc = product.SEO_DESC_JP ?? product.SEO_DESC ?? null;
  return { title: seoTitle ?? undefined, description: seoDesc ?? undefined };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "商品｜伊勢茶の藤八茶寮",
      alternates: buildAlternatesForLocales(`/ise-cha/${slug}`),
    };
  }
  const override = JA_SEO_OVERRIDES[slug];
  const seo = getProductSeo(product);
  return {
    title: override?.title ?? seo.title ?? `${product.TITLE ?? "商品"} 三重県松阪市飯南町産100% | 藤八茶寮`,
    description:
      override?.description ??
      seo.description ??
      product.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: buildAlternatesForLocales(`/ise-cha/${slug}`),
  };
}

export default async function IseChaProductDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  return <ProductDetailContent slug={slug} reviewsPage={parseReviewsPage(page)} />;
}
