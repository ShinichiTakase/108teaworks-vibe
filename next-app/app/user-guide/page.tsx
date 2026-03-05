import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ご注文の流れ｜伊勢茶の藤八茶寮",
  description:
    "オンラインショップでのご注文方法やお届け、送料、お支払い方法、キャンセル・返品・交換、お問い合わせ窓口についてご案内します。",
};

export default function UserGuidePage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="user-guide-heading" className="mb-12">
          <h1
            id="user-guide-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            ご注文の流れ
          </h1>

          {/* 上部：左に概要テキスト／右にイメージ */}
          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                創業1860年代、伝統ある伊勢茶を藤八茶寮から真心込めてお届けいたします。
                このページでは、オンラインショップでのご注文方法やお届け、お支払い、返品・交換などのご利用案内をまとめました。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                はじめての方も、いつもご利用くださっている方も、安心してお買い物をお楽しみいただけるよう、ぜひ一度ご確認ください。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/user-guide/user-guide.jpg"
                alt="ご注文の流れのイメージ"
                width={1200}
                height={800}
                className="w-full object-cover h-40 md:h-56 lg:h-64"
              />
            </figure>
          </div>

          {/* 1〜9 のご案内本体：2カラムレイアウト */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* 左カラム：1〜4 */}
            <div className="space-y-8">
              {/* 1. ご注文方法 */}
              <section aria-labelledby="order-flow-heading">
                <h2
                  id="order-flow-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  1．商品のご注文方法
                </h2>
                <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                  ご注文の流れ
                </h3>
                <ol className="mb-3 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>商品ページよりご希望の商品をカートに入れます。</li>
                  <li>カート画面で内容をご確認のうえ、「ご購入手続きへ進む」を押します。</li>
                  <li>お届け先・お支払い情報など必要事項をご入力ください。</li>
                  <li>内容をご確認のうえご注文を確定すると、自動返信メールが送信されます。</li>
                </ol>
                <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                  受付時間
                </h3>
                <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  インターネットからのご注文は、24時間いつでも受け付けております。
                </p>
                <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                  在庫について
                </h3>
                <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                  季節限定品や希少な茶葉は、数に限りがございます。品切れの際は何卒ご容赦ください。
                </p>
              </section>

              {/* 2. お届けについて */}
              <section aria-labelledby="delivery-heading">
                <h2
                  id="delivery-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  2．お届けについて
                </h2>
                <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                  配送業者
                </h3>
                <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  日本郵便（クリックポスト等）またはヤマト運輸にてお届けいたします。
                </p>
                <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                  出荷までの日数
                </h3>
                <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                  ご注文日より5日以内に発送いたします。
                  年末年始や繁忙期など、お時間をいただく場合は事前にお知らせいたします。
                </p>
              </section>

              {/* 3. 送料 */}
              <section aria-labelledby="shipping-fee-heading">
                <h2
                  id="shipping-fee-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  3．送料
                </h2>
                <ul className="mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>
                    ティーバッグ（3個入セット）6点まで、または袋詰め商品3点までは、
                    全国一律280円です。
                  </li>
                  <li>
                    上記を超える数量、または組み合わせでのご購入の場合は、
                    住所入力後の画面にて最適な送料が自動計算されます。
                  </li>
                  <li>
                    ティーバッグ（3個入セット）3点と袋詰め商品2点の組み合わせなど、
                    条件により全国一律送料が適用されます。その他の組み合わせについても自動計算でご確認ください。
                  </li>
                </ul>
                <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                  組み合わせによっては、複数口に分けてご注文いただくことで送料がお安くなる場合もございます。
                  20,000円以上のお買い上げで送料無料となります。
                </p>
              </section>

              {/* 4. お支払い方法 */}
              <section aria-labelledby="payment-heading">
                <h2
                  id="payment-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  4．お支払い方法について
                </h2>
                <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  以下の決済方法がご利用いただけます。
                </p>
                <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>Apple Pay / Google Pay</li>
                  <li>デビットカード</li>
                  <li>クレジットカード（Visa, Mastercard, American Express, JCB等）</li>
                </ul>
              </section>
            </div>

            {/* 右カラム：5〜9 */}
            <div className="space-y-8">
              {/* 5. 領収書 */}
              <section aria-labelledby="receipt-heading">
                <h2
                  id="receipt-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  5．領収書の発行について
                </h2>
                <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                  当店では、商品発送時に領収書を同梱させていただいております。
                  別送をご希望の場合は、ご注文時の備考欄にてお知らせください。
                </p>
              </section>

              {/* 6. ギフト・贈り物 */}
              <section aria-labelledby="gift-heading">
                <h2
                  id="gift-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  6．ギフト・贈り物としての対応
                </h2>
                <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                  藤八茶寮では、大切な方への贈り物を安心してお任せいただけるよう、ギフト対応を順次整えております。
                </p>
                <ul className="mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>ギフトラッピングは、現在準備中です。ご迷惑をおかけしますがしばらくお待ちください。</li>
                  <li>
                    お送り先に領収書を送りたくない場合は、ご購入手続き画面で
                    「金額記載の明細書は不要（ギフト用）」にチェックを入れてください。
                  </li>
                </ul>
                <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                  のし掛けや名入れなどのご要望がございましたら、可能な範囲で対応いたしますので事前にご相談ください。
                </p>
              </section>

              {/* 7. キャンセル */}
              <section aria-labelledby="cancel-heading">
                <h2
                  id="cancel-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  7．ご注文のキャンセルについて
                </h2>
                <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>商品発送後は、お客様のご都合によるキャンセルはお受けできません。</li>
                  <li>
                    ご注文受付メールを受信された後でも、商品発送前であればご注文内容の変更・キャンセルが可能です。
                  </li>
                </ul>
              </section>

              {/* 8・9. 返品・交換／お問い合わせ窓口 */}
              <section aria-labelledby="return-heading">
                <h2
                  id="return-heading"
                  className="mt-0 mb-3 text-base font-semibold text-tea-deep"
                >
                  8．返品・交換について
                </h2>
                <ul className="mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>当店の責により返品いただく場合は、送料は当店が負担いたします（送料着払い）。</li>
                  <li>
                    万一、お届けした商品に不備（破損・誤送など）があった場合は、
                    商品到着後7日以内にお問い合わせ窓口までご連絡ください。速やかに良品と交換させていただきます。
                  </li>
                  <li>商品の性質上、お客様都合による返品・交換は原則としてお受けいたしかねます。</li>
                </ul>

                <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                  9．お問い合わせ窓口
                </h2>
                <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  商品選びや美味しい淹れ方についてのご相談も承っております。お気軽にお問い合わせください。
                </p>
                <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  <li>
                    電話：050-6860-7347
                    <span className="block">
                      ※少人数で運営しているため、発送作業中などお電話に出られないことがあります。できるだけメールでお問い合わせください。
                    </span>
                  </li>
                  <li>メール：info@108teaworks.com</li>
                </ul>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

