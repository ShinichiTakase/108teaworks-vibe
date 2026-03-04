import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

export default function LegalPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="legal-heading" className="mb-12">
          <h1
            id="legal-heading"
            className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep"
          >
            特定商取引法に基づく表記
          </h1>

          <div className="text-[0.9375rem] leading-relaxed text-ink-muted">
            <dl className="divide-y divide-border border border-border rounded-md">
              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  屋号
                </dt>
                <dd className="m-0">藤八茶寮</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  ホームページ
                </dt>
                <dd className="m-0">
                  <a
                    href="https://108teaworks.com/"
                    className="text-tea no-underline hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://108teaworks.com/
                  </a>
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  代表者
                </dt>
                <dd className="m-0">高瀬晴香</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  相談役
                </dt>
                <dd className="m-0">
                  高瀬孝二（日本茶インストラクター協会認定 日本茶インストラクターリーダー /
                  日本茶アドバイザー養成講座専任講師 / 元三重県農業技術センター主席研究員兼茶業センター場長）
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  住所
                </dt>
                <dd className="m-0">
                  〒224-0007 横浜市都筑区荏田南一丁目１１番２３号
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  連絡先
                </dt>
                <dd className="m-0">
                  <a
                    href="mailto:info@108teaworks.com"
                    className="text-tea no-underline hover:underline"
                  >
                    info@108teaworks.com
                  </a>{" "}
                  および{" "}
                  <a
                    href="tel:050-6860-7347"
                    className="text-tea no-underline hover:underline"
                  >
                    050-6860-7347
                  </a>
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  営業時間
                </dt>
                <dd className="m-0">10:00～17:00（定休日：不定休）</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  販売価格
                </dt>
                <dd className="m-0">
                  各商品ページに表示された価格に基づきます（表示価格は消費税込み）。
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  商品以外の必要代金
                </dt>
                <dd className="m-0">
                  商品代金とは別に送料を頂きます。詳しい送料はご購入手続き画面にて自動計算されます。
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  支払い方法
                </dt>
                <dd className="m-0">
                  クレジットカード（Stripe決済）、Apple Pay、Google Pay
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  代金の支払い時期
                </dt>
                <dd className="m-0">
                  クレジットカード決済：ご注文商品配送時でのお支払いとなり、支払時期はご利用のクレジットカード会社の会員規約に従うものとします。
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  商品のお届け時期
                </dt>
                <dd className="m-0">代金のお支払い確定後、5日以内に発送いたします。</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  返品・交換について
                </dt>
                <dd className="m-0">
                  商品に瑕疵があった場合やご注文と異なる商品が配送された場合には、商品到着後7日以内にご連絡ください。当ショップの責による返品の場合は送料当ショップ負担にて対応いたします。食品という性質上、お客様都合による返品・交換はお受けできません。
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  キャンセルについて
                </dt>
                <dd className="m-0">
                  商品発送前であれば、ご注文の変更・キャンセルが可能です。商品発送後はお客様都合によるキャンセルはお受けできません。
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}

