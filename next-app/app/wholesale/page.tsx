import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import WholesalePageContent from "@/components/WholesalePageContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "パートナー募集（卸売り）｜伊勢茶の藤八茶寮",
  description:
    "カフェ・レストラン・オフィス向けの伊勢茶卸売り。緑茶ラテ・ほうじ茶ラテ用パウダーなど、業務用商品のご相談はこちらから。",
};

export default function WholesalePage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <WholesalePageContent />
      </div>
    </main>
  );
}
