import fs from "fs";
import path from "path";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getProductImagePath } from "@/lib/productImage";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { buildHref } from "@/lib/urlPath";

const STRUCTURE_IMAGE_SRC = "/images/ise-cha/caffeine/Caffeine_structure.webp";

type CaffeineTexts = {
  h1: string;
  articleHeadline: string;
  articleDescription: string;
  breadcrumbName: string;
  leadP1: string;
  leadP2: string;
  leadP3: string;
  decafLinkLabel: string;
  decafProductAlt: string;
  decafProductName: string;
  chemFormula: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  intakeTitle: string;
  intakeIntro: string;
  intakeTableH: readonly [string, string];
  intakeRows: readonly (readonly [string, string])[];
  intakeNote: string;
  caffeineIntro: string;
  caffeineTableH: readonly [string, string, string];
  caffeineRows: readonly (readonly [string, string, string])[];
  decafH2Prefix: string;
  decafH2Link: string;
  decafP1: string;
  decafP2Prefix: string;
  decafP2Link: string;
  decafP2Suffix: string;
  decafListItems: readonly [string, string, string];
  decafP3: string;
  faqTitle: string;
  faqs: readonly { q: string; a: string }[];
  summaryTitle: string;
  summaryP: string;
};

const TEXTS: CaffeineTexts = {
    h1: "カフェインカット緑茶の通販｜お茶とカフェインの知っておきたい関係",
    articleHeadline: "カフェインカット緑茶の通販｜お茶とカフェインの知っておきたい関係",
    articleDescription:
      "薬剤不使用・超臨界CO2抽出でカフェイン70%オフ。伊勢茶本来の旨みはそのままに、夜のティータイムや低カフェインを気にする方に。三重県川俣谷産シングルオリジン。",
    breadcrumbName: "カフェインカット緑茶",
    leadP1:
      "お茶には150種類以上の成分が含まれていますが、その中でも特に注目されるのが「カフェイン」です。",
    leadP2:
      "コーヒーにも含まれる苦み成分の一種で、眠気を抑えて集中力や注意力を高めたり、気分を向上させたりといった多くのメリットがあります。また、脂肪燃焼の促進や運動パフォーマンスの向上に寄与するという研究データもあり、私たちの生活に活力を与えてくれる存在です。",
    leadP3: "一方で、摂取するタイミングや量には少し注意が必要です。",
    decafLinkLabel: "伊勢茶 カフェインカット緑茶",
    decafProductAlt: "伊勢茶 カフェインカット（デカフェ）緑茶",
    decafProductName: "伊勢茶 カフェインカット（デカフェ）緑茶",
    chemFormula: "化学式: C8H10N4O2",
    sec2Title: "カフェインの「半減期」と上手な付き合い方",
    sec2P1:
      "カフェインを摂取してから、体内でその量が半分に分解されるまで（半減期）には、約5〜6時間かかると言われています。そのため、午後遅くに摂取すると、夜の寝つきや睡眠の質に影響が出ることもあります。",
    sec2P2:
      "また、継続的に多く摂取しすぎると耐性がつき、急に控えた際に倦怠感や集中力の低下を感じる「離脱症状」が出る場合もあります。カルシウムの吸収をわずかに阻害する性質もあるため、特に妊娠中の方はWHOの基準で1日200mg以下（コーヒー約2〜3杯程度）に抑えることが推奨されています。",
    intakeTitle: "飲み物別・カフェイン含有量ガイド",
    intakeIntro: "日本の食品安全委員会が示している、1日当たりの摂取目安量は以下の通りです。",
    intakeTableH: ["対象", "摂取目安量"],
    intakeRows: [
      ["成人", "400mg/日 以下"],
      ["妊婦", "200mg/日 以下"],
      ["子ども", "体重1kgあたり2.5mg/日 以下"],
    ],
    intakeNote: "※体質により個人差がありますので、あくまで目安としてください。",
    caffeineIntro: "では、私たちが普段口にする飲み物には、どれくらいのカフェインが含まれているのでしょうか。",
    caffeineTableH: ["飲み物", "カフェイン (mg/100ml)", "備考"],
    caffeineRows: [
      ["玉露", "約160mg", "別格の高さ。少量を楽しむのが基本"],
      ["エスプレッソ", "約60mg", "1杯（30ml）で約60〜75mg程度"],
      ["ドリップコーヒー", "約40mg", "1杯（150ml）で約60mg程度"],
      ["エナジードリンク", "約30mg", "製品により大きく異なる"],
      ["深蒸し茶", "約20mg", "普通の緑茶よりやや多め"],
      ["紅茶", "約17mg", "抽出時間によって変動"],
      ["緑茶（煎茶）", "約15mg", "番茶などはこれより低め"],
      ["ほうじ茶", "約10mg", "焙煎の工程でカフェインが揮発"],
      ["コーラ", "約5mg", "清涼飲料水としての微量含有"],
      ["カフェインカット緑茶", "約5mg", "藤八茶寮の商品（70%オフ）"],
      ["麦茶", "ほぼ0mg", "ノンカフェイン飲料"],
    ],
    decafH2Prefix: "美味しさを諦めない「藤八茶寮」の",
    decafH2Link: "カフェインカット緑茶",
    decafP1:
      "「夜もお茶を楽しみたいけれど、眠れなくなるのは困る」「妊娠中や授乳中でも、本格的なお茶の味を楽しみたい」……そんな声にお応えして生まれたのが、藤八茶寮のカフェインカット緑茶です。",
    decafP2Prefix: "私たちの",
    decafP2Link: "カフェインカット緑茶",
    decafP2Suffix: "は、薬剤を使わず「水と二酸化炭素」のみを用いる超臨界二酸化炭素抽出法を採用しています。",
    decafListItems: [
      "まず、深蒸し茶からカフェインを85%除去します。",
      "そのままだと失われがちな「濃厚なコク」と「まろやかな旨み」を保つため、あえて高品質な深蒸し茶を黄金比で再ブレンド。",
      "最終的にカフェイン70%オフという、美味しさと優しさを両立したバランスに仕上げました。",
    ],
    decafP3:
      "100ml当たりのカフェイン量は約5mg。これはコーラと同程度で、一般的な緑茶の3分の1以下です。お子様からカフェインに敏感な体質の方まで、伊勢茶ならではの薫り高い風味を安心してお楽しみいただけます。",
    faqTitle: "よくある質問",
    faqs: [
      {
        q: "デカフェと完全ノンカフェインは違いますか？",
        a: "はい、異なります。デカフェはカフェインを大幅に低減したものですが、完全にゼロではありません。藤八茶寮のカフェインカット緑茶は約70%オフで、100mlあたり約5mg残っています。完全にカフェインを避けたい場合は麦茶などをお選びください。",
      },
      {
        q: "妊娠中や授乳中でも飲めますか？",
        a: "本商品のカフェイン量は100mlあたり約5mgで、一般的な緑茶の約3分の1以下です。ただし妊娠中・授乳中の方の食品摂取についてはかかりつけの医師にご相談ください。",
      },
      {
        q: "子どもでも飲めますか？",
        a: "カフェイン量は一般的な緑茶の約3分の1以下です。ただし年齢・体重により適切な摂取量が異なるため、小さなお子様には量を調整してお飲みください。",
      },
      {
        q: "味は普通の緑茶と変わりますか？",
        a: "超臨界CO2抽出法により、カフェインのみを選択的に除去するため、伊勢茶本来の旨みとコクはそのままです。通常の深蒸し茶と同様にまろやかな味わいをお楽しみいただけます。",
      },
      {
        q: "水出しでも飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くだけで、甘みの強い水出しカフェインカット緑茶が楽しめます。就寝前の一杯としてもおすすめです。",
      },
    ],
    summaryTitle: "まとめ：シーンに合わせて賢く選ぶ",
    summaryP:
      "カフェインは決して「避けるべきもの」ではありません。仕事中の集中力アップや、アクティブに動きたい時には強い味方になってくれます。大切なのは、時間帯や体調に合わせて飲み分けること。朝の目覚めには力強い深蒸し茶を。そしてリラックスしたい夜や、ご家族で囲む食卓には藤八茶寮のカフェインカット緑茶を。上手に使い分けて、心豊かなティータイムをお過ごしください。",
};

export default function CaffeinePage() {
  const t = TEXTS;
  const decafImagePath = getProductImagePath("decaf_green_tea");
  const structureImageExists = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ise-cha", "caffeine", "Caffeine_structure.webp"),
  );
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/caffeine/`;
  const breadcrumbPath = "/ise-cha/caffeine";
  const decafHref = buildHref("/ise-cha/decaf_green_tea");

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.articleHeadline}
        description={t.articleDescription}
        imageUrl={STRUCTURE_IMAGE_SRC}
        canonicalUrl={canonicalUrl}
        inLanguage="ja"
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="caffeine" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {/* カフェイン構造式 */}
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
                  <p className="m-0 mt-3 text-center text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.chemFormula}
                  </p>
                  <h2 className="m-0 mt-1 text-center text-lg font-semibold text-tea-deep">
                    Caffeine
                  </h2>
                </section>

                <Link
                  href={decafHref}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.decafLinkLabel}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
                </Link>

                {/* デカフェ商品カード */}
                <Link
                  href={decafHref}
                  className="mx-auto block w-full max-w-[420px] no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
                >
                  <Image
                    src={decafImagePath}
                    alt={t.decafProductAlt}
                    width={640}
                    height={640}
                    className="h-auto w-full rounded object-cover"
                    sizes="(max-width: 767px) 90vw, 420px"
                  />
                  <p className="m-0 mt-3 text-center text-[0.9375rem] font-semibold text-tea-deep">
                    {t.decafProductName}
                  </p>
                </Link>
              </div>
            </aside>

            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP1}</p>
              <p>{t.leadP2}</p>
              <p>{t.leadP3}</p>

              <Link
                href={decafHref}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.decafLinkLabel}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>

              <div className="md:hidden">
                {structureImageExists ? (
                  <Image
                    src={STRUCTURE_IMAGE_SRC}
                    alt="カフェイン構造式"
                    width={480}
                    height={480}
                    className="mt-[3lh] mx-auto h-auto w-full max-w-[320px] object-contain"
                    sizes="70vw"
                  />
                ) : null}
                <p className="m-0 mt-3 text-center text-[0.875rem] leading-relaxed text-ink-muted">
                  {t.chemFormula}
                </p>
                <h2 className="m-0 mt-1 text-center text-lg font-semibold text-tea-deep">
                  Caffeine
                </h2>
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.intakeTitle}</h2>
              <p>{t.intakeIntro}</p>

              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full min-w-[520px] border-collapse text-left text-[0.875rem]">
                  <thead>
                    <tr className="bg-cream">
                      {t.intakeTableH.map((h) => (
                        <th key={h} className="border-b border-border px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.intakeRows.map(([label, val], i) => (
                      <tr key={i}>
                        <td className={`px-3 py-2 ${i < t.intakeRows.length - 1 ? "border-b border-border" : ""}`}>{label}</td>
                        <td className={`px-3 py-2 ${i < t.intakeRows.length - 1 ? "border-b border-border" : ""}`}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>{t.intakeNote}</p>
              <p>{t.caffeineIntro}</p>

              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full min-w-[780px] border-collapse text-left text-[0.875rem]">
                  <thead>
                    <tr className="bg-cream">
                      {t.caffeineTableH.map((h) => (
                        <th key={h} className="border-b border-border px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.caffeineRows.map(([name, amount, note], i) => (
                      <tr key={i}>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{name}</td>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{amount}</td>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                {t.decafH2Prefix}
                <Link href={decafHref} className="text-inherit underline underline-offset-2">
                  {t.decafH2Link}
                </Link>
              </h2>
              <p>{t.decafP1}</p>
              <p>
                {t.decafP2Prefix}
                <Link href={decafHref} className="text-tea underline underline-offset-2">
                  {t.decafP2Link}
                </Link>
                {t.decafP2Suffix}
              </p>

              <ol className="m-0 pl-5">
                {t.decafListItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>

              <p>{t.decafP3}</p>

              <div className="md:hidden">
                <Link
                  href={decafHref}
                  className="mx-auto block w-full max-w-[420px] no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
                >
                  <Image
                    src={decafImagePath}
                    alt={t.decafProductAlt}
                    width={640}
                    height={640}
                    className="h-auto w-full rounded object-cover"
                    sizes="80vw"
                  />
                  <p className="m-0 mt-3 text-center text-[0.9375rem] font-semibold text-tea-deep">
                    {t.decafProductName}
                  </p>
                </Link>
              </div>

              {/* FAQ */}
              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.faqTitle}</h2>
              <dl className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
                {t.faqs.map(({ q, a }, i) => (
                  <details key={i} className="group bg-washi open:bg-white">
                    <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                      <dt className="flex-1 text-[0.9375rem] font-semibold text-tea-deep leading-relaxed">
                        <span className="mr-2 text-tea">Q.</span>{q}
                      </dt>
                      <span className="mt-0.5 shrink-0 text-tea-deep/50 transition-transform group-open:rotate-180" aria-hidden>
                        ▾
                      </span>
                    </summary>
                    <dd className="m-0 px-4 pb-4 pt-1">
                      <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                        <span className="mr-2 font-semibold text-tea-deep/70">A.</span>{a}
                      </p>
                    </dd>
                  </details>
                ))}
              </dl>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.summaryTitle}</h2>
              <p>{t.summaryP}</p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
