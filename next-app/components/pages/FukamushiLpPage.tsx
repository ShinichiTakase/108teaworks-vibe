import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { formatPriceYen, stripVariantSizeFromProductName } from "@/lib/formatters";
import { getProductBySlug } from "@/lib/microcms";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import FukamushiLpBuy from "./FukamushiLpBuy";
import styles from "./FukamushiLpPage.module.css";

/**
 * D:\藤八茶寮\緑茶LP\isecha_fukamushi_lp_1.html をベースにしたLP（/ise-cha/fukamushi-lp/）。
 * デザイン・レイアウトは元HTML/CSSの値をそのまま踏襲している。以下のみユーザー指示・技術的な理由による変更：
 * ・HERO画像は指定のPNG（lp_greentea_0.png）をWebP変換したファイルに差し替え
 * ・商品画像は指定の実ファイルに差し替え
 *   （3個入り: 3teabag-ise-deeproasted/1500.webp、10個入り: deep-steamed-isecha/1000.webp、
 *   　50個入り: ise-tea-deep-steamed-bulkpack/1000.webp）
 * ・商品グリッド内にあった「この商品を選ぶ」ボタンは削除（ユーザー指示。元HTMLの最新版では既に削除済み）。
 *   購入操作はページ下部の固定バーのみに一本化
 * ・「夏こそ美味しい、水出し・氷出しの淹れ方」の図版は指定の水出し.webpに差し替え
 * ・カテキン／カフェインの構造式図版は、ユーザー指示のファイル名と実際の画像内容が入れ替わっていたため、
 *   実際の分子構造に合わせて対応を補正して配置
 *   （カテキンの話 → catechin.webp、カフェインの話 → Caffeine_structure.webp）
 * ・固定バーの「購入する」ボタンは元HTMLでは商品ページへの単純なリンクだったが、他LPと同様に
 *   カートに追加してチェックアウト画面（/checkout）へ遷移するよう変更
 * ・価格・商品名はmicroCMSからライブ取得し、取得できない場合は元HTMLの値にフォールバックする
 */

const FAQS = [
  {
    q: "深蒸し茶と普通の煎茶はどう違いますか？",
    a: "蒸し時間が通常の2〜4倍と長いため、茶葉の組織が細かく壊れ、渋みが少なくまろやかな味わいになります。水色が濃い緑色になるのも深蒸し茶ならではの特徴です。",
  },
  {
    q: "水出しでも美味しく飲めますか？",
    a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くだけで、甘みの強い水出し茶が楽しめます。渋みが出にくいため、緑茶の渋みが苦手な方にもおすすめです。",
  },
  {
    q: "茶葉の産地や原材料について教えてください。",
    a: "三重県松阪市飯南町・川俣谷産の茶葉のみを使用したシングルオリジンです。他産地とのブレンドは行っておらず、添加物も使用していません。",
  },
  {
    q: "ギフトとして贈ることはできますか？",
    a: "可能です。ご購入手続きの画面で「金額記載の明細書は不要（ギフト用）」にチェックを入れていただくと、金額の分かる書類を同梱せずお届けします。",
  },
  {
    q: "送料や配送について教えてください。",
    a: "配送は日本国内のみとなります。送料は商品やご購入内容により異なり、一定金額以上のご購入で送料無料となる場合があります。詳細は各商品ページ・ご注文手続き画面にてご確認ください。",
  },
] as const;

const TRIAL_SLUG = "3teabag-ise-deeproasted";
const STANDARD_SLUG = "deep-steamed-isecha";
const BULK_SLUG = "ise-tea-deep-steamed-bulkpack";

const FALLBACKS = {
  [TRIAL_SLUG]: { title: "深蒸し茶 ティーバッグ 3個", price: 756 },
  [STANDARD_SLUG]: { title: "深蒸し茶 ティーバッグ 10個", price: 1188 },
  [BULK_SLUG]: { title: "お得用 深蒸し茶 ティーバッグ 50個", price: 5940 },
} as const;

export default async function FukamushiLpPage() {
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/fukamushi-lp/`;
  const leadDescription =
    "三重県松阪市・川俣谷産のシングルオリジン伊勢茶を使った深蒸し茶ティーバッグです。まろやかな旨みを水出し・氷出しでも楽しめます。お試し3個、日常用10個、業務用50個から用途に合わせて選べます。";

  const [trialProduct, standardProduct, bulkProduct] = await Promise.all([
    getProductBySlug(TRIAL_SLUG),
    getProductBySlug(STANDARD_SLUG),
    getProductBySlug(BULK_SLUG),
  ]);

  const trial = {
    slug: TRIAL_SLUG,
    title: trialProduct?.TITLE ?? FALLBACKS[TRIAL_SLUG].title,
    price: trialProduct?.PRICE ?? FALLBACKS[TRIAL_SLUG].price,
    imagePath: "/images/products/3teabag-ise-deeproasted/1500.webp",
    shipRank: trialProduct?.SHIP_RANK,
    toggleLabel: "お試し3個入り",
  };
  const standard = {
    slug: STANDARD_SLUG,
    title: standardProduct?.TITLE ?? FALLBACKS[STANDARD_SLUG].title,
    price: standardProduct?.PRICE ?? FALLBACKS[STANDARD_SLUG].price,
    imagePath: "/images/products/deep-steamed-isecha/1000.webp",
    shipRank: standardProduct?.SHIP_RANK,
    toggleLabel: "定番10個入り",
  };
  const bulk = {
    slug: BULK_SLUG,
    title: bulkProduct?.TITLE ?? FALLBACKS[BULK_SLUG].title,
    price: bulkProduct?.PRICE ?? FALLBACKS[BULK_SLUG].price,
    imagePath: "/images/products/ise-tea-deep-steamed-bulkpack/1000.webp",
    shipRank: bulkProduct?.SHIP_RANK,
    toggleLabel: "お得用50個入り",
  };

  const purchaseProducts = [trial, standard, bulk] as const;

  return (
    <div className={styles.page}>
      <ProductJsonLd
        name={stripVariantSizeFromProductName(standard.title)}
        description={leadDescription}
        imageUrl={standard.imagePath}
        canonicalUrl={canonicalUrl}
        offers={[
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: trial.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "3個入り",
          },
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: standard.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "10個入り",
          },
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: bulk.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "50個入り",
          },
        ]}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/fukamushi-lp", { productName: "深蒸し茶ティーバッグ" })}
      />

      {/* ---------- Top bar ---------- */}
      <div className={styles.topbar}>
        <div className={styles.wrap}>
          <div className={styles.brand}>
            藤八茶寮 <small>伊勢茶の直営専門店</small>
          </div>
        </div>
      </div>

      {/* ---------- HERO ---------- */}
      <header className={styles.hero}>
        <div className={styles["hero-media"]}>
          <picture>
            <img src="/images/fukamushi-lp/hero.webp" alt="氷を浮かべた深蒸し茶の水出しグラス" />
          </picture>
        </div>
        <div className={styles["hero-copy"]}>
          <span className={styles.tag}>三重県川俣谷産 シングルオリジン</span>
          <h1>深蒸し茶を水出し・氷出しで。まろやかな旨みを楽しむ淹れ方</h1>
          <p>
            暑い日のアイスでも味がぼやけない——それが藤八茶寮の深蒸し茶。長い蒸し時間でぎゅっと溶け出す旨みだから、水出しでも渋みが少なく、すっきり濃い一杯に仕上がります。
          </p>
        </div>
      </header>

      <div className={styles["intro-strip"]}>
        <div className={styles.wrap}>
          <p>この夏は、氷を入れても薄まらない一杯を。</p>
          <p>深蒸し製法だからこそ、水出し・氷出しでも旨みがしっかり残ります。</p>
        </div>
      </div>

      {/* ---------- Features ---------- */}
      <section className={styles.features}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>WHY FUJIHACHI</span>
          <h2>藤八茶寮の深蒸し茶が選ばれる理由</h2>
          <p className={styles["section-lead"]}>産地・製法・味わい、3つの視点でご紹介します</p>
          <div className={styles["feature-grid"]}>
            <div className={styles["feature-card"]}>
              <span className={styles.num}>01</span>
              <h3>渋みを抑える「深蒸し」製法</h3>
              <p>
                一般的な煎茶のおよそ2〜4倍の時間をかけて蒸すことで茶葉が細かくなり、お湯（や水）を注いだ瞬間に旨み成分がたっぷり溶け出します。渋みのもとになる成分が分解されるぶん、後味はまろやか。水色は鮮やかな濃い緑色に仕上がります。
              </p>
            </div>
            <div className={styles["feature-card"]}>
              <span className={styles.num}>02</span>
              <h3>伊勢茶発祥の地・川俣谷の一番茶</h3>
              <p>
                三重県松阪市飯南町・川俣谷の自家茶畑で育てた茶葉のみを使用したシングルオリジン。山に囲まれた谷の地形が午後の日差しを自然にやわらげ、旨み成分のテアニンをゆっくり蓄えてから収穫しています。
              </p>
            </div>
            <div className={styles["feature-card"]}>
              <span className={styles.num}>03</span>
              <h3>自分で淹れて楽しむ味わい</h3>
              <p>
                茶葉の量や抽出時間を調整しながら、好みの濃さを見つけられます。日々の一杯を、川俣谷の茶葉でお楽しみください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Cold brew ---------- */}
      <section>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>HOW TO ENJOY COLD</span>
          <h2>夏こそ美味しい、水出し・氷出しの淹れ方</h2>
          <p className={styles["section-lead"]}>深蒸し茶は粒子が細かいぶん、水出しでも短時間でしっかり抽出できます</p>
          <div className={styles["coldbrew-block"]}>
            <div className={styles["coldbrew-media"]}>
              <img src="/images/fukamushi-lp/coldbrew.webp" alt="深蒸し茶の水出し・氷出しの様子" />
            </div>
            <div className={styles["cold-banner"]}>
              <div>
                <h3>冷水500mlに、ティーバッグ1〜2個。</h3>
                <p>
                  冷蔵庫で30分〜1時間置くだけで、渋みが少なく甘みの強い水出し茶が完成します。氷をたっぷり入れたグラスに注げば、薄まりにくい濃厚な一杯に。麦茶感覚で作り置きしても◎（衛生上、抽出後は当日中にお召し上がりください）。
                </p>
              </div>
              <div className={styles["cold-steps"]}>
                <span>① 冷水500ml</span>
                <span>② ティーバッグ1〜2個</span>
                <span>③ 冷蔵30分〜1時間</span>
                <span>④ 氷を入れて完成</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Products（購入操作は下部固定バーに一本化。ここでは情報のみ） ---------- */}
      <section className={styles.products} id="products">
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>LINE UP</span>
          <h2>伊勢の深蒸し茶 ラインナップ</h2>
          <p className={styles["section-lead"]}>お試し3個・日常用10個・業務用50個から、使う場面に合う商品を選べます。</p>
          <div className={styles["product-grid"]}>
            <div className={`${styles["product-card"]} ${styles["is-reco"]}`}>
              <span className={styles["product-badge"]}>はじめての方に</span>
              <div className={styles["product-photo"]}>
                <img src={trial.imagePath} alt={trial.title} />
              </div>
              <div className={styles["product-body"]}>
                <h3>お試し3個・深蒸し茶ティーバッグ</h3>
                <p><a href="/ise-cha/3teabag-ise-deeproasted/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>お試し3個の商品詳細</a></p>
                <p className={styles["product-price"]}>
                  {formatPriceYen(trial.price)} <small>(税込)</small>
                </p>
                <p>まずは味わってみたい方向けのお試しサイズ。旅行や出張のお供、ちょっとした手土産にも重宝します。</p>
              </div>
            </div>

            <div className={`${styles["product-card"]} ${styles["is-reco"]}`}>
              <span className={styles["product-badge"]}>日常用10個</span>
              <div className={styles["product-photo"]}>
                <img src={standard.imagePath} alt={standard.title} />
              </div>
              <div className={styles["product-body"]}>
                <h3>日常用10個・深蒸し茶ティーバッグ</h3>
                <p><a href="/ise-cha/deep-steamed-isecha/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>日常用10個の商品詳細</a></p>
                <p className={styles["product-price"]}>
                  {formatPriceYen(standard.price)} <small>(税込)</small>
                </p>
                <p>ご自宅用の定番サイズ。とろりとしたコクを日常使いで。大切な方への贈り物としても選ばれています。</p>
              </div>
            </div>

            <div className={`${styles["product-card"]} ${styles["is-reco"]}`}>
              <span className={styles["product-badge"]}>業務用50個</span>
              <div className={styles["product-photo"]}>
                <img src={bulk.imagePath} alt={bulk.title} />
              </div>
              <div className={styles["product-body"]}>
                <h3>業務用50個・深蒸し茶ティーバッグ</h3>
                <p><a href="/ise-cha/ise-tea-deep-steamed-bulkpack/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>業務用50個の商品詳細</a></p>
                <p className={styles["product-price"]}>
                  {formatPriceYen(bulk.price)} <small>(税込)</small>
                </p>
                <p>飲食店やオフィスの給茶に使える業務用サイズ。ご家庭でのまとめ買いにも向いています。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Category guide ---------- */}
      <section className={styles.story}>
        <div className={styles.wrap}>
          <h2>川俣谷の深蒸し茶を、味わいから選ぶ</h2>
          <p>三重県松阪市飯南町・川俣谷のシングルオリジン伊勢茶。水出しではまろやかな旨みを、温かい一杯では立ち上る香りを楽しめます。</p>
          <p><a href="/ise-cha/fukamushi/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>深蒸し茶の製法・商品カテゴリーを見る</a></p>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={styles.faq}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>FAQ</span>
          <h2>よくあるご質問</h2>
          <p className={styles["section-lead"]}></p>

          {FAQS.map((item) => (
            <details key={item.q} className={styles["faq-item"]}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.brand}>藤八茶寮 / シングルオリジン伊勢茶 108teaworks</div>
          <div className={styles["footer-links"]}>
            <a href="https://108teaworks.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
              プライバシーポリシー
            </a>
            <a href="https://108teaworks.com/legal/" target="_blank" rel="noopener noreferrer">
              特定商取引法に基づく表記
            </a>
            <a href="mailto:info@108teaworks.com" aria-label="メールで問い合わせる" title="メール">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </a>
            <a
              href="https://ig.me/m/108teaworks/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagramでメッセージを送る"
              title="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
          <div className={styles.copyright}>©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks</div>
        </div>
      </footer>

      {/* ---------- Sticky bottom purchase bar ---------- */}
      <FukamushiLpBuy products={purchaseProducts} defaultIndex={1} />
    </div>
  );
}
