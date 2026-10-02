import DecafPage from "@/components/pages/DecafPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "カフェインカット緑茶・デカフェ緑茶とは｜伊勢茶の商品案内｜藤八茶寮",
    description:
      "カフェインカット緑茶とデカフェ緑茶の特徴、製法、選び方をご案内。三重県松阪市飯南町・川俣谷産の伊勢茶を使った、カフェイン70%カットの商品です。カフェインはゼロではありません。",
    alternates: buildAlternatesForLocales("/ise-cha/decaf"),
  };
}

export default function IseChaDecafPageJa() {
  return <DecafPage />;
}
