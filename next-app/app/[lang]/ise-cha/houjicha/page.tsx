import HoujichaPage from "@/components/pages/HoujichaPage";
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
    ja: "ほうじ茶の通販なら伊勢茶の藤八茶寮｜茶葉・ティーバッグ・パウダー",
    en: "Houjicha Green Tea Online | Roasted Ise Tea — Teabag, Leaf & Powder | Fujihachi Saryo",
    ko: "호지차 통신판매｜이세차 후지하치야｜티백・찻잎・파우더",
    zh: "焙茶网购｜伊势茶 藤八茶寮｜茶包・散茶・粉末",
  };
  const descs: Record<Locale, string> = {
    ja: "三重県川俣谷産・シングルオリジン伊勢茶のほうじ茶をティーバッグ・茶葉・パウダーでお届け。高温焙煎が生む香ばしい香りと低カフェイン。夜のティータイムや食事のお供に。",
    en: "Single-origin roasted green tea from Kawamatatani, Mie. Lower in caffeine, rich in toasty aroma. Available as teabags, loose leaf, and powder for lattes and baking.",
    ko: "미에현 가와마타다니산 싱글 오리진 이세차 호지차를 티백·찻잎·파우더로 배송. 고온 볶음이 만드는 구수한 향과 저카페인. 저녁 티타임이나 식사 반찬으로 최적.",
    zh: "三重县川俣谷产单一产地伊势茶焙茶，提供茶包、散茶及粉末三种形态。高温焙烤孕育的浓郁焙香与低咖啡因，适合夜间品茗或佐餐享用。",
  };
  return {
    title: titles[locale],
    description: descs[locale],
    alternates: buildAlternatesForLocales("/ise-cha/houjicha", { currentLocale: locale }),
  };
}

export default function LocalizedHoujichaPage({ params }: { params: Params }) {
  const locale = resolveLocale(params.lang);
  return <HoujichaPage locale={locale} />;
}
