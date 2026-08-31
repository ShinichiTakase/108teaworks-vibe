import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

const ABOUT_TEXTS: {
    h1: string;
    lead1: React.ReactNode;
    lead2: string;
    sec2Title: string;
    sec2P1: string;
    sec2P2: string;
    sec3Title: string;
    sec3P1: string;
    sec4Title: string;
    sec4P1: string;
    sec4P2: string;
    sec4P3: string;
    sec4P4: string;
    altImage1: string;
    altImage2: string;
    altImage3: string;
    altImage4: string;
    sec5Title: string;
    sec5P1: string;
    sec5P2: string;
    sec5P3: string;
    sec5P4: string;
} = {
    h1: "藤八茶寮について",
    lead1: (
      <>
        <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          祖先より守り続けてきた、<strong>三重県松阪市飯南町のわずか1.7ヘクタールの茶園</strong>。藤八茶寮は、この希少な単一農園で育つ「シングルオリジン伊勢茶」の専門店です。
        </p>
        <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          櫛田川の清流が育む河岸段丘。午後の陽光が優しく遮られるこの特異な地形は、お茶にとって「<strong>天然の被せ（かぶせ）</strong>」の環境をもたらしました。限られた区画から収穫される希少な茶葉は、かつてはその質の高さゆえに、他の銘茶の「味を整えるための合組（ブレンド）用」として密かに重宝されてきました。
        </p>
        <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
          私たちは、この希少なシングルオリジン（単一農園）の美味しさをそのままお届けしたいという想いから、オンラインでのご紹介を始めました。コーヒーや紅茶を愉しむように、お気に入りのカップで自分を整えるひとときを。伝統ある深蒸し緑茶が、あなたの日常に静かな贅沢を添えます。
        </p>
      </>
    ),
    lead2:
      "ご自宅でお楽しみいただけるのはもちろん、コーヒースタンドをはじめとした飲食店様への卸業務も行っています。",
    sec2Title: "屋号に込めた想い：なぜ「藤八」なのか",
    sec2P1:
      "「藤八茶寮」という名は、私の先祖である高瀬藤八（たかせ とうはち）の歩んだ軌跡を受け継ぐために名付けられました。明治の海を越えた、ハイカラな茶商人",
    sec2P2:
      "時は明治。三重県松阪市の自社茶園で丹精込めて育てた伊勢茶を携え、藤八は神戸の港へと向かいました。当時の神戸は開国に沸く異国情緒あふれる街。藤八はスミス・ベーカー商会をはじめとするアメリカ商館を相手に、堂々と渡り合っていました。一年の半分を神戸で過ごし、シルクハットを小粋にかぶりこなしては、アメリカ西海岸へと続く巨大な輸出航路を切り拓いていく――。その姿は、当時としては驚くほど先駆的で、情熱に満ちた「ハイカラな商人」そのものでした。",
    sec3Title: "令和に呼び覚ます、藤八の志",
    sec3P1:
      "かつて藤八が見つめていた、伊勢茶が世界を席巻するあの輝かしい光景をもう一度令和の時代によみがえらせたい。単にお茶を売るだけでなく、時代を先取りする感性と、海を越えて良質なものを届けようとした彼の真摯な仕事ぶりを、私たちは現代の形で形にしていきたいと考えています。「藤八茶寮」という名には、100年以上の時を超えて再び伊勢茶の魅力を世界へと繋いでいく、私たちの揺るぎない決意が込められています。",
    sec4Title: "すこし、私のこと",
    sec4P1:
      "東京・青山のコーヒースタンドで6年間働き、コロナ禍をきっかけに、自分の将来や働き方について立ち止まって考えるようになりました。",
    sec4P2:
      "そんなとき、友人の何気ない一言から思い出したのが子どもの頃おばあちゃんの家で飲んだあの一杯のお茶でした。「このお茶を、今の時代にもう一度みんなに飲んでもらえないだろうか」そう思い立ったことがすべての始まりです。",
    sec4P3:
      "上京してコーヒーを学び好きな仕事を通して積み重ねてきた経験を活かして、明治に藤八さんが築いた少しハイカラで粋なその仕事を令和の時代にもう一度よみがえらせてみようじゃないか。",
    sec4P4:
      "創業者の名である「藤八」を屋号に、明治から令和へ。勝手ながら、想いのバトンを受け取りました。三重から東京、そして世界へ。伊勢茶を世界中にお届けします。ぜひ一度、飲んでみてください。",
    altImage1: "藤八茶寮の伊勢茶",
    altImage2: "高瀬",
    altImage3: "伊勢茶",
    altImage4: "春摘み",
    sec5Title: "川俣谷の茶畑から、あなたの手元へ",
    sec5P1: "藤八茶寮が販売する伊勢茶は、三重県松阪市飯南町・川俣谷にある自家茶畑で栽培されたお茶です。",
    sec5P2: "川俣谷は伊勢茶発祥の地とされる歴史ある産地で、山に囲まれた地形が午後の日照を遮ることで、茶葉が自然にかぶせ茶に近い深い旨みを蓄えます。この土地固有の条件が、他産地では再現できない濃厚なコクと香りを生み出しています。",
    sec5P3: "収穫した茶葉は、川俣谷をよく知る地元の製茶所で丁寧に仕上げられます。産地・製茶・販売が一本につながっているからこそ、茶葉の個性を損なわずそのままお届けできます。",
    sec5P4: "高瀬藤八が明治に切り拓いた輸出航路も、令和の私たちが届けるお茶も、出発点は同じ川俣谷の茶畑です。",
};

export default function AboutPage() {
  const t = ABOUT_TEXTS;
  // About ページ専用画像。next-app/public/images/about/ 直下に配置する。
  const IMG_BASE = "/images/about";

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="about-heading" className="mb-12">
          <h1
            id="about-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="mb-12 grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image src={`${IMG_BASE}/chaen.webp`} alt={t.altImage1} width={1600} height={1200} className="h-auto w-full object-cover" />
            </figure>
            <div className="order-1 text-left md:order-2">
              <div className="mb-4">
                {t.lead1}
              </div>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.lead2}
              </p>
              <a
                href="https://maps.app.goo.gl/6gYg91i3jbrov5dZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-tea-deep underline underline-offset-2 hover:opacity-70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                </svg>
                Googleストリートビューで茶園を見る
              </a>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P2}
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image src={`${IMG_BASE}/takase-1.png`} alt={t.altImage2} width={500} height={578} className="h-auto w-full object-cover" />
            </figure>
          </div>

          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image src={`${IMG_BASE}/108-892x1024-1.jpg`} alt={t.altImage3} width={892} height={1024} className="h-auto w-full object-cover" />
            </figure>
            <div className="order-1 text-left md:order-2">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec3Title}
              </h2>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec3P1}
              </p>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec4Title}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P1}
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P2}
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P3}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec4P4}
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image src={`${IMG_BASE}/haru-768x950-1.jpg`} alt={t.altImage4} width={768} height={950} className="h-auto w-full object-cover" />
            </figure>
          </div>

          <div className="mt-0 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">{t.sec5Title}</h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">{t.sec5P1}</p>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">{t.sec5P2}</p>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">{t.sec5P3}</p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">{t.sec5P4}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
