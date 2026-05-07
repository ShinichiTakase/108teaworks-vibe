import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getProductImagePath } from "@/lib/productImage";
import { buildAlternatesForLocales, getFixedSeo } from "@/lib/seo";

const STRUCTURE_IMAGE_SRC = "/images/ise-cha/caffeine/Caffeine_structure.webp";

function StructureFigure({ structureImageExists }: { structureImageExists: boolean }) {
  return (
    <section className="mx-auto w-full max-w-[420px]">
      {structureImageExists ? (
        <Image
          src={STRUCTURE_IMAGE_SRC}
          alt="カフェイン構造式"
          width={480}
          height={480}
          className="mt-[3lh] mx-auto h-auto w-full max-w-[320px] object-contain"
          sizes="(max-width: 767px) 70vw, 320px"
        />
      ) : (
        <div className="mt-[3lh] mx-auto flex h-[240px] w-full max-w-[320px] items-center justify-center rounded border border-dashed border-border bg-cream px-4 text-center text-[0.875rem] text-ink-muted">
          Caffeine_structure.webp を
          <br />
          /public/images/ise-cha/caffeine/
          <br />
          に配置してください
        </div>
      )}

      <p className="m-0 mt-3 text-center text-[0.875rem] leading-relaxed text-ink-muted">化学式: C8H10N4O2</p>
      <h2 className="m-0 mt-1 text-center text-lg font-semibold text-tea-deep">Caffeine</h2>
    </section>
  );
}

function DecafProductCard({ decafImagePath }: { decafImagePath: string }) {
  return (
    <Link
      href="/ise-cha/decaf_green_tea/"
      className="mx-auto block w-full max-w-[420px] no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
    >
      <Image
        src={decafImagePath}
        alt="伊勢茶 カフェインカット（デカフェ）緑茶"
        width={640}
        height={640}
        className="h-auto w-full rounded object-cover"
        sizes="(max-width: 767px) 90vw, 420px"
      />
      <p className="m-0 mt-3 text-center text-[0.9375rem] font-semibold text-tea-deep">
        伊勢茶 カフェインカット（デカフェ）緑茶
      </p>
    </Link>
  );
}

export async function generateMetadata() {
  const seo = getFixedSeo("/ise-cha/caffeine", "ja");
  return {
    title: seo?.title ?? "お茶とカフェインの関係｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "お茶とカフェインの関係、摂取目安、飲み物別の含有量、藤八茶寮のカフェインカット緑茶について解説します。",
    alternates: buildAlternatesForLocales("/ise-cha/caffeine"),
  };
}

export default function IseChaCaffeinePage() {
  const decafImagePath = getProductImagePath("decaf_green_tea");
  const structureImageExists = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ise-cha", "caffeine", "Caffeine_structure.webp"),
  );

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/ise-cha/caffeine", "ja")} />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale="ja" current="caffeine" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            お茶とカフェインの知っておきたい関係：心地よいティータイムのために
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                <StructureFigure structureImageExists={structureImageExists} />
                <Link
                  href="/ise-cha/decaf_green_tea/"
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>伊勢茶 カフェインカット緑茶</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">詳しく見る &gt;&gt;</span>
                </Link>
                <DecafProductCard decafImagePath={decafImagePath} />
              </div>
            </aside>

            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
            <p>
              お茶には150種類以上の成分が含まれていますが、その中でも特に注目されるのが「カフェイン」です。
            </p>
            <p>
              コーヒーにも含まれる苦み成分の一種で、眠気を抑えて集中力や注意力を高めたり、気分を向上させたりといった多くのメリットがあります。また、脂肪燃焼の促進や運動パフォーマンスの向上に寄与するという研究データもあり、私たちの生活に活力を与えてくれる存在です。
            </p>
            <p>一方で、摂取するタイミングや量には少し注意が必要です。</p>

            <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
              カフェインの「半減期」と上手な付き合い方
            </h2>
            <p>
              カフェインを摂取してから、体内でその量が半分に分解されるまで（半減期）には、約5〜6時間かかると言われています。そのため、午後遅くに摂取すると、夜の寝つきや睡眠の質に影響が出ることもあります。
            </p>
            <p>
              また、継続的に多く摂取しすぎると耐性がつき、急に控えた際に倦怠感や集中力の低下を感じる「離脱症状」が出る場合もあります。カルシウムの吸収をわずかに阻害する性質もあるため、特に妊娠中の方はWHOの基準で1日200mg以下（コーヒー約2〜3杯程度）に抑えることが推奨されています。
            </p>

            <div className="md:hidden">
              <StructureFigure structureImageExists={structureImageExists} />
            </div>

            <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
              飲み物別・カフェイン含有量ガイド
            </h2>
            <p>日本の食品安全委員会が示している、1日当たりの摂取目安量は以下の通りです。</p>

            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full min-w-[520px] border-collapse text-left text-[0.875rem]">
                <thead>
                  <tr className="bg-cream">
                    <th className="border-b border-border px-3 py-2 font-semibold">対象</th>
                    <th className="border-b border-border px-3 py-2 font-semibold">摂取目安量</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-border px-3 py-2">成人</td>
                    <td className="border-b border-border px-3 py-2">400mg/日 以下</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border px-3 py-2">妊婦</td>
                    <td className="border-b border-border px-3 py-2">200mg/日 以下</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">子ども</td>
                    <td className="px-3 py-2">体重1kgあたり2.5mg/日 以下</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>※体質により個人差がありますので、あくまで目安としてください。</p>
            <p>では、私たちが普段口にする飲み物には、どれくらいのカフェインが含まれているのでしょうか。</p>

            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full min-w-[780px] border-collapse text-left text-[0.875rem]">
                <thead>
                  <tr className="bg-cream">
                    <th className="border-b border-border px-3 py-2 font-semibold">飲み物</th>
                    <th className="border-b border-border px-3 py-2 font-semibold">カフェイン (mg/100ml)</th>
                    <th className="border-b border-border px-3 py-2 font-semibold">備考</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border-b border-border px-3 py-2">玉露</td><td className="border-b border-border px-3 py-2">約160mg</td><td className="border-b border-border px-3 py-2">別格の高さ。少量を楽しむのが基本</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">エスプレッソ</td><td className="border-b border-border px-3 py-2">約60mg</td><td className="border-b border-border px-3 py-2">1杯（30ml）で約60〜75mg程度</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">ドリップコーヒー</td><td className="border-b border-border px-3 py-2">約40mg</td><td className="border-b border-border px-3 py-2">1杯（150ml）で約60mg程度</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">エナジードリンク</td><td className="border-b border-border px-3 py-2">約30mg</td><td className="border-b border-border px-3 py-2">製品により大きく異なる</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">深蒸し茶</td><td className="border-b border-border px-3 py-2">約20mg</td><td className="border-b border-border px-3 py-2">普通の緑茶よりやや多め</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">紅茶</td><td className="border-b border-border px-3 py-2">約17mg</td><td className="border-b border-border px-3 py-2">抽出時間によって変動</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">緑茶（煎茶）</td><td className="border-b border-border px-3 py-2">約15mg</td><td className="border-b border-border px-3 py-2">番茶などはこれより低め</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">ほうじ茶</td><td className="border-b border-border px-3 py-2">約10mg</td><td className="border-b border-border px-3 py-2">焙煎の工程でカフェインが揮発</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">コーラ</td><td className="border-b border-border px-3 py-2">約5mg</td><td className="border-b border-border px-3 py-2">清涼飲料水としての微量含有</td></tr>
                  <tr><td className="border-b border-border px-3 py-2">カフェインカット緑茶</td><td className="border-b border-border px-3 py-2">約5mg</td><td className="border-b border-border px-3 py-2">藤八茶寮の商品（75%オフ）</td></tr>
                  <tr><td className="px-3 py-2">麦茶</td><td className="px-3 py-2">ほぼ0mg</td><td className="px-3 py-2">ノンカフェイン飲料</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
              美味しさを諦めない「藤八茶寮」の
              <Link href="/ise-cha/decaf_green_tea/" className="text-inherit underline underline-offset-2">
                カフェインカット緑茶
              </Link>
            </h2>
            <p>
              「夜もお茶を楽しみたいけれど、眠れなくなるのは困る」「妊娠中や授乳中でも、本格的なお茶の味を楽しみたい」……そんな声にお応えして生まれたのが、藤八茶寮のカフェインカット緑茶です。
            </p>
            <p>
              私たちの
              <Link href="/ise-cha/decaf_green_tea/" className="text-tea underline underline-offset-2">
                カフェインカット緑茶
              </Link>
              は、薬剤を使わず「水と二酸化炭素」のみを用いる超臨界二酸化炭素抽出法を採用しています。
            </p>

            <ol className="m-0 pl-5">
              <li>まず、深蒸し茶からカフェインを85%除去します。</li>
              <li>そのままだと失われがちな「濃厚なコク」と「まろやかな旨み」を保つため、あえて高品質な深蒸し茶を黄金比で再ブレンド。</li>
              <li>最終的にカフェイン75%オフという、美味しさと優しさを両立したバランスに仕上げました。</li>
            </ol>

            <p>
              100ml当たりのカフェイン量は約5mg。これはコーラと同程度で、一般的な緑茶の3分の1以下です。お子様からカフェインに敏感な体質の方まで、伊勢茶ならではの薫り高い風味を安心してお楽しみいただけます。
            </p>

            <div className="md:hidden">
              <DecafProductCard decafImagePath={decafImagePath} />
            </div>

            <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
              まとめ：シーンに合わせて賢く選ぶ
            </h2>
            <p>
              カフェインは決して「避けるべきもの」ではありません。仕事中の集中力アップや、アクティブに動きたい時には強い味方になってくれます。大切なのは、時間帯や体調に合わせて飲み分けること。朝の目覚めには力強い深蒸し茶を。そしてリラックスしたい夜や、ご家族で囲む食卓には藤八茶寮のカフェインカット緑茶を。上手に使い分けて、心豊かなティータイムをお過ごしください。
            </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
