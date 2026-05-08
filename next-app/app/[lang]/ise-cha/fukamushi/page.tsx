import FukamushiPage from "@/components/pages/FukamushiPage";
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
    ja: "深蒸し茶の通販なら伊勢茶の藤八茶寮｜川俣谷産シングルオリジン",
    en: "Deep-Steamed Sencha Online｜Single-Origin Ise Tea from Kawamatatani",
    ko: "후카무시 녹차 통신판매｜가와마타다니산 싱글 오리진 이세차 | 후지하치야",
    zh: "深蒸绿茶网购｜川俣谷产单一产地伊势茶 | 藤八茶寮",
  };
  const descs: Record<Locale, string> = {
    ja: "三重県川俣谷産・シングルオリジンの深蒸し茶をティーバッグ・茶葉でお届け。独自の地形が生む自然かぶせに近い濃厚な旨みが特徴。藤八茶寮の自家茶畑から直送します。",
    en: "Single-origin deep-steamed sencha from Kawamatatani, Mie Prefecture — delivered as teabags or loose leaf. Rich umami from a unique terrain. Direct from Fujihachi Saryo's own tea fields.",
    ko: "미에현 가와마타다니산 싱글 오리진 후카무시 녹차를 티백·찻잎으로 배송. 독자적인 지형이 만드는 진한 감칠맛. 후지하치야 자가 찻밭에서 직송합니다.",
    zh: "三重县川俣谷产单一产地深蒸绿茶，茶包·茶叶均可购买。独特地形孕育的浓郁鲜甜。藤八茶寮自家茶园直送。",
  };
  return {
    title: titles[locale],
    description: descs[locale],
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi", { currentLocale: locale }),
  };
}

export default function LocalizedFukamushiPage({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  return <FukamushiPage locale={locale} />;
}
