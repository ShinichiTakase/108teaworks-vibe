import type React from "react";
import Image from "next/image";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { formatPriceYen } from "@/lib/formatters";
import type { Locale } from "@/lib/i18n";
import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { buildLocalizedPath } from "@/lib/urlPath";

const PRODUCT_SLUGS = [
  "roasted-isecha-teabag",
  "roasted-isecha",
  "roasted-isecha-powder-unsweetened",
  "roasted-isecha-teabag-bulkpack",
] as const;

type HoujichaTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec1P4: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2LinkText: string;
  sec3Title: string;
  productNames: readonly [string, string, string, string];
  viewDetails: string;
  sec4Title: string;
  sec4P1: string;
  sec4P2: string;
  sec4LinkText: string;
  sec5Title: string;
  sec5HotLabel: string;
  sec5HotItems: readonly [string, string, string];
  sec5ColdLabel: string;
  sec5ColdItems: readonly [string, string, string];
  sec5PowderLabel: string;
  sec5PowderItems: readonly [string, string, string];
  sec5LinkText: string;
  sec5LinkHref: string;
  sec6Title: string;
  faqs: readonly { q: string; a: string }[];
  breadcrumbName: string;
};

const TEXTS: Record<Locale, HoujichaTexts> = {
  ja: {
    h1: "ほうじ茶の通販｜川俣谷産シングルオリジン伊勢茶",
    leadP:
      "ほうじ茶は、緑茶を高温で焙煎することで生まれる、香ばしい香りとまろやかな味わいが特徴のお茶です。藤八茶寮のほうじ茶は、三重県松阪市・川俣谷の自家茶畑で育てたシングルオリジン伊勢茶をベースに、ティーバッグ・茶葉・パウダーの3形態でお届けします。焙煎によりカフェインが揮発するため、夜のティータイムや食事のお供にも最適です。",
    sec1Title: "ほうじ茶とは——焙煎が生む、香ばしさとまろやかさ",
    sec1P1:
      "ほうじ茶は、緑茶（番茶・煎茶・茎茶など）を200℃前後の高温で焙煎したお茶です。高温焙煎によって茶葉の成分が変化し、ピラジン類と呼ばれる芳香成分が生成されることで、ほうじ茶特有の香ばしい香りが生まれます。",
    sec1P2:
      "焙煎の工程でカフェインの一部が揮発するため、100mlあたり約10mgと一般的な緑茶の約3分の2以下に抑えられます。夜のティータイムや、カフェインを控えたい方にもおすすめです。",
    sec1P3:
      "また、タンニン（渋み成分）が熱変性することで渋みが抑えられ、まろやかな味わいになります。水色（すいしょく）は赤褐色——緑茶とは異なる独特の色合いも、ほうじ茶の特徴のひとつです。",
    sec1P4:
      "藤八茶寮のほうじ茶は、川俣谷産のシングルオリジン伊勢茶をベースにしています。もともと旨み豊かな茶葉を使うことで、焙煎後も旨みの土台がしっかりと残り、香ばしさと旨みが際立つほうじ茶に仕上がります。",
    sec2Title: "川俣谷産シングルオリジンのほうじ茶",
    sec2P1:
      "川俣谷は、三重県松阪市飯南町に位置する伊勢茶発祥の地として知られる産地です。三方を山に囲まれた谷地形が午後の日照を自然に遮り、茶葉が旨み成分（テアニン）をじっくりと蓄えます。この「自然かぶせに近い条件」が、他産地にはない豊かな旨みを生み出します。",
    sec2P2:
      "その旨みを土台にした茶葉を使うからこそ、焙煎後も香りと旨みが際立つほうじ茶になります。収穫した茶葉は川俣谷を熟知した地元の製茶所で丁寧に加工し、産地から直接お届けします。",
    sec2LinkText: "深蒸し茶についてはこちら",
    sec3Title: "藤八茶寮のほうじ茶 商品一覧",
    productNames: [
      "伊勢茶 ほうじ茶 ティーバッグ 8個",
      "伊勢茶 ほうじ茶 茶葉 30g",
      "伊勢茶 ほうじ茶パウダー 80g",
      "お得用 伊勢茶 ほうじ茶 ティーバッグ 50個",
    ],
    viewDetails: "詳しく見る >>",
    sec4Title: "ほうじ茶パウダーの使い方",
    sec4P1:
      "藤八茶寮のほうじ茶パウダーは、お湯や牛乳に溶かすだけでほうじ茶ラテが手軽に作れます。ほうじ茶特有の香ばしさが牛乳の甘みと合わさり、カフェのようなひと杯をご自宅でお楽しみいただけます。",
    sec4P2:
      "製菓や料理への活用も広がります。パンケーキ・アイスクリーム・チョコレートの風味づけ、お菓子のクリームや生地への混ぜ込みなど、抹茶パウダーと同様の感覚でお使いいただけます。",
    sec4LinkText: "抹茶・パウダー緑茶との違いはこちら",
    sec5Title: "美味しい淹れ方",
    sec5HotLabel: "ホットの場合",
    sec5HotItems: [
      "お湯の温度：90〜100℃（高温で香りが引き立ちます）",
      "量の目安：ティーバッグ1個、茶葉は3〜4g",
      "蒸らし時間：30秒〜1分",
    ],
    sec5ColdLabel: "水出しの場合",
    sec5ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で1〜2時間",
      "香ばしさが柔らかく広がり、すっきりした味わいに",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec5PowderLabel: "パウダーの場合",
    sec5PowderItems: [
      "小さじ1杯（約2g）を80〜100℃のお湯150mlに溶かす",
      "牛乳で溶かすとほうじ茶ラテに",
      "製菓の場合は小麦粉100gに対して小さじ2〜3杯が目安",
    ],
    sec5LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec5LinkHref: "/how-to-brew/",
    sec6Title: "よくある質問",
    faqs: [
      {
        q: "ほうじ茶は低カフェインですか？",
        a: "はい。焙煎の工程でカフェインが揮発するため、100mlあたり約10mgと一般的な緑茶の約3分の2以下です。夜のティータイムや、カフェインを控えたい方にもおすすめです。",
      },
      {
        q: "ほうじ茶パウダーと茶葉・ティーバッグの違いは何ですか？",
        a: "ティーバッグ・茶葉はお湯で抽出して飲む形態です。パウダーはお湯や牛乳に直接溶かせるため、ほうじ茶ラテやお菓子作りにも活用できます。どちらも同じ川俣谷産の茶葉を使用しています。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で1〜2時間置くと、香ばしさが柔らかく広がる水出しほうじ茶が楽しめます。",
      },
      {
        q: "農薬や添加物は使っていますか？",
        a: "三重県産の茶葉のみを使用しており、添加物は一切使用していません。原材料名は「緑茶（三重県）」のみです。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
    ],
    breadcrumbName: "ほうじ茶の通販",
  },

  en: {
    h1: "Houjicha Online | Roasted Single-Origin Ise Tea from Kawamatatani",
    leadP:
      "Houjicha is a roasted green tea celebrated for its toasty aroma and smooth, gentle flavour. Fujihachi Saryo's houjicha is made from single-origin Ise tea grown in our own fields in Kawamatatani, Matsusaka, Mie Prefecture, and is available as teabags, loose leaf, and powder. Roasting reduces caffeine, making it ideal for evenings and as a companion to meals.",
    sec1Title: "What is houjicha? — the toasty richness born from roasting",
    sec1P1:
      "Houjicha is made by roasting green tea leaves (such as bancha, sencha, or kukicha) at around 200°C. This high-temperature roasting transforms the tea's compounds, producing pyrazine aromatics that give houjicha its signature toasty fragrance.",
    sec1P2:
      "Roasting also causes some caffeine to evaporate, reducing the content to approximately 10 mg per 100 ml — less than two-thirds of regular green tea. This makes houjicha a good choice in the evenings or for those watching their caffeine intake.",
    sec1P3:
      "Heat also denatures tannins, the compounds responsible for bitterness, giving houjicha its smooth, mellow flavour. The liquor takes on a distinctive amber-brown colour — quite different from the green of unroasted tea.",
    sec1P4:
      "Fujihachi Saryo's houjicha is roasted from single-origin Ise tea from Kawamatatani. Starting with leaves naturally rich in umami means the roasting builds on a solid flavour foundation — producing a houjicha where both the toasty aroma and the tea's inherent umami shine through.",
    sec2Title: "Single-origin houjicha from Kawamatatani",
    sec2P1:
      "Kawamatatani is a storied tea-growing region in Matsusaka, Mie Prefecture — known as the birthplace of Ise tea. The valley's mountain-surrounded terrain naturally blocks afternoon sunlight, allowing the leaves to accumulate theanine, the amino acid behind green tea's characteristic umami. This natural shading-like environment produces tea that other regions cannot replicate.",
    sec2P2:
      "Starting with leaves rich in umami means that even after roasting, the flavour foundation remains strong — giving rise to a houjicha with vivid toasty aroma and depth of taste. After harvesting, the leaves are carefully processed by a local producer with intimate knowledge of Kawamatatani, then delivered direct from origin to you.",
    sec2LinkText: "Learn more about fukamushi sencha",
    sec3Title: "Houjicha Products from Fujihachi Saryo",
    productNames: [
      "Ise Tea Houjicha Teabags × 8",
      "Ise Tea Houjicha Loose Leaf 30 g",
      "Ise Tea Houjicha Powder 80 g",
      "Ise Tea Houjicha Teabags × 50 (Value Pack)",
    ],
    viewDetails: "View details >>",
    sec4Title: "Ways to use houjicha powder",
    sec4P1:
      "Fujihachi Saryo's houjicha powder dissolves easily in hot water or milk, making it simple to create a houjicha latte at home. The toasty aroma of houjicha pairs beautifully with the sweetness of milk for a café-quality cup in minutes.",
    sec4P2:
      "The powder is also versatile in baking and cooking — flavouring pancakes, ice cream, and chocolate, or mixing into creams and doughs in the same way you would use matcha powder.",
    sec4LinkText: "See how houjicha powder compares to matcha and powdered green tea",
    sec5Title: "How to Brew",
    sec5HotLabel: "Hot",
    sec5HotItems: [
      "Water temperature: 90–100°C (higher temperature brings out more aroma)",
      "Amount: 1 teabag, or 3–4 g of loose leaf",
      "Steeping time: 30 seconds to 1 minute",
    ],
    sec5ColdLabel: "Cold brew",
    sec5ColdItems: [
      "Add 1–2 teabags to 500 ml of cold water and refrigerate for 1–2 hours",
      "The toasty aroma softens into a clean, refreshing flavour",
      "Remove the teabags after brewing before storing",
    ],
    sec5PowderLabel: "Powder",
    sec5PowderItems: [
      "Dissolve 1 teaspoon (approx. 2 g) in 150 ml of water at 80–100°C",
      "Use milk instead of water for a houjicha latte",
      "For baking: use 2–3 teaspoons per 100 g of flour as a guide",
    ],
    sec5LinkText: "For detailed brewing instructions, see our How to Brew page",
    sec5LinkHref: "/en/how-to-brew/",
    sec6Title: "Frequently Asked Questions",
    faqs: [
      {
        q: "Is houjicha low in caffeine?",
        a: "Yes. Roasting causes some caffeine to evaporate, reducing the content to approximately 10 mg per 100 ml — less than two-thirds of regular green tea. It is a good choice for evenings or when you want to limit caffeine.",
      },
      {
        q: "What is the difference between houjicha powder and teabags or loose leaf?",
        a: "Teabags and loose leaf are brewed by steeping in hot water. The powder dissolves directly in hot water or milk, making it ideal for houjicha lattes and baking. All forms use the same tea leaves from Kawamatatani.",
      },
      {
        q: "Can I make cold brew houjicha?",
        a: "Yes. Place teabags in cold water and refrigerate for 1–2 hours to enjoy a cold brew houjicha where the toasty aroma gently opens up.",
      },
      {
        q: "Do you use pesticides or additives?",
        a: "We use only tea leaves grown in Mie Prefecture and add no additives whatsoever. The only ingredient is \"green tea (Mie Prefecture)\".",
      },
      {
        q: "What is the shelf life?",
        a: "The shelf life is one year from the date of manufacture. After opening, store away from moisture and consume as soon as possible.",
      },
    ],
    breadcrumbName: "Houjicha Online",
  },

  ko: {
    h1: "호지차 통신판매｜가와마타다니산 싱글 오리진 이세차",
    leadP:
      "호지차는 녹차를 고온에서 볶아 만든 차로, 구수한 향과 부드러운 맛이 특징입니다. 후지하치야의 호지차는 미에현 마쓰사카시·가와마타다니의 자가 찻밭에서 기른 싱글 오리진 이세차를 베이스로, 티백·찻잎·파우더의 3가지 형태로 제공합니다. 볶음 과정에서 카페인이 휘발되어 저카페인이 되므로, 저녁 티타임이나 식사 반찬으로도 최적입니다.",
    sec1Title: "호지차란? — 볶음이 만드는 구수함과 부드러움",
    sec1P1:
      "호지차는 녹차(반차·센차·줄기차 등)를 200℃ 전후의 고온에서 볶은 차입니다. 고온 볶음에 의해 찻잎의 성분이 변화하고 피라진류라는 방향성분이 생성되어, 호지차 특유의 구수한 향이 만들어집니다.",
    sec1P2:
      "볶음 과정에서 카페인의 일부가 휘발되어 100ml당 약 10mg으로 일반 녹차의 약 3분의 2 이하가 됩니다. 저녁 티타임이나 카페인을 줄이고 싶은 분께도 추천합니다.",
    sec1P3:
      "또한 타닌(떫은맛 성분)이 열변성하여 떫은맛이 억제되고 부드러운 맛이 됩니다. 탕색은 적갈색으로, 녹차와는 다른 독특한 색도 호지차의 특징 중 하나입니다.",
    sec1P4:
      "후지하치야의 호지차는 가와마타다니산 싱글 오리진 이세차를 베이스로 사용합니다. 원래 감칠맛이 풍부한 찻잎을 사용하기 때문에 볶음 후에도 감칠맛의 토대가 남아 구수함과 감칠맛이 돋보이는 호지차가 됩니다.",
    sec2Title: "가와마타다니산 싱글 오리진 호지차",
    sec2P1:
      "가와마타다니는 미에현 마쓰사카시 이이난초에 위치한 이세차 발상지로 알려진 산지입니다. 삼방이 산으로 둘러싸인 골짜기 지형이 오후 일조를 자연스럽게 차단하여, 찻잎이 감칠맛 성분(테아닌)을 천천히 축적합니다. 이 「자연 피복에 가까운 조건」이 다른 산지에는 없는 풍부한 감칠맛을 만들어냅니다.",
    sec2P2:
      "감칠맛을 토대로 한 찻잎을 사용하기 때문에 볶음 후에도 향과 감칠맛이 돋보이는 호지차가 됩니다. 수확한 찻잎은 가와마타다니를 잘 아는 지역 제다소에서 정성스럽게 가공하여 산지에서 직접 배송합니다.",
    sec2LinkText: "후카무시 녹차에 대해서는 이쪽",
    sec3Title: "후지하치야의 호지차 상품 목록",
    productNames: [
      "이세차 호지차 티백 8개",
      "이세차 호지차 찻잎 30g",
      "이세차 호지차 파우더 80g",
      "대용량 이세차 호지차 티백 50개",
    ],
    viewDetails: "자세히 보기 >>",
    sec4Title: "호지차 파우더 활용법",
    sec4P1:
      "후지하치야의 호지차 파우더는 뜨거운 물이나 우유에 녹이기만 하면 손쉽게 호지차 라테를 만들 수 있습니다. 호지차 특유의 구수한 향과 우유의 단맛이 어우러져 카페 같은 한 잔을 집에서 즐기실 수 있습니다.",
    sec4P2:
      "제과나 요리에도 폭넓게 활용할 수 있습니다. 팬케이크·아이스크림·초콜릿의 풍미 더하기, 과자 크림이나 반죽에 섞기 등 말차 파우더와 같은 감각으로 사용하실 수 있습니다.",
    sec4LinkText: "말차·파우더 녹차와의 차이는 이쪽",
    sec5Title: "맛있게 우리는 법",
    sec5HotLabel: "따뜻하게 마실 때",
    sec5HotItems: [
      "물 온도：90〜100℃（높은 온도에서 향이 돋보입니다）",
      "양의 기준：티백 1개, 찻잎은 3〜4g",
      "우리는 시간：30초〜1분",
    ],
    sec5ColdLabel: "냉차로 마실 때",
    sec5ColdItems: [
      "찬물 500ml에 티백 1〜2개를 넣고 냉장고에서 1〜2시간",
      "구수한 향이 부드럽게 퍼지며 깔끔한 맛이 납니다",
      "우린 후에는 티백을 꺼내고 보관해 주세요",
    ],
    sec5PowderLabel: "파우더의 경우",
    sec5PowderItems: [
      "작은 숟가락 1개분（약 2g）을 80〜100℃의 뜨거운 물 150ml에 녹입니다",
      "우유로 녹이면 호지차 라테가 됩니다",
      "제과의 경우 밀가루 100g에 대해 작은 숟가락 2〜3개분이 기준입니다",
    ],
    sec5LinkText: "자세한 우리는 법은 우려내기 페이지를 참고해 주세요",
    sec5LinkHref: "/ko/how-to-brew/",
    sec6Title: "자주 묻는 질문",
    faqs: [
      {
        q: "호지차는 저카페인인가요?",
        a: "네. 볶음 과정에서 카페인이 휘발되어 100ml당 약 10mg으로 일반 녹차의 약 3분의 2 이하입니다. 저녁 티타임이나 카페인을 줄이고 싶은 분께도 추천합니다.",
      },
      {
        q: "호지차 파우더와 찻잎·티백의 차이는 무엇인가요?",
        a: "티백·찻잎은 뜨거운 물로 우려서 마시는 형태입니다. 파우더는 뜨거운 물이나 우유에 직접 녹일 수 있어 호지차 라테나 과자 만들기에도 활용할 수 있습니다. 모두 같은 가와마타다니산 찻잎을 사용합니다.",
      },
      {
        q: "냉차로도 맛있게 마실 수 있나요?",
        a: "네. 냉수에 티백을 넣고 냉장고에서 1〜2시간 두면 구수한 향이 부드럽게 퍼지는 냉차 호지차를 즐길 수 있습니다.",
      },
      {
        q: "농약이나 첨가물을 사용하고 있나요?",
        a: "미에현산 찻잎만 사용하며, 첨가물은 일체 사용하지 않습니다. 원재료명은 '녹차(미에현)'뿐입니다.",
      },
      {
        q: "유통기한은 얼마나 되나요?",
        a: "제조일로부터 1년입니다. 개봉 후에는 습기를 피해 보관하시고, 빨리 드시기를 권장합니다.",
      },
    ],
    breadcrumbName: "호지차 통신판매",
  },

  zh: {
    h1: "焙茶网购｜川俣谷产单一产地伊势茶",
    leadP:
      "焙茶是将绿茶经高温焙烤而成的茶，以浓郁的焙香和醇和口感著称。藤八茶寮的焙茶以三重县松阪市·川俣谷自家茶园栽培的单一产地伊势茶为基底，提供茶包、散茶及粉末三种形态。焙烤过程中咖啡因部分挥发，使其成为低咖啡因茶，非常适合夜间品茗或作为餐桌伴侣。",
    sec1Title: "焙茶是什么？——焙烤孕育的香气与醇和",
    sec1P1:
      "焙茶是将绿茶（番茶、煎茶、茎茶等）在200℃左右的高温下焙烤而成的茶。高温焙烤使茶叶成分发生变化，生成吡嗪类芳香成分，赋予焙茶独特的焙香。",
    sec1P2:
      "焙烤过程中部分咖啡因挥发，使每100ml咖啡因含量降至约10mg，不足一般绿茶的三分之二。非常适合夜间饮用或希望控制咖啡因摄入的朋友。",
    sec1P3:
      "单宁（涩味成分）在加热中发生热变性，涩味被抑制，口感更加醇和顺滑。茶汤呈红褐色，与绿茶截然不同，这也是焙茶的一大特征。",
    sec1P4:
      "藤八茶寮的焙茶以川俣谷产单一产地伊势茶为基底。由于原料茶叶本身鲜甜丰富，焙烤后鲜甜的底蕴依然留存，成就了焙香与鲜甜并存的焙茶。",
    sec2Title: "川俣谷产单一产地焙茶",
    sec2P1:
      "川俣谷是三重县松阪市饭南町的历史名产区，被誉为伊势茶发祥地。三面环山的山谷地形自然遮挡午后阳光，使茶叶缓缓积累茶氨酸（鲜味氨基酸），形成与人工遮阴茶相近的自然环境，孕育出其他产区无法复现的丰富鲜甜。",
    sec2P2:
      "以鲜甜为底蕴的茶叶经过焙烤，香气与鲜甜愈发突出。采收后的茶叶由熟悉川俣谷的当地制茶厂精心加工，从产地直送到您手中。",
    sec2LinkText: "了解深蒸绿茶请点击此处",
    sec3Title: "藤八茶寮的焙茶商品一览",
    productNames: [
      "伊势茶焙茶茶包 8个",
      "伊势茶焙茶茶叶 30g",
      "伊势茶焙茶粉末 80g",
      "大容量伊势茶焙茶茶包 50个",
    ],
    viewDetails: "查看详情 >>",
    sec4Title: "焙茶粉末的使用方法",
    sec4P1:
      "藤八茶寮的焙茶粉末只需用热水或牛奶溶化，即可轻松制作焙茶拿铁。焙茶特有的焙香与牛奶的甜味相融，在家就能享受咖啡馆品质的一杯。",
    sec4P2:
      "粉末还可广泛用于烘焙和烹饪，如为松饼、冰淇淋、巧克力增添风味，或混入甜点奶油和面团中，使用方法与抹茶粉相同。",
    sec4LinkText: "了解焙茶粉与抹茶及粉末绿茶的区别请点击此处",
    sec5Title: "冲泡方法",
    sec5HotLabel: "热饮",
    sec5HotItems: [
      "水温：90～100℃（高温更能激发香气）",
      "用量：茶包1个，散茶约3～4g",
      "浸泡时间：30秒～1分钟",
    ],
    sec5ColdLabel: "冷泡",
    sec5ColdItems: [
      "将1～2个茶包放入500ml冷水中，冷藏1～2小时",
      "焙香柔和散开，口感清爽宜人",
      "浸泡完成后请取出茶包再保存",
    ],
    sec5PowderLabel: "粉末冲泡",
    sec5PowderItems: [
      "将1小勺（约2g）溶于80～100℃的热水150ml中",
      "用牛奶溶化可制成焙茶拿铁",
      "用于烘焙时，以100g面粉搭配2～3小勺为参考量",
    ],
    sec5LinkText: "详细冲泡方法请参阅冲泡方法页面",
    sec5LinkHref: "/zh/how-to-brew/",
    sec6Title: "常见问题",
    faqs: [
      {
        q: "焙茶是低咖啡因茶吗？",
        a: "是的。焙烤过程中咖啡因挥发，每100ml含量降至约10mg，不足一般绿茶的三分之二。非常适合夜间饮用或希望控制咖啡因摄入的朋友。",
      },
      {
        q: "焙茶粉末与茶叶、茶包有何区别？",
        a: "茶叶和茶包需用热水冲泡饮用。粉末可直接溶于热水或牛奶，适合制作焙茶拿铁或用于烘焙。所有形态均使用同一款川俣谷产茶叶。",
      },
      {
        q: "可以做冷泡茶吗？",
        a: "可以。将茶包放入冷水中冷藏1～2小时，即可享用焙香柔和、口感清爽的冷泡焙茶。",
      },
      {
        q: "使用农药或添加剂吗？",
        a: "仅使用三重县产茶叶，不含任何添加剂。原材料名称仅为「绿茶（三重县）」。",
      },
      {
        q: "保质期是多久？",
        a: "自制造之日起1年。开封后请避免受潮保存，并尽快饮用。",
      },
    ],
    breadcrumbName: "焙茶网购",
  },
};

type Props = { locale: Locale };

export default async function HoujichaPage({ locale }: Props) {
  const t = TEXTS[locale];
  const pt = COMMON_TEXTS[locale].product;
  const basePath = locale === "ja" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_BASE_URL}${basePath}/ise-cha/houjicha/`;
  const breadcrumbPath =
    locale === "ja" ? "/ise-cha/houjicha" : `/${locale}/ise-cha/houjicha`;

  const { contents: allProducts } = await getProducts();
  const productData = PRODUCT_SLUGS.map((slug, i) => {
    const p = allProducts.find((ap) => ap.SLUG === slug);
    return {
      slug,
      name: t.productNames[i],
      href: buildLocalizedPath(locale, `/ise-cha/${slug}`),
      imagePath: getProductImagePath(slug),
      price: p?.PRICE,
      outOfStock: p?.STOCK === 0,
    };
  });
  const mainImagePath = productData[0].imagePath;

  const inLanguage =
    locale === "ja" ? "ja" : locale === "en" ? "en" : locale === "ko" ? "ko" : "zh";

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.h1}
        description={t.leadP}
        imageUrl={
          mainImagePath
            ? `${SITE_BASE_URL}${mainImagePath}`
            : `${SITE_BASE_URL}/images/ise-cha/catechin/catechin.webp`
        }
        canonicalUrl={canonicalUrl}
        inLanguage={inLanguage}
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, locale, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="houjicha" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          {locale === "ja" && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
              <div>
                <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">香ばしさとまろやかさ。夜でも安心の伊勢茶</p>
                <p className="m-0 text-[0.8125rem] text-ink-muted">川俣谷産シングルオリジン・低カフェイン</p>
              </div>
              <Link
                href={productData[0].href}
                className="shrink-0 rounded-lg border border-tea-light px-5 py-2.5 text-[0.9375rem] font-semibold text-tea-deep no-underline transition-colors hover:border-tea hover:bg-washi"
              >
                試してみる {formatPriceYen(productData[0].price)}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {mainImagePath && (
                  <Link href={productData[0].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={mainImagePath}
                        alt={productData[0].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[0].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[0].name}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
                {productData[2].imagePath && (
                  <Link href={productData[2].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[2].imagePath}
                        alt={productData[2].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[2].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[2].name}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
              </div>
            </aside>

            {/* 本文：セクション1〜2 */}
            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP}</p>

              {/* モバイル：商品リンク */}
              <Link
                href={productData[0].href}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{productData[0].name}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                  &gt;&gt;
                </span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec1Title}</h2>
              <p>{t.sec1P1}</p>
              <p>{t.sec1P2}</p>
              <p>{t.sec1P3}</p>
              <p>{t.sec1P4}</p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p>
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/fukamushi")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2LinkText}
                </Link>
              </p>

              {locale === "ja" && (
                <>
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">明治から令和へ、160年続く川俣谷の茶園</h2>
                  <p>藤八茶寮の屋号は、明治の茶商人・高瀬藤八に由来します。三重県松阪市の自社茶園で育てた伊勢茶を携えて神戸の港へ向かい、アメリカ商館を相手に渡り合いながら、西海岸への輸出航路を切り拓いた人物です。</p>
                  <p>その茶園が今も川俣谷にあります。鎌倉時代に始まったとされる伊勢茶の栽培が続くこの地で、160年以上受け継がれてきた茶葉を、現代の技術と藤八の志をあわせて令和の食卓へお届けしています。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/about")} className="text-tea underline underline-offset-2">
                      藤八茶寮についてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha")} className="text-tea underline underline-offset-2">
                      伊勢茶の産地・歴史についてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">夜でも安心——ほうじ茶のカフェインとカテキン</h2>
                  <p>ほうじ茶は焙煎の工程でカフェインが揮発し、100mlあたり約10mgと一般的な緑茶の約3分の2以下になります。夕食後や就寝前のリラックスタイムにも気兼ねなくお召し上がりいただけます。</p>
                  <p>カフェインが減少する一方、緑茶由来のカテキンは焙煎後も適量残ります。カテキン、特に「ガレート型カテキン」には、悪玉（LDL）コレステロールだけを選択的に低下させる働きが確認されており、毎日続けやすい健康習慣として注目されています。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      お茶とカフェインについてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha/catechin")} className="text-tea underline underline-offset-2">
                      お茶の健康成分（カテキン）についてもっと詳しく
                    </Link>
                  </p>
                </>
              )}
            </section>
          </div>

          {/* セクション4：パウダーの使い方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.sec4P1}</p>
              <p>{t.sec4P2}</p>
              <p>
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/maccha")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec4LinkText}
                </Link>
              </p>
            </div>
          </div>

          {/* セクション5：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5HotLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5ColdLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5ColdItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec5PowderLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5PowderItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <Link href={t.sec5LinkHref} className="text-tea underline underline-offset-2">
                {t.sec5LinkText}
              </Link>
            </p>
          </div>

          {/* セクション6：FAQ */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec6Title}</h2>
            <dl className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
              {t.faqs.map(({ q, a }, i) => (
                <details key={i} className="group bg-washi open:bg-white">
                  <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                    <dt className="flex-1 text-[0.9375rem] font-semibold text-tea-deep leading-relaxed">
                      <span className="mr-2 text-tea">Q.</span>
                      {q}
                    </dt>
                    <span
                      className="mt-0.5 shrink-0 text-tea-deep/50 transition-transform group-open:rotate-180"
                      aria-hidden
                    >
                      ▾
                    </span>
                  </summary>
                  <dd className="m-0 px-4 pb-4 pt-1">
                    <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                      <span className="mr-2 font-semibold text-tea-deep/70">A.</span>
                      {a}
                    </p>
                  </dd>
                </details>
              ))}
            </dl>
          </div>

          {/* 商品一覧（最下部） */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {productData.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="flex flex-col no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:border-tea-light hover:bg-white"
                >
                  <span className="relative block mb-2 aspect-square">
                    {p.imagePath && (
                      <Image
                        src={p.imagePath}
                        alt={p.name}
                        width={640}
                        height={640}
                        className="w-full h-full rounded object-cover bg-cream"
                        sizes="(max-width: 767px) 45vw, 220px"
                      />
                    )}
                    {p.outOfStock && (
                      <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[0.75rem] font-semibold text-cream">
                        {locale === "ja" ? "在庫切れ" : locale === "en" ? "Out of stock" : locale === "ko" ? "품절" : "缺货"}
                      </span>
                    )}
                  </span>
                  <span className="block text-right text-[0.8125rem] font-normal mb-0.5 leading-snug">
                    {p.name}
                  </span>
                  <span className="block text-right text-[0.875rem] font-bold text-tea-deep">
                    {formatPriceYen(p.price)}{" "}
                    <span className="text-[0.75rem] text-ink-muted font-normal">{pt.taxIncluded}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
