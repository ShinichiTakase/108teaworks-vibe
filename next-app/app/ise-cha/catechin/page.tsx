import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { buildAlternatesForLocales } from "@/lib/seo";

const CATECHIN_IMG = "/images/ise-cha/catechin/catechin.webp";
const TEABAG_IMG = "/images/ise-cha/catechin/3teabag-ise-deeproasted.webp";

export async function generateMetadata() {
  return {
    title: "お茶とコレステロール｜緑茶カテキンの健康効果｜伊勢茶の藤八茶寮",
    description:
      "NHK『あしたが変わるトリセツショー』で紹介。ガレート型カテキンが悪玉LDLコレステロールだけを狙い撃ち。自分で淹れた深蒸し茶100mlに約400mgのカテキンが含まれ、TJD（The Japan Diet）でも推奨される緑茶の健康効果を解説します。",
    alternates: buildAlternatesForLocales("/ise-cha/catechin"),
  };
}

function SideImages({
  catechinExists,
  teabagExists,
}: {
  catechinExists: boolean;
  teabagExists: boolean;
}) {
  return (
    <div className="space-y-8 px-10">
      {catechinExists && (
        <figure className="m-0">
          <Image
            src={CATECHIN_IMG}
            alt="カテキンの分子構造"
            width={480}
            height={480}
            className="h-auto w-full rounded object-contain"
            sizes="(max-width: 767px) 60vw, 320px"
          />
          <figcaption className="mt-2 pb-6 text-center text-[15px] text-ink-muted">
            ガレート型カテキンの構造
          </figcaption>
        </figure>
      )}
      <Link
        href="/ise-cha/deep-steamed-isecha/"
        className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
      >
        <span>伊勢茶 深蒸し茶 ティーバッグ</span>
        <span className="shrink-0 text-tea font-semibold" aria-hidden="true">詳しく見る &gt;&gt;</span>
      </Link>
      {teabagExists && (
        <figure className="m-0">
          <Image
            src={TEABAG_IMG}
            alt="伊勢茶 深蒸し茶 ティーバッグ"
            width={480}
            height={480}
            className="h-auto w-full rounded object-cover"
            sizes="(max-width: 767px) 60vw, 320px"
          />
        </figure>
      )}
      <Link
        href="/ise-cha/wakocha-isecha/"
        className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
      >
        <span>伊勢茶 和紅茶 ティーバッグ</span>
        <span className="shrink-0 text-tea font-semibold" aria-hidden="true">詳しく見る &gt;&gt;</span>
      </Link>
    </div>
  );
}

export default function IseChaGreenTeaCatechinPage() {
  const catechinExists = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ise-cha", "catechin", "catechin.webp"),
  );
  const teabagExists = fs.existsSync(
    path.join(
      process.cwd(),
      "public",
      "images",
      "ise-cha",
      "catechin",
      "3teabag-ise-deeproasted.webp",
    ),
  );

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/catechin", "ja")} />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale="ja" current="catechin" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            「1日一杯」で変わる、緑茶とコレステロールの健やかな関係
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <SideImages catechinExists={catechinExists} teabagExists={teabagExists} />
            </aside>

            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>
                2026年5月6日放送の<strong>NHK『あしたが変わるトリセツショー』</strong>において、コレステロールの吸収を抑える心強い味方として「緑茶」が紹介されました。緑茶に含まれる成分が、なぜこれほどまでに注目されているのか。その鍵を握るのは、お茶特有の成分である「カテキン」の驚くべき力です。
              </p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                悪玉コレステロールだけを狙い撃ちする「ガレート型カテキン」
              </h2>
              <p>
                カテキンにはいくつかのタイプがありますが、中でもコレステロールに直接はたらきかけるのは「ガレート型カテキン」と呼ばれる成分です。この成分の最大の特徴は、善玉（HDL）コレステロールには影響を与えず、血管疾患の原因となる悪玉（LDL）コレステロールだけを狙い撃ちして低下させるという、非常に優れた選択性にあります。
              </p>
              <p>
                体内では、食事から摂ったコレステロールが吸収されるのをブロックしてそのまま外へ追い出すと同時に、脂肪を分解する酵素の働きをセーブすることで余分な脂肪の蓄積を防いでくれます。さらに、強い抗酸化作用によって血管のサビ（酸化）を防ぎ、健やかな血流を保つサポートをしてくれるのです。
              </p>

              {/* モバイル：1枚目画像 */}
              <div className="md:hidden">
                {catechinExists && (
                  <figure className="m-0 my-4">
                    <Image
                      src={CATECHIN_IMG}
                      alt="カテキンの分子構造"
                      width={480}
                      height={480}
                      className="mx-auto h-auto w-full max-w-[320px] rounded object-contain"
                      sizes="70vw"
                    />
                  </figure>
                )}
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                ペットボトルよりも自分で淹れた深蒸し茶を勧める理由
              </h2>
              <p>
                効率よく健康を維持するなら、ぜひ「自分で淹れた深蒸し茶」を選んでください。実は、自分で淹れた深蒸し茶100mlには約400mgものガレート型カテキンが含まれており、これは市販のペットボトル緑茶の約10倍以上に相当します。
              </p>
              <p>
                研究では、1日に約400mgのカテキンを摂取することで数値の改善が確認されています。つまり、濃厚な深蒸し茶なら、毎日たった一杯を習慣にするだけで必要な量を補うことができるのです。ペットボトルで同量を摂取しようとすると毎日1リットル以上を飲み続けなければならず、継続のしやすさという点でも、自分で淹れたお茶には大きなメリットがあります。
              </p>

              {/* モバイル：2枚目画像 */}
              <div className="md:hidden">
                {teabagExists && (
                  <figure className="m-0 my-4">
                    <Image
                      src={TEABAG_IMG}
                      alt="伊勢茶 深蒸し茶 ティーバッグ"
                      width={480}
                      height={480}
                      className="h-auto w-full rounded object-cover"
                      sizes="80vw"
                    />
                  </figure>
                )}
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                日本が誇る健康食のスタンダードとして
              </h2>
              <p>
                日本動脈硬化学会が推奨する、動脈硬化予防のための食事法「TJD（The Japan Diet）」においても、緑茶は魚や大豆製品、野菜などと並び、公式に推奨される重要な食品として位置づけられています。緑茶は単なる嗜好品ではなく、私たちの長寿と健康を支える「機能性食品」そのものと言えるでしょう。
              </p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                藤八茶寮から、健やかな毎日へ
              </h2>
              <p>
                健康な体づくりは、毎日の美味しい一杯からはじまります。藤八茶寮が自信を持ってお届けする伊勢茶は、深蒸しならではの濃厚な栄養と旨みが詰まっています。今日から、大切なご家族と一緒に「1日一杯の伊勢茶習慣」を取り入れてみませんか。
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
