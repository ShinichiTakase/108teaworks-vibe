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

const PRODUCT_SLUGS = [
  "roasted-isecha-teabag",
  "roasted-isecha",
  "roasted-isecha-powder-unsweetened",
  "roasted-isecha-teabag-bulkpack",
  "roasted-isecha-powder-unsweetened-bulkpack",
] as const;

type HoujichaTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec1P4: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2LinkText: string;
  sec3Title: string;
  productNames: readonly [string, string, string, string, string];
  viewDetails: string;
  sec4Title: string;
  sec4P1: string;
  sec4P2: string;
  sec4LinkText: string;
  sec5Title: string;
  sec5HotLabel: string;
  sec5HotItems: readonly [string, string, string];
  sec5ColdLabel: string;
  sec5ColdItems: readonly [string, string, string];
  sec5PowderLabel: string;
  sec5PowderItems: readonly [string, string, string];
  sec5LinkText: string;
  sec5LinkHref: string;
  sec6Title: string;
  faqs: readonly { q: string; a: string }[];
  breadcrumbName: string;
};

const TEXTS: HoujichaTexts = {
    h1: "ほうじ茶の通販｜川俣谷産シングルオリジン伊勢茶",
    leadP:
      "ほうじ茶は、緑茶を高温で焙煎することで生まれる、香ばしい香りとまろやかな味わいが特徴のお茶です。藤八茶寮のほうじ茶は、三重県松阪市・川俣谷の自家茶畑で育てたシングルオリジン伊勢茶をベースに、ティーバッグ・茶葉・パウダーの3形態でお届けします。焙煎によりカフェインが揮発するため、夜のティータイムや食事のお供にも最適です。",
    sec1Title: "ほうじ茶とは——焙煎が生む、香ばしさとまろやかさ",
    sec1P1:
      "ほうじ茶は、緑茶（番茶・煎茶・茎茶など）を200℃前後の高温で焙煎したお茶です。高温焙煎によって茶葉の成分が変化し、ピラジン類と呼ばれる芳香成分が生成されることで、ほうじ茶特有の香ばしい香りが生まれます。",
    sec1P2:
      "焙煎の工程でカフェインの一部が揮発するため、100mlあたり約10mgと一般的な緑茶の約3分の2以下に抑えられます。夜のティータイムや、カフェインを控えたい方にもおすすめです。",
    sec1P3:
      "また、タンニン（渋み成分）が熱変性することで渋みが抑えられ、まろやかな味わいになります。水色（すいしょく）は赤褐色——緑茶とは異なる独特の色合いも、ほうじ茶の特徴のひとつです。",
    sec1P4:
      "藤八茶寮のほうじ茶は、川俣谷産のシングルオリジン伊勢茶をベースにしています。もともと旨み豊かな茶葉を使うことで、焙煎後も旨みの土台がしっかりと残り、香ばしさと旨みが際立つほうじ茶に仕上がります。",
    sec2Title: "川俣谷産シングルオリジンのほうじ茶",
    sec2P1:
      "川俣谷は、三重県松阪市飯南町に位置する伊勢茶発祥の地として知られる産地です。三方を山に囲まれた谷地形が午後の日照を自然に遮り、茶葉が旨み成分（テアニン）をじっくりと蓄えます。この「自然かぶせに近い条件」が、他産地にはない豊かな旨みを生み出します。",
    sec2P2:
      "その旨みを土台にした茶葉を使うからこそ、焙煎後も香りと旨みが際立つほうじ茶になります。収穫した茶葉は川俣谷を熟知した地元の製茶所で丁寧に加工し、産地から直接お届けします。",
    sec2LinkText: "深蒸し茶についてはこちら",
    sec3Title: "藤八茶寮のほうじ茶 商品一覧",
    productNames: [
      "伊勢茶 ほうじ茶 ティーバッグ 8個",
      "伊勢茶 ほうじ茶 茶葉 30g",
      "伊勢茶 ほうじ茶パウダー 80g",
      "お得用 伊勢茶 ほうじ茶 ティーバッグ 50個",
      "お得用 伊勢茶 ほうじ茶パウダー 500g",
    ],
    viewDetails: "詳しく見る >>",
    sec4Title: "ほうじ茶パウダーの使い方",
    sec4P1:
      "藤八茶寮のほうじ茶パウダーは、お湯や牛乳に溶かすだけでほうじ茶ラテが手軽に作れます。ほうじ茶特有の香ばしさが牛乳の甘みと合わさり、カフェのようなひと杯をご自宅でお楽しみいただけます。",
    sec4P2:
      "製菓や料理への活用も広がります。パンケーキ・アイスクリーム・チョコレートの風味づけ、お菓子のクリームや生地への混ぜ込みなど、抹茶パウダーと同様の感覚でお使いいただけます。",
    sec4LinkText: "抹茶・パウダー緑茶との違いはこちら",
    sec5Title: "美味しい淹れ方",
    sec5HotLabel: "ホットの場合",
    sec5HotItems: [
      "お湯の温度：90〜100℃（高温で香りが引き立ちます）",
      "量の目安：ティーバッグ1個、茶葉は3〜4g",
      "蒸らし時間：30秒〜1分",
    ],
    sec5ColdLabel: "水出しの場合",
    sec5ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で1〜2時間",
      "香ばしさが柔らかく広がり、すっきりした味わいに",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec5PowderLabel: "パウダーの場合",
    sec5PowderItems: [
      "小さじ1杯（約2g）を80〜100℃のお湯150mlに溶かす",
      "牛乳で溶かすとほうじ茶ラテに",
      "製菓の場合は小麦粉100gに対して小さじ2〜3杯が目安",
    ],
    sec5LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec5LinkHref: "/how-to-brew/",
    sec6Title: "よくある質問",
    faqs: [
      {
        q: "ほうじ茶は低カフェインですか？",
        a: "はい。焙煎の工程でカフェインが揮発するため、100mlあたり約10mgと一般的な緑茶の約3分の2以下です。夜のティータイムや、カフェインを控えたい方にもおすすめです。",
      },
      {
        q: "ほうじ茶パウダーと茶葉・ティーバッグの違いは何ですか？",
        a: "ティーバッグ・茶葉はお湯で抽出して飲む形態です。パウダーはお湯や牛乳に直接溶かせるため、ほうじ茶ラテやお菓子作りにも活用できます。どちらも同じ川俣谷産の茶葉を使用しています。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で1〜2時間置くと、香ばしさが柔らかく広がる水出しほうじ茶が楽しめます。",
      },
      {
        q: "農薬や添加物は使っていますか？",
        a: "三重県産の茶葉のみを使用しており、添加物は一切使用していません。原材料名は「緑茶（三重県）」のみです。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
    ],
    breadcrumbName: "ほうじ茶の通販",
};

export default async function HoujichaPage() {
  const t = TEXTS;
  const pt = COMMON_TEXTS.product;
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/houjicha/`;
  const breadcrumbPath = "/ise-cha/houjicha";

  const { contents: allProducts } = await getProducts();
  const productData = PRODUCT_SLUGS.map((slug, i) => {
    const p = allProducts.find((ap) => ap.SLUG === slug);
    return {
      slug,
      name: t.productNames[i],
      href: buildHref(`/ise-cha/${slug}`),
      imagePath: getProductImagePath(slug),
      price: p?.PRICE,
      outOfStock: p?.STOCK === 0,
    };
  });
  const mainImagePath = productData[0].imagePath;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.h1}
        description={t.leadP}
        imageUrl={
          mainImagePath
            ? `${SITE_BASE_URL}${mainImagePath}`
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
          <IsechaSubNav current="houjicha" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
            <div>
              <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">香ばしさとまろやかさ。夜でも安心の伊勢茶</p>
              <p className="m-0 text-[0.8125rem] text-ink-muted">川俣谷産シングルオリジン・低カフェイン</p>
            </div>
            <Link
              href={productData[0].href}
              className="shrink-0 rounded-lg border border-tea-light px-5 py-2.5 text-[0.9375rem] font-semibold text-tea-deep no-underline transition-colors hover:border-tea hover:bg-washi"
            >
              試してみる {formatPriceYen(productData[0].price)}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {mainImagePath && (
                  <Link href={productData[0].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={mainImagePath}
                        alt={productData[0].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[0].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[0].name}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
                {productData[2].imagePath && (
                  <Link href={productData[2].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[2].imagePath}
                        alt={productData[2].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[2].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[2].name}</span>
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
                href={productData[0].href}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{productData[0].name}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                  &gt;&gt;
                </span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec1Title}</h2>
              <p>{t.sec1P1}</p>
              <p>{t.sec1P2}</p>
              <p>{t.sec1P3}</p>
              <p>{t.sec1P4}</p>

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
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">明治から令和へ、160年続く川俣谷の茶園</h2>
                  <p>藤八茶寮の屋号は、明治の茶商人・高瀬藤八に由来します。三重県松阪市の自社茶園で育てた伊勢茶を携えて神戸の港へ向かい、アメリカ商館を相手に渡り合いながら、西海岸への輸出航路を切り拓いた人物です。</p>
                  <p>その茶園が今も川俣谷にあります。鎌倉時代に始まったとされる伊勢茶の栽培が続くこの地で、160年以上受け継がれてきた茶葉を、現代の技術と藤八の志をあわせて令和の食卓へお届けしています。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/about")} className="text-tea underline underline-offset-2">
                      藤八茶寮についてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha")} className="text-tea underline underline-offset-2">
                      伊勢茶の産地・歴史についてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">夜でも安心——ほうじ茶のカフェインとカテキン</h2>
                  <p>ほうじ茶は焙煎の工程でカフェインが揮発し、100mlあたり約10mgと一般的な緑茶の約3分の2以下になります。夕食後や就寝前のリラックスタイムにも気兼ねなくお召し上がりいただけます。</p>
                  <p>カフェインが減少する一方、緑茶由来のカテキンは焙煎後も適量残ります。カテキン、特に「ガレート型カテキン」には、悪玉（LDL）コレステロールだけを選択的に低下させる働きが確認されており、毎日続けやすい健康習慣として注目されています。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      お茶とカフェインについてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildHref("/ise-cha/catechin")} className="text-tea underline underline-offset-2">
                      お茶の健康成分（カテキン）についてもっと詳しく
                    </Link>
                  </p>
                </>
              )}
            </section>
          </div>

          {/* セクション4：パウダーの使い方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.sec4P1}</p>
              <p>{t.sec4P2}</p>
              <p>
                <Link
                  href={buildHref("/ise-cha/maccha")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec4LinkText}
                </Link>
              </p>
            </div>
          </div>

          {/* セクション5：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5HotLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5ColdLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5ColdItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5PowderLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5PowderItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <Link href={t.sec5LinkHref} className="text-tea underline underline-offset-2">
                {t.sec5LinkText}
              </Link>
            </p>
          </div>

          {/* セクション6：FAQ */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec6Title}</h2>
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

          {/* 商品一覧（最下部） */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productData.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="flex flex-col no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:border-tea-light hover:bg-white"
                >
                  <span className="relative block mb-2 aspect-square">
                    {p.imagePath && (
                      <Image
                        src={p.imagePath}
                        alt={p.name}
                        width={640}
                        height={640}
                        className="w-full h-full rounded object-cover bg-cream"
                        sizes="(max-width: 767px) 45vw, 220px"
                      />
                    )}
                    {p.outOfStock && (
                      <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[0.75rem] font-semibold text-cream">
                        在庫切れ
                      </span>
                    )}
                  </span>
                  <span className="block text-right text-[0.8125rem] font-normal mb-0.5 leading-snug">
                    {p.name}
                  </span>
                  <span className="block text-right text-[0.875rem] font-bold text-tea-deep">
                    {formatPriceYen(p.price)}{" "}
                    <span className="text-[0.75rem] text-ink-muted font-normal">{pt.taxIncluded}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
