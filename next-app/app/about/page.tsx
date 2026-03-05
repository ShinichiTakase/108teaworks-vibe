import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

const IMG_BASE = "https://108teaworks.com/wp-content/uploads";

export const metadata = {
  title: "藤八茶寮について｜伊勢茶の藤八茶寮",
  description:
    "三重県内で採れた茶葉のみを使用したシングルオリジンの伊勢茶。藤八茶寮の想いと歴史をご紹介します。",
};

export default function AboutPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="about-heading" className="mb-12">
          <h1
            id="about-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            藤八茶寮について
          </h1>

          {/* 1. 左：写真／右：導入テキスト（右寄せ） */}
          <div className="mb-12 grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src={`${IMG_BASE}/2025/12/about01-1.png`}
                alt="藤八茶寮の伊勢茶"
                width={800}
                height={600}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 text-right md:order-2">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                藤八茶寮では、三重県内で採れた茶葉のみを使用したシングルオリジンの伊勢茶を取り扱っています。こっくりとした甘みが広がる深蒸し緑茶、鼻に抜ける香ばしさが心地よいほうじ茶。思わずおうちに置いておきたくなるような日々のお茶を揃えました。私たちが目指すのは、コーヒーや紅茶のようにお気に入りのカップやおやつを用意してすてきな時間のお供にしたくなるお茶です。
              </p>
              <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                ご自宅でお楽しみいただけるのはもちろん、コーヒースタンドをはじめとした飲食店様への卸業務も行っています。
              </p>
            </div>
          </div>

          {/* 2. 左：屋号ブロック（左寄せ）／右：写真 */}
          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                屋号に込めた想い：なぜ「藤八」なのか
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                「藤八茶寮」という名は、私の先祖である高瀬藤八（たかせ とうはち）の歩んだ軌跡を受け継ぐために名付けられました。明治の海を越えた、ハイカラな茶商人
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                時は明治。三重県松阪市の自社茶園で丹精込めて育てた伊勢茶を携え、藤八は神戸の港へと向かいました。
                当時の神戸は開国に沸く異国情緒あふれる街。藤八はスミス・ベーカー商会をはじめとするアメリカ商館を相手に、堂々と渡り合っていました。一年の半分を神戸で過ごし、シルクハットを小粋にかぶりこなしては、アメリカ西海岸へと続く巨大な輸出航路を切り拓いていく――。
                その姿は、当時としては驚くほど先駆的で、情熱に満ちた「ハイカラな商人」そのものでした。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src={`${IMG_BASE}/2026/01/takase-1.png`}
                alt="高瀬"
                width={500}
                height={578}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          {/* 3. 左：写真／右：令和ブロック（右寄せ） */}
          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src={`${IMG_BASE}/2026/01/108-892x1024-1.jpg`}
                alt="伊勢茶"
                width={892}
                height={1024}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 text-right md:order-2">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                令和に呼び覚ます、藤八の志
              </h2>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                かつて藤八が見つめていた、伊勢茶が世界を席巻するあの輝かしい光景をもう一度令和の時代によみがえらせたい。
                単にお茶を売るだけでなく、時代を先取りする感性と、海を越えて良質なものを届けようとした彼の真摯な仕事ぶりを、私たちは現代の形で形にしていきたいと考えています。「藤八茶寮」という名には、100年以上の時を超えて再び伊勢茶の魅力を世界へと繋いでいく、私たちの揺るぎない決意が込められています。
              </p>
            </div>
          </div>

          {/* 4. 左：すこし、私のこと（左寄せ）／右：写真 */}
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                すこし、私のこと
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                東京・青山のコーヒースタンドで6年間働き、コロナ禍をきっかけに、自分の将来や働き方について立ち止まって考えるようになりました。
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                そんなとき、友人の何気ない一言から思い出したのが子どもの頃おばあちゃんの家で飲んだあの一杯のお茶でした。「このお茶を、今の時代にもう一度みんなに飲んでもらえないだろうか」そう思い立ったことがすべての始まりです。
              </p>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                上京してコーヒーを学び好きな仕事を通して積み重ねてきた経験を活かして、明治に藤八さんが築いた少しハイカラで粋なその仕事を令和の時代にもう一度よみがえらせてみようじゃないか。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                創業者の名である「藤八」を屋号に、明治から令和へ。勝手ながら、想いのバトンを受け取りました。三重から東京、そして世界へ。伊勢茶を世界中にお届けします。ぜひ一度、のんでみてください。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src={`${IMG_BASE}/2025/12/haru-768x950-1.jpg`}
                alt="春摘み"
                width={768}
                height={950}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>
        </section>
      </div>
    </main>
  );
}
