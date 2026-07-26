import DecafeLpPage from "@/components/pages/DecafeLpPage";
import { buildAlternatesForLocales } from "@/lib/seo";

export async function generateMetadata() {
  return {
    title: "デカフェ緑茶ティーバッグ8個 カフェイン70%カット｜藤八茶寮",
    description:
      "「緑茶は好きだけど、カフェインが気になる」——そんな声から生まれた、藤八茶寮のデカフェ緑茶ティーバッグ。三重県松阪市飯南町産の伊勢茶100%を、化学薬品を使わない超臨界二酸化炭素抽出法でやさしくカフェインカットしました。",
    alternates: buildAlternatesForLocales("/ise-cha/decafe-lp"),
  };
}

export default function IseChaDecafeLpPageJa() {
  return <DecafeLpPage />;
}
