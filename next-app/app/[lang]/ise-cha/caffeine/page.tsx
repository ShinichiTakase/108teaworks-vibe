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
    ja: "カフェインレス緑茶の通販｜妊婦・夜でも飲める伊勢茶デカフェ｜藤八茶寮",
    en: "Caffeine-Free Green Tea｜Decaf Ise Tea for Pregnancy & Night｜Fujihachiya",
    ko: "카페인 없는 녹차 통신판매｜임산부·야간에도 마실 수 있는 이세차 디카페｜후지하치야",
    zh: "低咖啡因绿茶网购｜孕妇·夜晚也可饮用的伊势茶无咖啡因茶｜藤八茶寮",
  };
  const descs: Record<Locale, string> = {
    ja: "薬剤不使用・超臨界CO2抽出でカフェイン75%オフ。伊勢茶本来の旨みはそのままに、妊娠中・授乳中・夜のティータイムも安心して楽しめるカフェインカット緑茶。三重県川俣谷産シングルオリジン。",
    en: "75% less caffeine using supercritical CO2 extraction — no chemicals. Enjoy the full flavor of Ise Tea any time: during pregnancy, breastfeeding, or at night. Single-origin from Kawamatatani, Mie Prefecture.",
    ko: "약품 불사용·초임계 CO2 추출로 카페인 75% 감소. 이세차 본래의 감칠맛은 그대로, 임신 중·수유 중·야간 티타임도 안심하고 즐길 수 있는 카페인 컷 녹차. 미에현 가와마타다니산 싱글 오리진.",
    zh: "采用超临界CO2萃取，无需药剂，咖啡因减少75%。保留伊势茶本来的鲜甜，孕期、哺乳期及夜间也可安心享用。三重县川俣谷产单一产地。",
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
