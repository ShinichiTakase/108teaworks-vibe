import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

export const dynamic = "force-dynamic";

const IMG_BASE = "https://108teaworks.com/wp-content/uploads";

export const metadata = {
  title: "ご利用案内｜伊勢茶の藤八茶寮",
  description:
    "ご注文の流れ、お支払い方法、配送・送料、返品・交換など、オンラインショップのご利用案内です。",
};

export default function GuidePage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="guide-heading" className="mb-12">
          <h1
            id="guide-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            ご利用案内
          </h1>

          {/* 1. 左：案内テキスト／右：イメージ */}
          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                ご注文の流れ
              </h2>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>お好みの商品を選び、「カートに追加」ボタンを押します。</li>
                <li>カート画面で内容をご確認のうえ、「ご購入手続きへ進む」をクリックします。</li>
                <li>お届け先情報・お支払い方法など必要事項をご入力ください。</li>
                <li>
                  内容確認後、「注文を確定する」ボタンを押すと、ご登録のメールアドレスに自動返信メールが届きます。
                </li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                ご注文内容に関してご不明点がございましたら、お問い合わせフォームよりお気軽にご連絡ください。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src={`${IMG_BASE}/2026/01/top.jpg`}
                alt="オンラインショップのイメージ"
                width={1200}
                height={500}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          {/* 2. お支払い方法・配送について */}
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                お支払い方法
              </h2>
              <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>クレジットカード決済</li>
                <li>各種ウォレット決済（対応ブランドはカート画面でご確認いただけます）</li>
                <li>その他の決済方法は、今後順次追加予定です。</li>
              </ul>
            </div>
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                配送・送料
              </h2>
              <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>ご注文確定後、通常2〜5営業日以内に発送いたします。</li>
                <li>送料はお届け先地域・ご注文内容により異なります。詳細はカート画面にてご確認ください。</li>
                <li>一定金額以上のご注文で送料無料となるキャンペーンを行う場合がございます。</li>
              </ul>
            </div>
          </div>

          {/* 3. 返品・交換／お問い合わせ */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                返品・交換について
              </h2>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                商品の品質には万全を期しておりますが、万一お届け内容に不備や破損があった場合は、商品到着後7日以内にご連絡ください。状況を確認のうえ、交換または返金にて対応させていただきます。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                お客様都合での返品・交換は、未開封品に限りお受けできる場合がございます。送料のご負担など詳細は、事前にお問い合わせください。
              </p>
            </div>
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                お問い合わせ
              </h2>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                商品選びやご利用方法についてご不明な点がございましたら、お気軽にお問い合わせください。卸売りのご相談やギフトのご提案なども承っております。
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                お問い合わせフォームは、メインメニューの「お問い合せ」からご利用いただけます。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

