import type React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
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
  "deep-steamed-isecha",
  "3teabag-ise-deeproasted",
  "ise-tea-deep-steamed-bulkpack",
  "isecha-powder-unsweetened",
  "ise-tea-powder-unsweetened-bulkpack",
] as const;

type FukamushiTexts = {
  h1: string;
  leadP: string;
  productLinkLabel: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2P3: string;
  sec2P4: string;
  sec3Title: string;
  sec3P1: React.ReactNode;
  sec3P2: string;
  sec3P3: string;
  sec3P4: React.ReactNode;
  sec4Title: string;
  productNames: readonly [string, string, string, string, string];
  viewDetails: string;
  sec4bTitle: string;
  sec4bP: string;
  sec4bItems: readonly [string, string, string];
  sec4bLinkText: string;
  sec4bLinkHref: string;
  sec5Title: string;
  sec5HotLabel: string;
  sec5HotItems: readonly [string, string, string, string];
  sec5ColdLabel: string;
  sec5ColdItems: readonly [string, string, string];
  sec5LinkText: string;
  sec5LinkHref: string;
  sec6Title: string;
  faqs: readonly { q: string; a: string }[];
  heroPitch: string;
  heroCta: string;
  heroCtaSub: string;
};

const TEXTS: FukamushiTexts = {
    h1: "深蒸し茶の通販｜川俣谷産・シングルオリジン伊勢茶",
    leadP:
      "深蒸し茶は、普通の煎茶の2〜4倍の時間をかけて蒸すことで、渋みが抑えられ、まろやかで濃厚な旨みが引き出されるお茶です。藤八茶寮の深蒸し茶は、三重県松阪市・川俣谷の自家茶畑で育てた茶葉を使ったシングルオリジン。この土地にしか出せない味わいをお届けします。",
    productLinkLabel: "伊勢茶 深蒸し茶 ティーバッグ",
    sec2Title: "深蒸し茶とは——製法が生む、まろやかなコク",
    sec2P1:
      "「深蒸し茶」とは、緑茶の製造工程における「蒸し」の時間を通常の2〜4倍に延ばしたお茶です。普通の煎茶が30〜40秒の蒸し工程であるのに対し、深蒸し茶は60〜180秒かけてじっくりと蒸します。",
    sec2P2:
      "この長い蒸し工程によって茶葉の細胞壁が壊れ、渋みの原因となる成分が細かく分解されます。その結果、渋みが抑えられ、まろやかで濃厚な旨みが前面に出るお茶に仕上がります。水色（すいしょく）は深みのある濃い緑色で、細かくなった茶葉の粒子が溶け出すことで独特の濁りが生まれます。この濁りこそが、深蒸し茶の豊かな旨みと栄養の証です。",
    sec2P3: "お湯の温度は70℃前後が最適。低温で淹れることで甘みと旨みがより引き立ちます。",
    sec2P4:
      "さらに藤八茶寮の深蒸し茶は、川俣谷の地形が自然に生み出す「かぶせに近い条件」がこの旨みをさらに深めています。山に囲まれた谷地形が午後の日照を遮ることで、茶葉がゆっくりと旨み成分（テアニン）を蓄えてから収穫されます。その茶葉を深蒸し製法でさらに凝縮させることで、他産地では再現できない濃厚なコクが生まれるのです。",
    sec3Title: "川俣谷が育む、深蒸し茶の旨み",
    sec3P1: (
      <>
        川俣谷は、三重県松阪市飯南町に位置する、<strong>伊勢茶発祥の地</strong>
        として知られる歴史ある産地です。鎌倉時代から茶の栽培が行われてきたとも伝えられ、日本茶の長い歴史の中でも特別な場所です。
      </>
    ),
    sec3P2:
      "この谷地形には、他産地にはない自然の恵みがあります。三方を山に囲まれた地形が午後の日照を自然に遮ることで、茶葉が焼けず、旨み成分であるテアニンをじっくりと蓄えることができます。これは、人工的に日除けをして育てる「かぶせ茶」に近い環境が自然に生まれている状態です。川俣谷の茶には、その分だけ深い甘みと旨みが宿ります。",
    sec3P3:
      "収穫した茶葉は、川俣谷を熟知した地元の製茶所で丁寧に仕上げられます。産地から製茶、そして販売まで一貫した体制だからこそ、茶葉本来の個性を損なうことなくお届けできます。",
    sec3P4: (
      <>
        藤八茶寮の深蒸し茶は「<strong>シングルオリジン</strong>
        」——他産地の茶葉とブレンドしない、川俣谷の単一茶園のみを使用した純粋なお茶です。産地の個性をそのままに、茶葉の本来の力を味わっていただけます。
      </>
    ),
    sec4Title: "藤八茶寮の深蒸し茶 商品一覧",
    productNames: [
      "伊勢茶 深蒸し茶 ティーバッグ 10個",
      "伊勢茶 深蒸し茶 ティーバッグ 3個",
      "お得用 伊勢茶 深蒸し茶 ティーバッグ 50個",
      "伊勢茶 深蒸し茶パウダー 100g",
      "お得用 伊勢茶 深蒸し茶パウダー 500g",
    ],
    viewDetails: "詳しく見る >>",
    sec4bTitle: "深蒸し茶パウダーの使い方",
    sec4bP: "深蒸し茶パウダーは、お茶として飲むだけでなく、お菓子作りや料理にも幅広く活用できます。",
    sec4bItems: [
      "緑茶ラテ：温めたミルクにパウダーを溶かすだけ。砂糖やはちみつをお好みで加えてどうぞ。",
      "お菓子作り：クッキーやケーキの生地に混ぜ込む場合、小麦粉100gに対してパウダー小さじ2〜3杯が目安です。",
      "料理への活用：抹茶塩の代わりに天ぷらや揚げ物に合わせても。茶葉の旨みが食材を引き立てます。",
    ],
    sec4bLinkText: "抹茶との違いについては「抹茶とパウダー緑茶」",
    sec4bLinkHref: "/ise-cha/maccha/",
    sec5Title: "深蒸し茶の美味しい淹れ方",
    sec5HotLabel: "ホットの場合",
    sec5HotItems: [
      "お湯の温度：70℃前後（低温ほど甘みが引き立ちます）",
      "茶葉の量：ティーバッグ1個、茶葉の場合は2〜3g",
      "蒸らし時間：30〜60秒",
      "ポイント：沸騰したお湯を一度湯呑みに移してから急須へ注ぐと自然に70℃前後になります",
    ],
    sec5ColdLabel: "水出しの場合",
    sec5ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で30分〜1時間",
      "甘みが強く出るため、暑い季節やお子様にもおすすめです",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec5LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec5LinkHref: "/how-to-brew/",
    sec6Title: "よくある質問",
    faqs: [
      {
        q: "深蒸し茶と普通の煎茶はどう違いますか？",
        a: "蒸し時間が通常の2〜4倍（60〜180秒）と長いため、茶葉の細胞が細かく壊れ、渋みが少なくまろやかな味わいになります。水色（すいしょく）が濁りのある濃い緑色になるのも深蒸し茶の特徴です。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くだけで、甘みの強い水出し深蒸し茶が楽しめます。渋みがほとんど出ないため、緑茶が苦手な方にもおすすめです。",
      },
      {
        q: "農薬や添加物は使っていますか？",
        a: "三重県産の茶葉のみを使用しており、添加物は一切使用していません。原材料名は「緑茶（三重県）」のみです。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
      {
        q: "深蒸し茶パウダーとティーバッグはどちらがおすすめですか？",
        a: "手軽においしい一杯を楽しみたい方にはティーバッグ、お菓子作りや緑茶ラテなど幅広い用途で使いたい方にはパウダーがおすすめです。どちらも同じ川俣谷産の茶葉を使用しています。",
      },
    ],
    heroPitch: "渋みなし・まろやか・急須不要。伊勢の一番茶をティーバッグで。",
    heroCta: "まずはお試し3個",
    heroCtaSub: "今すぐ試す",
};

export default async function FukamushiPage() {
  const t = TEXTS;
  const pt = COMMON_TEXTS.product;
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/fukamushi/`;
  const breadcrumbPath = "/ise-cha/fukamushi";

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
        imageUrl={mainImagePath ? `${SITE_BASE_URL}${mainImagePath}` : `${SITE_BASE_URL}/images/ise-cha/catechin/catechin.webp`}
        canonicalUrl={canonicalUrl}
        inLanguage="ja"
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema items={getBreadcrumbItems(breadcrumbPath, { productName: t.sec4Title })} />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="fukamushi" />
          <h1 className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          {/* ヒーローCTA */}
          <p className="mb-3 text-sm text-ink">{t.heroPitch}</p>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
            <div>
              <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">{t.heroCta}</p>
              <p className="m-0 text-[0.8125rem] text-ink-muted">{t.heroCtaSub}</p>
            </div>
            <AddToCartButton
              slug="3teabag-ise-deeproasted"
              price={productData[1].price}
              title={productData[1].name}
              imagePath={productData[1].imagePath ?? undefined}
              label={`${t.heroCta} ${formatPriceYen(productData[1].price)}`}
              className="shrink-0 rounded-lg border-2 border-tea bg-tea px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:border-tea-light hover:bg-tea-light disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {mainImagePath && (
                  <Link href={buildHref("/ise-cha/deep-steamed-isecha")} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={mainImagePath}
                        alt={t.productNames[0]}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={buildHref("/ise-cha/deep-steamed-isecha")}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.productLinkLabel}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
                {productData[3].imagePath && (
                  <Link href={productData[3].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[3].imagePath}
                        alt={productData[3].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[3].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[3].name}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
              </div>
            </aside>

            {/* 本文：セクション1〜3 */}
            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP}</p>

              {/* モバイル：商品リンク */}
              <Link
                href={buildHref("/ise-cha/deep-steamed-isecha")}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.productLinkLabel}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p>{t.sec2P3}</p>
              <p>{t.sec2P4}</p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
              <p>{t.sec3P1}</p>
              <p>{t.sec3P2}</p>
              <p>{t.sec3P3}</p>
              <p>{t.sec3P4}</p>
            </section>
          </div>

          {/* セクション4：商品一覧（全幅） */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productData.map((p) => (
                <div
                  key={p.slug}
                  className="flex flex-col rounded-lg border border-border bg-washi p-3"
                >
                  <Link
                    href={p.href}
                    className="flex flex-col no-underline text-inherit transition-opacity hover:opacity-90"
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
                  <div className="mt-2">
                    <AddToCartButton
                      slug={p.slug}
                      price={p.price}
                      title={p.name}
                      imagePath={p.imagePath ?? undefined}
                      disabled={p.outOfStock}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* セクション4b：パウダーの使い方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4bTitle}</h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink">{t.sec4bP}</p>
            <ul className="m-0 mb-4 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink">
              {t.sec4bItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
              →{" "}
              <Link href={buildHref("/ise-cha/maccha")} className="text-tea underline underline-offset-2">
                {t.sec4bLinkText}
              </Link>
            </p>
          </div>

          {/* セクション5：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">{t.sec5HotLabel}</p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">{t.sec5ColdLabel}</p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5ColdItems.map((item, i) => (
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
          </div>
        </article>
      </div>
    </main>
  );
}
