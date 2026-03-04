export default function Hero() {
  return (
    <section
      className="text-center mb-12 md:mb-16"
      aria-labelledby="hero-heading"
    >
      <p
        className="inline-block mb-3 md:mb-4 text-xs md:text-sm tracking-[0.15em] uppercase text-ink-muted"
        id="hero-label"
      >
        Single Origin Ise Tea
      </p>
      <h2
        id="hero-heading"
        className="m-0 mb-4 md:mb-6 font-heading text-[clamp(1.5rem,4vw,2.25rem)] font-semibold leading-snug text-tea-deep"
      >
        幕末より続く日本茶の伝統を日常に。
      </h2>
      <p className="hero-lead m-0 text-[0.9375rem] md:text-base text-ink-muted max-w-[38em] mx-auto">
        三重県産茶葉のみにこだわった、希少な日本茶「シングルオリジン伊勢茶（単一農園・単一品種）」を産地直送でお届けします。こっくり甘い「深蒸し茶」、香ばしさが心地よい「ほうじ茶」、渋みが少なくやさしい「和紅茶」など、ご自宅用の日本茶としてはもちろん、大切な方へのギフトとしても喜ばれる美味しいお茶を揃えました。歴史ある伊勢茶を、現代のライフスタイルに合わせて気軽にお楽しみいただきたい。その想いを込め、こだわりの日本茶を贈答用から普段使いまでひとつひとつ丁寧に梱包してお届けします。
      </p>
      <p className="hero-lead-more m-0 max-w-[38em] mx-auto text-right text-sm text-tea md:hidden">
        …もっと読む
      </p>
    </section>
  );
}
