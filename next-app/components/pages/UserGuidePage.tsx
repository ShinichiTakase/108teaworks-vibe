import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

const USER_GUIDE_TEXTS: {
    h1: string;
    intro1: string;
    intro2: string;
    intro3: string;
    sec1Title: string;
    sec1Step1: string;
    sec1Step2: string;
    sec1Step3: string;
    sec1Step4: string;
    sec1Note: string;
    payTitle: string;
    payLine1: string;
    payLine2: string;
    payLine3: string;
    shipTitle: string;
    shipLine1: string;
    shipLine2: string;
    shipLine3: string;
    shipDomesticNote: string;
    returnTitle: string;
    returnP1: string;
    returnP2: string;
    contactTitle: string;
    contactP1: string;
    contactP2: string;
    altImage: string;
} = {
    h1: "ご注文の流れ",
    intro1: "創業1860年代、伝統ある伊勢茶を藤八茶寮から真心込めてお届けいたします。",
    intro2: "このページでは、オンラインショップでのご注文方法やお届け、お支払い、返品・交換などのご利用案内をまとめました。",
    intro3: "はじめての方も、いつもご利用くださっている方も、安心してお買い物をお楽しみいただけるよう、ぜひ一度ご確認ください。",
    sec1Title: "ご注文の流れ",
    sec1Step1: "お好みの商品を選び、「カートに追加」ボタンを押します。",
    sec1Step2: "カート画面で内容をご確認のうえ、「ご購入手続きへ進む」をクリックします。",
    sec1Step3: "お届け先情報・お支払い方法など必要事項をご入力ください。",
    sec1Step4: "内容確認後、「注文を確定する」ボタンを押すと、ご登録のメールアドレスに自動返信メールが届きます。",
    sec1Note: "ご注文内容に関してご不明点がございましたら、お問い合わせフォームよりお気軽にご連絡ください。",
    payTitle: "お支払い方法",
    payLine1: "クレジットカード決済",
    payLine2: "各種ウォレット決済（対応ブランドはカート画面でご確認いただけます）",
    payLine3: "その他の決済方法は、今後順次追加予定です。",
    shipTitle: "配送・送料",
    shipLine1: "ご注文確定後、通常2〜5営業日以内に発送いたします。",
    shipLine2: "クリックポスト（日本郵便）全国一律380円、大きなご注文は60サイズ（日本郵便）全国一律880円です。",
    shipLine3: "¥10,000以上のお買い物で送料無料になります。",
    shipDomesticNote: "配送は日本国内のみです。海外への発送はできません。",
    returnTitle: "返品・交換について",
    returnP1: "商品の品質には万全を期しておりますが、万一お届け内容に不備や破損があった場合は、商品到着後7日以内にご連絡ください。状況を確認のうえ、交換または返金にて対応させていただきます。",
    returnP2: "お客様都合による返品・交換は、食品という商品の性質上お受けできません。商品の瑕疵・誤配送の場合のみ、商品到着後7日以内にご連絡いただければ対応いたします（送料は当店が負担いたします）。",
    contactTitle: "お問い合わせ",
    contactP1: "商品選びやご利用方法についてご不明な点がございましたら、お気軽にお問い合わせください。卸売りのご相談やギフトのご提案なども承っております。",
    contactP2: "お問い合わせフォームは、メインメニューの「お問い合わせ」からご利用いただけます。",
    altImage: "ご注文の流れのイメージ",
};

export default function UserGuidePage() {
  const t = USER_GUIDE_TEXTS;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="user-guide-heading" className="mb-12">
          <h1
            id="user-guide-heading"
            className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.intro1} {t.intro2}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.intro3}
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/user-guide/user-guide.jpg"
                alt={t.altImage}
                width={1200}
                height={800}
                className="w-full object-cover h-40 md:h-56 lg:h-64"
              />
            </figure>
          </div>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.sec1Title}
              </h2>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.sec1Step1}</li>
                <li>{t.sec1Step2}</li>
                <li>{t.sec1Step3}</li>
                <li>{t.sec1Step4}</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec1Note}
              </p>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.payTitle}
              </h2>
              <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.payLine1}</li>
                <li>{t.payLine2}</li>
                <li>{t.payLine3}</li>
              </ul>
            </div>
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.shipTitle}
              </h2>
              <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.shipLine1}</li>
                <li>{t.shipLine2}</li>
                <li>{t.shipLine3}</li>
              </ul>
              <p className="mt-3 mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.shipDomesticNote}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.returnTitle}
              </h2>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.returnP1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.returnP2}
              </p>
            </div>
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.contactTitle}
              </h2>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.contactP1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.contactP2}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
