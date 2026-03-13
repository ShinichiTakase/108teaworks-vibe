import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";

const USER_GUIDE_TEXTS: Record<
  Locale,
  {
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
    returnTitle: string;
    returnP1: string;
    returnP2: string;
    contactTitle: string;
    contactP1: string;
    contactP2: string;
    altImage: string;
  }
> = {
  ja: {
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
    shipLine2: "送料はお届け先地域・ご注文内容により異なります。詳細はカート画面にてご確認ください。",
    shipLine3: "一定金額以上のご注文で送料無料となるキャンペーンを行う場合がございます。",
    returnTitle: "返品・交換について",
    returnP1: "商品の品質には万全を期しておりますが、万一お届け内容に不備や破損があった場合は、商品到着後7日以内にご連絡ください。状況を確認のうえ、交換または返金にて対応させていただきます。",
    returnP2: "お客様都合での返品・交換は、未開封品に限りお受けできる場合がございます。送料のご負担など詳細は、事前にお問い合わせください。",
    contactTitle: "お問い合わせ",
    contactP1: "商品選びやご利用方法についてご不明な点がございましたら、お気軽にお問い合わせください。卸売りのご相談やギフトのご提案なども承っております。",
    contactP2: "お問い合わせフォームは、メインメニューの「お問い合せ」からご利用いただけます。",
    altImage: "ご注文の流れのイメージ",
  },
  en: {
    h1: "Order guide",
    intro1: "Since the 1860s we have been delivering traditional Ise tea from Fujihachiya with care.",
    intro2: "This page summarises how to order, delivery, payment, returns and exchanges on our online shop.",
    intro3: "Whether you're new or a regular, we hope you'll take a look so you can shop with confidence.",
    sec1Title: "How to order",
    sec1Step1: "Choose your products and click \"Add to cart\".",
    sec1Step2: "Review your cart and click \"Proceed to checkout\".",
    sec1Step3: "Enter delivery address, payment method, and other required details.",
    sec1Step4: "After confirming your order, click \"Place order\". An automatic confirmation email will be sent to your registered address.",
    sec1Note: "If you have any questions about your order, please contact us via the inquiry form.",
    payTitle: "Payment",
    payLine1: "Credit card",
    payLine2: "Digital wallets (see the cart page for supported brands)",
    payLine3: "Other payment methods may be added in the future.",
    shipTitle: "Delivery & shipping",
    shipLine1: "We usually ship within 2–5 business days after your order is confirmed.",
    shipLine2: "Shipping costs depend on destination and order. See the cart page for details.",
    shipLine3: "We may run free-shipping campaigns for orders above a certain amount.",
    returnTitle: "Returns & exchanges",
    returnP1: "We take every care with quality. If your order arrives damaged or incorrect, please contact us within 7 days. We will confirm and arrange an exchange or refund.",
    returnP2: "Returns or exchanges at the customer's request may be accepted for unopened items. Please contact us in advance about shipping costs and other details.",
    contactTitle: "Contact",
    contactP1: "If you have any questions about products or how to use the shop, please get in touch. We also handle wholesale enquiries and gift ideas.",
    contactP2: "The contact form is available from \"Contact\" in the main menu.",
    altImage: "Order guide",
  },
  ko: {
    h1: "주문 안내",
    intro1: "1860년대 창업 이래 전통 있는 이세차를 후지하치야에서 정성을 다해 보내드립니다.",
    intro2: "이 페이지에서는 온라인 숍에서의 주문 방법, 배송, 결제, 반품·교환 등의 이용 안내를 정리했습니다.",
    intro3: "처음 이용하시는 분도, 늘 이용해 주시는 분도 안심하고 쇼핑을 즐기실 수 있도록 한 번 확인해 주세요.",
    sec1Title: "주문 절차",
    sec1Step1: "원하는 상품을 고르고 「장바구니에 담기」 버튼을 누릅니다.",
    sec1Step2: "장바구니 화면에서 내용을 확인한 뒤 「결제하기」를 클릭합니다.",
    sec1Step3: "배송지 정보·결제 방법 등 필수 항목을 입력합니다.",
    sec1Step4: "내용 확인 후 「주문 확정」 버튼을 누르면 등록된 이메일로 자동 확인 메일이 도착합니다.",
    sec1Note: "주문 내용에 대해 궁금한 점이 있으시면 문의 양식을 통해 편하게 연락 주세요.",
    payTitle: "결제 방법",
    payLine1: "신용카드 결제",
    payLine2: "각종 월렛 결제(지원 브랜드는 장바구니 화면에서 확인하실 수 있습니다)",
    payLine3: "기타 결제 방법은 추후 순차 추가 예정입니다.",
    shipTitle: "배송·배송료",
    shipLine1: "주문 확정 후 보통 2~5 영업일 이내에 발송합니다.",
    shipLine2: "배송료는 배송 지역·주문 내용에 따라 다릅니다. 자세한 내용은 장바구니 화면에서 확인해 주세요.",
    shipLine3: "일정 금액 이상 주문 시 무료 배송 캠페인을 진행할 수 있습니다.",
    returnTitle: "반품·교환",
    returnP1: "상품 품질에는 만전을 기하지만, 배송 내용에 하자나 파손이 있을 경우 상품 도착 후 7일 이내에 연락 주세요. 상황 확인 후 교환 또는 환불로 대응하겠습니다.",
    returnP2: "고객 사유의 반품·교환은 미개봉품에 한해 받을 수 있는 경우가 있습니다. 배송료 부담 등 자세한 내용은 사전에 문의해 주세요.",
    contactTitle: "문의",
    contactP1: "상품 선택이나 이용 방법에 대해 궁금한 점이 있으시면 편하게 문의해 주세요. 도매 상담이나 선물 제안도 받고 있습니다.",
    contactP2: "문의 양식은 메인 메뉴의 「문의」에서 이용하실 수 있습니다.",
    altImage: "주문 안내 이미지",
  },
  zh: {
    h1: "订购流程",
    intro1: "自1860年代创业以来，藤八茶寮用心奉上传统伊势茶。",
    intro2: "本页汇总了在线商店的订购方式、配送、支付、退换货等使用说明。",
    intro3: "无论初次光临还是常客，都请浏览以便安心购物。",
    sec1Title: "订购流程",
    sec1Step1: "选择商品，点击「加入购物车」。",
    sec1Step2: "在购物车页面确认内容后，点击「去结账」。",
    sec1Step3: "请填写收货信息、支付方式等必填项。",
    sec1Step4: "确认内容后点击「确认下单」，系统将向您登记的邮箱发送自动确认邮件。",
    sec1Note: "对订单内容如有疑问，请通过咨询表单与我们联系。",
    payTitle: "支付方式",
    payLine1: "信用卡支付",
    payLine2: "各类电子钱包（支持品牌请于购物车页面确认）",
    payLine3: "其他支付方式将陆续追加。",
    shipTitle: "配送与运费",
    shipLine1: "订单确认后，通常于2～5个工作日内发货。",
    shipLine2: "运费因配送地区与订单内容而异。详情请于购物车页面确认。",
    shipLine3: "订单满一定金额时可能开展免运费活动。",
    returnTitle: "退换货",
    returnP1: "我们力求保证商品品质。如收到的商品有瑕疵或破损，请于到货后7日内联系。确认情况后将安排换货或退款。",
    returnP2: "因客户原因退换货，仅限未开封商品，且需事先咨询运费等详情。",
    contactTitle: "咨询",
    contactP1: "对商品选择或使用方法如有疑问，欢迎咨询。我们也接受批发咨询与礼品方案。",
    contactP2: "咨询表单可从主导航的「咨询」进入使用。",
    altImage: "订购流程",
  },
};

type Props = {
  locale: Locale;
};

export default function UserGuidePage({ locale }: Props) {
  const t = USER_GUIDE_TEXTS[locale];

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
