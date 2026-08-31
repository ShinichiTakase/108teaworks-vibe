import { getProductBySlug } from "@/lib/microcms";
import ProductDetailContent from "@/components/ProductDetailContent";
import { buildAlternatesForLocales } from "@/lib/seo";
import { parseReviewsPage } from "@/lib/reviewsStorage";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
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
  const seo = getProductSeo(product);
  return {
    title: seo.title ?? `${product.TITLE ?? "商品"} 三重県松阪市飯南町産100% | 藤八茶寮`,
    description:
      seo.description ?? product.DESCRIPTION01?.replace(/<[^>]+>/g, "").slice(0, 160),
    alternates: buildAlternatesForLocales(`/ise-cha/${slug}`),
  };
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  return <ProductDetailContent slug={slug} reviewsPage={parseReviewsPage(page)} />;
}
