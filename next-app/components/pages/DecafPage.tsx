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

const PRODUCT_SLUG = "decaf_green_tea" as const;

type DecafTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec1LinkText: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2LinkText: string;
  sec3Title: string;
  productName: string;
  viewDetails: string;
  sec4Title: string;
  sec4HotLabel: string;
  sec4HotItems: readonly [string, string, string];
  sec4ColdLabel: string;
  sec4ColdItems: readonly [string, string, string];
  sec4LinkText: string;
  sec4LinkHref: string;
  sec5Title: string;
  faqs: readonly { q: string; a: string }[];
  breadcrumbName: string;
};

const TEXTS: Record<Locale, DecafTexts> = {
  ja: {
    h1: "カフェインカット緑茶の通販｜薬剤不使用で伊勢茶の旨みそのまま",
    leadP:
      "藤八茶寮のカフェインカット緑茶は、薬剤を一切使わず「水と二酸化炭素」のみによる超臨界CO₂抽出法でカフェインを75%カットした低カフェイン緑茶です。三重県松阪市・川俣谷産シングルオリジン伊勢茶の濃厚な旨みとコクはそのままに、夜のティータイムやカフェインが気になる方でも安心してお楽しみいただけます。",
    sec1Title: "なぜ「薬剤不使用」にこだわるのか",
    sec1P1:
      "一般的なデカフェ処理では、カフェインを溶かし出すために塩化メチレン（ジクロロメタン）などの有機溶媒が用いられる場合があります。こうした化学溶媒は微量でも残留の懸念が生じるため、毎日飲むお茶として気になる方も少なくありません。",
    sec1P2:
      "藤八茶寮のカフェインカット緑茶は、「超臨界CO₂抽出法」を採用しています。この製法では水と二酸化炭素のみを使用するため、化学溶媒が残留する心配がありません。",
    sec1P3:
      "まず品質の高い深蒸し茶を原料として超臨界CO₂処理を行い、カフェインを85%除去します。その後、お茶本来の旨みと香りを最大限に保つため、高品質な深蒸し茶を黄金比でブレンドします。最終的に仕上がったカフェインカット緑茶は、カフェイン75%オフ・100mlあたり約5mgに抑えられています。",
    sec1LinkText: "カフェインについて詳しくはこちら",
    sec2Title: "川俣谷産シングルオリジンの深蒸し茶をベースに",
    sec2P1:
      "藤八茶寮のカフェインカット緑茶のベースは、三重県松阪市・川俣谷産のシングルオリジン深蒸し茶です。山々に囲まれたこの谷地形は、午後の日照を自然に遮ることでテアニン（旨み成分）を豊富に蓄えた茶葉を育みます。",
    sec2P2:
      "超臨界CO₂抽出法でカフェインを除去しても、この産地固有の旨みやテアニンの豊かさは変わりません。カフェインを気にしながらも伊勢茶の濃厚な味わいを楽しみたい方へ、妥協なき一杯をお届けします。",
    sec2LinkText: "深蒸し茶について詳しくはこちら",
    sec3Title: "商品",
    productName: "伊勢茶 カフェインカット（デカフェ）緑茶 ティーバッグ 8個",
    viewDetails: "詳しく見る >>",
    sec4Title: "美味しい淹れ方",
    sec4HotLabel: "ホットの場合",
    sec4HotItems: [
      "お湯の温度：70℃前後（低温ほど甘みが引き立ちます）",
      "ティーバッグ1個、蒸らし時間：30〜60秒",
      "ポイント：沸騰したお湯を一度湯呑みに移してから急須へ注ぐと自然に70℃前後になります",
    ],
    sec4ColdLabel: "水出しの場合",
    sec4ColdItems: [
      "冷水500mlにティーバッグ1〜2個を入れ、冷蔵庫で30分〜1時間",
      "甘みが強く出て口当たりがやわらか——就寝前の一杯にもおすすめです",
      "抽出後はティーバッグを取り出して保存してください",
    ],
    sec4LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec4LinkHref: "/how-to-brew/",
    sec5Title: "よくある質問",
    faqs: [
      {
        q: "カフェインは完全にゼロになりますか？",
        a: "ゼロにはなりません。超臨界CO₂抽出法により75%カットし、100mlあたり約5mgまで低減しています。これはコーラとほぼ同程度、一般的な緑茶の約3分の1以下です。完全にカフェインを避けたい場合は麦茶などをお選びください。",
      },
      {
        q: "妊娠中や授乳中でも飲めますか？",
        a: "本商品のカフェイン量は100mlあたり約5mgで、一般的な緑茶の約3分の1以下です。ただし妊娠中・授乳中の方の食品摂取については、かかりつけの医師にご相談ください。",
      },
      {
        q: "味は普通の緑茶と変わりますか？",
        a: "超臨界CO₂抽出法はカフェインのみを選択的に除去するため、伊勢茶本来の旨みとコクはそのままです。通常の深蒸し茶と同様にまろやかな味わいをお楽しみいただけます。",
      },
      {
        q: "水出しでも美味しく飲めますか？",
        a: "はい。冷水にティーバッグを入れて30分〜1時間置くだけで、甘みの強い水出し低カフェイン緑茶が楽しめます。就寝前の一杯としてもおすすめです。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
      {
        q: "子どもに飲ませても大丈夫ですか？",
        a: "本商品のカフェイン量は100mlあたり約5mgです。子どものカフェイン摂取目安は体重1kgあたり2.5mg/日以下（食品安全委員会）とされており、体重20kgのお子様であれば1日50mgが目安となります。本商品はコーラと同程度のカフェイン量ですが、お子様への食品摂取については保護者の方がご判断ください。",
      },
      {
        q: "朝の深蒸し茶と飲み分けるメリットはありますか？",
        a: "朝は通常の深蒸し茶でカフェインとカテキンをしっかり摂り、午後〜夜はカフェインカット緑茶に切り替えるのがおすすめです。緑茶の旨みや健康成分は変わらず、睡眠への影響を気にせずお茶を楽しめます。",
      },
      {
        q: "カフェインカット緑茶にもカテキンは含まれますか？",
        a: "はい。超臨界CO₂抽出法はカフェインのみを選択的に除去するため、カテキンをはじめとする健康成分はそのまま保たれています。カフェインを控えながら、緑茶本来の健康効果も引き続き得ることができます。",
      },
    ],
    breadcrumbName: "カフェインカット緑茶の通販",
  },

  en: {
    h1: "Low-Caffeine Green Tea Online | No Chemicals, 75% Less Caffeine | Fujihachi Saryo",
    leadP:
      "Fujihachi Saryo's low-caffeine green tea removes 75% of caffeine using supercritical CO₂ extraction — just water and carbon dioxide, no chemical solvents. The result: the full, rich umami of single-origin Ise tea from Kawamatatani, Matsusaka, Mie Prefecture, in a cup you can enjoy at night or whenever you're watching your caffeine intake.",
    sec1Title: "Why we insist on no chemical solvents",
    sec1P1:
      "Conventional decaffeination sometimes uses organic solvents such as methylene chloride (dichloromethane) to extract caffeine from tea. Even in trace amounts, chemical solvent residues can be a concern for something you drink every day.",
    sec1P2:
      "Fujihachi Saryo's low-caffeine green tea uses supercritical CO₂ extraction. This process uses only water and carbon dioxide, so there is no risk of chemical solvent residue.",
    sec1P3:
      "First, high-quality deep-steamed tea undergoes supercritical CO₂ treatment to remove 85% of its caffeine. It is then blended back with premium deep-steamed tea in a carefully balanced ratio to preserve the original umami and aroma. The finished tea contains 75% less caffeine than regular green tea — approximately 5 mg per 100 ml.",
    sec1LinkText: "Learn more about tea and caffeine",
    sec2Title: "Based on single-origin deep-steamed tea from Kawamatatani",
    sec2P1:
      "The base of our low-caffeine green tea is single-origin fukamushi (deep-steamed) sencha from Kawamatatani, Matsusaka, Mie Prefecture. Surrounded by mountains, this valley's terrain naturally blocks afternoon sunlight, allowing the tea leaves to accumulate abundant theanine — the amino acid behind green tea's characteristic umami.",
    sec2P2:
      "Supercritical CO₂ extraction removes caffeine while leaving the region's signature umami and theanine richness intact. For those who want to limit their caffeine intake without sacrificing the depth and flavour of Ise tea, this tea delivers without compromise.",
    sec2LinkText: "Learn more about fukamushi sencha",
    sec3Title: "Low-Caffeine Green Tea from Fujihachi Saryo",
    productName: "Ise Tea Low-Caffeine (Decaf) Green Tea Teabags × 8",
    viewDetails: "View details >>",
    sec4Title: "How to Brew",
    sec4HotLabel: "Hot",
    sec4HotItems: [
      "Water temperature: around 70°C (lower temperature brings out more sweetness)",
      "1 teabag, steeping time: 30–60 seconds",
      "Tip: pour boiling water into a cup first, then transfer to the teapot — this naturally lowers the temperature to around 70°C",
    ],
    sec4ColdLabel: "Cold brew",
    sec4ColdItems: [
      "Add 1–2 teabags to 500 ml of cold water and refrigerate for 30 minutes to 1 hour",
      "The natural sweetness shines through — also ideal as a bedtime cup",
      "Remove the teabags after brewing before storing",
    ],
    sec4LinkText: "For detailed brewing instructions, see our How to Brew page",
    sec4LinkHref: "/en/how-to-brew/",
    sec5Title: "Frequently Asked Questions",
    faqs: [
      {
        q: "Is the caffeine completely zero?",
        a: "No, it is not zero. Supercritical CO₂ extraction reduces caffeine by 75%, bringing it down to approximately 5 mg per 100 ml — roughly the same as cola and less than one-third of regular green tea. If you need to avoid caffeine entirely, we recommend barley tea or similar caffeine-free options.",
      },
      {
        q: "Can pregnant or breastfeeding women drink this?",
        a: "This tea contains approximately 5 mg of caffeine per 100 ml — less than one-third of regular green tea. However, we recommend consulting your doctor regarding food and beverage consumption during pregnancy or breastfeeding.",
      },
      {
        q: "Does it taste different from regular green tea?",
        a: "Supercritical CO₂ extraction selectively removes only caffeine, so the original umami and richness of Ise tea remain intact. You can enjoy the same smooth, mellow flavour as our regular deep-steamed sencha.",
      },
      {
        q: "Can I make cold brew tea with it?",
        a: "Yes. Simply place teabags in cold water and refrigerate for 30 minutes to 1 hour to enjoy a sweet, low-caffeine cold brew. It also makes a perfect bedtime drink.",
      },
      {
        q: "What is the shelf life?",
        a: "The shelf life is one year from the date of manufacture. After opening, store away from moisture and consume as soon as possible.",
      },
    ],
    breadcrumbName: "Low-Caffeine Green Tea Online",
  },

  ko: {
    h1: "카페인 컷 녹차 통신판매｜약제 불사용으로 이세차의 감칠맛 그대로",
    leadP:
      "후지하치야의 카페인 컷 녹차는 약제를 일절 사용하지 않고 「물과 이산화탄소」만을 사용하는 초임계 CO₂ 추출법으로 카페인을 75% 커트한 저카페인 녹차입니다. 미에현 마쓰사카시·가와마타다니산 싱글 오리진 이세차의 진한 감칠맛은 그대로, 저녁 티타임이나 카페인이 신경 쓰이는 분도 안심하고 즐기실 수 있습니다.",
    sec1Title: "왜 「약제 불사용」에 집착하는가",
    sec1P1:
      "일반적인 디카페인 처리에는 염화메틸렌 등의 유기 용매가 사용되는 경우가 있습니다. 이러한 화학 용매는 미량이라도 잔류 우려가 생기기 때문에 매일 마시는 차로서 신경 쓰이는 분도 적지 않습니다.",
    sec1P2:
      "후지하치야의 카페인 컷 녹차는 「초임계 CO₂ 추출법」을 채택하고 있습니다. 이 제법에서는 물과 이산화탄소만을 사용하므로 화학 용매가 잔류할 우려가 없습니다.",
    sec1P3:
      "먼저 품질 높은 후카무시 녹차를 원료로 초임계 CO₂ 처리를 하여 카페인을 85% 제거합니다. 그 후 차 본래의 감칠맛과 향을 최대한 보존하기 위해 고품질 후카무시 녹차를 황금 비율로 블렌드합니다. 최종적으로 완성된 카페인 컷 녹차는 카페인 75% 오프·100ml당 약 5mg으로 억제됩니다.",
    sec1LinkText: "카페인에 대해 자세히 보기",
    sec2Title: "가와마타다니산 싱글 오리진 후카무시 녹차를 베이스로",
    sec2P1:
      "후지하치야의 카페인 컷 녹차의 베이스는 미에현 마쓰사카시·가와마타다니산 싱글 오리진 후카무시 녹차입니다. 산들에 둘러싸인 이 골짜기 지형은 오후 일조를 자연스럽게 차단하여 테아닌(감칠맛 성분)을 풍부하게 축적한 찻잎을 키웁니다.",
    sec2P2:
      "초임계 CO₂ 추출법으로 카페인을 제거해도 이 산지 고유의 감칠맛과 테아닌의 풍부함은 변하지 않습니다. 카페인을 신경 쓰면서도 이세차의 진한 맛을 즐기고 싶은 분께 타협 없는 한 잔을 전합니다.",
    sec2LinkText: "후카무시 녹차에 대해 자세히 보기",
    sec3Title: "후지하치야의 카페인 컷 녹차",
    productName: "이세차 카페인 컷(디카페인) 녹차 티백 8개",
    viewDetails: "자세히 보기 >>",
    sec4Title: "맛있게 우리는 법",
    sec4HotLabel: "따뜻하게 마실 때",
    sec4HotItems: [
      "물 온도：70℃ 전후（낮은 온도일수록 단맛이 더 강해집니다）",
      "티백 1개, 우리는 시간：30~60초",
      "포인트：끓인 물을 한 번 찻잔에 옮긴 후 다관에 부으면 자연스럽게 70℃ 정도가 됩니다",
    ],
    sec4ColdLabel: "냉차로 마실 때",
    sec4ColdItems: [
      "찬물 500ml에 티백 1~2개를 넣고 냉장고에서 30분~1시간",
      "단맛이 강하게 나와 구수하고 부드럽습니다——취침 전 한 잔으로도 추천합니다",
      "우린 후에는 티백을 꺼내고 보관해 주세요",
    ],
    sec4LinkText: "자세한 우리는 법은 우려내기 페이지를 참고해 주세요",
    sec4LinkHref: "/ko/how-to-brew/",
    sec5Title: "자주 묻는 질문",
    faqs: [
      {
        q: "카페인이 완전히 제로가 되나요?",
        a: "제로는 되지 않습니다. 초임계 CO₂ 추출법으로 75% 커트하여 100ml당 약 5mg까지 낮춥니다. 이는 콜라와 비슷한 수준으로, 일반 녹차의 약 3분의 1 이하입니다. 카페인을 완전히 피하고 싶은 경우에는 보리차 등을 선택해 주세요.",
      },
      {
        q: "임신 중이나 수유 중에도 마실 수 있나요?",
        a: "이 상품의 카페인 양은 100ml당 약 5mg으로 일반 녹차의 약 3분의 1 이하입니다. 다만 임신 중·수유 중인 분의 식품 섭취에 대해서는 담당 의사에게 상담해 주시기 바랍니다.",
      },
      {
        q: "맛이 일반 녹차와 다른가요?",
        a: "초임계 CO₂ 추출법은 카페인만을 선택적으로 제거하므로 이세차 본래의 감칠맛과 깊은 맛은 그대로입니다. 일반 후카무시 녹차와 마찬가지로 부드러운 맛을 즐기실 수 있습니다.",
      },
      {
        q: "냉차로도 맛있게 마실 수 있나요?",
        a: "네. 냉수에 티백을 넣고 30분~1시간 두기만 하면 단맛이 강한 냉차 저카페인 녹차를 즐길 수 있습니다. 취침 전 한 잔으로도 추천합니다.",
      },
      {
        q: "유통기한은 얼마나 되나요?",
        a: "제조일로부터 1년입니다. 개봉 후에는 습기를 피해 보관하시고, 빨리 드시기를 권장합니다.",
      },
    ],
    breadcrumbName: "카페인 컷 녹차 통신판매",
  },

  zh: {
    h1: "低咖啡因绿茶网购｜无化学溶剂，伊势茶鲜甜原汁原味",
    leadP:
      "藤八茶寮的低咖啡因绿茶，不使用任何药剂，仅以「水与二氧化碳」进行超临界CO₂萃取，将咖啡因减少75%。三重县松阪市·川俣谷产单一产地伊势茶的浓郁鲜甜依然如故，夜间品茗或担心咖啡因摄入的朋友均可放心享用。",
    sec1Title: "为何坚持「不使用化学溶剂」",
    sec1P1:
      "一般的脱咖啡因处理有时会使用氯化亚甲基（二氯甲烷）等有机溶剂来溶出咖啡因。这类化学溶剂即便微量残留也令人担忧，对每天都要饮用的茶来说更是如此。",
    sec1P2:
      "藤八茶寮的低咖啡因绿茶采用「超临界CO₂萃取法」。该工艺仅使用水和二氧化碳，无化学溶剂残留之虞。",
    sec1P3:
      "首先以优质深蒸绿茶为原料进行超临界CO₂处理，去除85%的咖啡因；然后为最大限度保留茶本来的鲜甜与香气，以黄金比例将高品质深蒸绿茶重新混配。最终成品咖啡因减少75%，每100ml约含5mg。",
    sec1LinkText: "了解更多关于茶与咖啡因的知识",
    sec2Title: "以川俣谷产单一产地深蒸绿茶为基底",
    sec2P1:
      "藤八茶寮低咖啡因绿茶的基底，是三重县松阪市·川俣谷产单一产地深蒸绿茶。这片山谷被群山环绕，地形自然遮挡午后阳光，使茶叶得以缓缓积累丰富的茶氨酸（鲜味氨基酸）。",
    sec2P2:
      "超临界CO₂萃取法去除咖啡因后，这一产地特有的鲜甜与茶氨酸的丰富依然不变。为了在控制咖啡因摄入的同时品味伊势茶的浓郁风味，这款茶不作任何妥协。",
    sec2LinkText: "了解更多关于深蒸绿茶的知识",
    sec3Title: "藤八茶寮的低咖啡因绿茶",
    productName: "伊势茶低咖啡因（脱咖啡因）绿茶茶包 8个",
    viewDetails: "查看详情 >>",
    sec4Title: "冲泡方法",
    sec4HotLabel: "热饮",
    sec4HotItems: [
      "水温：70℃左右（温度越低，甜味越突出）",
      "茶包1个，浸泡时间：30～60秒",
      "要点：将沸水先倒入茶杯，再转入茶壶，自然降温至70℃左右",
    ],
    sec4ColdLabel: "冷泡",
    sec4ColdItems: [
      "将1～2个茶包放入500ml冷水中，冷藏30分钟～1小时",
      "甜味更为突出，口感柔和——亦是睡前一杯的绝佳选择",
      "浸泡完成后请取出茶包再保存",
    ],
    sec4LinkText: "详细冲泡方法请参阅冲泡方法页面",
    sec4LinkHref: "/zh/how-to-brew/",
    sec5Title: "常见问题",
    faqs: [
      {
        q: "咖啡因能降到完全为零吗？",
        a: "不能降为零。超临界CO₂萃取法将咖啡因减少75%，降至每100ml约5mg——与可乐大致相当，不足一般绿茶的三分之一。如需完全避免咖啡因，建议选择大麦茶等无咖啡因饮品。",
      },
      {
        q: "孕期或哺乳期可以饮用吗？",
        a: "本品咖啡因含量为每100ml约5mg，不足一般绿茶的三分之一。但孕期及哺乳期的饮食摄入，请务必咨询您的主治医生。",
      },
      {
        q: "口感与普通绿茶有区别吗？",
        a: "超临界CO₂萃取法只选择性地去除咖啡因，伊势茶本来的鲜甜与醇厚依然完整保留。您可以享受到与普通深蒸绿茶同样醇和顺滑的口感。",
      },
      {
        q: "可以做冷泡茶吗？",
        a: "可以。将茶包放入冷水中冷藏30分钟～1小时，即可享用甜味浓郁的低咖啡因冷泡绿茶，也非常适合作为睡前一杯。",
      },
      {
        q: "保质期是多久？",
        a: "自制造之日起1年。开封后请避免受潮保存，并尽快饮用。",
      },
    ],
    breadcrumbName: "低咖啡因绿茶网购",
  },
};

type Props = { locale: Locale };

export default async function DecafPage({ locale }: Props) {
  const t = TEXTS[locale];
  const pt = COMMON_TEXTS[locale].product;
  const basePath = locale === "ja" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_BASE_URL}${basePath}/ise-cha/decaf/`;
  const breadcrumbPath = locale === "ja" ? "/ise-cha/decaf" : `/${locale}/ise-cha/decaf`;

  const { contents: allProducts } = await getProducts();
  const p = allProducts.find((ap) => ap.SLUG === PRODUCT_SLUG);
  const productHref = buildLocalizedPath(locale, `/ise-cha/${PRODUCT_SLUG}`);
  const productImagePath = getProductImagePath(PRODUCT_SLUG);
  const price = p?.PRICE;
  const outOfStock = p?.STOCK === 0;

  const inLanguage =
    locale === "ja" ? "ja" : locale === "en" ? "en" : locale === "ko" ? "ko" : "zh";

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.h1}
        description={t.leadP}
        imageUrl={
          productImagePath
            ? `${SITE_BASE_URL}${productImagePath}`
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
          <IsechaSubNav locale={locale} current="decaf" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          {locale === "ja" && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-tea-light bg-cream px-4 py-3">
              <div>
                <p className="m-0 text-[0.9375rem] font-semibold text-tea-deep">夜も飲める、本格伊勢茶</p>
                <p className="m-0 text-[0.8125rem] text-ink-muted">薬剤不使用・水とCO₂のみでカフェインカット</p>
              </div>
              <Link
                href={productHref}
                className="shrink-0 rounded-lg border border-tea-light px-5 py-2.5 text-[0.9375rem] font-semibold text-tea-deep no-underline transition-colors hover:border-tea hover:bg-washi"
              >
                試してみる {formatPriceYen(price)}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            {/* デスクトップ：左サイドバー */}
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {productImagePath && (
                  <Link href={productHref} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productImagePath}
                        alt={t.productName}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productHref}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.productName}</span>
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
                href={productHref}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.productName}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">
                  &gt;&gt;
                </span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec1Title}</h2>
              <p>{t.sec1P1}</p>
              <p>{t.sec1P2}</p>
              <p>{t.sec1P3}</p>
              <p>
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/caffeine")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec1LinkText}
                </Link>
              </p>

              {locale === "ja" && (
                <>
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">カフェインとの上手な付き合い方</h2>
                  <p>カフェインは眠気を抑えて集中力を高めたり、気分を向上させる働きがあります。一方で、摂取してから体内で半分に分解されるまでに約5〜6時間かかるため、午後遅くに飲むと夜の寝つきや睡眠の質に影響が出ることがあります。</p>
                  <p>妊娠中の方はWHOの基準で1日200mg以下が推奨されており、カフェインに敏感な体質の方や、子どもとお茶を共有したい場面でもカフェイン量を意識することが大切です。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      カフェインについてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">飲み物別カフェイン含有量の比較</h2>
                  <p>日本の食品安全委員会が示す1日の摂取目安：成人400mg、妊婦200mg、子どもは体重1kgあたり2.5mg以下。</p>
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full min-w-[400px] border-collapse text-[0.875rem]">
                      <thead>
                        <tr className="bg-cream">
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">飲み物</th>
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">カフェイン (mg/100ml)</th>
                          <th className="border-b border-border px-3 py-2 text-left font-semibold text-tea-deep">備考</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr><td className="px-3 py-2">玉露</td><td className="px-3 py-2">約160mg</td><td className="px-3 py-2 text-ink-muted">少量を楽しむのが基本</td></tr>
                        <tr><td className="px-3 py-2">エスプレッソ</td><td className="px-3 py-2">約60mg</td><td className="px-3 py-2 text-ink-muted">1杯（30ml）で約60〜75mg</td></tr>
                        <tr><td className="px-3 py-2">ドリップコーヒー</td><td className="px-3 py-2">約40mg</td><td className="px-3 py-2 text-ink-muted">1杯（150ml）で約60mg</td></tr>
                        <tr><td className="px-3 py-2">エナジードリンク</td><td className="px-3 py-2">約30mg</td><td className="px-3 py-2 text-ink-muted">製品により異なる</td></tr>
                        <tr><td className="px-3 py-2">深蒸し茶</td><td className="px-3 py-2">約20mg</td><td className="px-3 py-2 text-ink-muted">普通の緑茶よりやや多め</td></tr>
                        <tr><td className="px-3 py-2">紅茶</td><td className="px-3 py-2">約17mg</td><td className="px-3 py-2 text-ink-muted">抽出時間によって変動</td></tr>
                        <tr><td className="px-3 py-2">緑茶（煎茶）</td><td className="px-3 py-2">約15mg</td><td className="px-3 py-2 text-ink-muted">番茶などはこれより低め</td></tr>
                        <tr><td className="px-3 py-2">ほうじ茶</td><td className="px-3 py-2">約10mg</td><td className="px-3 py-2 text-ink-muted">焙煎でカフェインが揮発</td></tr>
                        <tr><td className="px-3 py-2">コーラ</td><td className="px-3 py-2">約5mg</td><td className="px-3 py-2 text-ink-muted">清涼飲料水としての微量含有</td></tr>
                        <tr className="bg-cream font-semibold">
                          <td className="px-3 py-2 text-tea-deep">カフェインカット緑茶</td>
                          <td className="px-3 py-2 text-tea-deep">約5mg</td>
                          <td className="px-3 py-2 text-tea-deep">藤八茶寮の商品（75%オフ）</td>
                        </tr>
                        <tr><td className="px-3 py-2">麦茶</td><td className="px-3 py-2">ほぼ0mg</td><td className="px-3 py-2 text-ink-muted">ノンカフェイン飲料</td></tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

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
                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">カフェインを減らしても、カテキンはそのまま</h2>
                  <p>藤八茶寮のカフェインカット緑茶は、超臨界CO₂抽出法によりカフェインのみを選択的に除去しています。そのため、緑茶本来の健康成分である「カテキン」はそのまま保たれています。</p>
                  <p>緑茶のカテキン、特に「ガレート型カテキン」には、悪玉（LDL）コレステロールだけを選択的に低下させる働きが確認されています。善玉（HDL）コレステロールには影響を与えないため、毎日続けやすい健康習慣として注目されています。</p>
                  <p>2026年5月放送のNHK『あしたが変わるトリセツショー』でも、コレステロールの吸収を抑える食品として緑茶が紹介されました。</p>
                  <p>自分で淹れた深蒸し茶100mlに含まれるカテキンは、市販のペットボトル緑茶の約10倍以上。カフェインカット緑茶でも、この豊富なカテキンをそのまま摂ることができます。</p>
                  <p>「カフェインは控えたいけれど、健康効果は諦めたくない」——そんな方にこそ、藤八茶寮のカフェインカット緑茶はお役に立てます。</p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha/catechin")} className="text-tea underline underline-offset-2">
                      お茶とコレステロールについてもっと詳しく
                    </Link>
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    →{" "}
                    <Link href={buildLocalizedPath(locale, "/ise-cha/caffeine")} className="text-tea underline underline-offset-2">
                      お茶とカフェインについてもっと詳しく
                    </Link>
                  </p>

                  <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">こんな方におすすめ</h2>
                  <ul className="m-0 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink">
                    <li>夜もお茶を楽しみたいが、眠れなくなるのは困る方</li>
                    <li>妊娠中・授乳中で、本格的なお茶の味を諦めたくない方</li>
                    <li>子どもと同じお茶を飲みたい方</li>
                    <li>カフェインに敏感な体質の方</li>
                    <li>朝は深蒸し茶、夜はカフェインカットと飲み分けたい方</li>
                    <li>カフェインを控えながら、カテキンの健康効果も得たい方</li>
                  </ul>
                </>
              )}
            </section>
          </div>

          {/* セクション4：淹れ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4HotLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4HotItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4ColdLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4ColdItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <Link href={t.sec4LinkHref} className="text-tea underline underline-offset-2">
                {t.sec4LinkText}
              </Link>
            </p>
          </div>

          {/* セクション5：FAQ */}
          <div className="mt-12">
            <h2 className="m-0 mb-6 text-lg font-semibold text-tea-deep">{t.sec5Title}</h2>
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
          {/* 商品（最下部） */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec3Title}</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href={productHref}
                className="flex w-[200px] flex-col no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:border-tea-light hover:bg-white"
              >
                <span className="relative block mb-2 aspect-square">
                  {productImagePath && (
                    <Image
                      src={productImagePath}
                      alt={t.productName}
                      width={640}
                      height={640}
                      className="w-full h-full rounded object-cover bg-cream"
                      sizes="(max-width: 767px) 45vw, 220px"
                    />
                  )}
                  {outOfStock && (
                    <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[0.75rem] font-semibold text-cream">
                      {locale === "ja"
                        ? "在庫切れ"
                        : locale === "en"
                          ? "Out of stock"
                          : locale === "ko"
                            ? "품절"
                            : "缺货"}
                    </span>
                  )}
                </span>
                <span className="block text-right text-[0.8125rem] font-normal mb-0.5 leading-snug">
                  {t.productName}
                </span>
                <span className="block text-right text-[0.875rem] font-bold text-tea-deep">
                  {formatPriceYen(price)}{" "}
                  <span className="text-[0.75rem] text-ink-muted font-normal">
                    {pt.taxIncluded}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
