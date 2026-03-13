import type { Locale } from "./i18n";

/** トップページ「商品一覧」ブロック */
export const HOME_PRODUCTS_TEXTS: Record<
  Locale,
  {
    sectionAria: string;
    filterLabel: string;
    filterAria: string;
    noProducts: string;
    outOfStock: string;
    filterAll: string;
    filterFukamushi: string;
    filterHoujicha: string;
    filterWakoucha: string;
    filterLeaf: string;
    filterTeabag: string;
    filterPowder: string;
  }
> = {
  ja: {
    sectionAria: "商品一覧",
    filterLabel: "絞り込み:",
    filterAria: "商品の絞り込み",
    noProducts: "該当する商品はありません。",
    outOfStock: "在庫切れ",
    filterAll: "すべて表示",
    filterFukamushi: "深蒸し茶",
    filterHoujicha: "ほうじ茶",
    filterWakoucha: "和紅茶",
    filterLeaf: "リーフ（茶葉）",
    filterTeabag: "ティーバッグ",
    filterPowder: "パウダー",
  },
  en: {
    sectionAria: "Products",
    filterLabel: "Filter:",
    filterAria: "Filter products",
    noProducts: "No matching products.",
    outOfStock: "Out of stock",
    filterAll: "All",
    filterFukamushi: "Deep-steamed tea",
    filterHoujicha: "Houjicha",
    filterWakoucha: "Japanese black tea",
    filterLeaf: "Leaf",
    filterTeabag: "Teabag",
    filterPowder: "Powder",
  },
  ko: {
    sectionAria: "상품 목록",
    filterLabel: "필터:",
    filterAria: "상품 필터",
    noProducts: "해당 상품이 없습니다.",
    outOfStock: "품절",
    filterAll: "전체",
    filterFukamushi: "깊은 증편 차",
    filterHoujicha: "호지차",
    filterWakoucha: "왜홍차",
    filterLeaf: "리프",
    filterTeabag: "티백",
    filterPowder: "파우더",
  },
  zh: {
    sectionAria: "商品列表",
    filterLabel: "筛选：",
    filterAria: "商品筛选",
    noProducts: "暂无相关商品。",
    outOfStock: "缺货",
    filterAll: "全部",
    filterFukamushi: "深蒸茶",
    filterHoujicha: "焙茶",
    filterWakoucha: "和红茶",
    filterLeaf: "茶叶",
    filterTeabag: "茶包",
    filterPowder: "粉末",
  },
};

/** トップページ「最新のお知らせ」ブロック */
export const HOME_NEWS_TEXTS: Record<
  Locale,
  { sectionAria: string; heading: string; empty: string; readMore: string }
> = {
  ja: {
    sectionAria: "お知らせ一覧",
    heading: "最新のお知らせ",
    empty: "お知らせはありません。",
    readMore: "…もっと読む",
  },
  en: {
    sectionAria: "News",
    heading: "Latest news",
    empty: "No news yet.",
    readMore: "Read more…",
  },
  ko: {
    sectionAria: "공지 목록",
    heading: "최신 소식",
    empty: "소식이 없습니다.",
    readMore: "…더 보기",
  },
  zh: {
    sectionAria: "公告列表",
    heading: "最新公告",
    empty: "暂无公告。",
    readMore: "…阅读更多",
  },
};

/** トップページ「Instagram」ブロック */
export const HOME_INSTAGRAM_TEXTS: Record<
  Locale,
  {
    heading: string;
    intro: string;
    postsAria: string;
    postAlt: string;
    followCta: string;
  }
> = {
  ja: {
    heading: "Instagram",
    intro: "で日々のお茶や伊勢茶の魅力をお届けしています。",
    postsAria: "最新の投稿",
    postAlt: "Instagramの投稿",
    followCta: "Instagram でフォロー",
  },
  en: {
    heading: "Instagram",
    intro: "We share daily tea and Ise tea updates here.",
    postsAria: "Latest posts",
    postAlt: "Instagram post",
    followCta: "Follow us on Instagram",
  },
  ko: {
    heading: "Instagram",
    intro: "일상의 차와 이세차 소식을 전해 드립니다.",
    postsAria: "최신 게시물",
    postAlt: "Instagram 게시물",
    followCta: "Instagram에서 팔로우",
  },
  zh: {
    heading: "Instagram",
    intro: "我们在这里分享日常茶与伊势茶的魅力。",
    postsAria: "最新动态",
    postAlt: "Instagram 帖子",
    followCta: "在 Instagram 关注我们",
  },
};

/** トップページ「パートナー募集」ブロック */
export const HOME_WHOLESALE_TEXTS: Record<
  Locale,
  {
    heading: string;
    imgAlt: string;
    intro: string;
    productsTitle: string;
    product1: string;
    product2: string;
    product3: string;
    formatTitle: string;
    format1: string;
    format2: string;
    format3: string;
    formLinkText: string;
  }
> = {
  ja: {
    heading: "パートナー募集",
    imgAlt: "パートナー募集・伊勢茶をビジネスに",
    intro:
      "藤八茶寮では、ビジネスパートナーを募集中です。カフェやレストランのドリンクメニューに、スイーツに、シェアオフィスのリフレッシュアイテムに…いろんなシーンで伊勢茶を気軽に取り入れてみませんか。",
    productsTitle: "ご提供できる商品",
    product1: "深蒸し緑茶",
    product2: "ほうじ茶",
    product3: "和紅茶",
    formatTitle: "商品形態",
    format1: "茶葉（リーフ）",
    format2: "ティーバッグ",
    format3: "パウダー（粉茶）",
    formLinkText: "お問い合わせフォーム",
  },
  en: {
    heading: "Partner recruitment",
    imgAlt: "Partner recruitment – Ise tea for business",
    intro:
      "We are looking for business partners. Whether for café and restaurant drink menus, sweets, or shared-office refreshments—we’d love to help you bring Ise tea into your scene.",
    productsTitle: "Products we offer",
    product1: "Deep-steamed green tea",
    product2: "Houjicha",
    product3: "Japanese black tea",
    formatTitle: "Product forms",
    format1: "Leaf tea",
    format2: "Teabags",
    format3: "Powder",
    formLinkText: "Contact form",
  },
  ko: {
    heading: "파트너 모집",
    imgAlt: "파트너 모집 – 이세차를 비즈니스에",
    intro:
      "토하치 사료에서는 비즈니스 파트너를 모집하고 있습니다. 카페·레스토랑 음료 메뉴, 스위츠, 공유 오피스 리프레시 아이템 등 다양한 장면에서 이세차를 쉽게 활용해 보시겠어요?",
    productsTitle: "제공 가능한 상품",
    product1: "깊은 증편 녹차",
    product2: "호지차",
    product3: "왜홍차",
    formatTitle: "상품 형태",
    format1: "잎차(리프)",
    format2: "티백",
    format3: "파우더(분말)",
    formLinkText: "문의 양식",
  },
  zh: {
    heading: "合作伙伴招募",
    imgAlt: "合作伙伴招募 – 伊势茶商用",
    intro:
      "藤八茶寮正在招募商业合作伙伴。无论是咖啡馆、餐厅的饮品菜单、甜点，还是共享办公室的茶饮……欢迎在各种场景中轻松引入伊势茶。",
    productsTitle: "可提供商品",
    product1: "深蒸绿茶",
    product2: "焙茶",
    product3: "和红茶",
    formatTitle: "商品形态",
    format1: "茶叶（散茶）",
    format2: "茶包",
    format3: "粉末",
    formLinkText: "咨询表单",
  },
};
