import Image from "next/image";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getProductImagePath } from "@/lib/productImage";
import { buildAlternatesForLocales } from "@/lib/seo";
import { SITE_BASE_URL } from "@/lib/siteConstants";

const PRODUCTS = [
  {
    slug: "deep-steamed-isecha",
    name: "伊勢茶 深蒸し茶 ティーバッグ 10個",
    href: "/ise-cha/deep-steamed-isecha/",
  },
  {
    slug: "3teabag-ise-deeproasted",
    name: "伊勢茶 深蒸し茶 ティーバッグ 3個",
    href: "/ise-cha/3teabag-ise-deeproasted/",
  },
  {
    slug: "ise-tea-deep-steamed-bulkpack",
    name: "お得用 伊勢茶 深蒸し茶 ティーバッグ 50個",
    href: "/ise-cha/ise-tea-deep-steamed-bulkpack/",
  },
  {
    slug: "isecha-powder-unsweetened",
    name: "伊勢茶 深蒸し茶パウダー 100g",
    href: "/ise-cha/isecha-powder-unsweetened/",
  },
] as const;

export async function generateMetadata() {
  return {
    title: "深蒸し茶の通販なら伊勢茶の藤八茶寮｜川俣谷産シングルオリジン",
    description:
      "三重県川俣谷産・シングルオリジンの深蒸し茶をティーバッグ・茶葉でお届け。独自の地形が生む自然かぶせに近い濃厚な旨みが特徴。藤八茶寮の自家茶畑から直送します。",
    alternates: buildAlternatesForLocales("/ise-cha/fukamushi"),
  };
}

export default function IseChaFukamushiPage() {
  const productImages = PRODUCTS.map((p) => ({
    ...p,
    imagePath: getProductImagePath(p.slug),
  }));
  const mainImagePath = productImages[0].imagePath;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline="深蒸し茶の通販｜川俣谷産・シングルオリジン伊勢茶"
        description="三重県川俣谷産・シングルオリジンの深蒸し茶をティーバッグ・茶葉でお届け。独自の地形が生む自然かぶせに近い濃厚な旨みが特徴。藤八茶寮の自家茶畑から直送します。"
        imageUrl={mainImagePath ? `${SITE_BASE_URL}${mainImagePath}` : `${SITE_BASE_URL}/images/ise-cha/catechin/catechin.webp`}
        canonicalUrl="https://108teaworks.com/ise-cha/fukamushi/"
      />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/fukamushi", "ja", { productName: "深蒸し茶" })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale="ja" current="fukamushi" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            深蒸し茶の通販｜川俣谷産・シングルオリジン伊勢茶
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {mainImagePath && (
                  <figure className="m-0">
                    <Image
                      src={mainImagePath}
                      alt="伊勢茶 深蒸し茶 ティーバッグ"
                      width={640}
                      height={640}
                      className="h-auto w-full rounded object-cover"
                      sizes="(max-width: 767px) 60vw, 320px"
                    />
                  </figure>
                )}
                <Link
                  href="/ise-cha/deep-steamed-isecha/"
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>伊勢茶 深蒸し茶 ティーバッグ</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">詳しく見る &gt;&gt;</span>
                </Link>
              </div>
            </aside>

            {/* 本文：セクション1〜3 */}
            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>
                深蒸し茶は、普通の煎茶の2〜4倍の時間をかけて蒸すことで、渋みが抑えられ、まろやかで濃厚な旨みが引き出されるお茶です。藤八茶寮の深蒸し茶は、三重県松阪市・川俣谷の自家茶畑で育てた茶葉を使ったシングルオリジン。この土地にしか出せない味わいをお届けします。
              </p>

              {/* モバイル：商品リンク */}
              <Link
                href="/ise-cha/deep-steamed-isecha/"
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>伊勢茶 深蒸し茶 ティーバッグ</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                深蒸し茶とは——製法が生む、まろやかなコク
              </h2>
              <p>
                「深蒸し茶」とは、緑茶の製造工程における「蒸し」の時間を通常の2〜4倍に延ばしたお茶です。普通の煎茶が30〜40秒の蒸し工程であるのに対し、深蒸し茶は60〜180秒かけてじっくりと蒸します。
              </p>
              <p>
                この長い蒸し工程によって茶葉の細胞壁が壊れ、渋みの原因となる成分が細かく分解されます。その結果、渋みが抑えられ、まろやかで濃厚な旨みが前面に出るお茶に仕上がります。水色（すいしょく）は深みのある濃い緑色で、細かくなった茶葉の粒子が溶け出すことで独特の濁りが生まれます。この濁りこそが、深蒸し茶の豊かな旨みと栄養の証です。
              </p>
              <p>
                お湯の温度は70℃前後が最適。低温で淹れることで甘みと旨みがより引き立ちます。
              </p>
              <p>
                さらに藤八茶寮の深蒸し茶は、川俣谷の地形が自然に生み出す「かぶせに近い条件」がこの旨みをさらに深めています。山に囲まれた谷地形が午後の日照を遮ることで、茶葉がゆっくりと旨み成分（テアニン）を蓄えてから収穫されます。その茶葉を深蒸し製法でさらに凝縮させることで、他産地では再現できない濃厚なコクが生まれるのです。
              </p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                川俣谷が育む、深蒸し茶の旨み
              </h2>
              <p>
                川俣谷は、三重県松阪市飯南町に位置する、<strong>伊勢茶発祥の地</strong>として知られる歴史ある産地です。鎌倉時代から茶の栽培が行われてきたとも伝えられ、日本茶の長い歴史の中でも特別な場所です。
              </p>
              <p>
                この谷地形には、他産地にはない自然の恵みがあります。三方を山に囲まれた地形が午後の日照を自然に遮ることで、茶葉が焼けず、旨み成分であるテアニンをじっくりと蓄えることができます。これは、人工的に日除けをして育てる「かぶせ茶」に近い環境が自然に生まれている状態です。川俣谷の茶には、その分だけ深い甘みと旨みが宿ります。
              </p>
              <p>
                収穫した茶葉は、川俣谷を熟知した地元の製茶所で丁寧に仕上げられます。産地から製茶、そして販売まで一貫した体制だからこそ、茶葉本来の個性を損なうことなくお届けできます。
              </p>
              <p>
                藤八茶寮の深蒸し茶は「<strong>シングルオリジン</strong>」——他産地の茶葉とブレンドしない、川俣谷の単一茶園のみを使用した純粋なお茶です。産地の個性をそのままに、茶葉の本来の力を味わっていただけます。
              </p>
            </section>
          </div>

          {/* セクション4：商品一覧（全幅） */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">
              藤八茶寮の深蒸し茶 商品一覧
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productImages.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="block no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
                >
                  {p.imagePath && (
                    <Image
                      src={p.imagePath}
                      alt={p.name}
                      width={640}
                      height={640}
                      className="h-auto w-full rounded object-cover"
                      sizes="(max-width: 767px) 45vw, 220px"
                    />
                  )}
                  <p className="m-0 mt-2 text-center text-[0.875rem] font-semibold text-tea-deep leading-snug">
                    {p.name}
                  </p>
                  <p className="m-0 mt-1 text-center text-[0.8125rem] text-tea">
                    詳しく見る &gt;&gt;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
