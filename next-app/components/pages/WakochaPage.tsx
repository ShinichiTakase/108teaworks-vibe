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
  "wakocha-isecha",
  "3teabag-ise-wakocha",
] as const;

type WakochaTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2Link1Text: string;
  sec2Link2Text: string;
  sec3Title: string;
  productNames: readonly [string, string];
  viewDetails: string;
  sec4Title: string;
  sec4StraightLabel: string;
  sec4StraightItems: readonly [string, string, string];
  sec4MilkLabel: string;
  sec4MilkItems: readonly [string, string, string];
  sec4IceLabel: string;
  sec4IceItems: readonly [string, string];
  sec4LinkText: string;
  sec4LinkHref: string;
  sec5Title: string;
  faqs: readonly { q: string; a: React.ReactNode }[];
  breadcrumbName: string;
};

const TEXTS: WakochaTexts = {
    h1: "和紅茶の通販｜川俣谷産シングルオリジン伊勢茶",
    leadP:
      "和紅茶とは、日本の緑茶品種の茶葉を完全発酵させた国産紅茶です。インド・スリランカ産の紅茶とは異なり、渋みが少なく、やさしい甘みと花のような繊細な香りが特徴です。藤八茶寮の和紅茶は、三重県松阪市・川俣谷の自家茶畑で育てたシングルオリジン伊勢茶を完全発酵させたティーバッグです。ストレートでも、ミルクティーでもお楽しみいただけます。",
    sec1Title: "和紅茶とは——日本の緑茶品種が生む、繊細な紅茶",
    sec1P1:
      "同じ茶の木から摘んだ茶葉でも、製法（発酵度）によって緑茶・ウーロン茶・紅茶と全く異なるお茶になります。和紅茶は、日本の緑茶品種（やぶきた等）の茶葉を完全発酵させることで作られる国産紅茶です。",
    sec1P2:
      "インドのアッサム種やスリランカのセイロン種と比べ、日本の緑茶品種はタンニンが少ないため、完全発酵させても渋みが出にくいのが特徴です。その分、やさしい甘みと花・果実のような繊細な香りが際立ちます。ミルクを加えても茶葉本来の風味が消えにくく、ミルクティーとの相性も抜群です。",
    sec1P3:
      "一方で、国産茶葉を使った和紅茶は生産量が少なく希少性が高いお茶です。伊勢茶の産地・川俣谷で丁寧に育てられた茶葉から作る和紅茶は、この土地でしか生まれない特別な一杯です。",
    sec2Title: "川俣谷産シングルオリジンの和紅茶",
    sec2P1:
      "川俣谷の茶葉は、山に囲まれた谷地形が午後の日照を自然に遮ることで、アミノ酸（テアニン）が豊富に蓄えられます。テアニンが豊富な茶葉を完全発酵させると、アミノ酸が複雑な香り成分に変化し、甘みと香りがより際立つ和紅茶に仕上がります。",
    sec2P2:
      "深蒸し茶・ほうじ茶・和紅茶——これらはすべて同じ川俣谷の茶畑から生まれます。産地の個性をそのままに、製法を変えることで異なる表情を見せるのが、シングルオリジンならではの楽しみ方です。",
    sec2Link1Text: "同じ茶畑の深蒸し茶はこちら",
    sec2Link2Text: "同じ茶畑のほうじ茶はこちら",
    sec3Title: "藤八茶寮の和紅茶 商品一覧",
    productNames: [
      "伊勢茶 和紅茶 ティーバッグ 8個",
      "伊勢茶 和紅茶 ティーバッグ 3個",
    ],
    viewDetails: "詳しく見る >>",
    sec4Title: "和紅茶の美味しい楽しみ方",
    sec4StraightLabel: "ストレートティー",
    sec4StraightItems: [
      "お湯の温度：90〜95℃",
      "蒸らし時間：2〜3分（緑茶より長め）",
      "茶葉の甘みと香りをそのまま楽しめます",
    ],
    sec4MilkLabel: "ミルクティー",
    sec4MilkItems: [
      "濃いめに抽出（蒸らし3〜4分）してから温めた牛乳を加える",
      "渋みが少ないため牛乳との相性が良い",
      "砂糖なしでも自然な甘みが感じられます",
    ],
    sec4IceLabel: "アイスティー",
    sec4IceItems: [
      "熱めに抽出したものを氷の上に注ぐだけ",
      "美しいアンバー色のアイスティーに",
    ],
    sec4LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec4LinkHref: "/how-to-brew/",
    sec5Title: "よくある質問",
    faqs: [
      {
        q: "和紅茶と外国産の紅茶はどう違いますか？",
        a: "和紅茶は日本の緑茶品種を使って作るため、インドやスリランカ産の紅茶と比べてタンニンが少なく渋みが出にくいのが特徴です。やさしい甘みと花・果実のような繊細な香りがあり、ストレートで飲んでも渋くなりにくいです。",
      },
      {
        q: "ミルクティーにできますか？",
        a: "はい。渋みが少ないため牛乳との相性が良く、茶葉本来の甘みと香りが牛乳に負けずに感じられます。砂糖なしでも自然な甘みをお楽しみいただけます。",
      },
      {
        q: "カフェインは含まれますか？",
        a: (
          <>
            含まれます。和紅茶のカフェイン量は100mlあたり約17mgで、一般的な緑茶と同程度です。夜の摂取が気になる方は
            <Link href="/ise-cha/decaf/" className="text-tea underline underline-offset-2">
              カフェインカット緑茶
            </Link>
            もご検討ください。
          </>
        ),
      },
      {
        q: "アイスティーにできますか？",
        a: "はい。熱めに抽出したものを氷の上に注ぐだけで、美しいアンバー色のアイスティーが楽しめます。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
    ],
    breadcrumbName: "和紅茶の通販",
};

export default async function WakochaPage() {
  const t = TEXTS;
  const pt = COMMON_TEXTS.product;
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/wakocha/`;
  const breadcrumbPath = "/ise-cha/wakocha";

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

  const faqsForSchema = t.faqs.map(({ q, a }) => ({
    q,
    a: typeof a === "string" ? a : "",
  }));

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
      <FaqJsonLd questions={faqsForSchema} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="wakocha" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
            <div>
              <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">渋みなく、やさしい甘みの国産紅茶</p>
              <p className="m-0 text-[0.8125rem] text-ink-muted">川俣谷産シングルオリジン伊勢茶を完全発酵</p>
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
                {productData[1].imagePath && (
                  <Link href={productData[1].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[1].imagePath}
                        alt={productData[1].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[1].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[1].name}</span>
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

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p className="flex flex-wrap gap-4">
                <Link
                  href={buildHref("/ise-cha/fukamushi")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2Link1Text}
                </Link>
                <Link
                  href={buildHref("/ise-cha/houjicha")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2Link2Text}
                </Link>
              </p>
            </section>
          </div>

          {(
            <div className="mt-12">
              <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">明治から令和へ、160年続く川俣谷の茶園</h2>
              <div className="space-y-3 text-[0.9375rem] leading-relaxed text-ink">
                <p>藤八茶寮の茶畑がある川俣谷は、明治時代から続く伊勢茶の産地です。山に囲まれた谷地形と清らかな水が育む茶葉は、この土地ならではの個性を持ちます。深蒸し茶・ほうじ茶・和紅茶——製法を変えながら、同じ土地が生み出す異なる表情のお茶をお届けしています。</p>
                <p className="flex flex-wrap gap-4">
                  <Link href={buildHref("/about")} className="text-tea underline underline-offset-2">藤八茶寮について</Link>
                  <Link href={buildHref("/ise-cha")} className="text-tea underline underline-offset-2">伊勢茶について</Link>
                </p>
              </div>
            </div>
          )}

          {(
            <div className="mt-12">
              <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">和紅茶のカフェインと健康成分</h2>
              <div className="space-y-3 text-[0.9375rem] leading-relaxed text-ink">
                <p>和紅茶のカフェイン量は100mlあたり約17mgで、一般的な緑茶とほぼ同程度です。就寝前の摂取は控えることをおすすめします。カフェインが気になる方には、同じ川俣谷の茶葉を使ったカフェインカット緑茶もご用意しています。</p>
                <p>完全発酵によって生まれる茶ポリフェノール（テアフラビン）は、紅茶特有の成分です。緑茶のカテキンが発酵過程で変化したもので、抗酸化作用が期待されています。</p>
                <p className="flex flex-wrap gap-4">
                  <Link href={buildHref("/ise-cha/caffeine")} className="text-tea underline underline-offset-2">カフェインについて詳しく</Link>
                  <Link href={buildHref("/ise-cha/catechin")} className="text-tea underline underline-offset-2">カテキン・ポリフェノールについて</Link>
                </p>
              </div>
            </div>
          )}

          {/* セクション4：楽しみ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4StraightLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4StraightItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4MilkLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4MilkItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4IceLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4IceItems.map((item, i) => (
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

          {/* セクション3：商品一覧（全幅） */}
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
                    <span className="text-[0.75rem] text-ink-muted font-normal">
                      {pt.taxIncluded}
                    </span>
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
