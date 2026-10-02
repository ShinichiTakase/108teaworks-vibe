import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { formatPriceYen, stripVariantSizeFromProductName } from "@/lib/formatters";
import { getProductBySlug } from "@/lib/microcms";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import FukamushiPowderLpBuy from "./FukamushiPowderLpBuy";
import styles from "./FukamushiPowderLpPage.module.css";

/**
 * D:\藤八茶寮\緑茶パウダーLP\深蒸し茶パウダーLP.htm をベースにしたLP（/ise-cha/fukamushi-powder-lp/）。
 * デザイン・レイアウトは元HTML/CSSの値をそのまま踏襲している。以下のみユーザー指示・技術的な理由による変更：
 * ・HERO画像は指定のPNG（lp_greentea_powder_0.png）をWebP変換したファイルに差し替え
 * ・商品画像は指定の実ファイル（100g.webp・500g.webp）に差し替え
 * ・「アイス／ホット 緑茶ラテ」カードの画像は指定の緑茶ラテ.webpに差し替え
 * ・元HTMLの「VOICE お客様の声」セクションは実在しないサンプルレビュー（星評価・日付つき）だったため、
 *   事実と異なる内容を掲載しないようセクションごと削除（ユーザー指示）
 * ・固定バーの「購入する」ボタンは元HTMLでは商品ページへの単純なリンクだったが、他LPと同様に
 *   カートに追加してチェックアウト画面（/checkout）へ遷移するよう変更
 * ・価格・商品名はmicroCMSからライブ取得し、取得できない場合は元HTMLの値にフォールバックする
 */

const FAQS = [
  {
    q: "抹茶とはどう違いますか？",
    a: "原料は深蒸し茶で、抹茶とは異なります。詳しい比較は、このページの「抹茶と緑茶パウダーの違いを詳しく見る」リンクからご覧ください。",
  },
  {
    q: "お菓子作りの分量の目安はありますか？",
    a: "クッキーやケーキの生地に混ぜ込む場合、薄力粉100gに対してパウダー小さじ2〜3杯が目安です。緑茶ラテは、パウダー3g・お湯25〜30ml・牛乳160cc・お好みで砂糖小さじ1でお作りいただけます。",
  },
  {
    q: "香料や着色料は使っていますか？",
    a: "使用しておりません。三重県産の伊勢茶一番茶のみを原料とし、香料・着色料・保存料は一切使用していない無糖・無添加のパウダーです。",
  },
  {
    q: "賞味期限と保存方法を教えてください。",
    a: "製造から1年が目安です。開封後は湿気と直射日光を避け、密閉容器に移し替えて早めにお召し上がりください。",
  },
  {
    q: "100gと500g、どちらを選べばよいですか？",
    a: "毎日のお茶やたまのお菓子作りには100gが、緑茶ラテやスイーツ作りを日常的に楽しみたい方・カフェや飲食店での業務用には500gがおすすめです。",
  },
] as const;

const SMALL_SLUG = "isecha-powder-unsweetened";
const BULK_SLUG = "ise-tea-powder-unsweetened-bulkpack";

const FALLBACKS = {
  [SMALL_SLUG]: { title: "伊勢茶 深蒸し茶パウダー 100g（無糖）", price: 1380 },
  [BULK_SLUG]: { title: "深蒸し茶パウダー 500g 業務用・製菓用", price: 7980 },
} as const;

const WAVE_DIVIDER = (
  <div className={styles.wave}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,32 C240,60 480,4 720,26 C960,48 1200,10 1440,30 L1440,60 L0,60 Z"
        fill="#fbf8ee"
      />
    </svg>
  </div>
);

export default async function FukamushiPowderLpPage() {
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/fukamushi-powder-lp/`;
  const leadDescription =
    "三重県産の伊勢茶一番茶を粉末にした、無糖・無添加の深蒸し茶パウダーです。原料は深蒸し茶で、抹茶とは異なります。緑茶ラテや製菓に使え、家庭用100gと業務用・製菓用500gから選べます。";

  const [smallProduct, bulkProduct] = await Promise.all([
    getProductBySlug(SMALL_SLUG),
    getProductBySlug(BULK_SLUG),
  ]);

  const small = {
    slug: SMALL_SLUG,
    title: smallProduct?.TITLE ?? FALLBACKS[SMALL_SLUG].title,
    price: smallProduct?.PRICE ?? FALLBACKS[SMALL_SLUG].price,
    imagePath: "/images/fukamushi-powder-lp/100g.webp",
    shipRank: smallProduct?.SHIP_RANK,
    selectLabel: "100g",
  };
  const bulk = {
    slug: BULK_SLUG,
    title: bulkProduct?.TITLE ?? FALLBACKS[BULK_SLUG].title,
    price: bulkProduct?.PRICE ?? FALLBACKS[BULK_SLUG].price,
    imagePath: "/images/fukamushi-powder-lp/500g.webp",
    shipRank: bulkProduct?.SHIP_RANK,
    selectLabel: "500g",
  };

  const purchaseProducts = [small, bulk] as const;
  const defaultVisibleProduct = small;

  return (
    <div className={styles.page}>
      <ProductJsonLd
        name={stripVariantSizeFromProductName(defaultVisibleProduct.title)}
        description={leadDescription}
        imageUrl={defaultVisibleProduct.imagePath}
        canonicalUrl={canonicalUrl}
        offers={[
          {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "JPY",
            price: small.price,
            itemCondition: "https://schema.org/NewCondition",
            name: "100g",
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
        items={getBreadcrumbItems("/ise-cha/fukamushi-powder-lp", { productName: "深蒸し茶パウダー" })}
      />

      <header className={styles["site-header"]}>
        <div className={styles.brand}>
          藤八茶寮
          <small>SINGLE ORIGIN ISE-CHA　伊勢茶の深蒸し茶パウダー</small>
        </div>
      </header>

      <main>
        {/* ---------- HERO ---------- */}
        <section className={styles.hero}>
          <div className={styles["hero-media"]}>
            <img src="/images/fukamushi-powder-lp/hero.webp" alt="緑茶パウダーで作ったホット・アイスの緑茶ラテ" />
          </div>
          <div className={styles["hero-copy"]}>
            <p className={styles["hero-eyebrow"]}>三重県産 伊勢茶 一番茶100%</p>
            <ul className={styles["hero-draws"]}>
              <li>アイス緑茶ラテに、</li>
              <li>バニラアイスのトッピングに、</li>
              <li>お菓子作りの生地に、混ぜるだけ。</li>
            </ul>
          </div>
          <div className={`${styles["hero-below"]} ${styles["grain-bg"]}`}>
            <h1>無糖の深蒸し茶パウダーで、緑茶ラテとお菓子作り</h1>
            <span className={styles["hero-sub"]}>無糖・無添加。800メッシュの微粉末で、お茶をまるごと。</span>
            <ul className={styles["hero-tags"]}>
              <li>香料・着色料不使用</li>
              <li>保存料不使用</li>
              <li>800メッシュの細かさ</li>
            </ul>
          </div>
          {WAVE_DIVIDER}
        </section>

        {/* ---------- Intro ---------- */}
        <section className={styles.intro}>
          <div className={styles.wrap}>
            <p>
              <strong>深蒸し茶のコクを、ラテやお菓子作りに。</strong>
              <br />
              三重県松阪市飯南町・川俣谷の伊勢茶を、深蒸し製法で仕上げて粉末にしました。砂糖を加えていない緑茶パウダーなので、ラテの甘さはお好みで調整できます。飲み物だけでなく、製菓や料理の風味づけにも使えます。
            </p>
          </div>
        </section>

        {/* ---------- 茶種と製法の案内 ---------- */}
        <section className={`${styles.fukamushi} ${styles["grain-bg"]}`}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>ABOUT 深蒸し茶パウダー</span>
            <h2 className={styles["section-title"]}>深蒸し茶ならではのコクを、粉末で</h2>
            <p className={styles["section-lead"]}>川俣谷産シングルオリジン伊勢茶を深蒸しに仕上げ、細かな粉末にしています。味わいを活かして、ラテや焼き菓子にお使いいただけます。</p>
            <p>原料は深蒸し茶で、抹茶とは異なります。</p>
            <p><a href="/ise-cha/maccha/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>抹茶と緑茶パウダーの違いを詳しく見る</a></p>
            <p><a href="/ise-cha/fukamushi/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>深蒸し茶の製法・商品カテゴリーを見る</a></p>
          </div>
        </section>

        {/* ---------- 使い方 ---------- */}
        <section className={styles.usage}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>USAGE 使い方</span>
            <h2 className={styles["section-title"]}>
              飲んで、のせて、混ぜ込んで。
              <br />
              3つの楽しみ方
            </h2>
            <p className={styles["section-lead"]}>
              深蒸し茶パウダーは、お茶として飲むだけでなく、お菓子作りや料理にも幅広く活用できます。
            </p>

            <div className={styles["usage-list"]}>
              <div className={`${styles["usage-card"]} ${styles["has-img"]}`}>
                <div className={styles["usage-media"]}>
                  <img src="/images/fukamushi-powder-lp/matcha-latte.webp" alt="緑茶パウダーで作ったホット・アイスの緑茶ラテ" />
                </div>
                <div className={styles["usage-body"]}>
                  <span className={styles["usage-tag"]}>DRINK</span>
                  <h3>アイス／ホット 緑茶ラテ</h3>
                  <p>牛乳や豆乳と合わせるだけで、なめらかな緑茶ラテに。800メッシュの細かさだから、口の中でざらつきを感じにくいのが自慢です。</p>
                  <div className={styles["recipe-box"]}>
                    <b>緑茶ラテの作り方</b>
                    緑茶パウダー3g＋お湯25〜30mlでよく溶き、温めた牛乳160ccを注ぐ。お好みで砂糖小さじ1をプラス。
                  </div>
                </div>
              </div>

              <div className={styles["usage-card"]}>
                <div className={styles["usage-body"]}>
                  <span className={styles["usage-tag"]}>DESSERT</span>
                  <h3>バニラアイス・スイーツのトッピングに</h3>
                  <p>
                    抹茶は温度が下がると甘みの魅力が薄れがちですが、深蒸し茶パウダーは香りと飲みごたえが「芯」として残るため、冷たいアイスにかけても味の輪郭がぼやけません。アイスの甘さに負けない、豊かなコクと香りが広がります。
                  </p>
                </div>
              </div>

              <div className={styles["usage-card"]}>
                <div className={styles["usage-body"]}>
                  <span className={styles["usage-tag"]}>BAKING</span>
                  <h3>クッキー・パン生地・お料理にも</h3>
                  <p>
                    抹茶のような鮮やかな緑と力強いコクで、クッキーやパン生地への練り込みに最適。目安は薄力粉100gに対してパウダー小さじ2〜3杯。抹茶塩の代わりに天ぷらへ、焼酎の緑茶割りにも幅広く活用できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- こだわり ---------- */}
        <section className={styles.features}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>POINT こだわり</span>
            <h2 className={styles["section-title"]}>選ばれる、3つの理由</h2>
            <div className={styles["feat-grid"]}>
              <div className={styles["feat-card"]}>
                <div className={styles.ico} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 12h8M8 9h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>800メッシュの細かさ</h3>
                <p>牛乳や豆乳と合わせてラテにするのはもちろん、お水やお湯で溶くだけでもなめらか。口当たりのざらつきを抑えました。</p>
              </div>
              <div className={styles["feat-card"]}>
                <div className={styles.ico} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l7 4v5c0 5-3.2 8-7 9-3.8-1-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>原材料は伊勢茶</h3>
                <p>香料・着色料・保存料は一切不使用。伊勢茶そのものの風味を、飲み物やお菓子作りに取り入れられます。</p>
              </div>
              <div className={styles["feat-card"]}>
                <div className={styles.ico} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>手間いらず、ゴミもなし</h3>
                <p>お湯や水にさっと溶かすだけ。急須を使わず、茶殻の片付けも不要です。忙しい朝やオフィスでの一杯にも。</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 商品ラインナップ（購入操作は下部固定バーに一本化。ここでは情報のみ） ---------- */}
        <section className={styles.products} id="products">
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>LINEUP 商品ラインナップ</span>
            <h2 className={styles["section-title"]}>ご家庭用から業務用まで</h2>
            <div className={styles["prod-grid"]}>
              <div className={styles["prod-card"]}>
                <div className={styles["prod-media"]}>
                  <img src={small.imagePath} alt={small.title} />
                </div>
                <div className={styles["prod-body"]}>
                  <span className={styles["prod-badge"]}>家庭用100g</span>
                  <h3>伊勢茶 深蒸し茶パウダー 100g（無糖）</h3>
                  <p>ご自宅の緑茶ラテやお菓子作りに、少量ずつ使いやすい家庭用。</p>
                  <p><a href="/ise-cha/isecha-powder-unsweetened/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>家庭用100g・無糖緑茶パウダーの商品詳細</a></p>
                  <p className={styles["prod-price"]}>
                    {formatPriceYen(small.price)}
                    <small>税込</small>
                  </p>
                  <ul className={styles["prod-specs"]}>
                    <li>
                      <span>種類</span>
                      <b>深蒸し茶</b>
                    </li>
                    <li>
                      <span>産地</span>
                      <b>三重県産（伊勢茶100%）</b>
                    </li>
                    <li>
                      <span>内容量</span>
                      <b>パウダー100g（無糖）</b>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={styles["prod-card"]}>
                <div className={styles["prod-media"]}>
                  <img src={bulk.imagePath} alt={bulk.title} />
                </div>
                <div className={styles["prod-body"]}>
                  <span className={styles["prod-badge"]}>業務用・製菓用500g</span>
                  <h3>深蒸し茶パウダー 500g 業務用・製菓用</h3>
                  <p>カフェのラテや製菓材料として、まとまった量を使う方へ。</p>
                  <p><a href="/ise-cha/ise-tea-powder-unsweetened-bulkpack/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>業務用・製菓用500gの商品詳細</a></p>
                  <p><a href="/wholesale/" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>カフェ・製菓業者向けの卸売り相談</a></p>
                  <p className={styles["prod-price"]}>
                    {formatPriceYen(bulk.price)}
                    <small>税込</small>
                  </p>
                  <ul className={styles["prod-specs"]}>
                    <li>
                      <span>種類</span>
                      <b>深蒸し茶</b>
                    </li>
                    <li>
                      <span>産地</span>
                      <b>三重県産（伊勢茶100%）</b>
                    </li>
                    <li>
                      <span>内容量</span>
                      <b>パウダー500g（無糖）</b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className={styles.faq}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>FAQ よくある質問</span>
            <h2 className={styles["section-title"]}>ご購入前によくいただくご質問</h2>
            <div className={styles["faq-list"]}>
              {FAQS.map((item) => (
                <details key={item.q} className={styles["faq-item"]}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles["footer-links"]}>
            <span className={styles["legal-links"]}>
              <a href="https://108teaworks.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </a>
              <a href="https://108teaworks.com/legal/" target="_blank" rel="noopener noreferrer">
                特定商取引法に基づく表記
              </a>
            </span>
            <span className={styles["footer-divider"]} aria-hidden="true"></span>
            <span className={styles["footer-icons"]}>
              <a href="mailto:info@108teaworks.com" aria-label="メールで問い合わせる">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2 0l7 6 7-6"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="https://ig.me/m/108teaworks/" target="_blank" rel="noopener noreferrer" aria-label="Instagramでメッセージを送る">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" fill="none" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" strokeWidth="1.7" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
              </a>
            </span>
          </div>
          <p className={styles["footer-copy"]}>©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks</p>
        </div>
      </footer>

      {/* ---------- Sticky bottom purchase bar ---------- */}
      <FukamushiPowderLpBuy products={purchaseProducts} defaultIndex={0} />
    </div>
  );
}
