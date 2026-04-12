import type { Locale } from "./i18n";

/** 共通UI文言（ナビ・カート・お問い合わせ・フッター・ページネーション等） */
export const COMMON_TEXTS: Record<
  Locale,
  {
    nav: {
      top: string;
      products: string;
      about: string;
      isecha: string;
      /** /ise-cha/ から /ise-cha/books/ へのサブナビ（伊勢茶関連の本） */
      isechaBooks: string;
      /** /ise-cha/ から /ise-cha/america/ へのサブナビ */
      isechaAmerica: string;
      /** /ise-cha/how-to-brew/（伊勢茶セクション内の淹れ方） */
      isechaHowToBrew: string;
      /** /ise-cha/maccha/（抹茶とパウダー緑茶） */
      isechaMaccha: string;
      howToBrew: string;
      userGuide: string;
      notice: string;
      wholesale: string;
    };
    header: {
      /** ヘッダーの購入フロー導線（/checkout） */
      checkout: string;
      inquiry: string;
    };
    /** フローティング導線（/checkout） */
    floatingCheckout: string;
    footer: {
      privacyPolicy: string;
      legal: string;
      domesticShippingNote: string;
      address: string;
      copyright: string;
    };
    pagination: {
      prev: string;
      next: string;
      noticeAria: string;
    };
    notice: {
      title: string;
      empty: string;
      backToList: string;
    };
    product: {
      taxIncluded: string;
      productCode: string;
      janCode: string;
      relatedProducts: string;
      viewDetails: string;
      quantity: string;
      addToCart: string;
      buyNow: string;
    };
    aria: { mainMenu: string; menuButton: string };
    /** ヘッダー下のクーポン告知（空なら非表示） */
    couponBanner: string;
    cart: {
      title: string;
      empty: string;
      continueShopping: string;
      taxIncluded: string;
      subtotal: string;
      shipping: string;
      shippingCalculating: string;
      total: string;
      taxNote: string;
      taxNoteSuffix: string;
      proceedToCheckout: string;
      freeShipping: string;
      freeShippingRemainPrefix: string;
      freeShippingRemain: string;
      decreaseQty: string;
      increaseQty: string;
      remove: string;
    };
  }
> = {
  ja: {
    nav: {
      top: "トップページ",
      products: "商品一覧",
      about: "藤八茶寮について",
      isecha: "伊勢茶とは",
      isechaBooks: "伊勢茶の本",
      isechaAmerica: "伊勢茶とアメリカ",
      isechaHowToBrew: "おいしいお茶の淹れ方",
      isechaMaccha: "抹茶とパウダー緑茶",
      howToBrew: "お茶の淹れ方",
      userGuide: "ご注文の流れ",
      notice: "お知らせ",
      wholesale: "パートナー募集",
    },
    header: { checkout: "購入手続きへ", inquiry: "お問い合わせ" },
    floatingCheckout: "購入手続きへ",
    footer: {
      privacyPolicy: "プライバシーポリシー",
      legal: "特定商取引法に基づく表記",
      domesticShippingNote: "配送は日本国内のみです",
      address: "〒224-0007 横浜市都筑区荏田南一丁目１１番２３号",
      copyright: "©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks",
    },
    pagination: { prev: "前へ", next: "次へ", noticeAria: "お知らせのページネーション" },
    notice: { title: "お知らせ", empty: "現在、お知らせはありません。", backToList: "← お知らせ一覧へ" },
    product: { taxIncluded: "(税込)", productCode: "商品コード", janCode: "JANコード", relatedProducts: "関連商品", viewDetails: "詳しく見る >>", quantity: "数量", addToCart: "カートに追加", buyNow: "今すぐ買う" },
    aria: { mainMenu: "メインメニュー", menuButton: "メニュー" },
    couponBanner: "",
    cart: {
      title: "ショッピングカート",
      empty: "カートに商品はありません。",
      continueShopping: "買い物を続ける",
      taxIncluded: "（税込）",
      subtotal: "小計",
      shipping: "送料",
      shippingCalculating: "計算中",
      total: "合計（税込）",
      taxNote: "（消費税",
      taxNoteSuffix: "を含む）",
      proceedToCheckout: "購入手続きに進む",
      freeShipping: "送料無料です",
      freeShippingRemainPrefix: "あと ",
      freeShippingRemain: " のお買い上げで送料無料です",
      decreaseQty: "数量を減らす",
      increaseQty: "数量を増やす",
      remove: "削除",
    },
  },
  en: {
    nav: {
      top: "Home",
      products: "Products",
      about: "About Us",
      isecha: "What is Ise Tea",
      isechaBooks: "Books on Ise Tea",
      isechaAmerica: "Ise Tea and America",
      isechaHowToBrew: "How to Brew Delicious Tea",
      isechaMaccha: "Matcha vs. powdered green tea",
      howToBrew: "How to Brew",
      userGuide: "Order Guide",
      notice: "News",
      wholesale: "Wholesale",
    },
    header: { checkout: "Proceed to checkout", inquiry: "Contact" },
    floatingCheckout: "Proceed to checkout",
    footer: {
      privacyPolicy: "Privacy Policy",
      legal: "Legal Notice",
      domesticShippingNote: "Shipping within Japan only",
      address: "1-11-23 Edaminami, Tsuzuki-ku, Yokohama 224-0007, Japan",
      copyright: "© Fujihachiya / Single Origin Ise Tea 108teaworks",
    },
    pagination: { prev: "Previous", next: "Next", noticeAria: "News pagination" },
    notice: { title: "News", empty: "There are no news items at the moment.", backToList: "← Back to news" },
    product: { taxIncluded: "(tax incl.)", productCode: "Product code", janCode: "JAN", relatedProducts: "Related products", viewDetails: "View details >>", quantity: "Quantity", addToCart: "Add to cart", buyNow: "Buy now" },
    aria: { mainMenu: "Main menu", menuButton: "Menu" },
    couponBanner: "",
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty.",
      continueShopping: "Continue shopping",
      taxIncluded: "(tax incl.)",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingCalculating: "Calculating",
      total: "Total (tax incl.)",
      taxNote: "(incl. consumption tax ",
      taxNoteSuffix: ")",
      proceedToCheckout: "Proceed to checkout",
      freeShipping: "Free shipping",
      freeShippingRemainPrefix: "",
      freeShippingRemain: " away from free shipping",
      decreaseQty: "Decrease quantity",
      increaseQty: "Increase quantity",
      remove: "Remove",
    },
  },
  ko: {
    nav: {
      top: "홈",
      products: "상품 목록",
      about: "후지하치야 소개",
      isecha: "이세차란",
      isechaBooks: "이세차의 책",
      isechaAmerica: "이세차와 미국",
      isechaHowToBrew: "맛있게 우리는 법",
      isechaMaccha: "말차와 분말 녹차",
      howToBrew: "우려내기",
      userGuide: "주문 안내",
      notice: "소식",
      wholesale: "도매 문의",
    },
    header: { checkout: "결제하기", inquiry: "문의" },
    floatingCheckout: "결제하기",
    footer: {
      privacyPolicy: "개인정보처리방침",
      legal: "거래 조건",
      domesticShippingNote: "일본 국내만 배송합니다",
      address: "〒224-0007 요코하마시 츠즈키구 에다미나미 1-11-23",
      copyright: "© 후지하치야 / 싱글 오리진 이세차 108teaworks",
    },
    pagination: { prev: "이전", next: "다음", noticeAria: "소식 페이지네이션" },
    notice: { title: "소식", empty: "현재 소식이 없습니다.", backToList: "← 소식 목록으로" },
    product: { taxIncluded: "(세금 포함)", productCode: "상품 코드", janCode: "JAN 코드", relatedProducts: "관련 상품", viewDetails: "자세히 보기 >>", quantity: "수량", addToCart: "장바구니에 담기", buyNow: "지금 구매" },
    aria: { mainMenu: "메인 메뉴", menuButton: "메뉴" },
    couponBanner: "",
    cart: {
      title: "쇼핑 카트",
      empty: "장바구니에 상품이 없습니다.",
      continueShopping: "쇼핑 계속하기",
      taxIncluded: "(세금 포함)",
      subtotal: "소계",
      shipping: "배송료",
      shippingCalculating: "계산 중",
      total: "합계 (세금 포함)",
      taxNote: "(부가세 ",
      taxNoteSuffix: " 포함)",
      proceedToCheckout: "결제하기",
      freeShipping: "무료 배송",
      freeShippingRemainPrefix: "",
      freeShippingRemain: " 추가 구매 시 무료 배송",
      decreaseQty: "수량 줄이기",
      increaseQty: "수량 늘리기",
      remove: "삭제",
    },
  },
  zh: {
    nav: {
      top: "首页",
      products: "商品一览",
      about: "关于藤八茶寮",
      isecha: "什么是伊势茶",
      isechaBooks: "伊势茶之书",
      isechaAmerica: "伊势茶与美国",
      isechaHowToBrew: "美味冲泡要诀",
      isechaMaccha: "抹茶与粉末绿茶",
      howToBrew: "冲泡方法",
      userGuide: "订购流程",
      notice: "公告",
      wholesale: "批发合作",
    },
    header: { checkout: "去结账", inquiry: "咨询" },
    floatingCheckout: "去结账",
    footer: {
      privacyPolicy: "隐私政策",
      legal: "特定商交易法表记",
      domesticShippingNote: "仅日本国内配送",
      address: "〒224-0007 横滨市都筑区荏田南1-11-23",
      copyright: "© 藤八茶寮 / 单一产地伊势茶 108teaworks",
    },
    pagination: { prev: "上一页", next: "下一页", noticeAria: "公告分页" },
    notice: { title: "公告", empty: "暂无公告。", backToList: "← 返回公告列表" },
    product: { taxIncluded: "（含税）", productCode: "商品代码", janCode: "JAN码", relatedProducts: "相关商品", viewDetails: "查看详情 >>", quantity: "数量", addToCart: "加入购物车", buyNow: "立即购买" },
    aria: { mainMenu: "主导航", menuButton: "菜单" },
    couponBanner: "",
    cart: {
      title: "购物车",
      empty: "购物车为空。",
      continueShopping: "继续购物",
      taxIncluded: "（含税）",
      subtotal: "小计",
      shipping: "运费",
      shippingCalculating: "计算中",
      total: "合计（含税）",
      taxNote: "（含消费税",
      taxNoteSuffix: "）",
      proceedToCheckout: "去结账",
      freeShipping: "免运费",
      freeShippingRemainPrefix: "再买 ",
      freeShippingRemain: " 即免运费",
      decreaseQty: "减少数量",
      increaseQty: "增加数量",
      remove: "删除",
    },
  },
};

