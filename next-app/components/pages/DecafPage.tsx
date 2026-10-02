import type React from "react";
import Image from "next/image";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { formatPriceYen } from "@/lib/formatters";
import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { buildHref } from "@/lib/urlPath";

const PRODUCT_SLUG = "decaf_green_tea" as const;

type DecafTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec1LinkText: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2LinkText: string;
  sec3Title: string;
  productName: string;
  viewDetails: string;
  sec4Title: string;
  sec4HotLabel: string;
  sec4HotItems: readonly [string, string, string];
  sec4ColdLabel: string;
  sec4ColdItems: readonly [string, string, string];
  sec4LinkText: string;
  sec4LinkHref: string;
  sec5Title: string;
  faqs: readonly { q: string; a: string }[];
  breadcrumbName: string;
};

const TEXTS: DecafTexts = {
    h1: "カフェインカット緑茶・デカフェ緑茶の特徴",
    leadP:
      "藤八茶寮のカフェインカット緑茶は、薬剤を一切使わず「水と二酸化炭素」のみによる超臨界CO₂抽出法でカフェインを70%カットした低カフェイン緑茶です。三重県松阪市・川俣谷産シングルオリジン伊勢茶の旨みとコクを楽しめます。カフェインはゼロではありません。",
    sec1Title: "なぜ「薬剤不使用」にこだわるのか",
    sec1P1:
      "一般的なデカフェ処理では、カフェインを溶かし出すために塩化メチレン（ジクロロメタン）などの有機溶媒が用いられる場合があります。こうした化学溶媒は微量でも残留の懸念が生じるため、毎日飲むお茶として気になる方も少なくありません。",
    sec1P2:
      "藤八茶寮のカフェインカット緑茶は、「超臨界CO₂抽出法」を採用しています。この製法では水と二酸化炭素のみを使用するため、化学溶媒が残留する心配がありません。",
    sec1P3:
      "まず品質の高い深蒸し茶を原料として超臨界CO₂処理を行い、カフェインを85%除去します。その後、お茶本来の旨みと香りを最大限に保つため、高品質な深蒸し茶を黄金比でブレンドします。最終的に仕上がったカフェインカット緑茶は、カフェイン70%オフ・100mlあたり約5mgに抑えられています。",
    sec1LinkText: "カフェインについて詳しくはこちら",
    sec2Title: "川俣谷産シングルオリジンの深蒸し茶をベースに",
    sec2P1:
      "藤八茶寮のカフェインカット緑茶のベースは、三重県松阪市・川俣谷産のシングルオリジン深蒸し茶です。山々に囲まれたこの谷地形は、午後の日照を自然に遮ることでテアニン（旨み成分）を豊富に蓄えた茶葉を育みます。",
    sec2P2:
      "超臨界CO₂抽出法でカフェインを除去しても、この産地固有の旨みやテアニンの豊かさは変わりません。カフェインを気にしながらも伊勢茶の濃厚な味わいを楽しみたい方へ、妥協なき一杯をお届けします。",
    sec2LinkText: "深蒸し茶について詳しくはこちら",
    sec3Title: "商品",
    productName: "伊勢茶 カフェインカット（デカフェ）緑茶 ティーバッグ 8個",
    viewDetails: "詳しく見る >>",
    sec4Title: "美味しい淹れ方",
    sec4HotLabel: "ホットの場合",
    sec4HotItems: [
      "お湯の温度：70℃前後（低温ほど甘みが引き立ちます）",
      "ティーバッグ1個、蒸らし時間：30〜60秒",
      "ポイント：沸騰したお湯を一度湯呑みに移してから急須へ注ぐと自然に70℃前後になります",
    ],
    sec4ColdLabel: "水出しの場合",
    sec4ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で30分〜1時間",
      "甘みとやわらかな口当たりを楽しめます。カフェインはゼロではありません",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec4LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec4LinkHref: "/how-to-brew/",
    sec5Title: "よくある質問",
    faqs: [
      {
        q: "カフェインは完全にゼロになりますか？",
        a: "ゼロにはなりません。超臨界CO₂抽出法により70%カットし、100mlあたり約5mgまで低減しています。これはコーラとほぼ同程度、一般的な緑茶の約3分の1以下です。完全にカフェインを避けたい場合は麦茶などをお選びください。",
      },
      {
        q: "妊娠中や授乳中でも飲めますか？",
        a: "本商品のカフェイン量は100mlあたり約5mgで、一般的な緑茶の約3分の1以下です。ただし妊娠中・授乳中の方の食品摂取については、かかりつけの医師にご相談ください。",
      },
      {
        q: "味は普通の緑茶と変わりますか？",
        a: "超臨界CO₂抽出法はカフェインのみを選択的に除去するため、伊勢茶本来の旨みとコクはそのままです。通常の深蒸し茶と同様にまろやかな味わいをお楽しみいただけます。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くと、水出しの緑茶を楽しめます。カフェインはゼロではありません。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
      {
        q: "子どもに飲ませても大丈夫ですか？",
        a: "本商品はカフェイン70%カットの緑茶ですが、カフェインはゼロではありません。子ども向けの安全性を保証する商品ではありません。",
      },
      {
        q: "朝の深蒸し茶と飲み分けるメリットはありますか？",
        a: "通常の深蒸し茶とカフェインカット緑茶は、味わいとカフェインカットの有無で選べます。本商品はカフェイン70%カットですが、カフェインはゼロではありません。",
      },
      {
        q: "カフェインカット緑茶にもカテキンは含まれますか？",
        a: "本商品は伊勢茶を原料とするカフェイン70%カットの緑茶です。カテキン含有量や健康への効果を保証するものではありません。カフェインはゼロではありません。",
      },
    ],
    breadcrumbName: "カフェインカット緑茶の通販",
};

export default async function DecafPage() {
  const t = TEXTS;
  const pt = COMMON_TEXTS.product;
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/decaf/`;
  const breadcrumbPath = "/ise-cha/decaf";

  const { contents: allProducts } = await getProducts();
  const p = allProducts.find((ap) => ap.SLUG === PRODUCT_SLUG);
  const productHref = buildHref(`/ise-cha/${PRODUCT_SLUG}`);
  const productImagePath = getProductImagePath(PRODUCT_SLUG);
  const price = p?.PRICE;
  const outOfStock = p?.STOCK === 0;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.h1}
        description={t.leadP}
        imageUrl={
          productImagePath
            ? `${SITE_BASE_URL}${productImagePath}`
            : `${SITE_BASE_URL}/images/ise-cha/catechin/catechin.webp`
        }
        canonicalUrl={canonicalUrl}
        inLanguage="ja"
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="decaf" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
            <div>
              <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">夜も飲める、本格伊勢茶</p>
              <p className="m-0 text-[0.8125rem] text-ink-muted">薬剤不使用・水とCO₂のみでカフェインカット</p>
            </div>
            <Link
              href={productHref}
              className="shrink-0 rounded-lg border border-tea-light px-5 py-2.5 text-[0.9375rem] font-semibold text-tea-deep no-underline transition-colors hover:border-tea hover:bg-washi"
            >
              試してみる {formatPriceYen(price)}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {productImagePath && (
                  <Link href={productHref} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productImagePath}
                        alt={t.productName}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productHref}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.productName}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
              </div>
            </aside>

            {/* 本文：セクション1〜2 */}
            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP}</p>

              {/* モバイル：商品リンク */}
              <Link
                href={productHref}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.productName}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                  &gt;&gt;
                </span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec1Title}</h2>
              <p>{t.sec1P1}</p>
              <p>{t.sec1P2}</p>
              <p>{t.sec1P3}</p>
              <p>
                <Link
                  href={buildHref("/ise-cha/caffeine")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec1LinkText}
                </Link>
              </p>

              {(
                <>
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">カフェインとの上手な付き合い方</h2>
                  <p>カフェインは眠気を抑えて集中力を高めたり、気分を向上させる働きがあります。一方で、摂取してから体内で半分に分解されるまでに約5〜6時間かかるため、午後遅くに飲むと夜の寝つきや睡眠の質に影響が出ることがあります。</p>
                  <p>本商品はカフェイン70%カットですが、カフェインはゼロではありません。カフェインを控える際は、この商品特性をご確認ください。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      カフェインについてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">飲み物別カフェイン含有量の比較</h2>
                  <p>日本の食品安全委員会が示す1日の摂取目安：成人400mg、妊婦200mg、子どもは体重1kgあたり2.5mg以下。</p>
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full min-w-[400px] border-collapse text-[0.875rem]">
                      <thead>
                        <tr className="bg-cream">
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">飲み物</th>
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">カフェイン (mg/100ml)</th>
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">備考</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr><td className="px-3 py-2">玉露</td><td className="px-3 py-2">約160mg</td><td className="px-3 py-2 text-ink-muted">少量を楽しむのが基本</td></tr>
                        <tr><td className="px-3 py-2">エスプレッソ</td><td className="px-3 py-2">約60mg</td><td className="px-3 py-2 text-ink-muted">1杯（30ml）で約60〜75mg</td></tr>
                        <tr><td className="px-3 py-2">ドリップコーヒー</td><td className="px-3 py-2">約40mg</td><td className="px-3 py-2 text-ink-muted">1杯（150ml）で約60mg</td></tr>
                        <tr><td className="px-3 py-2">エナジードリンク</td><td className="px-3 py-2">約30mg</td><td className="px-3 py-2 text-ink-muted">製品により異なる</td></tr>
                        <tr><td className="px-3 py-2">深蒸し茶</td><td className="px-3 py-2">約20mg</td><td className="px-3 py-2 text-ink-muted">普通の緑茶よりやや多め</td></tr>
                        <tr><td className="px-3 py-2">紅茶</td><td className="px-3 py-2">約17mg</td><td className="px-3 py-2 text-ink-muted">抽出時間によって変動</td></tr>
                        <tr><td className="px-3 py-2">緑茶（煎茶）</td><td className="px-3 py-2">約15mg</td><td className="px-3 py-2 text-ink-muted">番茶などはこれより低め</td></tr>
                        <tr><td className="px-3 py-2">ほうじ茶</td><td className="px-3 py-2">約10mg</td><td className="px-3 py-2 text-ink-muted">焙煎でカフェインが揮発</td></tr>
                        <tr><td className="px-3 py-2">コーラ</td><td className="px-3 py-2">約5mg</td><td className="px-3 py-2 text-ink-muted">清涼飲料水としての微量含有</td></tr>
                        <tr className="bg-cream font-semibold">
                          <td className="px-3 py-2 text-tea-deep">カフェインカット緑茶</td>
                          <td className="px-3 py-2 text-tea-deep">約5mg</td>
                          <td className="px-3 py-2 text-tea-deep">藤八茶寮の商品（70%オフ）</td>
                        </tr>
                        <tr><td className="px-3 py-2">麦茶</td><td className="px-3 py-2">ほぼ0mg</td><td className="px-3 py-2 text-ink-muted">ノンカフェイン飲料</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p>
                <Link
                  href={buildHref("/ise-cha/fukamushi")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2LinkText}
                </Link>
              </p>

              {(
                <>
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">カフェイン70%カットの伊勢茶を選ぶ</h2>
                  <p>藤八茶寮のカフェインカット緑茶は、深蒸し茶をベースに仕上げた伊勢茶です。</p>
                  <p>完成品はカフェイン70%カットです。カフェインはゼロではありません。味わいと商品特性を確認してお選びください。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha/catechin")} className="text-tea underline underline-offset-2">
                      お茶の成分（カテキン）についてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      お茶とカフェインについてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">こんな方におすすめ</h2>
                  <ul className="m-0 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink">
                    <li>カフェインを控えながら緑茶の味わいを楽しみたい方</li>
                    <li>川俣谷産伊勢茶のコクと香りでお茶を選びたい方</li>
                    <li>カフェインカットの有無を確認して商品を選びたい方</li>
                  </ul>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href="/ise-cha/decafe-lp/" className="text-tea underline underline-offset-2">
                      カフェイン70%カット緑茶ティーバッグの味わい・淹れ方を見る
                    </Link>
                  </p>
                </>
              )}
            </section>
          </div>

          {/* セクション4：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4HotLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4ColdLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4ColdItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <Link href={t.sec4LinkHref} className="text-tea underline underline-offset-2">
                {t.sec4LinkText}
              </Link>
            </p>
          </div>

          {/* セクション5：FAQ */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
            <dl className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
              {t.faqs.map(({ q, a }, i) => (
                <details key={i} className="group bg-washi open:bg-white">
                  <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                    <dt className="flex-1 text-[0.9375rem] font-semibold text-tea-deep leading-relaxed">
                      <span className="mr-2 text-tea">Q.</span>
                      {q}
                    </dt>
                    <span
                      className="mt-0.5 shrink-0 text-tea-deep/50 transition-transform group-open:rotate-180"
                      aria-hidden
                    >
                      ▾
                    </span>
                  </summary>
                  <dd className="m-0 px-4 pb-4 pt-1">
                    <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                      <span className="mr-2 font-semibold text-tea-deep/70">A.</span>
                      {a}
                    </p>
                  </dd>
                </details>
              ))}
            </dl>
          </div>
          {/* 商品（最下部） */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href={productHref}
                className="flex w-[200px] flex-col no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:border-tea-light hover:bg-white"
              >
                <span className="relative block mb-2 aspect-square">
                  {productImagePath && (
                    <Image
                      src={productImagePath}
                      alt={t.productName}
                      width={640}
                      height={640}
                      className="w-full h-full rounded object-cover bg-cream"
                      sizes="(max-width: 767px) 45vw, 220px"
                    />
                  )}
                  {outOfStock && (
                    <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[0.75rem] font-semibold text-cream">
                      在庫切れ
                    </span>
                  )}
                </span>
                <span className="block text-right text-[0.8125rem] font-normal mb-0.5 leading-snug">
                  {t.productName}
                </span>
                <span className="block text-right text-[0.875rem] font-bold text-tea-deep">
                  {formatPriceYen(price)}{" "}
                  <span className="text-[0.75rem] text-ink-muted font-normal">
                    {pt.taxIncluded}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
