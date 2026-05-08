import WakochaPage from "@/components/pages/WakochaPage";
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
    ja: "和紅茶の通販なら伊勢茶の藤八茶寮｜川俣谷産シングルオリジン",
    en: "Japanese Black Tea Online | Single-Origin Ise Tea Wakocha | Fujihachi Saryo",
    ko: "와코차(일본홍차) 통신판매｜가와마타다니산 싱글 오리진 이세차｜후지하치야",
    zh: "和红茶网购｜川俣谷产单一产地伊势茶｜藤八茶寮",
  };
  const descs: Record<Locale, string> = {
    ja: "三重県川俣谷産・シングルオリジン伊勢茶の和紅茶をティーバッグでお届け。日本の緑茶品種を完全発酵させた、やさしい甘みと繊細な香りの国産紅茶。ストレートでもミルクティーでもお楽しみいただけます。",
    en: "Single-origin Japanese black tea from Kawamatatani, Mie Prefecture. Made from green tea cultivars fully fermented—gentle sweetness, delicate floral aroma. Enjoy as straight tea or milk tea.",
    ko: "미에현 가와마타다니산 싱글 오리진 이세차 와코차를 티백으로 배송. 일본 녹차 품종을 완전 발효시킨 국산 홍차로 부드러운 단맛과 섬세한 향이 특징. 스트레이트로도 밀크티로도 즐기실 수 있습니다.",
    zh: "三重县川俣谷产单一产地伊势茶和红茶，以茶包形态配送。将日本绿茶品种完全发酵制成的国产红茶，具有柔和甜味与细腻花香。可享用原味或奶茶。",
  };
  return {
    title: titles[locale],
    description: descs[locale],
    alternates: buildAlternatesForLocales("/ise-cha/wakocha", { currentLocale: locale }),
  };
}

export default function LocalizedWakochaPage({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  return <WakochaPage locale={locale} />;
}
