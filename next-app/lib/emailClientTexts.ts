/** お問い合わせ：クライアント宛返信メールの件名・本文 */
export const INQUIRY_EMAIL_CLIENT = {
  subject: "藤八茶寮 - お問合せありがとうございました",
  body: (name: string, email: string, message: string) =>
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
};

/** パートナー募集：クライアント宛返信メールの件名・本文 */
export const WHOLESALE_EMAIL_CLIENT = {
  subject: "藤八茶寮 - お問合せありがとうございました",
  body: (
    company: string,
    department: string,
    lastName: string,
    firstName: string,
    phone: string,
    email: string,
    message: string,
  ) =>
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
};

/** 注文確認メール（クライアント宛）のラベル。 */
export const ORDER_EMAIL_LABELS = {
  intro: "藤八茶寮 をご利用いただき、ありがとうございます。藤八茶寮 がお客様のご注文を承ったことをお知らせいたします。",
  titleLine: "ご注文の確認",
  orderContent: "ご注文内容：",
  thProduct: "商品",
  thQty: "数量",
  thUnitPrice: "単価",
  thAmount: "金額",
  shipping: "送料",
  discount: "割引",
  total: "合計",
  taxIncluded: "内消費税",
  shippingDate: "発送予定日：本日より2～5営業日",
  billingLabel: "請求先住所：",
  shippingAddrLabel: "お届け先：",
  memoLabel: "注文に関するメモ：",
  orderNoLabel: "注文番号：",
};

/** 注文確認メールの件名（クライアント宛）。firstItemName と他点数で組み立て。 */
export const ORDER_EMAIL_SUBJECT = (firstItemName: string, othersCount: number) =>
  othersCount > 0
    ? `藤八茶寮よりご注文の確認 ${firstItemName} 他 ${othersCount} 点`
    : `藤八茶寮よりご注文の確認 ${firstItemName}`;

/** 発送完了メール（顧客宛）の件名・本文。orderNo と trackingNumber は任意。orderSummaryHtml があると「お届けしたご注文内容」として埋め込む。 */
export const SHIPPING_COMPLETE_EMAIL = {
  subject: "【藤八茶寮】ご注文品を発送いたしました",
  bodyHtml: (orderNo?: string, trackingNumber?: string, orderSummaryHtml?: string): string => {
    const orderLine =
      orderNo?.trim() ?
        `<p style="margin:12px 0;">注文番号：${orderNo.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
      : "";
    const trackingLine =
      trackingNumber?.trim() ?
        `<p style="margin:12px 0;">お問い合わせ番号（追跡用）：${trackingNumber.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
      : "";
    const orderBlock =
      orderSummaryHtml?.trim() ?
        `<p style="margin:16px 0 8px; font-weight:700;">お届けしたご注文内容</p><div style="margin:0 0 16px;">${orderSummaryHtml}</div>`
      : "";
    return `
<div style="font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif; color:#111827; line-height:1.8;">
  <p>いつも藤八茶寮をご利用いただき、ありがとうございます。</p>
  <p>お客様のご注文品を発送いたしましたので、お知らせいたします。</p>
  ${orderLine}
  ${trackingLine}
  ${orderBlock}
  <p style="margin:16px 0 0;">到着まで今しばらくお待ちください。</p>
  <p style="margin:24px 0 0;">藤八茶寮</p>
</div>`;
  },
};
