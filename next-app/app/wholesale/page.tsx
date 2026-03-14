import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import WholesalePageContent from "@/components/WholesalePageContent";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/wholesale", "ja");
  return {
    title: seo?.title ?? "パートナー募集（卸売り）｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "カフェ・レストラン・オフィス向けの伊勢茶卸売り。緑茶ラテ・ほうじ茶ラテ用パウダーなど、業務用商品のご相談はこちらから。",
    alternates: buildAlternatesForLocales("/wholesale"),
  };
}

export default function WholesalePage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/wholesale", "ja")} />
      <div className={INNER_CLASS}>
        <WholesalePageContent />
        <PageEndProductList locale="ja" />
      </div>
    </main>
  );
}
