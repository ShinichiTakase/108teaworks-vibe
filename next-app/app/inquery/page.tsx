import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import InquiryForm from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "お問い合わせ｜伊勢茶の藤八茶寮",
  description:
    "藤八茶寮へのお問い合わせフォームです。商品や伊勢茶に関するご質問、卸売りのご相談などはこちらからお寄せください。",
};

export default function InquiryPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <InquiryForm />
      </div>
    </main>
  );
}

