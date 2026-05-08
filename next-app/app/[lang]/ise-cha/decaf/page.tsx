import DecafPage from "@/components/pages/DecafPage";
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
    ja: "カフェインカット緑茶の通販｜薬剤不使用・超臨界CO2抽出｜伊勢茶 藤八茶寮",
    en: "Low-Caffeine Green Tea | No Chemicals, 75% Less Caffeine | Fujihachi Saryo",
    ko: "카페인 컷 녹차 통신판매｜약제 불사용・초임계 CO2 추출｜이세차 후지하치야",
    zh: "低咖啡因绿茶网购｜无化学溶剂・超临界CO2萃取｜伊势茶 藤八茶寮",
  };
  const descs: Record<Locale, string> = {
    ja: "薬剤不使用・超臨界CO2抽出でカフェイン75%オフ。三重県川俣谷産シングルオリジン伊勢茶の旨みそのままに、夜のティータイムや低カフェインを気にする方へ。",
    en: "Caffeine reduced 75% via supercritical CO2 extraction—no chemical solvents. Full umami of single-origin Ise tea from Kawamatatani, ideal for evenings and those watching caffeine intake.",
    ko: "약제 불사용・초임계 CO2 추출로 카페인 75% 감소. 미에현 가와마타다니산 싱글 오리진 이세차의 감칠맛 그대로, 저녁 티타임이나 저카페인을 신경 쓰는 분께.",
    zh: "无化学溶剂・超临界CO2萃取，咖啡因减少75%。三重县川俣谷产单一产地伊势茶的鲜甜原汁原味，适合夜间品茗及在意咖啡因摄入的朋友。",
  };
  return {
    title: titles[locale],
    description: descs[locale],
    alternates: buildAlternatesForLocales("/ise-cha/decaf", { currentLocale: locale }),
  };
}

export default function LocalizedDecafPage({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  return <DecafPage locale={locale} />;
}
