import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { formatPriceYen } from "@/lib/formatters";
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
    a: "原料と製法が異なります。抹茶の原料は遮光栽培した「碾茶」、当店のパウダーは露地栽培の「煎茶」をまるごと微粉末にしたもの。特殊製法で抹茶と同程度の細かさに仕上げており、冷めても味の輪郭がぼやけないのが特徴です。",
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
    "三重県産の伊勢茶一番茶を丸ごと粉末にした深蒸し茶パウダー。無糖・無添加、800メッシュの微粉末で緑茶ラテやお菓子作りにも。100g・500g業務用をご用意。";

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
        name={defaultVisibleProduct.title}
        description={leadDescription}
        imageUrl={defaultVisibleProduct.imagePath}
        canonicalUrl={canonicalUrl}
        price={defaultVisibleProduct.price}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/fukamushi-powder-lp", "ja", { productName: "深蒸し茶パウダー" })}
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
            <h1>伊勢茶 深蒸し茶パウダー</h1>
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
              <strong>急須では引き出せない栄養まで、まるごと一杯に。</strong>
              <br />
              お茶処・三重県で育った伊勢茶の一番茶を、贅沢にそのまま粉末にしました。急須で淹れるお茶では茶葉に残ってしまう栄養成分が約70％とも言われますが、この深蒸し茶パウダーならカテキン・ビタミン・食物繊維を100％まるごと取り入れられます。水にもお湯にも牛乳にもさっと溶けて、飲むだけでなくお菓子作りや料理にも幅広く活躍します。
            </p>
          </div>
        </section>

        {/* ---------- 深蒸し茶とは ---------- */}
        <section className={`${styles.fukamushi} ${styles["grain-bg"]}`}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>ABOUT 深蒸し茶</span>
            <h2 className={styles["section-title"]}>
              長く蒸すから、渋くならない。
              <br />
              深蒸し茶がまろやかな理由
            </h2>
            <p className={styles["section-lead"]}>
              「深蒸し茶」とは、緑茶づくりの「蒸し」の工程を通常の2〜4倍じっくりとかけたお茶。長い蒸し時間が茶葉の細胞壁を壊し、渋みのもとになる成分を細かく分解します。渋みが抑えられ、まろやかで濃厚な旨みが前面に出るのが特徴です。
            </p>
            <div className={styles["fuka-grid"]}>
              <div className={styles["fuka-card"]}>
                <p className={styles.num}>
                  30〜40<span>秒</span>
                </p>
                <p>普通の煎茶の蒸し時間の目安</p>
              </div>
              <div className={styles["fuka-card"]}>
                <p className={styles.num}>
                  60〜180<span>秒</span>
                </p>
                <p>藤八茶寮の深蒸し茶。じっくり蒸すことで渋みの成分を分解</p>
              </div>
              <div className={styles["fuka-card"]}>
                <p className={styles.num}>
                  800<span>メッシュ</span>
                </p>
                <p>パウダーの細かさ。ざらつきを感じにくく、なめらかに溶けます</p>
              </div>
            </div>
            <div className={styles["fuka-body"]}>
              <p>
                三重県は静岡・鹿児島に次ぐ、日本有数のお茶の産地。中でも山あいの茶園で育つ伊勢茶は、山に囲まれた地形が午後の日照をやわらげ、茶葉が旨み成分・テアニンをじっくり蓄えてから収穫されます。その茶葉を深蒸し製法でさらに凝縮させたのが、藤八茶寮の深蒸し茶パウダーです。
              </p>
              <p>他産地の茶葉とブレンドしない「シングルオリジン」だから、産地の個性をそのままに、お茶本来の力強いコクと鮮やかな緑色を味わっていただけます。</p>
            </div>
          </div>
        </section>

        {/* ---------- 抹茶との違い ---------- */}
        <section className={styles.vsmatcha}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>抹茶と、何が違う？</span>
            <h2 className={styles["section-title"]}>
              抹茶ではなく、
              <br />
              「パウダー緑茶」を選ぶ理由
            </h2>
            <p className={styles["section-lead"]}>
              藤八茶寮では抹茶ではなく、煎茶をまるごと微粉末にした「パウダー緑茶」をご用意しています。原料も製法も異なる、それぞれの個性です。
            </p>
            <div className={styles["cmp-table"]}>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}></div>
                <div className={styles["cmp-cell"]}>抹茶</div>
                <div className={styles["cmp-cell"]}>深蒸し茶パウダー</div>
              </div>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}>原料</div>
                <div className={styles["cmp-cell"]}>碾茶（てんちゃ）</div>
                <div className={styles["cmp-cell"]}>煎茶（せんちゃ）</div>
              </div>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}>栽培</div>
                <div className={styles["cmp-cell"]}>収穫前に約1ヶ月遮光</div>
                <div className={styles["cmp-cell"]}>太陽をたっぷり浴びる露地栽培</div>
              </div>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}>細かさ</div>
                <div className={styles["cmp-cell"]}>約15〜20ミクロン</div>
                <div className={styles["cmp-cell"]}>特殊製法で抹茶と同程度に微粉末化</div>
              </div>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}>冷めても</div>
                <div className={styles["cmp-cell"]}>繊細な甘みが弱まりやすい</div>
                <div className={styles["cmp-cell"]}>香りと飲みごたえが芯として残り、コクが持続</div>
              </div>
              <div className={styles["cmp-row"]}>
                <div className={styles["cmp-label"]}>向いてる場面</div>
                <div className={styles["cmp-cell"]}>温かい一服、繊細な甘さを楽しむ茶席</div>
                <div className={styles["cmp-cell"]}>アイスラテ、デザートのトッピング、焼き菓子</div>
              </div>
            </div>
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
                <h3>安心の「純・伊勢茶」</h3>
                <p>香料・着色料・保存料は一切不使用。小さなお子様から健康を意識される方まで、安心してお召し上がりいただけます。</p>
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
                  <span className={styles["prod-badge"]}>ご家庭用</span>
                  <h3>伊勢茶 深蒸し茶パウダー 100g（無糖）</h3>
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
                  <span className={styles["prod-badge"]}>業務用・まとめ買い</span>
                  <h3>深蒸し茶パウダー 500g 業務用・製菓用</h3>
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
