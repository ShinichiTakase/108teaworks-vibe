import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getProductBySlug } from "@/lib/microcms";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import RoastedPowderLpBuy from "./RoastedPowderLpBuy";
import styles from "./RoastedPowderLpPage.module.css";

/**
 * D:\藤八茶寮\ほうじ茶パウダーLP\hoji_powder_lp_3.html をベースにしたLP（/ise-cha/roasted-powder-lp/）。
 * デザイン・レイアウトは元HTML/CSSの値をそのまま踏襲している。以下のみNext.js化に伴う技術的な変更：
 * ・外部ドメイン（https://108teaworks.com/...）への絶対URLは、同一サイト内のため相対パスに変更
 * ・商品画像（パッケージ写真）は元HTMLの埋め込みbase64画像から、指定の実ファイル
 *   （/images/products/roasted-isecha-powder-unsweetened/1500.webp）に差し替え
 * ・HERO画像は元HTMLの埋め込みbase64画像から、指定のPNG（lp_hoji_powder_0.png）を
 *   同解像度のままWebP変換したファイル（/images/roasted-powder-lp/hero.webp）に差し替え
 * ・「購入する」ボタンは元HTMLでは商品ページへの単純なリンクだったが、/ise-cha/decafe-lp/ 等と
 *   同様に数量+/-ステッパー付きでカートに追加し購入手続き画面（/checkout）へ遷移するよう変更
 *   （/ise-cha/roasted-isecha-powder-unsweetened/ の「今すぐ買う」と同じ動作。ユーザー指示）。
 *   価格・商品名はmicroCMSからライブ取得し、取得できない場合は元HTMLの値にフォールバックする
 * ・数量表示は上記のReact化に伴い readonly な <input> から <span role="spinbutton"> に変更
 * ・元HTMLはJSで全ステッパーの数量を同期していたが、Next.js化に伴い他のLPページ（decafe-lp等）と
 *   同様、ヒーロー・最終CTA・スティッキーバーの各ブロックは独立した数量状態を持つ
 * ・実際は80g（¥1,380）と500g業務用（¥7,980）の2商品構成だが、80gのみの単一商品として実装されていた
 *   誤りをユーザー指示により修正。microCMS側も2商品が同一SLUGを共有しておりカートで別商品として
 *   区別できなかったため、500g側のSLUGを roasted-isecha-powder-unsweetened-bulkpack に変更してもらった
 *   上で、購入ブロックを80g/500gのトグル選択式（FukamushiPowderLpBuy等と同様の構成）に変更
 */

const SMALL_SLUG = "roasted-isecha-powder-unsweetened";
const BULK_SLUG = "roasted-isecha-powder-unsweetened-bulkpack";
const FALLBACKS = {
  [SMALL_SLUG]: { title: "伊勢茶 ほうじ茶パウダー 80g（無糖）", price: 1380 },
  [BULK_SLUG]: { title: "伊勢茶 ほうじ茶パウダー 500g（業務用・製菓用・無糖）", price: 7980 },
} as const;
const PRODUCT_IMAGE = "/images/products/roasted-isecha-powder-unsweetened/1500.webp";

const FAQS = [
  {
    q: "カフェインは含まれますか？",
    a: "はい、含まれます。ほうじ茶パウダーはノンカフェインではありません。使用する粉末の量によって摂る量が変わるため、抽出したほうじ茶の一般値とは区別してください。",
  },
  {
    q: "お湯や牛乳に溶けやすいですか？",
    a: "抹茶と同程度まで微粉末に仕上げているため、ダマになりにくくよく馴染みます。少量のお湯でよく溶いてから牛乳を加えるのがコツです。",
  },
  {
    q: "添加物は使っていますか？",
    a: "原材料は緑茶（伊勢茶）のみです。香料・着色料・保存料は一切使用していません。",
  },
  {
    q: "ラテ以外の使い道は？",
    a: "ほうじ茶プリンやシフォンケーキ、クッキー、アイスクリームなど、お菓子作りの風味づけにもお使いいただけます。熱を加えても香りが飛びにくいのが特長です。",
  },
  {
    q: "賞味期限はどのくらいですか？",
    a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
  },
] as const;

const WAVE_DIVIDER = (
  <div className={styles.divider}>
    <div className={styles.constrain}>
      <svg viewBox="0 0 600 22" preserveAspectRatio="none">
        <path
          d="M0 11 C 40 2, 80 20, 120 11 S 200 2, 240 11 S 320 20, 360 11 S 440 2, 480 11 S 560 20, 600 11"
          fill="none"
          stroke="#D9C29B"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  </div>
);

export default async function RoastedPowderLpPage() {
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/roasted-powder-lp/`;

  const [smallProduct, bulkProduct] = await Promise.all([
    getProductBySlug(SMALL_SLUG),
    getProductBySlug(BULK_SLUG),
  ]);

  const small = {
    slug: SMALL_SLUG,
    title: smallProduct?.TITLE ?? FALLBACKS[SMALL_SLUG].title,
    price: smallProduct?.PRICE ?? FALLBACKS[SMALL_SLUG].price,
    imagePath: PRODUCT_IMAGE,
    shipRank: smallProduct?.SHIP_RANK,
    sizeLabel: "80g",
  };
  const bulk = {
    slug: BULK_SLUG,
    title: bulkProduct?.TITLE ?? FALLBACKS[BULK_SLUG].title,
    price: bulkProduct?.PRICE ?? FALLBACKS[BULK_SLUG].price,
    imagePath: PRODUCT_IMAGE,
    shipRank: bulkProduct?.SHIP_RANK,
    sizeLabel: "500g",
  };

  const purchaseProducts = [small, bulk] as const;

  return (
    <div className={styles.page}>
      <ProductJsonLd
        name="伊勢茶 ほうじ茶パウダー（無糖）"
        description="三重県松阪市・川俣谷産の伊勢茶を微粉末に仕上げた無糖ほうじ茶パウダーです。香ばしいラテや製菓に使え、家庭用80gと業務用・製菓用500gから選べます。カフェインを含むため、ノンカフェイン商品ではありません。"
        imageUrl={PRODUCT_IMAGE}
        canonicalUrl={canonicalUrl}
        offers={[
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: small.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "80g",
          },
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: bulk.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "500g",
          },
        ]}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/roasted-powder-lp", { productName: "ほうじ茶パウダー" })}
      />

      <div className={styles.shell}>
        {/* Header */}
        <div className={styles.topbar}>
          <div className={styles.constrain}>
            <div className={styles.brand}>
              藤八茶寮
              <small>SINGLE ORIGIN ISE-CHA — 108teaworks</small>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles["hero-media"]}>
            <img src="/images/roasted-powder-lp/hero.webp" alt="ほうじ茶ラテと焼き菓子" />
            <div className={styles["hero-scrim"]} />
            <div className={styles["hero-overlay"]}>
              <div className={styles.constrain}>
                <span className={styles.eyebrow}>伊勢茶 ほうじ茶パウダー（無糖）</span>
                <h1 className={styles["hero-title"]}>無糖ほうじ茶パウダーで楽しむ、ラテとお菓子作り</h1>
                <p className={styles["hero-lead"]}>
                  三重・川俣谷産（松阪市飯南町）の一番茶を丸ごと焙じて微粉末に。お湯にも牛乳にもすっと溶けて、伊勢のほうじ茶ラテが自宅で仕上がります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase block */}
        <div className={styles["buybox-outer"]}>
          <div className={`${styles.constrain} ${styles["buybox-flex"]}`}>
            <div className={styles.buybox}>
              <div className={styles["buybox-name"]}>
                伊勢茶 ほうじ茶パウダー（無糖）
                <span className={styles["buybox-sub"]}>三重県松阪市飯南町産 伊勢茶100%使用</span>
              </div>
              <RoastedPowderLpBuy products={purchaseProducts} />
              <p className={styles["buybox-note"]}>お買い上げ¥10,000以上で送料無料。配送は日本国内のみです。</p>
            </div>
          </div>
        </div>

        {/* Intro */}
        <section className={styles.intro}>
          <div className={styles.constrain}>
            <span className={styles.kicker}>ABOUT THIS TEA</span>
            <div className={styles["intro-grid"]}>
              <div>
                <h2 className={styles["section-title"]}>伊勢の香ばしさを丸ごと味わう、無添加・無着色のほうじ茶パウダー</h2>
                <p className={styles["body-copy"]}>
                  三重県産伊勢茶の一番茶を贅沢に使用し、丁寧に焙じ上げたほうじ茶を、そのまま細かな粉末に仕上げました。茶葉を丸ごと粉砕し、焙煎によって生まれた香ばしい風味をラテや製菓に取り入れられます。
                </p>
                <p className={styles["body-copy"]}>
                  香料・着色料・保存料は一切不使用。無糖・無添加の純粋なほうじ茶パウダーです。牛乳や豆乳に溶かすだけで、カフェで飲むような本格的なほうじ茶ラテが自宅で簡単に完成します。
                </p>
              </div>
              <div className={styles["intro-image"]}>
                <img src={PRODUCT_IMAGE} alt="伊勢茶 ほうじ茶パウダー パッケージ" />
              </div>
            </div>
          </div>
        </section>

        {WAVE_DIVIDER}

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.constrain}>
            <span className={styles.kicker}>3 REASONS</span>
            <h2 className={styles["section-title"]}>選ばれる、3つの理由</h2>
            <div className={styles["feature-grid"]}>
              <div className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 12l2 2 4-4" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={styles["feature-text"]}>
                  <h3>無添加・無着色</h3>
                  <p>香料・着色料・保存料は一切不使用。原材料は緑茶（伊勢茶）のみの、純粋なほうじ茶パウダーです。</p>
                </div>
              </div>
              <div className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 3c4 3 8 3 12 0" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M4 9c5 3.5 11 3.5 16 0" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M12 9v10" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M8 21h8" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div className={styles["feature-text"]}>
                  <h3>一番茶を丸ごと粉末に</h3>
                  <p>川俣谷産シングルオリジン伊勢茶の一番茶を余すことなく粉砕。焙煎による香ばしさを楽しめる粉末に仕上げました。</p>
                </div>
              </div>
              <div className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v6" stroke="#33503E" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M7 9h10l1.4 9.2A2 2 0 0 1 16.4 21H7.6a2 2 0 0 1-2-2.8L7 9z" stroke="#33503E" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M9 13c1 1 2 1 3 0s2-1 3 0" stroke="#33503E" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className={styles["feature-text"]}>
                  <h3>お湯にも牛乳にもすっと溶ける</h3>
                  <p>抹茶と同程度まで微粉末化。ダマになりにくく、ラテはもちろんお菓子作りの生地にも混ぜ込みやすい質感です。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {WAVE_DIVIDER}

        {/* Recipe / Usage */}
        <section>
          <div className={styles.constrain}>
            <span className={styles.kicker}>HOW TO ENJOY</span>
            <h2 className={styles["section-title"]}>お湯で溶いて、牛乳を注ぐだけ</h2>
            <p className={styles["body-copy"]}>
              熱を加えても香りが飛びにくいので、ラテはもちろん、お菓子にしてもほうじ茶の風味をしっかり楽しめます。まずは定番のほうじ茶ラテから。
            </p>

            <div className={styles["recipe-card"]}>
              <h3>ほうじ茶ラテの作り方</h3>
              <ul className={styles["recipe-ingredients"]}>
                <li>ほうじ茶パウダー 3g</li>
                <li>お湯 25〜30ml</li>
                <li>牛乳 160cc</li>
                <li>砂糖 小さじ1（お好みで）</li>
              </ul>
              <ol className={styles["recipe-steps"]}>
                <li>
                  <span className={styles["step-num"]}>1</span>
                  <span>ほうじ茶パウダーを少量のお湯でよく溶かします。</span>
                </li>
                <li>
                  <span className={styles["step-num"]}>2</span>
                  <span>温めた牛乳を注いだら完成です。お好みで砂糖やはちみつを加えても。</span>
                </li>
              </ol>
            </div>

            <div className={styles["uses-row"]}>
              <span className={styles["use-chip"]}>🍨 アイスクリームに</span>
              <span className={styles["use-chip"]}>🍮 ほうじ茶プリンに</span>
              <span className={styles["use-chip"]}>🧁 シフォンケーキ・クッキーに</span>
            </div>
          </div>
        </section>

        {WAVE_DIVIDER}

        {/* Story */}
        <section className={styles.story}>
          <div className={styles.constrain}>
            <span className={styles.kicker}>OUR ORIGIN</span>
            <h2 className={styles["section-title"]}>伊勢茶発祥の地、川俣谷から</h2>
            <p className={styles["body-copy"]}>
              川俣谷は、三重県松阪市飯南町に位置する伊勢茶発祥の地。三方を山に囲まれた谷地形が午後の日照を自然に遮り、茶葉が旨み成分をじっくりと蓄えます。旨み豊かな茶葉だからこそ、焙煎後も香ばしさと旨みが際立つほうじ茶に仕上がります。
            </p>
            <p className={styles["body-copy"]}>
              藤八茶寮の屋号は、明治の茶商人・高瀬藤八に由来します。松阪の自社茶園で育てた伊勢茶を携え、神戸の港からアメリカへの輸出航路を切り拓いた人物です。その茶園は今も川俣谷にあり、鎌倉時代から続くと伝わる茶づくりを、現代の技術とともに受け継いでいます。
            </p>
            <div className={styles["story-stats"]}>
              <div className={styles["story-stat"]}>
                <span className={styles.num}>160年+</span>
                <span className={styles.lbl}>川俣谷で続く茶園の歴史</span>
              </div>
              <div className={styles["story-stat"]}>
                <span className={styles.num}>一番茶100%</span>
                <span className={styles.lbl}>川俣谷産シングルオリジン</span>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison with matcha */}
        <section>
          <div className={styles.constrain}>
            <span className={styles.kicker}>TASTE PROFILE</span>
            <h2 className={styles["section-title"]}>ほうじ茶パウダーの特徴</h2>
            <p className={styles["body-copy"]}>
              藤八茶寮のパウダーは、太陽をたっぷり浴びて育つ煎茶をまるごと微粉末にしています。ほうじ茶パウダーはその煎茶を高温で焙じたもの。渋みや苦みが「芯」として残るぶん、温度が下がっても味の輪郭がぼやけにくいのが特徴です。
            </p>
            <table className={styles["compare-table"]}>
              <tbody>
                <tr>
                  <th className={styles.colhead} />
                  <th className={`${styles.colhead} ${styles.hl}`}>ほうじ茶パウダー</th>
                  <th className={styles.colhead}>抹茶</th>
                </tr>
                <tr>
                  <th className={styles.rowhead}>原料</th>
                  <td className={styles.hl}>煎茶を焙煎（露地栽培・一番茶）</td>
                  <td>碾茶（日光を遮って栽培）</td>
                </tr>
                <tr>
                  <th className={styles.rowhead}>味わい</th>
                  <td className={styles.hl}>香ばしさとほどよい渋み・コク</td>
                  <td>まろやかな甘み</td>
                </tr>
                <tr>
                  <th className={styles.rowhead}>冷めた時</th>
                  <td className={styles.hl}>渋み・苦みが芯となり輪郭が残る</td>
                  <td>甘みの印象がやわらぐ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {WAVE_DIVIDER}

        {/* Caffeine */}
        <section>
          <div className={styles.constrain}>
            <span className={styles.kicker}>CAFFEINE</span>
            <h2 className={styles["section-title"]}>ほうじ茶パウダーに含まれるカフェイン</h2>
            <p className={styles["body-copy"]}>ほうじ茶パウダーにもカフェインが含まれます。使用する粉末の量によって摂る量が変わるため、抽出したお茶の一般的な含有量を、そのまま本商品の値として扱うことはできません。</p>
          </div>
        </section>

        {/* Spec table */}
        <section>
          <div className={styles.constrain}>
            <span className={styles.kicker}>PRODUCT INFO</span>
            <h2 className={styles["section-title"]}>家庭用80g・業務用500gから選ぶ</h2>
            <div className={styles["feature-grid"]}>
              <div className={styles["feature-card"]}><div className={styles["feature-text"]}>
                <h3>家庭用80g</h3><p>ご自宅の無糖ほうじ茶ラテや、お菓子作りに少量ずつ使いたい方へ。</p>
                <p><a href="/ise-cha/roasted-isecha-powder-unsweetened/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>家庭用80g・無糖ほうじ茶パウダーの商品詳細</a></p>
              </div></div>
              <div className={styles["feature-card"]}><div className={styles["feature-text"]}>
                <h3>業務用・製菓用500g</h3><p>カフェのラテや製菓材料として、まとまった量を使いたい方へ。</p>
                <p><a href="/ise-cha/roasted-isecha-powder-unsweetened-bulkpack/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>業務用・製菓用500gの商品詳細</a></p>
                <p><a href="/wholesale/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>カフェ・製菓業者向けの卸売り相談</a></p>
              </div></div>
            </div>
            <p className={styles["body-copy"]}><a href="/ise-cha/houjicha/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>茶葉・ティーバッグも含めて伊勢茶のほうじ茶を選ぶ</a></p>
            <table className={styles["spec-table"]}>
              <tbody>
                <tr>
                  <th>種類</th>
                  <td>ほうじ茶パウダー（無糖）</td>
                </tr>
                <tr>
                  <th>産地</th>
                  <td>三重県松阪市飯南町産（伊勢茶100%使用）</td>
                </tr>
                <tr>
                  <th>原材料</th>
                  <td>緑茶（伊勢茶）</td>
                </tr>
                <tr>
                  <th>内容量</th>
                  <td>パウダー 80g／500g業務用（無糖）</td>
                </tr>
                <tr>
                  <th>フレーバー</th>
                  <td>芳醇な香りと甘み</td>
                </tr>
                <tr>
                  <th>賞味期限</th>
                  <td>製造から1年（開封後はお早めに）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {WAVE_DIVIDER}

        {/* FAQ */}
        <section>
          <div className={styles.constrain}>
            <span className={styles.kicker}>FAQ</span>
            <h2 className={styles["section-title"]}>よくある質問</h2>

            {FAQS.map((item) => (
              <details key={item.q} className={styles["faq-item"]}>
                <summary>
                  <span className={styles["faq-q"]}>
                    <span className={styles.qmark}>Q</span>
                    <span>{item.q}</span>
                  </span>
                  <svg className={styles["faq-chevron"]} viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className={styles["faq-a"]}>
                  <span className={styles.amark}>A</span>
                  <span>{item.a}</span>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className={styles["final-cta"]}>
          <div className={`${styles.constrain} ${styles["final-cta-row"]}`}>
            <div className={styles["final-cta-text"]}>
              <span className={styles.kicker}>ORDER</span>
              <h2>
                今日のティータイムに、
                <br />
                伊勢のほうじ茶パウダーを。
              </h2>
            </div>
            <div className={styles["buybox-flex"]}>
              <div className={styles.buybox}>
                <div className={styles["buybox-name"]}>
                  伊勢茶 ほうじ茶パウダー（無糖）
                  <span className={styles["buybox-sub"]}>三重県松阪市飯南町産 伊勢茶100%使用</span>
                </div>
                <RoastedPowderLpBuy products={purchaseProducts} />
                <p className={styles["buybox-note"]}>お買い上げ¥10,000以上で送料無料。配送は日本国内のみです。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className={styles.constrain}>
            <div className={styles.flogo}>藤八茶寮 / シングルオリジン伊勢茶 108teaworks</div>
            <div className={styles["flinks-row"]}>
              <span className={styles["flinks-text"]}>
                <a href="/legal/">特定商取引法に基づく表記</a>　<a href="/privacy-policy/">プライバシーポリシー</a>
              </span>
              <span className={styles["flinks-icons"]}>
                <a href="mailto:info@108teaworks.com" aria-label="メールでお問い合わせ" title="info@108teaworks.com">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3.5 6.5h17v11h-17z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M4 7l8 6.5L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="https://instagram.com/m/108teaworks" aria-label="Instagramでメッセージ" title="Instagram DM">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                  </svg>
                </a>
              </span>
            </div>
            <div className={styles.fcopy}>©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks</div>
          </div>
        </footer>
      </div>

      {/* Sticky bottom purchase bar */}
      <div className={styles["sticky-bar"]}>
        <div className={styles.constrain}>
          <RoastedPowderLpBuy products={purchaseProducts} />
        </div>
      </div>
    </div>
  );
}
