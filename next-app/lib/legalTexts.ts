import type { Locale } from "./i18n";

export const LEGAL_TEXTS: Record<
  Locale,
  {
    h1: string;
    tradeName: string;
    homepage: string;
    representative: string;
    advisor: string;
    address: string;
    contact: string;
    contactAnd: string;
    hours: string;
    hoursValue: string;
    price: string;
    priceValue: string;
    extraCosts: string;
    extraCostsValue: string;
    payment: string;
    paymentValue: string;
    paymentTiming: string;
    paymentTimingValue: string;
    delivery: string;
    deliveryValue: string;
    returns: string;
    returnsValue: string;
    cancel: string;
    cancelValue: string;
  }
> = {
  ja: {
    h1: "特定商取引法に基づく表記",
    tradeName: "屋号",
    homepage: "ホームページ",
    representative: "代表者",
    advisor: "相談役",
    address: "住所",
    contact: "連絡先",
    contactAnd: "および",
    hours: "営業時間",
    hoursValue: "10:00～17:00（定休日：不定休）",
    price: "販売価格",
    priceValue: "各商品ページに表示された価格に基づきます（表示価格は消費税込み）。",
    extraCosts: "商品以外の必要代金",
    extraCostsValue: "商品代金とは別に送料を頂きます。詳しい送料はご購入手続き画面にて自動計算されます。",
    payment: "支払い方法",
    paymentValue: "クレジットカード（Stripe決済）",
    paymentTiming: "代金の支払い時期",
    paymentTimingValue:
      "クレジットカード決済：ご注文商品配送時でのお支払いとなり、支払時期はご利用のクレジットカード会社の会員規約に従うものとします。",
    delivery: "商品のお届け時期",
    deliveryValue: "代金のお支払い確定後、5日以内に発送いたします。",
    returns: "返品・交換について",
    returnsValue:
      "商品に瑕疵があった場合やご注文と異なる商品が配送された場合には、商品到着後7日以内にご連絡ください。当ショップの責による返品の場合は送料当ショップ負担にて対応いたします。食品という性質上、お客様都合による返品・交換はお受けできません。",
    cancel: "キャンセルについて",
    cancelValue:
      "商品発送前であれば、ご注文の変更・キャンセルが可能です。商品発送後はお客様都合によるキャンセルはお受けできません。",
  },
  en: {
    h1: "Legal notice (Specified Commercial Transaction Act)",
    tradeName: "Trade name",
    homepage: "Website",
    representative: "Representative",
    advisor: "Advisor",
    address: "Address",
    contact: "Contact",
    contactAnd: " and ",
    hours: "Business hours",
    hoursValue: "10:00–17:00 (closed: irregular)",
    price: "Prices",
    priceValue: "As shown on each product page (prices include consumption tax).",
    extraCosts: "Additional charges",
    extraCostsValue: "Shipping is charged in addition to the product price. Shipping is calculated automatically at checkout.",
    payment: "Payment methods",
    paymentValue: "Credit card (Stripe)",
    paymentTiming: "Payment timing",
    paymentTimingValue:
      "Credit card: payment is due when the order is shipped. The payment date follows the terms of your card issuer.",
    delivery: "Delivery",
    deliveryValue: "We ship within 5 days after payment is confirmed.",
    returns: "Returns and exchanges",
    returnsValue:
      "If your order is defective or different from what you ordered, please contact us within 7 days of delivery. We will cover return shipping for returns due to our error. Due to the nature of food products, we cannot accept returns or exchanges at the customer's request.",
    cancel: "Cancellation",
    cancelValue:
      "You may change or cancel your order before we ship. We cannot accept cancellation at the customer's request after shipment.",
  },
  ko: {
    h1: "특정 상거래에 관한 법률에 기반한 표기",
    tradeName: "상호",
    homepage: "홈페이지",
    representative: "대표자",
    advisor: "고문",
    address: "주소",
    contact: "연락처",
    contactAnd: " 및 ",
    hours: "영업 시간",
    hoursValue: "10:00～17:00（휴업일：부정휴）",
    price: "판매 가격",
    priceValue: "각 상품 페이지에 표시된 가격에 따릅니다（표시 가격은 소비세 포함）. ",
    extraCosts: "상품 외 필요 대금",
    extraCostsValue: "상품 대금과 별도로 배송료를 받습니다. 자세한 배송료는 결제 화면에서 자동 계산됩니다.",
    payment: "결제 방법",
    paymentValue: "신용카드(Stripe 결제)",
    paymentTiming: "대금의 결제 시기",
    paymentTimingValue:
      "신용카드 결제: 주문 상품 배송 시 결제되며, 결제 시기는 이용하시는 신용카드 회사의 회원 약관에 따릅니다.",
    delivery: "상품의 배송 시기",
    deliveryValue: "대금 결제 확인 후 5일 이내에 발송합니다.",
    returns: "반품·교환",
    returnsValue:
      "상품에 하자가 있거나 주문과 다른 상품이 배송된 경우에는 상품 도착 후 7일 이내에 연락해 주세요. 당숍 귀책에 의한 반품의 경우 배송료는 당숍 부담으로 대응합니다. 식품의 성질상 고객 사유에 의한 반품·교환은 받지 않습니다.",
    cancel: "취소",
    cancelValue:
      "상품 발송 전이라면 주문 변경·취소가 가능합니다. 상품 발송 후에는 고객 사유에 의한 취소는 받지 않습니다.",
  },
  zh: {
    h1: "特定商业交易法相关标注",
    tradeName: "商号",
    homepage: "网站",
    representative: "代表人",
    advisor: "顾问",
    address: "地址",
    contact: "联系方式",
    contactAnd: "及",
    hours: "营业时间",
    hoursValue: "10:00～17:00（休息日：不定休）",
    price: "销售价格",
    priceValue: "以各商品页面所示价格为准（标注价格含消费税）。",
    extraCosts: "商品以外必要费用",
    extraCostsValue: "除商品价款外另收运费。具体运费在结账页面自动计算。",
    payment: "支付方式",
    paymentValue: "信用卡（Stripe）",
    paymentTiming: "价款支付时间",
    paymentTimingValue:
      "信用卡支付：于所订商品发货时支付，具体支付时间依所使用信用卡公司的会员规约。",
    delivery: "商品送达时间",
    deliveryValue: "价款支付确认后5日内发货。",
    returns: "退换货",
    returnsValue:
      "如商品存在瑕疵或与订单不符，请于到货后7日内联系。因本店责任导致的退换货，运费由本店承担。鉴于食品性质，恕不接受因客户原因退换货。",
    cancel: "取消",
    cancelValue:
      "商品发货前可变更或取消订单。发货后恕不接受因客户原因取消。",
  },
};
