import type { Locale } from "@/lib/i18n";

export const CHECKOUT_COMPLETE_TEXTS: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    sectionAria: string;
    sectionTitle: string;
    thProduct: string;
    thQty: string;
    thUnitPrice: string;
    thAmount: string;
    shipping: string;
    total: string;
    includedTax: string;
    orderNoLabel: string;
  }
> = {
  ja: {
    title: "ご購入ありがとうございます。",
    subtitle: "またのご利用をお待ちしております。",
    sectionAria: "ご注文内容の詳細",
    sectionTitle: "ご注文内容",
    thProduct: "商品",
    thQty: "数量",
    thUnitPrice: "単価",
    thAmount: "金額",
    shipping: "送料",
    total: "合計",
    includedTax: "内消費税",
    orderNoLabel: "注文番号：",
  },
  en: {
    title: "Thank you for your purchase.",
    subtitle: "We look forward to serving you again.",
    sectionAria: "Order details",
    sectionTitle: "Order summary",
    thProduct: "Item",
    thQty: "Qty",
    thUnitPrice: "Unit price",
    thAmount: "Amount",
    shipping: "Shipping",
    total: "Total",
    includedTax: "Tax included",
    orderNoLabel: "Order No.: ",
  },
  ko: {
    title: "구매해 주셔서 감사합니다.",
    subtitle: "다시 찾아주시길 기다리겠습니다.",
    sectionAria: "주문 상세",
    sectionTitle: "주문 내역",
    thProduct: "상품",
    thQty: "수량",
    thUnitPrice: "단가",
    thAmount: "금액",
    shipping: "배송비",
    total: "합계",
    includedTax: "포함 세금",
    orderNoLabel: "주문번호: ",
  },
  zh: {
    title: "感谢您的购买。",
    subtitle: "期待您的再次光临。",
    sectionAria: "订单详情",
    sectionTitle: "订单内容",
    thProduct: "商品",
    thQty: "数量",
    thUnitPrice: "单价",
    thAmount: "金额",
    shipping: "运费",
    total: "合计",
    includedTax: "含税",
    orderNoLabel: "订单号：",
  },
};

