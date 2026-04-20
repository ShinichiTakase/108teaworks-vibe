import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export async function generateMetadata() {
  const seo = getFixedSeo("/inquiry", "ja");
  return {
    title: seo?.title ?? "お問い合わせ｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "藤八茶寮へのお問い合わせフォームです。商品や伊勢茶に関するご質問、卸売りのご相談などはこちらからお寄せください。",
    alternates: buildAlternatesForLocales("/inquiry"),
  };
}

export default function InquiryPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/inquiry", "ja")} />
      <div className={INNER_CLASS}>
        <InquiryForm locale="ja" />
        <PageEndProductList locale="ja" />
      </div>
    </main>
  );
}
