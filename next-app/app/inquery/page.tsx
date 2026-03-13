import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/inquery", "ja");
  return {
    title: seo?.title ?? "お問い合わせ｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "藤八茶寮へのお問い合わせフォームです。商品や伊勢茶に関するご質問、卸売りのご相談などはこちらからお寄せください。",
    alternates: buildAlternatesForLocales("/inquery"),
  };
}

export default function InquiryPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <InquiryForm locale="ja" />
      </div>
    </main>
  );
}

