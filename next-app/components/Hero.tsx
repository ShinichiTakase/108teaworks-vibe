import type { Locale } from "@/lib/i18n";

const HERO_TEXTS: Record<
  Locale,
  { label: string; heading: string; body: string; more: string }
> = {
  ja: {
    label: "Single Origin Ise Tea",
    heading: "幕末より続く日本茶の伝統を日常に。",
    body:
      "三重県産茶葉のみにこだわった、希少な日本茶「シングルオリジン伊勢茶（単一農園・単一品種）」を産地直送でお届けします。こっくり甘い「深蒸し茶」、香ばしさが心地よい「ほうじ茶」、渋みが少なくやさしい「和紅茶」など、ご自宅用の日本茶としてはもちろん、大切な方へのギフトとしても喜ばれる美味しいお茶を揃えました。歴史ある伊勢茶を、現代のライフスタイルに合わせて気軽にお楽しみいただきたい。その想いを込め、こだわりの日本茶を贈答用から普段使いまでひとつひとつ丁寧に梱包してお届けします。",
    more: "…もっと読む",
  },
  en: {
    label: "Single Origin Ise Tea",
    heading: "Bringing the tradition of Japanese tea since the late Edo period into everyday life.",
    body:
      "We deliver rare single-origin Ise tea (single estate, single variety) made only from tea leaves grown in Mie Prefecture. From rich, sweet fukamushi sencha and aromatic hojicha to gentle Japanese black tea, we offer teas for home and for gifting. We want you to enjoy historic Ise tea in a modern way—each package is carefully prepared for both gift and daily use.",
    more: "…Read more",
  },
  ko: {
    label: "Single Origin Ise Tea",
    heading: "막부 말기부터 이어져 온 일본 차의 전통을 일상으로.",
    body:
      "미에현산 찻잎만으로 만든 희소한 싱글 오리진 이세차를 산지 직송으로 보내드립니다. 진한 단맛의 후카무시 차, 고소한 호지차, 떫은맛이 적은 와홍차 등 가정용은 물론 선물로도 좋은 차를 준비했습니다. 역사 깊은 이세차를 현대적인 라이프스타일에 맞춰 편하게 즐기시길 바라며, 선물용부터 일상용까지 정성껏 포장해 보내드립니다.",
    more: "…더 읽기",
  },
  zh: {
    label: "Single Origin Ise Tea",
    heading: "将自幕末延续的日本茶传统融入日常。",
    body:
      "我们只使用三重县产的茶叶，直送稀有的单一产地伊势茶（单一茶园、单一品种）。从醇甜深蒸茶、香气怡人的焙茶到涩味较少的和红茶，备齐了自用与馈赠皆宜的茶品。希望您能以现代生活方式轻松享受历史悠久的伊势茶——从礼品到日常饮用，我们都会逐一细心包装送达。",
    more: "…阅读更多",
  },
};

type Props = {
  locale: Locale;
};

export default function Hero({ locale }: Props) {
  const t = HERO_TEXTS[locale];

  return (
    <section
      className="text-center mb-12 md:mb-16"
      aria-labelledby="hero-heading"
    >
      <p
        className="inline-block mb-3 md:mb-4 text-xs md:text-sm tracking-[0.15em] uppercase text-ink-muted"
        id="hero-label"
      >
        {t.label}
      </p>
      <h2
        id="hero-heading"
        className="m-0 mb-4 md:mb-6 font-heading text-[clamp(1.5rem,4vw,2.25rem)] font-semibold leading-snug text-tea-deep"
      >
        {t.heading}
      </h2>
      <p className="hero-lead m-0 text-[0.9375rem] md:text-base text-ink-muted max-w-[38em] mx-auto">
        {t.body}
      </p>
      <p className="hero-lead-more m-0 max-w-[38em] mx-auto text-right text-sm text-tea md:hidden">
        {t.more}
      </p>
    </section>
  );
}
