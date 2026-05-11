import CaffeinePage from "@/components/pages/CaffeinePage";
import type { Locale } from "@/lib/i18n";
import { buildAlternatesForLocales } from "@/lib/seo";

type Params = { lang: string };

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

function resolveLocale(lang: string): Locale {
  return SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
}

export async function generateMetadata({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  const titles: Record<Locale, string> = {
    ja: "カフェインカット緑茶の通販｜夜でも飲める低カフェイン伊勢茶｜藤八茶寮",
    en: "Low-Caffeine Green Tea | Ise Tea with 70% Less Caffeine | Fujihachi Saryo",
    ko: "저카페인 녹차 통신판매｜카페인 70% 감소 이세차｜후지하치야",
    zh: "低咖啡因绿茶网购｜夜晚也可饮用的伊势茶低咖啡因绿茶｜藤八茶寮",
  };
  const descs: Record<Locale, string> = {
    ja: "薬剤不使用・超臨界CO2抽出でカフェイン70%オフ。伊勢茶本来の旨みはそのままに、夜のティータイムや低カフェインを気にする方に。三重県川俣谷産シングルオリジン。",
    en: "Caffeine reduced by 70% using supercritical CO2 extraction—no chemicals. Full umami of Kawamatatani Ise tea, ideal for evenings and those watching their caffeine intake.",
    ko: "약제 불사용·초임계 CO2 추출로 카페인 70% 감소. 이세차 본연의 감칠맛은 그대로, 야간 티타임이나 저카페인이 신경 쓰이는 분에게. 미에현 가와마타다니산 싱글 오리진.",
    zh: "不使用药剂·超临界CO2萃取，咖啡因减少70%。保留伊势茶本来的鲜甜，适合夜间饮用及关注咖啡因摄入的人士。三重县川俣谷产单一产地。",
  };
  return {
    title: titles[locale],
    description: descs[locale],
    alternates: buildAlternatesForLocales("/ise-cha/caffeine", { currentLocale: locale }),
  };
}

export default function LocalizedCaffeinePage({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  return <CaffeinePage locale={locale} />;
}
