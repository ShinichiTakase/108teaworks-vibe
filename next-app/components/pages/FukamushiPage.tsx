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
  "deep-steamed-isecha",
  "3teabag-ise-deeproasted",
  "ise-tea-deep-steamed-bulkpack",
  "isecha-powder-unsweetened",
  "ise-tea-powder-unsweetened-bulkpack",
] as const;

type FukamushiTexts = {
  h1: string;
  leadP: string;
  productLinkLabel: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2P3: string;
  sec2P4: string;
  sec3Title: string;
  sec3P1: React.ReactNode;
  sec3P2: string;
  sec3P3: string;
  sec3P4: React.ReactNode;
  sec4Title: string;
  productNames: readonly [string, string, string, string, string];
  viewDetails: string;
  sec4bTitle: string;
  sec4bP: string;
  sec4bItems: readonly [string, string, string];
  sec4bLinkText: string;
  sec4bLinkHref: string;
  sec5Title: string;
  sec5HotLabel: string;
  sec5HotItems: readonly [string, string, string, string];
  sec5ColdLabel: string;
  sec5ColdItems: readonly [string, string, string];
  sec5LinkText: string;
  sec5LinkHref: string;
  sec6Title: string;
  faqs: readonly { q: string; a: string }[];
};

const TEXTS: Record<Locale, FukamushiTexts> = {
  ja: {
    h1: "深蒸し茶の通販｜川俣谷産・シングルオリジン伊勢茶",
    leadP:
      "深蒸し茶は、普通の煎茶の2〜4倍の時間をかけて蒸すことで、渋みが抑えられ、まろやかで濃厚な旨みが引き出されるお茶です。藤八茶寮の深蒸し茶は、三重県松阪市・川俣谷の自家茶畑で育てた茶葉を使ったシングルオリジン。この土地にしか出せない味わいをお届けします。",
    productLinkLabel: "伊勢茶 深蒸し茶 ティーバッグ",
    sec2Title: "深蒸し茶とは——製法が生む、まろやかなコク",
    sec2P1:
      "「深蒸し茶」とは、緑茶の製造工程における「蒸し」の時間を通常の2〜4倍に延ばしたお茶です。普通の煎茶が30〜40秒の蒸し工程であるのに対し、深蒸し茶は60〜180秒かけてじっくりと蒸します。",
    sec2P2:
      "この長い蒸し工程によって茶葉の細胞壁が壊れ、渋みの原因となる成分が細かく分解されます。その結果、渋みが抑えられ、まろやかで濃厚な旨みが前面に出るお茶に仕上がります。水色（すいしょく）は深みのある濃い緑色で、細かくなった茶葉の粒子が溶け出すことで独特の濁りが生まれます。この濁りこそが、深蒸し茶の豊かな旨みと栄養の証です。",
    sec2P3: "お湯の温度は70℃前後が最適。低温で淹れることで甘みと旨みがより引き立ちます。",
    sec2P4:
      "さらに藤八茶寮の深蒸し茶は、川俣谷の地形が自然に生み出す「かぶせに近い条件」がこの旨みをさらに深めています。山に囲まれた谷地形が午後の日照を遮ることで、茶葉がゆっくりと旨み成分（テアニン）を蓄えてから収穫されます。その茶葉を深蒸し製法でさらに凝縮させることで、他産地では再現できない濃厚なコクが生まれるのです。",
    sec3Title: "川俣谷が育む、深蒸し茶の旨み",
    sec3P1: (
      <>
        川俣谷は、三重県松阪市飯南町に位置する、<strong>伊勢茶発祥の地</strong>
        として知られる歴史ある産地です。鎌倉時代から茶の栽培が行われてきたとも伝えられ、日本茶の長い歴史の中でも特別な場所です。
      </>
    ),
    sec3P2:
      "この谷地形には、他産地にはない自然の恵みがあります。三方を山に囲まれた地形が午後の日照を自然に遮ることで、茶葉が焼けず、旨み成分であるテアニンをじっくりと蓄えることができます。これは、人工的に日除けをして育てる「かぶせ茶」に近い環境が自然に生まれている状態です。川俣谷の茶には、その分だけ深い甘みと旨みが宿ります。",
    sec3P3:
      "収穫した茶葉は、川俣谷を熟知した地元の製茶所で丁寧に仕上げられます。産地から製茶、そして販売まで一貫した体制だからこそ、茶葉本来の個性を損なうことなくお届けできます。",
    sec3P4: (
      <>
        藤八茶寮の深蒸し茶は「<strong>シングルオリジン</strong>
        」——他産地の茶葉とブレンドしない、川俣谷の単一茶園のみを使用した純粋なお茶です。産地の個性をそのままに、茶葉の本来の力を味わっていただけます。
      </>
    ),
    sec4Title: "藤八茶寮の深蒸し茶 商品一覧",
    productNames: [
      "伊勢茶 深蒸し茶 ティーバッグ 10個",
      "伊勢茶 深蒸し茶 ティーバッグ 3個",
      "お得用 伊勢茶 深蒸し茶 ティーバッグ 50個",
      "伊勢茶 深蒸し茶パウダー 100g",
      "お得用 伊勢茶 深蒸し茶パウダー 500g",
    ],
    viewDetails: "詳しく見る >>",
    sec4bTitle: "深蒸し茶パウダーの使い方",
    sec4bP: "深蒸し茶パウダーは、お茶として飲むだけでなく、お菓子作りや料理にも幅広く活用できます。",
    sec4bItems: [
      "緑茶ラテ：温めたミルクにパウダーを溶かすだけ。砂糖やはちみつをお好みで加えてどうぞ。",
      "お菓子作り：クッキーやケーキの生地に混ぜ込む場合、小麦粉100gに対してパウダー小さじ2〜3杯が目安です。",
      "料理への活用：抹茶塩の代わりに天ぷらや揚げ物に合わせても。茶葉の旨みが食材を引き立てます。",
    ],
    sec4bLinkText: "抹茶との違いについては「抹茶とパウダー緑茶」",
    sec4bLinkHref: "/ise-cha/maccha/",
    sec5Title: "深蒸し茶の美味しい淹れ方",
    sec5HotLabel: "ホットの場合",
    sec5HotItems: [
      "お湯の温度：70℃前後（低温ほど甘みが引き立ちます）",
      "茶葉の量：ティーバッグ1個、茶葉の場合は2〜3g",
      "蒸らし時間：30〜60秒",
      "ポイント：沸騰したお湯を一度湯呑みに移してから急須へ注ぐと自然に70℃前後になります",
    ],
    sec5ColdLabel: "水出しの場合",
    sec5ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で30分〜1時間",
      "甘みが強く出るため、暑い季節やお子様にもおすすめです",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec5LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec5LinkHref: "/how-to-brew/",
    sec6Title: "よくある質問",
    faqs: [
      {
        q: "深蒸し茶と普通の煎茶はどう違いますか？",
        a: "蒸し時間が通常の2〜4倍（60〜180秒）と長いため、茶葉の細胞が細かく壊れ、渋みが少なくまろやかな味わいになります。水色（すいしょく）が濁りのある濃い緑色になるのも深蒸し茶の特徴です。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くだけで、甘みの強い水出し深蒸し茶が楽しめます。渋みがほとんど出ないため、緑茶が苦手な方にもおすすめです。",
      },
      {
        q: "農薬や添加物は使っていますか？",
        a: "三重県産の茶葉のみを使用しており、添加物は一切使用していません。原材料名は「緑茶（三重県）」のみです。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
      {
        q: "深蒸し茶パウダーとティーバッグはどちらがおすすめですか？",
        a: "手軽においしい一杯を楽しみたい方にはティーバッグ、お菓子作りや緑茶ラテなど幅広い用途で使いたい方にはパウダーがおすすめです。どちらも同じ川俣谷産の茶葉を使用しています。",
      },
    ],
  },

  en: {
    h1: "Deep-Steamed Sencha Online｜Single-Origin Ise Tea from Kawamatatani",
    leadP:
      "Fukamushi sencha is steamed 2–4 times longer than standard sencha, reducing bitterness and drawing out a smooth, rich umami. At Fujihachi Saryo, our deep-steamed tea is single-origin — grown in our own tea fields in Kawamatatani, Matsusaka, Mie Prefecture — delivering a flavour found nowhere else.",
    productLinkLabel: "Ise Tea Deep-Steamed Teabags",
    sec2Title: "What is fukamushi sencha? — the mellow richness born from the process",
    sec2P1:
      "\"Fukamushi\" means deep steaming. Whereas standard sencha is steamed for 30–40 seconds, fukamushi sencha is steamed slowly for 60–180 seconds — 2 to 4 times as long.",
    sec2P2:
      "This extended steaming breaks down the cell walls of the tea leaves, finely dispersing the compounds responsible for bitterness. The result is a tea with less astringency and a smooth, rich, full-bodied flavour. The liquor takes on a deep, cloudy green — a hallmark of fukamushi created as fine leaf particles dissolve. That cloudiness is a sign of the tea's rich flavour and nutrition.",
    sec2P3:
      "The optimal brewing temperature is around 70°C. Brewing at lower temperatures brings out more sweetness and umami.",
    sec2P4:
      "Fujihachi Saryo's deep-steamed tea gains even deeper umami from the natural shading-like conditions created by Kawamatatani's terrain. The valley's mountain-surrounded geography blocks afternoon sunlight, allowing the tea leaves to slowly accumulate theanine — the umami amino acid — before harvest. Deep-steaming those leaves concentrates their richness still further, producing a depth of flavour that cannot be replicated elsewhere.",
    sec3Title: "The umami of deep-steamed tea, nurtured by Kawamatatani",
    sec3P1: (
      <>
        Kawamatatani is a historic tea-growing region in Iinandcho, Matsusaka, Mie Prefecture —
        known as the <strong>birthplace of Ise tea</strong>. Tea cultivation here is said to date
        back to the Kamakura period, making it one of the most storied places in Japan&apos;s long
        tea history.
      </>
    ),
    sec3P2:
      "This valley has a natural gift that other regions cannot match. The mountain-ringed terrain blocks afternoon sunlight, preventing the leaves from burning and allowing them to accumulate theanine at a leisurely pace. This is a natural equivalent of the shading process used to grow kabuse-cha (covered tea). The tea from Kawamatatani carries that deep sweetness and umami within it.",
    sec3P3:
      "After harvesting, the tea leaves are carefully processed by a local tea producer who knows Kawamatatani intimately. Because growing, processing, and selling are all connected in one chain, we can deliver the full character of the tea leaves to you without loss.",
    sec3P4: (
      <>
        Fujihachi Saryo&apos;s deep-steamed tea is <strong>single-origin</strong> — grown only in
        the single estate of Kawamatatani, with no blending from other regions. You taste the full,
        uncompromised character of this unique terroir.
      </>
    ),
    sec4Title: "Deep-Steamed Tea Products from Fujihachi Saryo",
    productNames: [
      "Ise Tea Deep-Steamed Teabags × 10",
      "Ise Tea Deep-Steamed Teabags × 3",
      "Ise Tea Deep-Steamed Teabags × 50 (Value Pack)",
      "Ise Tea Deep-Steamed Powder 100 g",
      "Ise Tea Deep-Steamed Powder 500 g (Value Pack)",
    ],
    viewDetails: "View details >>",
    sec4bTitle: "How to Use Deep-Steamed Tea Powder",
    sec4bP: "The powder can be used not just as tea, but also in baking and cooking.",
    sec4bItems: [
      "Green tea latte: dissolve the powder in warm milk. Add sugar or honey to taste.",
      "Baking: when mixing into cookie or cake batter, use 2–3 teaspoons per 100 g of flour as a guide.",
      "Cooking: use as a substitute for matcha salt alongside tempura or fried foods. The tea's umami brings out the flavour of ingredients.",
    ],
    sec4bLinkText: "For the difference between matcha and powdered green tea, see our Maccha page",
    sec4bLinkHref: "/en/ise-cha/maccha/",
    sec5Title: "How to Brew Fukamushi Sencha",
    sec5HotLabel: "Hot",
    sec5HotItems: [
      "Water temperature: around 70°C (lower temperature brings out more sweetness)",
      "Amount: 1 teabag, or 2–3 g of loose leaf",
      "Steeping time: 30–60 seconds",
      "Tip: pour boiling water into a cup first, then transfer to the teapot — this naturally lowers the temperature to around 70°C",
    ],
    sec5ColdLabel: "Cold brew",
    sec5ColdItems: [
      "Add 1–2 teabags to 500 ml of cold water and refrigerate for 30 minutes to 1 hour",
      "The natural sweetness is more pronounced — great for hot weather or for children",
      "Remove the teabags after brewing before storing",
    ],
    sec5LinkText: "For detailed brewing instructions, see our How to Brew page",
    sec5LinkHref: "/en/how-to-brew/",
    sec6Title: "Frequently Asked Questions",
    faqs: [
      {
        q: "What is the difference between fukamushi sencha and regular sencha?",
        a: "The steaming time is 2–4 times longer than usual (60–180 seconds), which breaks down the tea leaves' cells, resulting in less bitterness and a smoother, mellow flavour. The liquor colour is also a distinctive deep, cloudy green.",
      },
      {
        q: "Can I make cold brew tea with it?",
        a: "Yes. Simply place teabags in cold water and refrigerate for 30 minutes to 1 hour to enjoy a sweet, cold-brew fukamushi sencha. Almost no bitterness comes out, making it a great choice even for those who don't usually enjoy green tea.",
      },
      {
        q: "Do you use pesticides or additives?",
        a: "We use only tea leaves grown in Mie Prefecture and add no additives whatsoever. The only ingredient is \"green tea (Mie Prefecture)\".",
      },
      {
        q: "What is the shelf life?",
        a: "The shelf life is one year from the date of manufacture. After opening, store away from moisture and consume as soon as possible.",
      },
      {
        q: "Which do you recommend — the powdered tea or the teabags?",
        a: "Teabags are ideal if you want a quick, delicious cup. Powder is recommended if you want to use it for baking, matcha lattes, or other recipes. Both use the same tea leaves from Kawamatatani.",
      },
    ],
  },

  ko: {
    h1: "후카무시 녹차 통신판매｜가와마타다니산 싱글 오리진 이세차",
    leadP:
      "후카무시 녹차는 보통 녹차의 2~4배 시간을 들여 증제하여 떫은맛을 줄이고 부드럽고 진한 감칠맛을 이끌어낸 차입니다. 후지하치야의 후카무시 녹차는 미에현 마쓰사카시·가와마타다니의 자가 찻밭에서 기른 찻잎을 사용한 싱글 오리진. 이 땅에서만 낼 수 있는 맛을 전합니다.",
    productLinkLabel: "이세차 후카무시 녹차 티백",
    sec2Title: "후카무시 녹차란? — 제조법이 만드는 부드러운 감칠맛",
    sec2P1:
      "\"후카무시\"는 녹차 제조 공정에서 증제 시간을 보통의 2~4배로 늘린 차입니다. 일반 녹차의 증제가 30~40초인 데 비해 후카무시 녹차는 60~180초 동안 천천히 증제합니다.",
    sec2P2:
      "이 긴 증제 과정으로 찻잎의 세포벽이 부서져 떫은맛의 원인이 되는 성분이 잘게 분해됩니다. 그 결과 떫은맛이 억제되고 부드럽고 진한 감칠맛이 앞에 나오는 차가 됩니다. 탕색은 깊은 짙은 녹색으로, 잘게 된 찻잎 입자가 녹아 나오며 독특한 탁함이 생깁니다. 이 탁함이 후카무시 녹차의 풍부한 감칠맛과 영양의 증거입니다.",
    sec2P3: "물 온도는 70℃ 전후가 최적입니다. 낮은 온도로 우리면 단맛과 감칠맛이 더욱 살아납니다.",
    sec2P4:
      "게다가 후지하치야의 후카무시 녹차는 가와마타다니의 지형이 자연스럽게 만들어내는 '피복에 가까운 조건'이 감칠맛을 더욱 깊게 합니다. 산에 둘러싸인 골짜기 지형이 오후 햇빛을 차단하여 찻잎이 천천히 감칠맛 성분(테아닌)을 쌓아갑니다. 그 찻잎을 후카무시 제법으로 더욱 농축시켜, 다른 산지에서는 재현할 수 없는 진한 감칠맛이 생겨납니다.",
    sec3Title: "가와마타다니가 키우는 후카무시 녹차의 감칠맛",
    sec3P1: (
      <>
        가와마타다니는 미에현 마쓰사카시 이이난초에 위치한, <strong>이세차 발상지</strong>로
        알려진 유서 깊은 산지입니다. 가마쿠라 시대부터 차 재배가 이루어졌다고 전해지며, 일본 차의
        오랜 역사 속에서도 특별한 곳입니다.
      </>
    ),
    sec3P2:
      "이 골짜기 지형에는 다른 산지에는 없는 자연의 혜택이 있습니다. 삼방이 산으로 둘러싸인 지형이 오후 햇빛을 자연스럽게 차단하여 찻잎이 타지 않고, 감칠맛 성분인 테아닌을 천천히 쌓을 수 있습니다. 이는 인공적으로 해가림을 하여 기르는 '피복차'에 가까운 환경이 자연적으로 만들어지는 상태입니다. 가와마타다니의 차에는 그만큼 깊은 단맛과 감칠맛이 깃들어 있습니다.",
    sec3P3:
      "수확한 찻잎은 가와마타다니를 잘 아는 지역 제다소에서 정성스럽게 마무리됩니다. 산지에서 제다, 그리고 판매까지 일관된 체제이기 때문에 찻잎 본연의 개성을 손상시키지 않고 전해드릴 수 있습니다.",
    sec3P4: (
      <>
        후지하치야의 후카무시 녹차는 「<strong>싱글 오리진</strong>」——다른 산지의 찻잎과
        블렌드하지 않고 가와마타다니의 단일 찻밭만 사용한 순수한 차입니다. 산지의 개성을 그대로,
        찻잎 본래의 힘을 맛보실 수 있습니다.
      </>
    ),
    sec4Title: "후지하치야의 후카무시 녹차 상품 목록",
    productNames: [
      "이세차 후카무시 녹차 티백 10개",
      "이세차 후카무시 녹차 티백 3개",
      "대용량 이세차 후카무시 녹차 티백 50개",
      "이세차 후카무시 녹차 파우더 100g",
      "대용량 이세차 후카무시 녹차 파우더 500g",
    ],
    viewDetails: "자세히 보기 >>",
    sec4bTitle: "후카무시 녹차 파우더 활용법",
    sec4bP: "후카무시 녹차 파우더는 차로 마시는 것 외에도 과자 만들기와 요리에도 폭넓게 활용할 수 있습니다.",
    sec4bItems: [
      "녹차 라테：따뜻한 우유에 파우더를 녹이기만 하면 됩니다. 설탕이나 꿀을 취향에 따라 추가하세요.",
      "과자 만들기：쿠키나 케이크 반죽에 섞을 때는 밀가루 100g에 파우더 작은 스푼 2~3스푼이 기준입니다.",
      "요리 활용：말차 소금 대신 튀김 요리에 곁들여도 좋습니다. 찻잎의 감칠맛이 식재료를 돋보이게 합니다.",
    ],
    sec4bLinkText: "말차와의 차이점은 「말차와 파우더 녹차」 페이지를 참고하세요",
    sec4bLinkHref: "/ko/ise-cha/maccha/",
    sec5Title: "후카무시 녹차 맛있게 우리는 법",
    sec5HotLabel: "따뜻하게 마실 때",
    sec5HotItems: [
      "물 온도：70℃ 전후（낮은 온도일수록 단맛이 더 강해집니다）",
      "찻잎 양：티백 1개, 찻잎의 경우 2~3g",
      "우리는 시간：30~60초",
      "포인트：끓인 물을 한 번 찻잔에 옮긴 후 다관에 부으면 자연스럽게 70℃ 정도가 됩니다",
    ],
    sec5ColdLabel: "냉차로 마실 때",
    sec5ColdItems: [
      "찬물 500ml에 티백 1~2개를 넣고 냉장고에서 30분~1시간",
      "단맛이 강하게 나와 더운 계절이나 어린이에게도 추천합니다",
      "우린 후에는 티백을 꺼내고 보관해 주세요",
    ],
    sec5LinkText: "자세한 우리는 법은 우려내기 페이지를 참고해 주세요",
    sec5LinkHref: "/ko/how-to-brew/",
    sec6Title: "자주 묻는 질문",
    faqs: [
      {
        q: "후카무시 녹차와 일반 녹차의 차이점은 무엇인가요?",
        a: "증제 시간이 보통의 2~4배(60~180초)로 길기 때문에 찻잎의 세포가 잘게 부서져 떫은맛이 적고 부드러운 맛이 납니다. 탕색이 탁한 짙은 녹색이 되는 것도 후카무시 녹차의 특징입니다.",
      },
      {
        q: "냉차로도 맛있게 마실 수 있나요?",
        a: "네. 냉수에 티백을 넣고 냉장고에서 30분~1시간 두기만 하면 단맛이 풍부한 냉차 후카무시를 즐길 수 있습니다. 떫은맛이 거의 나오지 않아 녹차를 잘 못 드시는 분께도 추천합니다.",
      },
      {
        q: "농약이나 첨가물을 사용하고 있나요?",
        a: "미에현산 찻잎만 사용하며, 첨가물은 일체 사용하지 않습니다. 원재료명은 '녹차(미에현)'뿐입니다.",
      },
      {
        q: "유통기한은 얼마나 되나요?",
        a: "제조일로부터 1년입니다. 개봉 후에는 습기를 피해 보관하시고, 빨리 드시기를 권장합니다.",
      },
      {
        q: "후카무시 녹차 파우더와 티백 중 어느 것이 추천인가요?",
        a: "간편하게 맛있는 한 잔을 즐기고 싶은 분께는 티백을, 과자 만들기나 녹차 라테 등 다양한 용도로 사용하고 싶은 분께는 파우더를 추천합니다. 모두 같은 가와마타다니산 찻잎을 사용하고 있습니다.",
      },
    ],
  },

  zh: {
    h1: "深蒸绿茶网购｜川俣谷产单一产地伊势茶",
    leadP:
      "深蒸绿茶是普通煎茶蒸制时间的2～4倍，抑制了涩味，引出了醇和浓郁的鲜甜。藤八茶寮的深蒸绿茶是单一产地茶，使用三重县松阪市·川俣谷自家茶园栽培的茶叶，为您呈现只有这片土地才能带来的独特滋味。",
    productLinkLabel: "伊势茶深蒸绿茶茶包",
    sec2Title: "深蒸绿茶是什么？——制法孕育的醇和甘鲜",
    sec2P1:
      "「深蒸」指的是将绿茶制造工序中的蒸制时间延长至通常的2～4倍。普通煎茶蒸制30～40秒，而深蒸绿茶则需60～180秒慢慢蒸制。",
    sec2P2:
      "漫长的蒸制过程使茶叶细胞壁破裂，导致涩味的成分被细细分解。结果是涩味得到抑制，醇和浓郁的鲜甜味道更加突出。茶汤呈深邃的浓绿色，细碎的茶叶颗粒溶出形成特有的混浊感。这种混浊正是深蒸绿茶丰富鲜味与营养的佐证。",
    sec2P3: "冲泡水温以70℃左右为佳。温度越低，甜味和鲜味越发突出。",
    sec2P4:
      "藤八茶寮的深蒸绿茶更因川俣谷的地形自然形成的「接近遮阴茶的条件」而使鲜味更加深厚。被山峦环抱的山谷地形自然遮挡了午后阳光，使茶叶缓缓积累鲜味氨基酸（茶氨酸）后再采收。再以深蒸制法进一步浓缩，造就了其他产地无法复现的醇厚甘鲜。",
    sec3Title: "川俣谷孕育的深蒸绿茶鲜味",
    sec3P1: (
      <>
        川俣谷位于三重县松阪市饭南町，是公认的<strong>伊势茶发祥地</strong>
        ，历史悠久。据传自镰仓时代起便有茶叶栽培，在日本茶的漫长历史中占据着特殊地位。
      </>
    ),
    sec3P2:
      "这片山谷地形拥有其他产区无法比拟的自然恩赐。三面环山的地形自然遮挡了午后阳光，使茶叶不受烈日灼烤，悠然积累鲜味氨基酸茶氨酸。这与人工遮阴培育的「覆盖茶」极为相似，川俣谷的茶因此蕴含了深厚的甘甜与鲜味。",
    sec3P3:
      "采收后的茶叶由熟悉川俣谷的当地制茶厂精心加工。从产地到制茶再到销售，一贯相连的体制确保了茶叶本来的个性得以完整传递到您手中。",
    sec3P4: (
      <>
        藤八茶寮的深蒸绿茶是「<strong>单一产地</strong>
        」——仅使用川俣谷单一茶园的茶叶，不与其他产地茶叶混合。您将品尝到这片土地个性原汁原味、未经妥协的纯粹风味。
      </>
    ),
    sec4Title: "藤八茶寮的深蒸绿茶商品一览",
    productNames: [
      "伊势茶深蒸绿茶茶包 10个",
      "伊势茶深蒸绿茶茶包 3个",
      "大容量伊势茶深蒸绿茶茶包 50个",
      "伊势茶深蒸绿茶粉 100g",
      "大容量伊势茶深蒸绿茶粉 500g",
    ],
    viewDetails: "查看详情 >>",
    sec4bTitle: "深蒸绿茶粉的使用方法",
    sec4bP: "深蒸绿茶粉不仅可以冲泡饮用，还可广泛用于点心制作和料理。",
    sec4bItems: [
      "绿茶拿铁：将粉末溶入温热牛奶中即可，可按喜好加入砂糖或蜂蜜。",
      "点心制作：揉入饼干或蛋糕面糊时，以每100g面粉加入2～3茶匙为参考。",
      "料理应用：可代替抹茶盐搭配天妇罗等炸物，茶叶鲜味能衬托食材风味。",
    ],
    sec4bLinkText: "关于与抹茶的区别，请参阅「抹茶与绿茶粉」页面",
    sec4bLinkHref: "/zh/ise-cha/maccha/",
    sec5Title: "深蒸绿茶的冲泡方法",
    sec5HotLabel: "热饮",
    sec5HotItems: [
      "水温：70℃左右（温度越低，甜味越突出）",
      "茶量：茶包1个，散茶约2～3g",
      "浸泡时间：30～60秒",
      "要点：将沸水先倒入茶杯，再转入茶壶，自然降温至70℃左右",
    ],
    sec5ColdLabel: "冷泡",
    sec5ColdItems: [
      "将1～2个茶包放入500ml冷水中，冷藏30分钟～1小时",
      "冷泡茶甜味更浓，天热时或给孩子饮用均推荐",
      "浸泡完成后请取出茶包再保存",
    ],
    sec5LinkText: "详细冲泡方法请参阅冲泡方法页面",
    sec5LinkHref: "/zh/how-to-brew/",
    sec6Title: "常见问题",
    faqs: [
      {
        q: "深蒸绿茶与普通煎茶有什么区别？",
        a: "蒸制时间是普通煎茶的2～4倍（60～180秒），茶叶细胞被充分破坏，涩味减少，口感更加醇和顺滑。茶汤颜色呈浑浊的深绿色也是深蒸绿茶的一大特征。",
      },
      {
        q: "可以做冷泡茶吗？",
        a: "可以。将茶包放入冷水中冷藏30分钟～1小时，即可享用甜味浓郁的冷泡深蒸绿茶。几乎不出涩味，即便是不太喜欢绿茶的朋友也值得一试。",
      },
      {
        q: "使用农药或添加剂吗？",
        a: "仅使用三重县产茶叶，不含任何添加剂。原材料名称仅为「绿茶（三重县）」。",
      },
      {
        q: "保质期是多久？",
        a: "自制造之日起1年。开封后请避免受潮保存，并尽快饮用。",
      },
      {
        q: "深蒸绿茶粉和茶包哪个更推荐？",
        a: "如果想简便享用一杯美茶，推荐茶包；如果想用于点心制作、绿茶拿铁等多种用途，则推荐粉末。两者均使用同一款川俣谷产茶叶。",
      },
    ],
  },
};

type Props = { locale: Locale };

export default async function FukamushiPage({ locale }: Props) {
  const t = TEXTS[locale];
  const pt = COMMON_TEXTS[locale].product;
  const basePath = locale === "ja" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_BASE_URL}${basePath}/ise-cha/fukamushi/`;
  const breadcrumbPath = locale === "ja" ? "/ise-cha/fukamushi" : `/${locale}/ise-cha/fukamushi`;

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

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.h1}
        description={t.leadP}
        imageUrl={mainImagePath ? `${SITE_BASE_URL}${mainImagePath}` : `${SITE_BASE_URL}/images/ise-cha/catechin/catechin.webp`}
        canonicalUrl={canonicalUrl}
        inLanguage={locale === "ja" ? "ja" : locale === "en" ? "en" : locale === "ko" ? "ko" : "zh"}
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema items={getBreadcrumbItems(breadcrumbPath, locale, { productName: t.sec4Title })} />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="fukamushi" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {mainImagePath && (
                  <Link href={buildLocalizedPath(locale, "/ise-cha/deep-steamed-isecha")} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={mainImagePath}
                        alt={t.productNames[0]}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/deep-steamed-isecha")}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.productLinkLabel}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
                {productData[3].imagePath && (
                  <Link href={productData[3].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[3].imagePath}
                        alt={productData[3].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[3].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[3].name}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                    {t.viewDetails}
                  </span>
                </Link>
              </div>
            </aside>

            {/* 本文：セクション1〜3 */}
            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP}</p>

              {/* モバイル：商品リンク */}
              <Link
                href={buildLocalizedPath(locale, "/ise-cha/deep-steamed-isecha")}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.productLinkLabel}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p>{t.sec2P3}</p>
              <p>{t.sec2P4}</p>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
              <p>{t.sec3P1}</p>
              <p>{t.sec3P2}</p>
              <p>{t.sec3P3}</p>
              <p>{t.sec3P4}</p>
            </section>
          </div>

          {/* セクション4：商品一覧（全幅） */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
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

          {/* セクション4b：パウダーの使い方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4bTitle}</h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink">{t.sec4bP}</p>
            <ul className="m-0 mb-4 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink">
              {t.sec4bItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
              →{" "}
              <Link href={buildLocalizedPath(locale, "/ise-cha/maccha")} className="text-tea underline underline-offset-2">
                {t.sec4bLinkText}
              </Link>
            </p>
          </div>

          {/* セクション5：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">{t.sec5HotLabel}</p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">{t.sec5ColdLabel}</p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec5ColdItems.map((item, i) => (
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
                      <span className="mr-2 text-tea">Q.</span>{q}
                    </dt>
                    <span className="mt-0.5 shrink-0 text-tea-deep/50 transition-transform group-open:rotate-180" aria-hidden>
                      ▾
                    </span>
                  </summary>
                  <dd className="m-0 px-4 pb-4 pt-1">
                    <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                      <span className="mr-2 font-semibold text-tea-deep/70">A.</span>{a}
                    </p>
                  </dd>
                </details>
              ))}
            </dl>
          </div>
        </article>
      </div>
    </main>
  );
}
