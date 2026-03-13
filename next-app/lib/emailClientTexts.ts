import type { Locale } from "./i18n";

/** お問い合わせ：クライアント宛返信メールの件名・本文 */
export const INQUIRY_EMAIL_CLIENT: Record<
  Locale,
  { subject: string; body: (name: string, email: string, message: string) => string }
> = {
  ja: {
    subject: "藤八茶寮 - お問合せありがとうございました",
    body: (name, email, message) =>
      [
        `${name} 様`,
        "",
        "この度はお問い合わせいただきありがとうございました。",
        "下記内容にて承りました。",
        "",
        `お名前: ${name}`,
        `Eメール: ${email}`,
        "",
        "メッセージ:",
        message,
        "",
        "担当者より数日中に返信いたしますので、しばらくお待ちください。",
      ].join("\n"),
  },
  en: {
    subject: "Tohachi Saryo - Thank you for your inquiry",
    body: (name, email, message) =>
      [
        `Dear ${name},`,
        "",
        "Thank you for contacting us. We have received the following message.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
        "",
        "We will reply within a few business days.",
      ].join("\n"),
  },
  ko: {
    subject: "토하치 사료 - 문의해 주셔서 감사합니다",
    body: (name, email, message) =>
      [
        `${name} 님,`,
        "",
        "문의해 주셔서 감사합니다. 아래 내용으로 접수되었습니다.",
        "",
        `이름: ${name}`,
        `이메일: ${email}`,
        "",
        "메시지:",
        message,
        "",
        "담당자가 며칠 내로 답변드리겠습니다.",
      ].join("\n"),
  },
  zh: {
    subject: "藤八茶寮 - 感谢您的咨询",
    body: (name, email, message) =>
      [
        `${name} 您好，`,
        "",
        "感谢您的咨询。我们已收到以下内容。",
        "",
        `姓名：${name}`,
        `邮箱：${email}`,
        "",
        "留言：",
        message,
        "",
        "我们将在数日内回复。",
      ].join("\n"),
  },
};

/** パートナー募集：クライアント宛返信メールの件名・本文 */
export const WHOLESALE_EMAIL_CLIENT: Record<
  Locale,
  {
    subject: string;
    body: (company: string, department: string, lastName: string, firstName: string, phone: string, email: string, message: string) => string;
  }
> = {
  ja: {
    subject: "藤八茶寮 - お問合せありがとうございました",
    body: (company, department, lastName, firstName, phone, email, message) =>
      [
        [company, department].filter(Boolean).join(" ") + " 様",
        "",
        "この度はお問い合わせいただきありがとうございました。",
        "下記内容にて承りました。",
        "",
        `事業者名: ${company}`,
        department ? `部署名: ${department}` : null,
        `名前: ${lastName} ${firstName}`,
        `電話番号: ${phone}`,
        `メールアドレス: ${email}`,
        "",
        "お問い合わせ内容:",
        message,
        "",
        "担当者より数日中に返信いたしますので、しばらくお待ちください。",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  en: {
    subject: "Tohachi Saryo - Thank you for your inquiry",
    body: (company, department, lastName, firstName, phone, email, message) =>
      [
        `Dear ${[company, department].filter(Boolean).join(" ") || "Customer"},`,
        "",
        "Thank you for your inquiry. We have received the following details.",
        "",
        `Company: ${company}`,
        department ? `Department: ${department}` : null,
        `Name: ${lastName} ${firstName}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
        "",
        "We will reply within a few business days.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  ko: {
    subject: "토하치 사료 - 문의해 주셔서 감사합니다",
    body: (company, department, lastName, firstName, phone, email, message) =>
      [
        [company, department].filter(Boolean).join(" ") + " 님,",
        "",
        "문의해 주셔서 감사합니다. 아래 내용으로 접수되었습니다.",
        "",
        `사업자명: ${company}`,
        department ? `부서: ${department}` : null,
        `이름: ${lastName} ${firstName}`,
        `전화: ${phone}`,
        `이메일: ${email}`,
        "",
        "문의 내용:",
        message,
        "",
        "담당자가 며칠 내로 답변드리겠습니다.",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  zh: {
    subject: "藤八茶寮 - 感谢您的咨询",
    body: (company, department, lastName, firstName, phone, email, message) =>
      [
        `尊敬的 ${[company, department].filter(Boolean).join(" ") || "客户"}，`,
        "",
        "感谢您的咨询。我们已收到以下内容。",
        "",
        `公司：${company}`,
        department ? `部门：${department}` : null,
        `姓名：${lastName} ${firstName}`,
        `电话：${phone}`,
        `邮箱：${email}`,
        "",
        "咨询内容：",
        message,
        "",
        "我们将在数日内回复。",
      ]
        .filter(Boolean)
        .join("\n"),
  },
};

/** 注文確認メール（クライアント宛）のラベル。locale 用。 */
export const ORDER_EMAIL_LABELS: Record<
  Locale,
  {
    intro: string;
    titleLine: string;
    orderContent: string;
    thProduct: string;
    thQty: string;
    thUnitPrice: string;
    thAmount: string;
    shipping: string;
    total: string;
    taxIncluded: string;
    shippingDate: string;
    billingLabel: string;
    shippingAddrLabel: string;
    memoLabel: string;
    orderNoLabel: string;
  }
> = {
  ja: {
    intro: "藤八茶寮 をご利用いただき、ありがとうございます。藤八茶寮 がお客様のご注文を承ったことをお知らせいたします。",
    titleLine: "ご注文の確認",
    orderContent: "ご注文内容：",
    thProduct: "商品",
    thQty: "数量",
    thUnitPrice: "単価",
    thAmount: "金額",
    shipping: "送料",
    total: "合計",
    taxIncluded: "内消費税",
    shippingDate: "発送予定日：本日より2～5営業日",
    billingLabel: "請求先住所：",
    shippingAddrLabel: "お届け先：",
    memoLabel: "注文に関するメモ：",
    orderNoLabel: "注文番号：",
  },
  en: {
    intro: "Thank you for your order at Tohachi Saryo. We have received your order as below.",
    titleLine: "Order confirmation",
    orderContent: "Order details:",
    thProduct: "Item",
    thQty: "Qty",
    thUnitPrice: "Unit price",
    thAmount: "Amount",
    shipping: "Shipping",
    total: "Total",
    taxIncluded: "Tax included",
    shippingDate: "Estimated delivery: 2–5 business days.",
    billingLabel: "Billing address:",
    shippingAddrLabel: "Shipping address:",
    memoLabel: "Order notes:",
    orderNoLabel: "Order No.:",
  },
  ko: {
    intro: "토하치 사료를 이용해 주셔서 감사합니다. 주문이 접수되었음을 알려드립니다.",
    titleLine: "주문 확인",
    orderContent: "주문 내역:",
    thProduct: "상품",
    thQty: "수량",
    thUnitPrice: "단가",
    thAmount: "금액",
    shipping: "배송비",
    total: "합계",
    taxIncluded: "포함 세금",
    shippingDate: "배송 예정: 2~5 영업일.",
    billingLabel: "청구지 주소:",
    shippingAddrLabel: "배송지:",
    memoLabel: "주문 메모:",
    orderNoLabel: "주문번호:",
  },
  zh: {
    intro: "感谢您在藤八茶寮下单。我们已收到您的订单，详情如下。",
    titleLine: "订单确认",
    orderContent: "订单内容：",
    thProduct: "商品",
    thQty: "数量",
    thUnitPrice: "单价",
    thAmount: "金额",
    shipping: "运费",
    total: "合计",
    taxIncluded: "含税",
    shippingDate: "预计发货：2～5个工作日。",
    billingLabel: "账单地址：",
    shippingAddrLabel: "收货地址：",
    memoLabel: "订单备注：",
    orderNoLabel: "订单号：",
  },
};

/** 注文確認メールの件名（クライアント宛）。firstItemName と他点数で組み立て。 */
export const ORDER_EMAIL_SUBJECT: Record<Locale, (firstItemName: string, othersCount: number) => string> = {
  ja: (first, others) => (others > 0 ? `藤八茶寮よりご注文の確認 ${first} 他 ${others} 点` : `藤八茶寮よりご注文の確認 ${first}`),
  en: (first, others) => (others > 0 ? `Tohachi Saryo – Order confirmation: ${first} + ${others} more` : `Tohachi Saryo – Order confirmation: ${first}`),
  ko: (first, others) => (others > 0 ? `토하치 사료 주문 확인: ${first} 외 ${others}건` : `토하치 사료 주문 확인: ${first}`),
  zh: (first, others) => (others > 0 ? `藤八茶寮 订单确认：${first} 等 ${others} 件` : `藤八茶寮 订单确认：${first}`),
};
