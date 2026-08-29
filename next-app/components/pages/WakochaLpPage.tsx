import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { formatPriceYen } from "@/lib/formatters";
import { decodeHtmlEntities, getProductBySlug } from "@/lib/microcms";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import WakochaLpFaq from "./WakochaLpFaq";
import WakochaLpStickyBar from "./WakochaLpStickyBar";
import styles from "./WakochaLpPage.module.css";

/**
 * D:\藤八茶寮\和紅茶LP\wakoucha_landing_page.html をベースにしたLP。
 * デザイン・レイアウトは元HTML/CSSの値を踏襲しつつ、以下はユーザー指示により変更している。
 * ・ヒーロー画像に重ねていた文字/ボタンをコントラスト改善のため別要素（.hero-content）に分離
 * ・元HTMLのpackage.jpg/icedtea.jpg（不要なUI断片が写り込んでいた埋め込み画像）を廃止し、
 *   実商品画像2点・実商品説明文（microCMS）に置き換え
 * ・価格はmicroCMSからライブ取得
 * ・「川俣谷」表記は「飯南町」に統一
 */

const FAQS = [
  {
    q: "和紅茶と外国産の紅茶はどう違いますか？",
    a: "和紅茶は日本の緑茶品種を完全発酵させた国産紅茶です。インド・スリランカ産の紅茶に比べてタンニンが少なく、渋みの少ないやさしい味わいが特徴です。",
  },
  {
    q: "ミルクティーにできますか？",
    a: "渋みが少なく繊細な風味のため、実はミルクとの相性はひかえめです。まずはストレートでお試しいただくのが一番のおすすめ。ミルクティーにする場合は、いつもより濃いめに抽出してから温めた牛乳を加えると、香りと旨味が負けにくくなります。",
  },
  {
    q: "カフェインは含まれますか？",
    a: "100mlあたり約17mgと、一般的な緑茶とほぼ同程度です。就寝前は摂取を控えめにすることをおすすめします。",
  },
  {
    q: "アイスティーにできますか？",
    a: "可能です。熱めのお湯で濃いめに抽出したものを、氷を入れたグラスへ注ぐだけで美しいアンバー色のアイスティーになります。",
  },
  {
    q: "賞味期限はどのくらいですか？",
    a: "未開封では、冷蔵・冷凍保存で約一年お召し上がりいただけます。開封前は必ず常温に戻してから封を開け、結露による劣化を防いでください。開封後は2週間〜1ヶ月を目安に飲み切っていただくのがおすすめです。",
  },
] as const;

/** 「川俣谷」表記をユーザー指示に沿って「飯南町」表記へ統一する */
function normalizePlaceNames(text: string): string {
  return text
    .replace(/三重県松阪市飯南町・川俣谷産/g, "三重県松阪市飯南町産")
    .replace(/三重県松阪市・川俣谷/g, "松阪市飯南町")
    .replace(/川俣谷/g, "飯南町");
}

export default async function WakochaLpPage() {
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/wakocha-lp/`;
  const leadDescription =
    "ふわっと紅茶の香りが鼻に抜けたあと、緑茶ゆずりの旨味とコクが広がる和紅茶。渋みが少なく繊細なので、まずはストレートで。ティータイムはもちろん、和食にもよく合います。";

  const [product8, product3] = await Promise.all([
    getProductBySlug("wakocha-isecha"),
    getProductBySlug("3teabag-ise-wakocha"),
  ]);

  const title8 = product8?.TITLE ?? "和紅茶 ティーバッグ 8個";
  const title3 = product3?.TITLE ?? "和紅茶 ティーバッグ 3個";
  const price8 = product8?.PRICE;
  const price3 = product3?.PRICE;
  const productPrices = [price3, price8].filter((price): price is number => typeof price === "number");
  const defaultVisibleProduct = product8 ?? product3;
  const defaultVisiblePrice = defaultVisibleProduct?.PRICE ?? 1380;
  const minPrice = productPrices.length > 0 ? Math.min(...productPrices) : defaultVisiblePrice;
  const maxPrice = productPrices.length > 0 ? Math.max(...productPrices) : defaultVisiblePrice;
  const lowPrice = price3 ?? price8 ?? defaultVisiblePrice;
  const highPrice = price8 ?? price3 ?? defaultVisiblePrice;

  const spotDescriptionHtml = product8?.DESCRIPTION01
    ? normalizePlaceNames(sanitizeRichHtml(decodeHtmlEntities(product8.DESCRIPTION01)))
    : "";

  const purchaseProducts = [
    {
      slug: "3teabag-ise-wakocha",
      title: title3,
      price: price3,
      imagePath: "/images/products/3teabag-ise-wakocha/1500.webp",
      shipRank: product3?.SHIP_RANK,
      bagLabel: "お試し3個入り",
    },
    {
      slug: "wakocha-isecha",
      title: title8,
      price: price8,
      imagePath: "/images/products/wakocha-isecha/1000.webp",
      shipRank: product8?.SHIP_RANK,
      bagLabel: "お得な8個入り",
    },
  ] as const;

  return (
    <div className={styles.page}>
      {/* 元HTMLと同じGoogle Fontsをそのまま読み込む */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      <ProductJsonLd
        name={title8}
        description={leadDescription}
        imageUrl="/images/products/wakocha-isecha/1000.webp"
        canonicalUrl={canonicalUrl}
        offers={{
          "@type": "AggregateOffer",
          priceCurrency: "JPY",
          lowPrice,
          highPrice,
          offerCount: 2,
          availability: "https://schema.org/InStock",
        }}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/wakocha-lp", "ja", { productName: "和紅茶 ティーバッグ" })}
      />

      <div className={styles.topbar}>
        <div className={styles.wrap}>
          <span>シングルオリジン伊勢茶・お茶の魅力を三重から世界へ</span>
          <span>配送は日本国内のみです</span>
        </div>
      </div>

      <header className={styles.brand}>
        <div className={styles.wrap}>
          <div className={styles.logo}>
            <span className={styles.en}>TOHACHI TEAWORKS — JAPAN TEA</span>
            <span className={styles.jp}>藤八茶寮</span>
          </div>
        </div>
      </header>

      {/* ---------- HERO（画像 + オーバーレイのテキスト/ボタン） ---------- */}
      <section className={styles.hero}>
        <img src="/images/wakoucha/hero.webp" alt="焼き菓子と紅茶のアフタヌーンティー" />
        <div className={styles["hero-content"]}>
          <h1>
            お菓子にも、お食事にも。
            <br />
            毎日の食卓に寄り添う、国産和紅茶。
            <em>シングルオリジンの伊勢茶、完全発酵させた国産紅茶</em>
          </h1>
          <p className={styles.sub}>
            ふわっと紅茶の香りが鼻に抜けたあと、緑茶ゆずりの旨味とコクが広がる和紅茶。渋みが少なく繊細な味わいなので、まずはストレートでどうぞ。
          </p>
          <div className={styles["hero-ctas"]}>
            <a href="#story" className={`${styles.btn} ${styles["btn-primary"]}`}>
              商品を見る
            </a>
            <a href="#order" className={`${styles.btn} ${styles["btn-outline"]}`}>
              和紅茶について知る
            </a>
          </div>
        </div>
      </section>

      {/* ---------- INTRO / STORY ---------- */}
      <section className={styles.intro} id="story">
        <div className={`${styles.wrap} ${styles["intro-grid"]}`}>
          <div className={styles["intro-copy"]}>
            <span className={styles.eyebrow}>Ise Tea, Fully Fermented</span>
            <p className={styles.lead}>
              同じ茶葉から、まったく違う一杯が生まれる。
              <br />
              それが、和紅茶という愉しみ方です。
            </p>
            <p>
              紅茶といえばインドやスリランカを思い浮かべる方が多いかもしれません。けれど和紅茶は、日本の緑茶品種の茶葉を完全発酵させてつくる、れっきとした国産紅茶。松阪市飯南町の自家茶園で丁寧に育てたシングルオリジン伊勢茶を使い、藤八茶寮ならではの繊細な一杯に仕上げました。
            </p>
            <p>
              インドやスリランカのセイロン種に比べ、日本の緑茶品種はタンニンが少なく、完全発酵させても渋みが出にくいのが特徴。口に含むとまずふわっと紅茶らしい香りが鼻に抜け、そのあとから緑茶ゆずりの旨味とコクがじんわりと広がります。この繊細な味わいはミルクに負けやすいため、まずはストレートでお楽しみいただくのが一番のおすすめです。
            </p>
            <p>
              洋菓子とのアフタヌーンティーはもちろん、緑茶に通じる旨味とコクがあるからこそ、焼き魚や煮物といった和食とも好相性。ティータイムだけでなく、食中茶としても愉しんでいただけます。
            </p>
            <p>明治時代から160年続く飯南町の茶畑。山に囲まれた谷地形と清らかな水が育む茶葉は、この土地でしか生まれない個性を持っています。</p>
          </div>
          <div className={styles["intro-photo"]}>
            <div className={styles.cap}>幕末から続く松阪市飯南町の茶園から、シングルオリジンでお届け</div>
            <div className={styles["intro-photo-grid"]}>
              <div>
                <img src="/images/products/wakocha-isecha/1000.webp" alt={title8} />
                <p className={styles["intro-photo-name"]}>{title8}</p>
              </div>
              <div>
                <img src="/images/products/3teabag-ise-wakocha/1500.webp" alt={title3} />
                <p className={styles["intro-photo-name"]}>{title3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY POPULAR ---------- */}
      <section className={`${styles.why} ${styles.tight}`}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.eyebrow}>なぜ、選ばれるのか</span>
            <h2>毎日飲みたくなる、4つの理由</h2>
            <p>渋みを抑えたやさしい味わいだから、お菓子にも、お食事にも自然に寄り添います。</p>
          </div>
        </div>
        <div className={styles["why-grid"]}>
          <div className={styles["why-card"]}>
            <div className={styles.ico}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 8h13a3 3 0 0 1 0 6h-1" />
                <path d="M4 8v8a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V8" />
                <path d="M8 3c0 1.5-1.5 1.5-1.5 3M12 3c0 1.5-1.5 1.5-1.5 3" />
              </svg>
            </div>
            <h3>渋みが少なく上品な甘み</h3>
            <p>日本の緑茶品種はタンニンが少なく、完全発酵させても渋みが出にくいのが持ち味です。</p>
          </div>
          <div className={styles["why-card"]}>
            <div className={styles.ico}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3c-3 3-3 6 0 9s3 6 0 9M8 6c-2 2-2 4 0 6M16 12c2 2 2 4 0 6" />
              </svg>
            </div>
            <h3>香りの奥に、緑茶の旨味とコク</h3>
            <p>アミノ酸が豊富な茶葉が発酵する過程で華やかな香りが引き立ち、そのあとに緑茶ゆずりの旨味とコクがじんわり広がります。</p>
          </div>
          <div className={styles["why-card"]}>
            <div className={styles.ico}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>
            <h3>ティーバッグでいつでも本格派</h3>
            <p>お湯を注いで2〜3分。ホテルのような一杯を、おうちの時間に合わせて手軽に。</p>
          </div>
          <div className={styles["why-card"]}>
            <div className={styles.ico}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
              </svg>
            </div>
            <h3>洋菓子にも和食にも合う懐の深さ</h3>
            <p>渋みが少なく旨味とコクがあるからこそ、スコーンなどの洋菓子はもちろん、焼き魚や煮物といった和食の味わいも引き立てます。</p>
          </div>
        </div>
      </section>

      {/* ---------- 3-TIER STAND / HOW TO ENJOY ---------- */}
      <section className={styles.stand}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.eyebrow}>How to Enjoy</span>
            <h2>気分に合わせて楽しむ、3つの飲み方</h2>
            <p>まずはストレートで、香りと旨味・コクを。アフタヌーンティースタンドの一段一段のように、気分や時間帯で愉しみ方を変えられます。</p>
          </div>
          <div className={styles.tier}>
            <div className={`${styles["tier-plate"]} ${styles.top}`}>
              <span className={styles["tier-num"]}>TOP · ストレートティー（一番のおすすめ）</span>
              <h3>茶葉そのものを味わう</h3>
              <div className={styles.temp}>お湯 90〜95℃／2〜3分</div>
              <p>緑茶より長めに蒸らして、ふわっと香る紅茶の余韻のあとに広がる、緑茶ゆずりの旨味とコクをそのまま楽しみます。</p>
            </div>
            <div className={`${styles["tier-plate"]} ${styles.mid}`}>
              <span className={styles["tier-num"]}>MIDDLE · ミルクティー</span>
              <h3>試すなら、いつもより濃いめに</h3>
              <div className={styles.temp}>蒸らし3〜4分／温めた牛乳を加える</div>
              <p>渋みが少なく繊細な風味の分、ミルクにはやや負けやすいのが和紅茶。試す場合はしっかり濃いめに淹れると、香りと旨味が引き立ちます。</p>
            </div>
            <div className={`${styles["tier-plate"]} ${styles.base}`}>
              <span className={styles["tier-num"]}>BASE · アイスティー</span>
              <h3>熱めに淹れて、氷の上へ</h3>
              <div className={styles.temp}>熱湯で濃いめに抽出</div>
              <p>氷の上にそのまま注ぐだけ。美しいアンバー色のアイスティーに仕上がります。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT SPOTLIGHT ---------- */}
      <section className={styles.spotlight} id="order">
        <div className={`${styles.wrap} ${styles["spot-grid"]}`}>
          <div className={styles["spot-photo"]}>
            {spotDescriptionHtml ? (
              <div className={styles["spot-text"]} dangerouslySetInnerHTML={{ __html: spotDescriptionHtml }} />
            ) : (
              <div className={styles["spot-text"]}>
                <p>
                  三重県の山間で丁寧に育てられた伊勢茶を100%使用した国産和紅茶のティーバッグです。ふわっと香る紅茶の余韻のあとに緑茶ゆずりの旨味とコクが広がり、ストレートはもちろん、洋菓子にも和食にも合わせやすい一杯です。
                </p>
              </div>
            )}
            <div className={styles["spot-price-tag"]}>
              <small>税込</small>
              <strong>{formatPriceYen(minPrice)}〜</strong>
            </div>
          </div>
          <div>
            <span className={styles.eyebrow}>Product</span>
            <h2 style={{ fontSize: "clamp(22px,2.8vw,30px)", margin: "16px 0 18px", fontWeight: 700 }}>
              伊勢 和紅茶 ティーバッグ
            </h2>
            <p style={{ color: "var(--ink-soft)", fontSize: "14.5px", margin: "0 0 8px" }}>
              三重県産100%・飯南町シングルオリジン。渋みなく、やさしい甘みの国産紅茶を、3個入りのお試しサイズから。
            </p>
            <table className={styles["spec-table"]}>
              <tbody>
                <tr>
                  <th>種類</th>
                  <td>和紅茶（完全発酵茶）</td>
                </tr>
                <tr>
                  <th>産地</th>
                  <td>三重県松阪市飯南町産（伊勢茶100%使用）</td>
                </tr>
                <tr>
                  <th>原材料</th>
                  <td>紅茶（伊勢茶）</td>
                </tr>
                <tr>
                  <th>カフェイン</th>
                  <td>100mlあたり約17mg（緑茶とほぼ同程度）</td>
                </tr>
                <tr>
                  <th>内容量</th>
                  <td>ティーバッグ3個／8個</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- QUOTE STRIP ---------- */}
      <div className={styles["quote-strip"]}>
        <div className={styles.wrap}>
          <blockquote>
            「渋くないから、お菓子の甘さを邪魔しません。気づけば、おやつの時間に欠かせない一杯になっています。」
          </blockquote>
          <cite>和紅茶のある暮らしを楽しむお客様の声より</cite>
        </div>
      </div>

      {/* ---------- FAQ ---------- */}
      <section className={styles.faq}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.eyebrow}>よくある質問</span>
            <h2>ご注文の前に</h2>
          </div>
          <WakochaLpFaq items={FAQS} />
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className={styles["final-cta"]}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow} style={{ color: "#f2d9ad" }}>
            Start Your Afternoon Tea
          </span>
          <h2>今日の午後を、ちょっと特別に。</h2>
          <p>お気に入りの焼き菓子と一緒に。まずは3個入りのお試しサイズから、和紅茶のある暮らしを始めてみませんか。</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div>
            <div className={styles.logo} style={{ color: "#f4ead2" }}>
              <span className={styles.en} style={{ color: "var(--gold-soft)" }}>
                TOHACHI TEAWORKS
              </span>
              <span className={styles.jp}>藤八茶寮 / シングルオリジン伊勢茶 108teaworks</span>
            </div>
          </div>
          <nav className={styles.fnav}>
            <a href="/privacy-policy/" target="_blank" rel="noopener noreferrer">
              プライバシーポリシー
            </a>
            <a href="/legal/" target="_blank" rel="noopener noreferrer">
              特定商取引法に基づく表記
            </a>
            <a
              href="mailto:info@108teaworks.com"
              className={styles["fnav-icon"]}
              aria-label="メールでお問い合わせ"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </a>
            <a
              href="https://ig.me/m/108teaworks/"
              className={styles["fnav-icon"]}
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </nav>
        </div>
        <div className={`${styles.wrap} ${styles.fbottom}`}>
          © 藤八茶寮 / シングルオリジン伊勢茶 108teaworks　配送は日本国内のみです
        </div>
      </footer>

      {/* Sticky bottom purchase bar */}
      <WakochaLpStickyBar products={purchaseProducts} />
    </div>
  );
}
