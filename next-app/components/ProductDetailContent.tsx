import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, decodeHtmlEntities } from "@/lib/microcms";
import { getProductImagePaths, getProductTasteImagePaths } from "@/lib/productImage";
import ProductTasteImages from "@/components/ProductTasteImages";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductAddToCart from "@/components/ProductAddToCart";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import styles from "@/components/ProductDetailContent.module.css";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateForLocale, translateManyForLocale } from "@/lib/translateForLocale";
import { loadReviewsForSlug } from "@/lib/reviewsStorage";
import { formatReviewDate } from "@/lib/reviewDisplay";
import { formatPriceYen } from "@/lib/formatters";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { buildLocalizedPath } from "@/lib/urlPath";
import { ORGANIZATION_NAME_JA } from "@/lib/siteConstants";

function productHref(locale: Locale, path: string): string {
  const slug = path.replace(/^\/*(products|ise-cha)\/*/, "") || path;
  return buildLocalizedPath(locale, `/ise-cha/${slug}`);
}

const RELATED_KEYS = [
  { label: "RELATED01", url: "RELATED_URL01" },
  { label: "RELATED02", url: "RELATED_URL02" },
  { label: "RELATED03", url: "RELATED_URL03" },
  { label: "RELATED04", url: "RELATED_URL04" },
] as const;

/** Product/Offer 用。Google リッチリザルトで推奨される価格の有効期限 */
const OFFER_PRICE_VALID_UNTIL = "2027-12-31";
const SCHEMA_RATING_BEST = 5;
const SCHEMA_RATING_WORST = 1;

/** 商品の販売・配送対象を日本国内のみと JSON-LD で明示 */
const OFFER_ELIGIBLE_REGION_JP = "JP";
/** リッチリザルト用。実送料はランク・1万円以上無料等で変動（api/checkout/shipping と整合） */
const SCHEMA_SHIPPING_RATE_JPY = 380;
/** 注文確定メール等の「本日より2～5営業日」に合わせた日数レンジ（calendar DAY 表現） */
const OFFER_SHIPPING_DETAILS_JP = [
  {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "JP",
    },
    shippingRate: {
      "@type": "MonetaryAmount",
      value: SCHEMA_SHIPPING_RATE_JPY,
      currency: "JPY",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 2,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "DAY",
      },
    },
  },
];

/** Google 等が飲料をアルコール類と誤認しにくいよう、茶・非アルコールを明示 */
const SCHEMA_ADDITIONAL_TYPE_TEA = "https://schema.org/Tea";
const SCHEMA_PRODUCT_CATEGORY: Record<Locale, string> = {
  ja: "お茶（アルコール非含有）",
  en: "Tea (non-alcoholic)",
  ko: "차(茶) · 무알코올 음료",
  zh: "茶（无酒精）",
};

type Props = {
  locale: Locale;
  slug: string;
};

function AdditionalProductSectionsJa({ slug }: { slug: string }) {
  if (slug === "decaf_green_tea") {
    return (
      <section className="mt-8 space-y-8 border-t border-border pt-6">
        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">カフェイン量はどれくらい？（通常の緑茶との比較）</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">現在公開中の比較情報</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            藤八茶寮のデカフェ緑茶は、カフェインを70%カットしたカフェインカット緑茶です。一般的な目安として、
            コーヒーの1/10、普通のお茶の1/3以下までカフェインを抑えています。1杯あたりのカフェイン量は約5mg/100mlです。
            内容量はティーバッグ8個、価格は1,296円（税込）です。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">どんな人に向いているか（就寝前・カフェインを控えたい方）</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            緑茶の風味は楽しみたいが、カフェインは控えたいという方に向いています。とくに就寝前の一杯や、
            日中のカフェイン量を調整したい場面で選ばれています。普段の緑茶習慣を大きく変えずに、
            カフェイン摂取量を見直したい方に取り入れやすいお茶です。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">ノンカフェインとの違い</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">デカフェとノンカフェインの定義の違い</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            デカフェは、もともとカフェインを含む原料から、製法によってカフェインを減らしたものです。
            ノンカフェインは、原料そのものにカフェインをほとんど含まない飲み物を指す場合に使われます。
            名称が似ていても、成り立ちが異なる点が大きな違いです。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">本商品の位置づけ（カフェインカット緑茶）</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            本商品は、緑茶本来の味わいを残しながらカフェインを抑えたカフェインカット緑茶です。
            完全にカフェインをゼロにすることを目的とした商品ではなく、日々の選択肢として
            「控える」ためのバランスを重視しています。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">妊娠中・授乳中の飲み方</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">量とタイミングの考え方</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            本商品は1杯あたり約5mg/100mlを目安に、カフェインを抑えて楽しめる設計です。
            妊娠中・授乳中にお茶を選ぶ際は、体調やその日の摂取状況にあわせて、
            量とタイミングを調整しながら取り入れるのがおすすめです。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">不安がある場合の確認先</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            カフェインの感じ方には個人差があります。妊娠中・授乳中で不安がある場合は、
            自己判断だけで進めず、医師・助産師などの専門家に相談したうえでご利用ください。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">デカフェ製法について</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">超臨界二酸化炭素抽出法とは</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            藤八茶寮のデカフェ緑茶は、水と二酸化炭素を用いた超臨界二酸化炭素抽出法を採用しています。
            この製法は、カフェインを抑えながら、茶葉の風味をできるだけ損なわないことを重視した方法です。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">化学薬品不使用のポイント</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            デカフェ工程において、化学薬品（有機溶媒）を使わない方針で仕上げています。
            毎日続けるお茶として、素材と製法の両面で、安心感のある選択肢を目指しています。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">よくある質問（FAQ）</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">カフェインは完全にゼロですか？</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            本商品はカフェインを70%カットしたデカフェ緑茶です。完全なゼロではなく、
            1杯あたり約5mg/100mlを目安に、カフェインを抑えています。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">妊娠中に飲んでもよいですか？</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            カフェインを抑えた設計のため、選択肢の一つとして検討しやすいお茶です。
            ただし体調や状況には個人差があるため、不安がある場合は医師・助産師へご相談ください。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">普通の緑茶との違いは何ですか？</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            緑茶らしい味わいを残しつつ、カフェインを抑えている点が大きな違いです。一般的な目安として、
            コーヒーの1/10、普通のお茶の1/3以下までカフェインをカットしています。
          </p>
        </section>
      </section>
    );
  }

  if (slug === "teasampler-3teabag-variety-pack") {
    return (
      <section className="mt-8 space-y-8 border-t border-border pt-6">
        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">3種の違いがひと目でわかる比較表</h2>
          <h3 className="m-0 mb-3 text-[0.95rem] font-semibold text-tea-deep">味・香り・カフェイン感・おすすめシーン</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-[0.875rem] text-ink-muted">
              <thead>
                <tr className="bg-cream">
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">種類</th>
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">味の印象</th>
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">香りの印象</th>
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">カフェイン感（目安）</th>
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">おすすめシーン</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">深蒸し茶</td>
                  <td className="border border-border px-3 py-2">濃厚なコク</td>
                  <td className="border border-border px-3 py-2">青みとお茶らしい香り</td>
                  <td className="border border-border px-3 py-2">約20mg/100ml</td>
                  <td className="border border-border px-3 py-2">食事と一緒に、日中の定番茶として</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">ほうじ茶</td>
                  <td className="border border-border px-3 py-2">まろやかで香ばしい</td>
                  <td className="border border-border px-3 py-2">焙煎由来の香ばしさ</td>
                  <td className="border border-border px-3 py-2">約10mg/100ml</td>
                  <td className="border border-border px-3 py-2">ほっとしたい時間、夕方以降の一杯に</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">和紅茶</td>
                  <td className="border border-border px-3 py-2">やさしい甘み</td>
                  <td className="border border-border px-3 py-2">華やかでやわらかな香り</td>
                  <td className="border border-border px-3 py-2">約17mg/100ml</td>
                  <td className="border border-border px-3 py-2">甘いものと一緒に、気分を変えたい時に</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 mb-0 text-[0.875rem] leading-relaxed text-ink-muted">
            本商品は3種セット、ティーバッグ3個、価格756円（税込）です。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">ギフト用途のQ&amp;A</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">のし・ギフト包装には対応していますか？</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            本商品は、のし・ギフト包装には対応しておりません。ただし、シンプルで上品なパッケージのため、
            そのままお渡し用として選ばれることが多い商品です。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">どんな渡し方に向いていますか？</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            気軽なお礼や、相手の好みがまだ分からない場面に向いています。3種類を飲み比べできるため、
            「まず試してもらう」贈り方と相性の良いセットです。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">関連商品の選び方</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">初めての方向け</h3>
          <p className="m-0 mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            まずは本商品で3種の味わいを試し、好みに近いタイプを見つけるのがおすすめです。
          </p>
          <ul className="m-0 mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li><Link href={productHref("ja", "/ise-cha/3teabag-ise-deeproasted/")} className="text-tea underline">深蒸し茶 ティーバッグ 3個</Link></li>
            <li><Link href={productHref("ja", "/ise-cha/3teabag-ise-roasted/")} className="text-tea underline">ほうじ茶 ティーバッグ 3個</Link></li>
            <li><Link href={productHref("ja", "/ise-cha/3teabag-ise-wakocha/")} className="text-tea underline">和紅茶 ティーバッグ 3個</Link></li>
          </ul>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">リピーター向け</h3>
          <p className="m-0 mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            好みが決まっている方は、同系統の単品やまとめ買い商品を選ぶと、日常使いしやすくなります。
          </p>
          <ul className="m-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li><Link href={productHref("ja", "/ise-cha/deep-steamed-isecha/")} className="text-tea underline">深蒸し茶 ティーバッグ 10個</Link></li>
            <li><Link href={productHref("ja", "/ise-cha/roasted-isecha-teabag/")} className="text-tea underline">ほうじ茶 ティーバッグ 8個</Link></li>
            <li><Link href={productHref("ja", "/ise-cha/wakocha-isecha/")} className="text-tea underline">和紅茶 ティーバッグ 8個</Link></li>
          </ul>
        </section>
      </section>
    );
  }

  if (slug === "ise-tea-powder-unsweetened-bulkpack") {
    return (
      <section className="mt-8 space-y-8 border-t border-border pt-6">
        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">100gと500gの比較表</h2>
          <h3 className="m-0 mb-3 text-[0.95rem] font-semibold text-tea-deep">価格・g単価・使用量目安・1杯コスト</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-[0.875rem] text-ink-muted">
              <thead>
                <tr className="bg-cream">
                  <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">項目</th>
                  <th className="border border-border px-3 py-2 text-right font-semibold text-tea-deep">100g</th>
                  <th className="border border-border px-3 py-2 text-right font-semibold text-tea-deep">500g</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2">価格（税込）</td>
                  <td className="border border-border px-3 py-2 text-right">1,680円</td>
                  <td className="border border-border px-3 py-2 text-right">7,980円</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">g単価</td>
                  <td className="border border-border px-3 py-2 text-right">16.8円/g</td>
                  <td className="border border-border px-3 py-2 text-right">15.9円/g</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">使用量目安（ラテ1杯）</td>
                  <td className="border border-border px-3 py-2 text-right">3g</td>
                  <td className="border border-border px-3 py-2 text-right">3g</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-2">1杯コスト（3g換算）</td>
                  <td className="border border-border px-3 py-2 text-right">50.4円</td>
                  <td className="border border-border px-3 py-2 text-right">約47.9円</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 mb-0 text-[0.8125rem] leading-relaxed text-ink-muted">
            算出根拠: 100gは1,680円÷100g=16.8円/g、500gは7,980円÷500g=15.9円/g。
            1杯コストは各g単価に3gを掛けて算出（100g: 50.4円、500g: 47.9円）。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">用途別レシピ</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">ラテで使う</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            ラテの配合目安は、緑茶パウダー3g、お湯25〜30ml、牛乳160ccです。まず少量のお湯でよく溶かしてから
            牛乳を加えると、なめらかに仕上がります。800メッシュの細かさにより、ざらつきを抑えやすいのも特長です。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">製菓で使う</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            クッキー、パウンドケーキ、シフォンケーキ、アイスクリームなど、製菓用途に使いやすい大容量サイズです。
            無糖・無添加のため、甘さや香りの設計をレシピに合わせて調整できます。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">ドリンクで使う</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            牛乳・豆乳だけでなく、お湯や水に溶かして日常のドリンクとしても使えます。
            食事中の一杯から間食時間まで、用途に応じて濃さを変えて楽しめます。
          </p>
        </section>

        <section>
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">業務利用向け情報</h2>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">保管方法</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            未開封で長期保存する場合は、冷蔵・冷凍保存に対応しています。冷蔵・冷凍保存した商品は、
            開封前に常温へ戻してから開封し、結露による劣化を防いでください。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">賞味期限の目安</h3>
          <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            未開封の目安は1年です。開封後は2週間〜1ヶ月を目安に、早めに使い切ることをおすすめします。
          </p>
          <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">発注単位</h3>
          <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            発注単位は1個単位です。必要量に応じて、100gと500gを使い分けてお選びいただけます。
          </p>
        </section>
      </section>
    );
  }

  return null;
}

export default async function ProductDetailContent({ locale, slug }: Props) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = COMMON_TEXTS[locale].product;
  const imagePaths = getProductImagePaths(slug);
  const tasteImagePaths = getProductTasteImagePaths(slug);
  const relatedRaw = RELATED_KEYS.map(({ label, url }) => ({
    label: product[label as keyof typeof product] as string | undefined,
    href: product[url as keyof typeof product] as string | undefined,
  })).filter((r): r is { label: string; href: string } => typeof r.label === "string" && !!r.label && typeof r.href === "string" && !!r.href);

  const titleJa = product.TITLE ?? "";
  const desc01Ja = product.DESCRIPTION01 ? decodeHtmlEntities(product.DESCRIPTION01) : "";
  const desc02Ja = product.DESCRIPTION02 ? decodeHtmlEntities(product.DESCRIPTION02) : "";

  const localizedContent: [string, string, string, string[]] =
    locale === "ja"
      ? [titleJa, desc01Ja, desc02Ja, relatedRaw.map((r) => r.label)]
      : await Promise.all([
          translateForLocale(titleJa, locale),
          desc01Ja ? translateForLocale(desc01Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
          desc02Ja ? translateForLocale(desc02Ja, locale, { tagHandling: "html" }) : Promise.resolve(""),
          translateManyForLocale(relatedRaw.map((r) => r.label), locale),
        ]).then(([translatedTitle, translatedDesc01, translatedDesc02, labels]) => [
          translatedTitle,
          translatedDesc01,
          translatedDesc02,
          labels ?? [],
        ]);

  const [displayTitleRaw, displayDesc01, displayDesc02, translatedLabels] = localizedContent;

  const displayTitle = displayTitleRaw;
  const safeDisplayDesc01 = sanitizeRichHtml(displayDesc01);
  const safeDisplayDesc02 = sanitizeRichHtml(displayDesc02);

  const related =
    locale === "ja"
      ? relatedRaw
      : relatedRaw.map((r, i) => ({ ...r, label: translatedLabels[i] ?? r.label }));

  const reviews = await loadReviewsForSlug(slug);
  const latest = reviews.slice(0, 3);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://108teaworks.com";
  const productUrl =
    locale === "ja"
      ? `${baseUrl}/ise-cha/${slug}/`
      : `${baseUrl}/${locale}/ise-cha/${slug}/`;
  const legalUrl = `${baseUrl}/legal/`;
  const schemaAvailability =
    typeof product.STOCK === "number" && product.STOCK <= 0
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";
  const descriptionForSchema =
    typeof safeDisplayDesc01 === "string"
      ? safeDisplayDesc01.replace(/<[^>]+>/g, "").slice(0, 300)
      : "";
  const reviewsForSchema = reviews.filter(
    (r) =>
      typeof r.rating === "number" &&
      r.rating >= SCHEMA_RATING_WORST &&
      r.rating <= SCHEMA_RATING_BEST
  );
  const reviewCount = reviewsForSchema.length;
  const avgRating =
    reviewCount > 0
      ? reviewsForSchema.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;
  const schemaReviews =
    reviewCount > 0
      ? reviewsForSchema.slice(0, 50).map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.nickname.trim() || "anonymous" },
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: SCHEMA_RATING_BEST,
            worstRating: SCHEMA_RATING_WORST,
          },
          reviewBody: r.review?.trim() || "（コメントなし）",
          datePublished: r.createdAt,
        }))
      : undefined;
  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    additionalType: SCHEMA_ADDITIONAL_TYPE_TEA,
    category: SCHEMA_PRODUCT_CATEGORY[locale],
    name: displayTitle || titleJa,
    image: imagePaths.length > 0 ? imagePaths.map((p) => `${baseUrl}${p}`) : undefined,
    description: descriptionForSchema || undefined,
    brand: { "@type": "Brand", name: ORGANIZATION_NAME_JA },
    sku: product.SKU || undefined,
    gtin13: product.GTIN || undefined,
    url: productUrl,
    offers:
      typeof product.PRICE === "number"
        ? {
            "@type": "Offer",
            priceCurrency: "JPY",
            price: product.PRICE,
            availability: schemaAvailability,
            url: productUrl,
            priceValidUntil: OFFER_PRICE_VALID_UNTIL,
            eligibleRegion: OFFER_ELIGIBLE_REGION_JP,
            shippingDetails: OFFER_SHIPPING_DETAILS_JP,
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "JP",
              merchantReturnLink: legalUrl,
              returnPolicyCategory:
                "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 7,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            },
          }
        : undefined,
  };
  if (reviewCount > 0 && avgRating !== null && schemaReviews) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(avgRating.toFixed(2)),
      reviewCount,
      bestRating: SCHEMA_RATING_BEST,
      worstRating: SCHEMA_RATING_WORST,
    };
    productSchema.review = schemaReviews;
  }

  const pathname = buildLocalizedPath(locale, `/ise-cha/${slug}`);
  const breadcrumbItems = getBreadcrumbItems(pathname, locale, { productName: displayTitle || titleJa });

  const hasTaste = tasteImagePaths.length > 0;
  /** DESCRIPTION02 が無い商品は淹れ方などが DESCRIPTION01 に入ることが多い → その右に味わい画像 */
  const tasteWithDesc01Only = hasTaste && !!displayDesc01 && !displayDesc02;
  const tasteWithDesc02 = hasTaste && !!displayDesc02;
  const tasteStandalone = hasTaste && !displayDesc01 && !displayDesc02;

  const howToBrewHref = buildLocalizedPath(locale, "/how-to-brew");
  const isechaHref = buildLocalizedPath(locale, "/ise-cha");
  const showDescription02Ctas =
    !!displayDesc02 &&
    !String(displayDesc02).includes("/how-to-brew") &&
    !String(displayDesc02).includes("/ise-cha");

  return (
    <>
    <BreadcrumbListSchema items={breadcrumbItems} />
    <article className={["mb-10", styles.scope].join(" ")}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <ProductImageGallery imagePaths={imagePaths} alt={displayTitle || ""} />
        </div>
        <div>
          <h1 className="m-0 mb-2 font-heading text-lg md:text-xl font-semibold text-tea-deep text-right">
            {displayTitle || "—"}
          </h1>
          <p className="m-0 mb-4 text-[1.125rem] font-bold text-tea-deep text-right">
            {formatPriceYen(product.PRICE)} <span className="text-base font-normal text-ink-muted">{t.taxIncluded}</span>
          </p>
          {safeDisplayDesc01 && !tasteWithDesc01Only && (
            <div
              className="product-description mb-4 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: safeDisplayDesc01 }}
            />
          )}
          {safeDisplayDesc01 && tasteWithDesc01Only && (
            <div className="mb-4 grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-start md:gap-5">
              <div
                className="product-description min-w-0 text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: safeDisplayDesc01 }}
              />
              <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} className="min-w-0" />
            </div>
          )}
          <p className="m-0 text-[0.8125rem] text-ink-muted">
            {product.SKU && <>{t.productCode}: {product.SKU}</>}
            {product.SKU && product.GTIN && " / "}
            {product.GTIN && <>{t.janCode}: {product.GTIN}</>}
          </p>
          <ProductAddToCart
            slug={slug}
            price={product.PRICE}
            title={displayTitle}
            imagePath={imagePaths[0]}
            locale={locale}
            shipRank={product.SHIP_RANK}
          />
          {related.length > 0 && (
            <div className="mt-6">
              <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">{t.relatedProducts}</h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-2">
                {related.map((r, i) => (
                  <li key={i}>
                    <Link
                      href={r.href.startsWith("/") ? productHref(locale, r.href) : productHref(locale, r.href)}
                      className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span>{r.label}</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">{t.viewDetails}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {(safeDisplayDesc02 || tasteStandalone) && (
        <div
          className={
            tasteWithDesc02
              ? "grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:items-start md:gap-8"
              : tasteStandalone
                ? "flex justify-center md:justify-end"
                : undefined
          }
        >
          {safeDisplayDesc02 && (
            <div className="min-w-0">
              <div
                className="product-description text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:underline [&_img]:max-w-full [&_p]:mb-2 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: safeDisplayDesc02 }}
              />
              {showDescription02Ctas && (
                <ul className="list-none m-0 mt-4 p-0 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-start">
                  <li className="md:w-auto md:flex-none">
                    <Link
                      href={howToBrewHref}
                      className="flex items-center justify-between gap-2 w-full md:w-auto py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="whitespace-nowrap">お茶の淹れ方</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">＞＞</span>
                    </Link>
                  </li>
                  <li className="md:w-auto md:flex-none">
                    <Link
                      href={isechaHref}
                      className="flex items-center justify-between gap-2 w-full md:w-auto py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="whitespace-nowrap">伊勢茶とは</span>
                      <span className="shrink-0 text-tea font-semibold" aria-hidden="true">＞＞</span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}
          {tasteWithDesc02 && (
            <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} />
          )}
          {tasteStandalone && (
            <ProductTasteImages paths={tasteImagePaths} altBase={displayTitle || titleJa} />
          )}
        </div>
      )}
      {locale === "ja" && <AdditionalProductSectionsJa slug={slug} />}
      {latest.length > 0 && (
        <section className="mt-10 border-t border-border pt-6">
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">
            レビュー（{reviews.length}件）
          </h2>
          <ul className="m-0 p-0 list-none space-y-4">
            {latest.map((r, idx) => (
              <li key={idx} className="border border-border rounded-xl p-4 bg-washi">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-tea-deep">
                    <span className="shrink-0 w-5 h-5 text-ink-muted" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    {r.nickname}
                  </span>
                  <span className="text-[0.875rem] text-amber-500" aria-label={`評価 ${r.rating} / 5`}>
                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="m-0 mb-1 text-[0.875rem] text-ink leading-relaxed whitespace-pre-wrap">
                  {r.review}
                </p>
                <p className="m-0 text-[0.75rem] text-ink-muted">
                  {formatReviewDate(r.createdAt)}
                </p>
              </li>
            ))}
          </ul>
          {reviews.length > 3 && (
            <div className="mt-4">
              <Link
                href={productHref(locale, `/ise-cha/${slug}/reviews`)}
                className="inline-flex items-center text-[0.875rem] font-semibold text-tea no-underline hover:underline"
              >
                ...もっと読む
              </Link>
            </div>
          )}
        </section>
      )}
    </article>
    <PageEndProductList locale={locale} />
  </>
  );
}
