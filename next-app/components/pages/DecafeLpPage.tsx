import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { formatPriceYen } from "@/lib/formatters";
import { getProductBySlug } from "@/lib/microcms";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import DecafeLpBuy from "./DecafeLpBuy";
import styles from "./DecafeLpPage.module.css";

/**
 * D:\藤八茶寮\カフェインカットLP\decaf_green_tea_lp.html をベースにしたLP（/ise-cha/decafe-lp/）。
 * デザイン・レイアウトは元HTML/CSSの値をそのまま踏襲している。以下のみNext.js化に伴う技術的な変更：
 * ・外部ドメイン（https://108teaworks.com/...）への絶対URLは、同一サイト内のため相対パスに変更
 * ・商品画像は元HTMLの `_next/image` プロキシURLから、実ファイルへの直接パスに変更
 *   （/images/products/decaf_green_tea/1000.webp・4000.webp。指定通り変更なし）
 * ・HERO画像は元HTMLの埋め込みbase64画像から、指定のPNG（lp_caffeinecut.png）をWebP変換した
 *   ファイルに差し替え
 * ・<title>はそのまま踏襲。meta descriptionは元HTMLに存在しないため新規に追加（表示デザインには影響しない）
 * ・「購入する」ボタンは元HTMLでは商品ページへの単純なリンクだったが、/ise-cha/wakocha-lp/ と同様に
 *   数量+/-ステッパー付きでカートに追加し購入手続き画面（/checkout）へ遷移するよう変更（ユーザー指示）。
 *   価格・商品名はmicroCMSからライブ取得し、取得できない場合は元HTMLの値にフォールバックする
 */

const FAQS = [
  {
    q: "カフェインは完全にゼロですか？",
    a: "完全にゼロではありませんが、通常の深蒸し茶と比べて約70%のカフェインをカットしています。カフェインを完全に含まないお茶をお探しの場合は、麦茶などノンカフェイン飲料をおすすめします。",
  },
  {
    q: "化学薬品は使われていますか？",
    a: "使用していません。水と二酸化炭素だけを用いる「超臨界二酸化炭素抽出法」を採用しており、有機溶媒などの化学薬品は一切使っていません。",
  },
  {
    q: "妊娠中や授乳中でも飲めますか？",
    a: "カフェインを気にされる方に選ばれている商品ですが、体質や体調には個人差がありますので、心配な場合はかかりつけの医師にご相談のうえお楽しみください。",
  },
] as const;

const FALLBACK_TITLE = "デカフェ緑茶 ティーバッグ 8個";
const FALLBACK_PRICE = 1296;

export default async function DecafeLpPage() {
  const canonicalUrl = `${SITE_BASE_URL}/ise-cha/decafe-lp/`;
  const leadDescription =
    "「緑茶は好きだけど、カフェインが気になる」——そんな声から生まれた、藤八茶寮のデカフェ緑茶ティーバッグ。三重県松阪市飯南町産の伊勢茶100%を、化学薬品を使わない超臨界二酸化炭素抽出法でやさしくカフェインカットしました。";

  const product = await getProductBySlug("decaf_green_tea");
  const price = product?.PRICE ?? FALLBACK_PRICE;
  const purchaseProduct = {
    slug: "decaf_green_tea",
    title: product?.TITLE ?? FALLBACK_TITLE,
    price,
    imagePath: "/images/products/decaf_green_tea/1000.webp",
    shipRank: product?.SHIP_RANK,
  };

  return (
    <div className={styles.page}>
      <ArticleJsonLd
        headline="デカフェ緑茶ティーバッグ8個 カフェイン70%カット｜藤八茶寮"
        description={leadDescription}
        imageUrl={`${SITE_BASE_URL}/images/decafe-lp/hero.webp`}
        canonicalUrl={canonicalUrl}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems("/ise-cha/decafe-lp", "ja", { productName: "デカフェ緑茶ティーバッグ" })}
      />

      <header className={styles["site-header"]}>
        <div className={styles["header-top"]}>
          <div className={styles.brand}>
            <img src="/images/logo/logo-mobile.png" alt="伊勢茶の藤八茶寮" />
            <span className={styles["brand-text"]}>シングルオリジン伊勢茶・お茶の魅力を三重から世界へ</span>
          </div>
        </div>
      </header>

      {/* ===== HERO（全面画像＋オーバーレイ） ===== */}
      <section className={styles.hero}>
        <div className={styles["hero-bg"]}>
          <img src="/images/decafe-lp/hero.webp" alt="デカフェ緑茶をポットからグラスへ注ぐ様子" />
        </div>
        <div className={styles["hero-overlay"]}>
          <div className={styles["hero-copy-card"]}>
            <span className={styles.eyebrow}>🍃 カフェイン70%カット</span>
            <h1>
              深蒸し茶のコクはそのまま、
              <br />
              <span className={styles.accent}>夜も、妊娠中も、家族みんなで</span>楽しめる緑茶。
            </h1>
            <p className={styles.lead}>{leadDescription}</p>
            <div className={styles["hero-badges"]}>
              <div className={styles.badge}>
                <b>約70%</b>カフェインカット
              </div>
              <div className={styles.badge}>
                <b>100%</b>松阪市飯南町産 伊勢茶
              </div>
              <div className={styles.badge}>
                <b>0%</b>化学薬品・プラスチック
              </div>
            </div>
            <DecafeLpBuy product={purchaseProduct} ctaLabel="この商品を購入する" />
            <span className={styles["cta-sub"]}>{formatPriceYen(price)}（税込）・ティーバッグ8個入り・全国クリックポスト対応</span>
          </div>
        </div>
      </section>

      {/* ===== お悩み共感 ===== */}
      <section className={styles["worry-band"]}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>SYMPATHY</span>
            <h2>こんなお悩み、ありませんか？</h2>
            <p>おいしいお茶を、もっと気兼ねなく楽しみたい方へ。</p>
          </div>
          <div className={styles["worry-cards"]}>
            <div className={styles["worry-card"]}>
              <div className={styles.emoji}>🌙</div>
              <p>
                夜に緑茶を飲むと
                <br />
                眠れなくなってしまう
              </p>
            </div>
            <div className={styles["worry-card"]}>
              <div className={styles.emoji}>🤰</div>
              <p>
                妊娠中・授乳中でも
                <br />
                お茶の味をあきらめたくない
              </p>
            </div>
            <div className={styles["worry-card"]}>
              <div className={styles.emoji}>👨‍👩‍👧‍👦</div>
              <p>
                子どもや親とも
                <br />
                同じお茶を囲みたい
              </p>
            </div>
          </div>
          <div className={styles["worry-arrow"]}>↓ そんな方に選ばれています ↓</div>
        </div>
      </section>

      {/* ===== 製法 & 3ポイント ===== */}
      <section className={styles.method}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>HOW WE MAKE IT</span>
            <h2>薬品を使わない、やさしい脱カフェイン製法</h2>
            <p>水と二酸化炭素だけを用いる「超臨界二酸化炭素抽出法」で、風味を守りながらカフェインだけを取り除きます。</p>
          </div>
          <div className={styles["method-flow"]}>
            <div className={styles["method-step"]}>
              <div className={styles.num}>1</div>
              <h3>深蒸し茶を抽出</h3>
              <p>三重県産の深蒸し伊勢茶から、超臨界状態のCO₂でカフェインのみを溶かし出します。</p>
            </div>
            <div className={styles["method-step"]}>
              <div className={styles.num}>2</div>
              <h3>旨みを黄金比で再ブレンド</h3>
              <p>抽出で薄まりがちなコクと旨みを補うため、高品質な深蒸し茶を独自の配合で再ブレンド。</p>
            </div>
            <div className={styles["method-step"]}>
              <div className={styles.num}>3</div>
              <h3>約70%カットで仕上げ</h3>
              <p>化学溶媒を使わず、うまみと香りはそのままにカフェインだけをやさしくオフ。</p>
            </div>
          </div>

          <div className={styles["point-cards"]}>
            <div className={styles["point-card"]}>
              <div className={styles["icon-circle"]}>🍵</div>
              <h3>深蒸し茶の濃厚なコク</h3>
              <p>独自製法でカフェインを大幅カットしても、まろやかな旨みと香りはそのまま。デカフェ特有の物足りなさを感じさせません。</p>
            </div>
            <div className={styles["point-card"]}>
              <div className={styles["icon-circle"]}>💧</div>
              <h3>水とCO₂だけで抽出</h3>
              <p>一般的なデカフェ茶に使われがちな有機溶媒は不使用。水と二酸化炭素のみを用いた製法だから、毎日安心して飲めます。</p>
            </div>
            <div className={styles["point-card"]}>
              <div className={styles["icon-circle"]}>🌱</div>
              <h3>プラスチックフリーの茶葉</h3>
              <p>ティーバッグは植物由来素材のみ。お湯に浸しても雑味が出にくく、環境にも体にもやさしい設計です。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== カフェイン比較 ===== */}
      <section className={styles.compare}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>CAFFEINE DATA</span>
            <h2>飲み物別・カフェイン含有量を比べてみると</h2>
            <p>100mlあたりのカフェイン量（目安）。数値が小さいほど、体にやさしい選択肢です。</p>
          </div>
          <div className={styles["compare-table-wrap"]}>
            <table className={styles["compare-table"]}>
              <thead>
                <tr>
                  <th>飲み物</th>
                  <th>カフェイン量</th>
                  <th></th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>玉露</td>
                  <td>約160mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "100%" }} />
                    </div>
                  </td>
                  <td>別格の高さ。少量を楽しむのが基本</td>
                </tr>
                <tr>
                  <td>ドリップコーヒー</td>
                  <td>約40mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "25%" }} />
                    </div>
                  </td>
                  <td>1杯（150ml）で約60mg程度</td>
                </tr>
                <tr>
                  <td>深蒸し茶（通常）</td>
                  <td>約20mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "12%" }} />
                    </div>
                  </td>
                  <td>普通の緑茶よりやや多め</td>
                </tr>
                <tr>
                  <td>紅茶</td>
                  <td>約17mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "11%" }} />
                    </div>
                  </td>
                  <td>抽出時間によって変動</td>
                </tr>
                <tr>
                  <td>緑茶（煎茶）</td>
                  <td>約15mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "9%" }} />
                    </div>
                  </td>
                  <td>番茶などはこれより低め</td>
                </tr>
                <tr className={styles.highlight}>
                  <td>デカフェ緑茶（本商品）</td>
                  <td>約5〜6mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "4%" }} />
                    </div>
                  </td>
                  <td>通常の深蒸し茶から約70%カット</td>
                </tr>
                <tr>
                  <td>麦茶</td>
                  <td>ほぼ0mg</td>
                  <td>
                    <div className={styles["bar-wrap"]}>
                      <div className={styles.bar} style={{ width: "1%" }} />
                    </div>
                  </td>
                  <td>ノンカフェイン飲料</td>
                </tr>
              </tbody>
            </table>
            <p className={styles["compare-note"]}>
              ※出典：食品安全委員会等の一般的な目安値を参考に作成。体質により個人差があります。詳しくは
              <a href="/ise-cha/caffeine/" style={{ color: "var(--emerald-deep)", textDecoration: "underline" }}>
                「お茶とカフェインの関係」特集ページ
              </a>
              もご覧ください。
            </p>
          </div>
        </div>
      </section>

      {/* ===== おすすめシーン ===== */}
      <section className={styles.scenes}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>FOR YOUR MOMENTS</span>
            <h2>こんな方・シーンにおすすめです</h2>
          </div>
          <div className={styles["scene-grid"]}>
            <div className={styles["scene-card"]}>
              <div className={styles.emoji}>😴</div>
              <p>
                おやすみ前の
                <br />
                リラックスタイムに
              </p>
            </div>
            <div className={styles["scene-card"]}>
              <div className={styles.emoji}>🤱</div>
              <p>
                妊娠中・授乳中の
                <br />
                カフェイン管理に
              </p>
            </div>
            <div className={styles["scene-card"]}>
              <div className={styles.emoji}>👵</div>
              <p>
                お子さまから
                <br />
                ご年配の方まで
              </p>
            </div>
            <div className={styles["scene-card"]}>
              <div className={styles.emoji}>☕</div>
              <p>
                カフェインを
                <br />
                控えたい毎日に
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 商品情報 ===== */}
      <section className={styles.product} id="order">
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>PRODUCT</span>
            <h2>商品情報</h2>
          </div>
          <div className={styles["product-grid"]}>
            <div className={styles["product-gallery"]}>
              <img src="/images/products/decaf_green_tea/1000.webp" alt="デカフェ緑茶ティーバッグ8個 パッケージ" />
              <img src="/images/products/decaf_green_tea/4000.webp" alt="デカフェ緑茶ティーバッグ 使用イメージ" />
            </div>
            <div className={styles["product-detail"]}>
              <h2>{FALLBACK_TITLE}</h2>
              <div className={styles["price-tag"]}>
                {formatPriceYen(price)} <span>（税込）</span>
              </div>
              <p style={{ color: "var(--ink-soft)", fontSize: "14px" }}>
                深蒸し茶ならではの濃厚なコクとまろやかな旨みそのまま、カフェインだけを約70%カット。三重県松阪市飯南町産の伊勢茶を100%使用しています。
              </p>
              <table className={styles["spec-table"]}>
                <tbody>
                  <tr>
                    <th>種類</th>
                    <td>カフェインカット（デカフェ）緑茶</td>
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
                    <td>ティーバッグ8個</td>
                  </tr>
                  <tr>
                    <th>風味</th>
                    <td>デカフェながら深蒸し茶らしいまろやかな旨みと香り</td>
                  </tr>
                </tbody>
              </table>
              <div className={styles["shipping-box"]}>
                配送目安：合計ポイント6.0以下はクリックポスト ¥380／6.0超は60サイズ宅配便
                ¥880。お買い上げ¥10,000以上で送料無料。ギフトの場合はご購入手続き画面で明細書不要（ギフト用）にチェックしてください。
              </div>
              <DecafeLpBuy product={purchaseProduct} ctaLabel="この商品を購入する" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={styles.faq}>
        <div className={styles.wrap}>
          <div className={styles["section-head"]}>
            <span className={styles.tag}>FAQ</span>
            <h2>よくあるご質問</h2>
          </div>
          {FAQS.map((item) => (
            <div key={item.q} className={styles["faq-item"]}>
              <div className={styles.q}>Q. {item.q}</div>
              <p className={styles.a}>A. {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 最終CTA ===== */}
      <section className={styles["final-cta"]}>
        <h2>
          今日から、カフェインを気にせず
          <br />
          おいしい緑茶を。
        </h2>
        <p>深蒸し茶のコクはそのままに、カフェイン約70%カット。{formatPriceYen(price)}（税込）・送料¥10,000以上で無料。</p>
        <DecafeLpBuy product={purchaseProduct} ctaLabel="この商品を購入する" />
      </section>

      <footer className={styles["site-footer"]}>
        <div className={styles["footer-links"]}>
          <a href="/privacy-policy/">プライバシーポリシー</a>｜<a href="/legal/">特定商取引法に基づく表記</a>
          <span className={styles["footer-icons"]}>
            <a href="mailto:info@108teaworks.com" aria-label="メールで問い合わせる" title="メール">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </a>
            <a href="https://ig.me/m/108teaworks/" aria-label="Instagramでメッセージを送る" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </span>
        </div>
        <div className={styles["footer-note"]}>配送は日本国内のみです</div>
        <div className={styles["footer-copy"]}>©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks</div>
      </footer>
    </div>
  );
}
