import fs from "fs";
import path from "path";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import type { Locale } from "@/lib/i18n";
import { getProductImagePath } from "@/lib/productImage";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { buildLocalizedPath } from "@/lib/urlPath";

const STRUCTURE_IMAGE_SRC = "/images/ise-cha/caffeine/Caffeine_structure.webp";

type CaffeineTexts = {
  h1: string;
  articleHeadline: string;
  articleDescription: string;
  breadcrumbName: string;
  leadP1: string;
  leadP2: string;
  leadP3: string;
  decafLinkLabel: string;
  decafProductAlt: string;
  decafProductName: string;
  chemFormula: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  intakeTitle: string;
  intakeIntro: string;
  intakeTableH: readonly [string, string];
  intakeRows: readonly (readonly [string, string])[];
  intakeNote: string;
  caffeineIntro: string;
  caffeineTableH: readonly [string, string, string];
  caffeineRows: readonly (readonly [string, string, string])[];
  decafH2Prefix: string;
  decafH2Link: string;
  decafP1: string;
  decafP2Prefix: string;
  decafP2Link: string;
  decafP2Suffix: string;
  decafListItems: readonly [string, string, string];
  decafP3: string;
  faqTitle: string;
  faqs: readonly { q: string; a: string }[];
  summaryTitle: string;
  summaryP: string;
};

const TEXTS: Record<Locale, CaffeineTexts> = {
  ja: {
    h1: "カフェインカット緑茶の通販｜お茶とカフェインの知っておきたい関係",
    articleHeadline: "カフェインカット緑茶の通販｜お茶とカフェインの知っておきたい関係",
    articleDescription:
      "薬剤不使用・超臨界CO2抽出でカフェイン70%オフ。伊勢茶本来の旨みはそのままに、夜のティータイムや低カフェインを気にする方に。三重県川俣谷産シングルオリジン。",
    breadcrumbName: "カフェインカット緑茶",
    leadP1:
      "お茶には150種類以上の成分が含まれていますが、その中でも特に注目されるのが「カフェイン」です。",
    leadP2:
      "コーヒーにも含まれる苦み成分の一種で、眠気を抑えて集中力や注意力を高めたり、気分を向上させたりといった多くのメリットがあります。また、脂肪燃焼の促進や運動パフォーマンスの向上に寄与するという研究データもあり、私たちの生活に活力を与えてくれる存在です。",
    leadP3: "一方で、摂取するタイミングや量には少し注意が必要です。",
    decafLinkLabel: "伊勢茶 カフェインカット緑茶",
    decafProductAlt: "伊勢茶 カフェインカット（デカフェ）緑茶",
    decafProductName: "伊勢茶 カフェインカット（デカフェ）緑茶",
    chemFormula: "化学式: C8H10N4O2",
    sec2Title: "カフェインの「半減期」と上手な付き合い方",
    sec2P1:
      "カフェインを摂取してから、体内でその量が半分に分解されるまで（半減期）には、約5〜6時間かかると言われています。そのため、午後遅くに摂取すると、夜の寝つきや睡眠の質に影響が出ることもあります。",
    sec2P2:
      "また、継続的に多く摂取しすぎると耐性がつき、急に控えた際に倦怠感や集中力の低下を感じる「離脱症状」が出る場合もあります。カルシウムの吸収をわずかに阻害する性質もあるため、特に妊娠中の方はWHOの基準で1日200mg以下（コーヒー約2〜3杯程度）に抑えることが推奨されています。",
    intakeTitle: "飲み物別・カフェイン含有量ガイド",
    intakeIntro: "日本の食品安全委員会が示している、1日当たりの摂取目安量は以下の通りです。",
    intakeTableH: ["対象", "摂取目安量"],
    intakeRows: [
      ["成人", "400mg/日 以下"],
      ["妊婦", "200mg/日 以下"],
      ["子ども", "体重1kgあたり2.5mg/日 以下"],
    ],
    intakeNote: "※体質により個人差がありますので、あくまで目安としてください。",
    caffeineIntro: "では、私たちが普段口にする飲み物には、どれくらいのカフェインが含まれているのでしょうか。",
    caffeineTableH: ["飲み物", "カフェイン (mg/100ml)", "備考"],
    caffeineRows: [
      ["玉露", "約160mg", "別格の高さ。少量を楽しむのが基本"],
      ["エスプレッソ", "約60mg", "1杯（30ml）で約60〜75mg程度"],
      ["ドリップコーヒー", "約40mg", "1杯（150ml）で約60mg程度"],
      ["エナジードリンク", "約30mg", "製品により大きく異なる"],
      ["深蒸し茶", "約20mg", "普通の緑茶よりやや多め"],
      ["紅茶", "約17mg", "抽出時間によって変動"],
      ["緑茶（煎茶）", "約15mg", "番茶などはこれより低め"],
      ["ほうじ茶", "約10mg", "焙煎の工程でカフェインが揮発"],
      ["コーラ", "約5mg", "清涼飲料水としての微量含有"],
      ["カフェインカット緑茶", "約5mg", "藤八茶寮の商品（70%オフ）"],
      ["麦茶", "ほぼ0mg", "ノンカフェイン飲料"],
    ],
    decafH2Prefix: "美味しさを諦めない「藤八茶寮」の",
    decafH2Link: "カフェインカット緑茶",
    decafP1:
      "「夜もお茶を楽しみたいけれど、眠れなくなるのは困る」「妊娠中や授乳中でも、本格的なお茶の味を楽しみたい」……そんな声にお応えして生まれたのが、藤八茶寮のカフェインカット緑茶です。",
    decafP2Prefix: "私たちの",
    decafP2Link: "カフェインカット緑茶",
    decafP2Suffix: "は、薬剤を使わず「水と二酸化炭素」のみを用いる超臨界二酸化炭素抽出法を採用しています。",
    decafListItems: [
      "まず、深蒸し茶からカフェインを85%除去します。",
      "そのままだと失われがちな「濃厚なコク」と「まろやかな旨み」を保つため、あえて高品質な深蒸し茶を黄金比で再ブレンド。",
      "最終的にカフェイン70%オフという、美味しさと優しさを両立したバランスに仕上げました。",
    ],
    decafP3:
      "100ml当たりのカフェイン量は約5mg。これはコーラと同程度で、一般的な緑茶の3分の1以下です。お子様からカフェインに敏感な体質の方まで、伊勢茶ならではの薫り高い風味を安心してお楽しみいただけます。",
    faqTitle: "よくある質問",
    faqs: [
      {
        q: "デカフェと完全ノンカフェインは違いますか？",
        a: "はい、異なります。デカフェはカフェインを大幅に低減したものですが、完全にゼロではありません。藤八茶寮のカフェインカット緑茶は約70%オフで、100mlあたり約5mg残っています。完全にカフェインを避けたい場合は麦茶などをお選びください。",
      },
      {
        q: "妊娠中や授乳中でも飲めますか？",
        a: "本商品のカフェイン量は100mlあたり約5mgで、一般的な緑茶の約3分の1以下です。ただし妊娠中・授乳中の方の食品摂取についてはかかりつけの医師にご相談ください。",
      },
      {
        q: "子どもでも飲めますか？",
        a: "カフェイン量は一般的な緑茶の約3分の1以下です。ただし年齢・体重により適切な摂取量が異なるため、小さなお子様には量を調整してお飲みください。",
      },
      {
        q: "味は普通の緑茶と変わりますか？",
        a: "超臨界CO2抽出法により、カフェインのみを選択的に除去するため、伊勢茶本来の旨みとコクはそのままです。通常の深蒸し茶と同様にまろやかな味わいをお楽しみいただけます。",
      },
      {
        q: "水出しでも飲めますか？",
        a: "はい。冷水にティーバッグを入れて冷蔵庫で30分〜1時間置くだけで、甘みの強い水出しカフェインカット緑茶が楽しめます。就寝前の一杯としてもおすすめです。",
      },
    ],
    summaryTitle: "まとめ：シーンに合わせて賢く選ぶ",
    summaryP:
      "カフェインは決して「避けるべきもの」ではありません。仕事中の集中力アップや、アクティブに動きたい時には強い味方になってくれます。大切なのは、時間帯や体調に合わせて飲み分けること。朝の目覚めには力強い深蒸し茶を。そしてリラックスしたい夜や、ご家族で囲む食卓には藤八茶寮のカフェインカット緑茶を。上手に使い分けて、心豊かなティータイムをお過ごしください。",
  },

  en: {
    h1: "Low-Caffeine Green Tea | What You Should Know About Tea and Caffeine",
    articleHeadline: "Low-Caffeine Green Tea | What You Should Know About Tea and Caffeine",
    articleDescription:
      "Caffeine reduced by 70% using supercritical CO2 extraction—no chemicals. Full umami of Kawamatatani Ise tea, ideal for evenings and those watching their caffeine intake.",
    breadcrumbName: "Low-Caffeine Green Tea",
    leadP1:
      "Green tea contains over 150 components, but one of the most notable is caffeine.",
    leadP2:
      "Like the bitter compound in coffee, caffeine can help ward off sleepiness, sharpen focus and attention, and lift mood. Research also suggests it may support fat burning and exercise performance — giving us a natural boost in daily life.",
    leadP3: "That said, timing and quantity do require a little care.",
    decafLinkLabel: "Ise Tea Caffeine-Cut Green Tea",
    decafProductAlt: "Ise Tea Caffeine-Cut (Decaf) Green Tea",
    decafProductName: "Ise Tea Caffeine-Cut (Decaf) Green Tea",
    chemFormula: "Formula: C8H10N4O2",
    sec2Title: "Caffeine's \"half-life\" and how to use it wisely",
    sec2P1:
      "After consuming caffeine, it takes about 5–6 hours for the body to break down half of it (the \"half-life\"). This means that drinking caffeine late in the afternoon can affect how easily you fall asleep and the quality of your sleep.",
    sec2P2:
      "Consuming too much over time can also build tolerance, and cutting back suddenly may cause withdrawal symptoms such as fatigue or difficulty concentrating. Caffeine can also slightly inhibit calcium absorption, so pregnant women are advised by WHO guidelines to keep their intake below 200 mg per day (roughly 2–3 cups of coffee).",
    intakeTitle: "Caffeine content guide by beverage",
    intakeIntro:
      "The following are the daily intake guidelines issued by Japan's Food Safety Commission.",
    intakeTableH: ["Group", "Daily guideline"],
    intakeRows: [
      ["Adults", "Up to 400 mg/day"],
      ["Pregnant women", "Up to 200 mg/day"],
      ["Children", "Up to 2.5 mg/kg body weight/day"],
    ],
    intakeNote: "※ Individual tolerance varies; please treat these as general guidelines.",
    caffeineIntro:
      "So how much caffeine is actually in the drinks we consume every day?",
    caffeineTableH: ["Beverage", "Caffeine (mg/100 ml)", "Notes"],
    caffeineRows: [
      ["Gyokuro", "~160 mg", "Exceptionally high; enjoy in small amounts"],
      ["Espresso", "~60 mg", "About 60–75 mg per shot (30 ml)"],
      ["Drip coffee", "~40 mg", "About 60 mg per cup (150 ml)"],
      ["Energy drinks", "~30 mg", "Varies significantly by product"],
      ["Fukamushi sencha", "~20 mg", "Slightly higher than regular green tea"],
      ["Black tea", "~17 mg", "Varies with steeping time"],
      ["Green tea (sencha)", "~15 mg", "Bancha etc. is lower"],
      ["Hojicha", "~10 mg", "Caffeine evaporates during roasting"],
      ["Cola", "~5 mg", "Trace amounts in soft drinks"],
      ["Caffeine-cut green tea", "~5 mg", "Fujihachi Saryo product (70% off)"],
      ["Barley tea (mugicha)", "Nearly 0 mg", "Caffeine-free beverage"],
    ],
    decafH2Prefix: "Fujihachi Saryo's ",
    decafH2Link: "caffeine-cut green tea",
    decafP1:
      "\"I want to enjoy tea in the evening, but I don't want to lie awake.\" \"I'm pregnant but I still want real tea flavour.\" — Our caffeine-cut green tea was born to answer exactly those needs.",
    decafP2Prefix: "Our ",
    decafP2Link: "caffeine-cut green tea",
    decafP2Suffix:
      " uses supercritical carbon dioxide extraction — water and CO2 only, no chemicals.",
    decafListItems: [
      "First, 85% of the caffeine is removed from the deep-steamed tea.",
      "To preserve the rich body and smooth umami that can be lost in processing, we then blend in premium deep-steamed tea at a golden ratio.",
      "The result is a 70%-caffeine-reduced tea that balances great taste with gentle caffeine levels.",
    ],
    decafP3:
      "About 5 mg of caffeine per 100 ml — the same as cola, and less than one-third of regular green tea. From children to those sensitive to caffeine, everyone can enjoy the aromatic flavour unique to Ise tea with peace of mind.",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Is decaf different from completely caffeine-free?",
        a: "Yes. Decaf means the caffeine has been greatly reduced, but not completely removed. Fujihachi Saryo's caffeine-cut green tea is about 70% lower, leaving approximately 5 mg per 100 ml. If you need to avoid caffeine entirely, please choose something like barley tea.",
      },
      {
        q: "Is it suitable for pregnant or breastfeeding women?",
        a: "This product contains approximately 5 mg of caffeine per 100 ml, which is less than one-third of regular green tea. If you are pregnant or breastfeeding, please consult your doctor regarding food and beverage intake.",
      },
      {
        q: "Can children drink it?",
        a: "The caffeine content is less than one-third of regular green tea. However, appropriate intake varies by age and weight, so please adjust the amount for young children.",
      },
      {
        q: "Does it taste different from regular green tea?",
        a: "Because supercritical CO2 extraction selectively removes only caffeine, the original umami and body of the Ise tea are preserved. You can enjoy the same smooth, mellow flavour as our regular deep-steamed tea.",
      },
      {
        q: "Can I make cold brew with it?",
        a: "Yes. Simply place teabags in cold water and refrigerate for 30 minutes to 1 hour for a sweet, cold-brew caffeine-cut green tea. It makes a perfect evening cup before bed.",
      },
    ],
    summaryTitle: "Choosing wisely for every occasion",
    summaryP:
      "Caffeine is certainly not something to avoid altogether. It can be a powerful ally when you need to concentrate at work or stay active. The key is to match your choice to the time of day and how you feel. Reach for a bold fukamushi sencha to wake up in the morning — and for a relaxing evening or a family meal, let Fujihachi Saryo's caffeine-cut green tea be your companion.",
  },

  ko: {
    h1: "저카페인 녹차 통신판매｜차와 카페인에 대해 알아두어야 할 것",
    articleHeadline: "저카페인 녹차 통신판매｜차와 카페인에 대해 알아두어야 할 것",
    articleDescription:
      "약제 불사용·초임계 CO2 추출로 카페인 70% 감소. 이세차 본연의 감칠맛은 그대로, 야간 티타임이나 저카페인이 신경 쓰이는 분에게. 미에현 가와마타다니산 싱글 오리진.",
    breadcrumbName: "저카페인 녹차",
    leadP1: "녹차에는 150종 이상의 성분이 함유되어 있는데, 그 중에서도 특히 주목받는 것이 「카페인」입니다.",
    leadP2:
      "커피에도 들어 있는 쓴맛 성분의 일종으로, 졸음을 억제하고 집중력·주의력을 높이거나 기분을 향상시키는 등 다양한 장점이 있습니다. 또 지방 연소 촉진과 운동 퍼포먼스 향상에 기여한다는 연구 데이터도 있어, 우리의 일상에 활력을 주는 존재입니다.",
    leadP3: "한편, 섭취 타이밍과 양에는 약간의 주의가 필요합니다.",
    decafLinkLabel: "이세차 카페인컷 녹차",
    decafProductAlt: "이세차 카페인컷(디카페인) 녹차",
    decafProductName: "이세차 카페인컷(디카페인) 녹차",
    chemFormula: "화학식: C8H10N4O2",
    sec2Title: "카페인의 '반감기'와 현명한 활용법",
    sec2P1:
      "카페인을 섭취한 후 체내에서 그 양이 절반으로 분해될 때까지(반감기)는 약 5~6시간이 걸린다고 합니다. 그래서 오후 늦게 섭취하면 밤의 수면 시작이나 수면의 질에 영향을 줄 수 있습니다.",
    sec2P2:
      "또 지속적으로 많이 섭취하면 내성이 생겨, 갑자기 줄였을 때 권태감이나 집중력 저하 등의 '금단 증상'이 나타날 수 있습니다. 칼슘 흡수를 약간 저해하는 성질도 있어, 특히 임신 중인 분은 WHO 기준으로 1일 200mg 이하(커피 약 2~3잔 정도)로 제한하도록 권고됩니다.",
    intakeTitle: "음료별 카페인 함량 가이드",
    intakeIntro: "일본 식품안전위원회가 제시하는 1일 섭취 기준량은 다음과 같습니다.",
    intakeTableH: ["대상", "섭취 기준량"],
    intakeRows: [
      ["성인", "400mg/일 이하"],
      ["임산부", "200mg/일 이하"],
      ["어린이", "체중 1kg당 2.5mg/일 이하"],
    ],
    intakeNote: "※ 체질에 따라 개인차가 있으므로 어디까지나 기준으로 참고해 주세요.",
    caffeineIntro: "그렇다면 우리가 평소 마시는 음료에는 얼마나 많은 카페인이 포함되어 있을까요?",
    caffeineTableH: ["음료", "카페인 (mg/100ml)", "비고"],
    caffeineRows: [
      ["교쿠로", "약160mg", "각별히 높다. 소량씩 즐기는 것이 기본"],
      ["에스프레소", "약60mg", "1잔(30ml)에 약60~75mg 정도"],
      ["드립 커피", "약40mg", "1잔(150ml)에 약60mg 정도"],
      ["에너지 드링크", "약30mg", "제품에 따라 크게 다름"],
      ["후카무시 녹차", "약20mg", "보통 녹차보다 약간 높음"],
      ["홍차", "약17mg", "우리는 시간에 따라 달라짐"],
      ["녹차(센차)", "약15mg", "반차 등은 이보다 낮음"],
      ["호지차", "약10mg", "볶음 과정에서 카페인이 증발"],
      ["콜라", "약5mg", "청량음료로서의 미량 함유"],
      ["카페인컷 녹차", "약5mg", "후지하치야 상품(70% 감소)"],
      ["보리차", "거의0mg", "무카페인 음료"],
    ],
    decafH2Prefix: "맛을 포기하지 않는 「후지하치야」의 ",
    decafH2Link: "카페인컷 녹차",
    decafP1:
      "「밤에도 차를 즐기고 싶지만 잠 못 자는 건 곤란해」「임신 중·수유 중이어도 제대로 된 차 맛을 즐기고 싶어」……그런 목소리에 응해 탄생한 것이 후지하치야의 카페인컷 녹차입니다.",
    decafP2Prefix: "저희의 ",
    decafP2Link: "카페인컷 녹차",
    decafP2Suffix: "는 약제를 사용하지 않고 「물과 이산화탄소」만을 이용하는 초임계 이산화탄소 추출법을 채용하고 있습니다.",
    decafListItems: [
      "먼저, 후카무시 녹차에서 카페인을 85% 제거합니다.",
      "그대로 두면 잃어버리기 쉬운 「진한 감칠맛」과 「부드러운 우마미」를 유지하기 위해, 고품질 후카무시 녹차를 황금 비율로 재블렌드.",
      "최종적으로 카페인 70% 감소라는, 맛과 부드러움을 양립한 밸런스로 완성했습니다.",
    ],
    decafP3:
      "100ml당 카페인 함량은 약5mg. 이는 콜라와 같은 수준으로, 일반적인 녹차의 3분의 1 이하입니다. 어린이부터 카페인에 민감한 분까지, 이세차 특유의 향긋한 풍미를 안심하고 즐기실 수 있습니다.",
    faqTitle: "자주 묻는 질문",
    faqs: [
      {
        q: "디카페인과 완전 논카페인은 다른가요?",
        a: "네, 다릅니다. 디카페인은 카페인을 대폭 저감한 것이지만 완전히 제로는 아닙니다. 후지하치야의 카페인컷 녹차는 약 70% 감소로, 100ml당 약 5mg이 남아 있습니다. 카페인을 완전히 피하고 싶은 경우에는 보리차 등을 선택해 주세요.",
      },
      {
        q: "임신 중이나 수유 중에도 마실 수 있나요?",
        a: "본 상품의 카페인 함량은 100ml당 약 5mg으로, 일반 녹차의 약 3분의 1 이하입니다. 다만 임신 중·수유 중인 분의 식품 섭취에 대해서는 주치의에게 상담해 주세요.",
      },
      {
        q: "어린이도 마실 수 있나요?",
        a: "카페인 함량은 일반적인 녹차의 약 3분의 1 이하입니다. 다만 나이·체중에 따라 적절한 섭취량이 다르므로, 어린 아이에게는 양을 조절해서 드세요.",
      },
      {
        q: "맛이 보통 녹차와 다른가요?",
        a: "초임계 CO2 추출법으로 카페인만을 선택적으로 제거하기 때문에, 이세차 본연의 감칠맛과 풍미는 그대로입니다. 일반 후카무시 녹차와 마찬가지로 부드러운 맛을 즐기실 수 있습니다.",
      },
      {
        q: "냉차로도 마실 수 있나요?",
        a: "네. 냉수에 티백을 넣고 냉장고에서 30분~1시간 두기만 하면, 단맛이 풍부한 냉차 카페인컷 녹차를 즐길 수 있습니다. 취침 전 한 잔으로도 추천합니다.",
      },
    ],
    summaryTitle: "상황에 맞게 현명하게 선택하기",
    summaryP:
      "카페인은 결코 '피해야 할 것'이 아닙니다. 업무 중 집중력 향상이나, 활발하게 움직이고 싶을 때 강한 아군이 되어 줍니다. 중요한 것은 시간대와 컨디션에 맞게 마시는 것. 아침의 눈뜸에는 힘찬 후카무시 녹차를. 그리고 릴랙스하고 싶은 밤이나 가족과 함께하는 식탁에는 후지하치야의 카페인컷 녹차를. 잘 구분해서 마시며, 마음 풍요로운 티타임을 즐기세요.",
  },

  zh: {
    h1: "低咖啡因绿茶网购｜关于茶与咖啡因你应该了解的知识",
    articleHeadline: "低咖啡因绿茶网购｜关于茶与咖啡因你应该了解的知识",
    articleDescription:
      "不使用药剂·超临界CO2萃取，咖啡因减少70%。保留伊势茶本来的鲜甜，适合夜间饮用及关注咖啡因摄入的人士。三重县川俣谷产单一产地。",
    breadcrumbName: "低咖啡因绿茶",
    leadP1: "绿茶含有150种以上的成分，其中最受关注的是「咖啡因」。",
    leadP2:
      "咖啡因是咖啡中也含有的一种苦味物质，具有提神醒脑、提高专注力和注意力、改善心情等多种益处。研究数据也表明它有助于促进脂肪燃烧和提升运动表现，是为我们日常生活注入活力的存在。",
    leadP3: "不过，摄取时机和摄取量需要稍加注意。",
    decafLinkLabel: "伊势茶低咖啡因绿茶",
    decafProductAlt: "伊势茶低咖啡因（脱咖啡因）绿茶",
    decafProductName: "伊势茶低咖啡因（脱咖啡因）绿茶",
    chemFormula: "分子式: C8H10N4O2",
    sec2Title: "咖啡因的「半衰期」与聪明饮用方式",
    sec2P1:
      "摄取咖啡因后，体内将其量分解为一半（半衰期）需要约5～6小时。因此，下午较晚摄取可能会影响夜间入睡及睡眠质量。",
    sec2P2:
      "持续大量摄取还会产生耐受性，突然减少时可能出现倦怠感或注意力下降等「戒断症状」。咖啡因还略微抑制钙的吸收，因此WHO建议孕妇每日摄取量控制在200mg以下（约相当于2～3杯咖啡）。",
    intakeTitle: "各类饮品咖啡因含量指南",
    intakeIntro: "以下为日本食品安全委员会公布的每日摄取参考量。",
    intakeTableH: ["对象", "每日摄取参考量"],
    intakeRows: [
      ["成人", "400mg/天 以下"],
      ["孕妇", "200mg/天 以下"],
      ["儿童", "每kg体重不超过2.5mg/天"],
    ],
    intakeNote: "※ 因个人体质存在差异，仅供参考。",
    caffeineIntro: "那么，我们日常饮用的饮品中究竟含有多少咖啡因呢？",
    caffeineTableH: ["饮品", "咖啡因 (mg/100ml)", "备注"],
    caffeineRows: [
      ["玉露", "约160mg", "含量特别高，少量品饮为宜"],
      ["浓缩咖啡", "约60mg", "每杯(30ml)约60～75mg"],
      ["手冲咖啡", "约40mg", "每杯(150ml)约60mg"],
      ["功能饮料", "约30mg", "因产品差异较大"],
      ["深蒸绿茶", "约20mg", "略高于普通绿茶"],
      ["红茶", "约17mg", "随冲泡时间有所变化"],
      ["绿茶(煎茶)", "约15mg", "番茶等低于此值"],
      ["焙茶", "约10mg", "烘焙过程中咖啡因挥发"],
      ["可乐", "约5mg", "作为清凉饮料的微量含有"],
      ["低咖啡因绿茶", "约5mg", "藤八茶寮商品（减少70%）"],
      ["大麦茶", "几乎0mg", "无咖啡因饮料"],
    ],
    decafH2Prefix: "不妥协美味的「藤八茶寮」",
    decafH2Link: "低咖啡因绿茶",
    decafP1:
      "「想在晚上也享受茶，但不想失眠」「妊娠期或哺乳期也想品尝正宗茶香」……为回应这些心声而诞生的，就是藤八茶寮的低咖啡因绿茶。",
    decafP2Prefix: "我们的",
    decafP2Link: "低咖啡因绿茶",
    decafP2Suffix: "采用不使用药剂、仅用「水与二氧化碳」的超临界二氧化碳萃取法。",
    decafListItems: [
      "首先，从深蒸绿茶中去除85%的咖啡因。",
      "为保留容易流失的「浓郁甘鲜」与「醇和鲜味」，特以黄金比例混入优质深蒸绿茶进行再调配。",
      "最终制成咖啡因减少70%、兼顾美味与温和的平衡产品。",
    ],
    decafP3:
      "每100ml咖啡因含量约5mg，与可乐相当，不到一般绿茶的三分之一。无论是儿童还是对咖啡因敏感的人群，都可以放心享用伊势茶独特的馥郁风味。",
    faqTitle: "常见问题",
    faqs: [
      {
        q: "脱咖啡因与完全无咖啡因有区别吗？",
        a: "有区别。脱咖啡因是大幅降低咖啡因含量，但并非完全为零。藤八茶寮的低咖啡因绿茶减少约70%，每100ml仍残留约5mg。如需完全避免咖啡因，请选择大麦茶等无咖啡因饮品。",
      },
      {
        q: "妊娠期或哺乳期可以饮用吗？",
        a: "本商品每100ml咖啡因含量约为5mg，不足普通绿茶的三分之一。妊娠期或哺乳期人士在食品摄取方面请咨询主治医生。",
      },
      {
        q: "儿童可以饮用吗？",
        a: "咖啡因含量不足普通绿茶的三分之一。但由于适当摄取量因年龄和体重而异，请为年幼儿童适量调整饮用量。",
      },
      {
        q: "口味与普通绿茶有区别吗？",
        a: "超临界CO2萃取法仅选择性去除咖啡因，因此伊势茶本来的鲜甜与醇厚得以完整保留，可享用与普通深蒸绿茶相同的醇和口感。",
      },
      {
        q: "可以做冷泡茶吗？",
        a: "可以。将茶包放入冷水中冷藏30分钟～1小时，即可享用甜味浓郁的冷泡低咖啡因绿茶。作为睡前的一杯茶也非常推荐。",
      },
    ],
    summaryTitle: "按场合聪明选择",
    summaryP:
      "咖啡因绝非「应该避免之物」。工作时提升专注力，或需要积极活动时，它都是强有力的帮手。关键在于根据时间段和身体状况来选择不同的茶饮。清晨唤醒身体，选力道十足的深蒸绿茶；想放松的夜晚或家人共聚的餐桌上，则选藤八茶寮的低咖啡因绿茶。合理搭配，享受心旷神怡的茶时光。",
  },
};

type Props = { locale: Locale };

export default function CaffeinePage({ locale }: Props) {
  const t = TEXTS[locale];
  const decafImagePath = getProductImagePath("decaf_green_tea");
  const structureImageExists = fs.existsSync(
    path.join(process.cwd(), "public", "images", "ise-cha", "caffeine", "Caffeine_structure.webp"),
  );
  const basePath = locale === "ja" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_BASE_URL}${basePath}/ise-cha/caffeine/`;
  const breadcrumbPath =
    locale === "ja" ? "/ise-cha/caffeine" : `/${locale}/ise-cha/caffeine`;
  const decafHref = buildLocalizedPath(locale, "/ise-cha/decaf_green_tea");
  const inLanguage = locale === "zh" ? "zh" : locale;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={t.articleHeadline}
        description={t.articleDescription}
        imageUrl={STRUCTURE_IMAGE_SRC}
        canonicalUrl={canonicalUrl}
        inLanguage={inLanguage}
      />
      <FaqJsonLd questions={t.faqs} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, locale, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="caffeine" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] md:items-start">
            <aside className="hidden w-full md:block">
              <div className="space-y-8">
                {/* カフェイン構造式 */}
                <section className="mx-auto w-full max-w-[420px]">
                  {structureImageExists ? (
                    <Image
                      src={STRUCTURE_IMAGE_SRC}
                      alt="カフェイン構造式"
                      width={480}
                      height={480}
                      className="mt-[3lh] mx-auto h-auto w-full max-w-[320px] object-contain"
                      sizes="(max-width: 767px) 70vw, 320px"
                    />
                  ) : (
                    <div className="mt-[3lh] mx-auto flex h-[240px] w-full max-w-[320px] items-center justify-center rounded border border-dashed border-border bg-cream px-4 text-center text-[0.875rem] text-ink-muted">
                      Caffeine_structure.webp を
                      <br />
                      /public/images/ise-cha/caffeine/
                      <br />
                      に配置してください
                    </div>
                  )}
                  <p className="m-0 mt-3 text-center text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.chemFormula}
                  </p>
                  <h2 className="m-0 mt-1 text-center text-lg font-semibold text-tea-deep">
                    Caffeine
                  </h2>
                </section>

                <Link
                  href={decafHref}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{t.decafLinkLabel}</span>
                  <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
                </Link>

                {/* デカフェ商品カード */}
                <Link
                  href={decafHref}
                  className="mx-auto block w-full max-w-[420px] no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
                >
                  <Image
                    src={decafImagePath}
                    alt={t.decafProductAlt}
                    width={640}
                    height={640}
                    className="h-auto w-full rounded object-cover"
                    sizes="(max-width: 767px) 90vw, 420px"
                  />
                  <p className="m-0 mt-3 text-center text-[0.9375rem] font-semibold text-tea-deep">
                    {t.decafProductName}
                  </p>
                </Link>
              </div>
            </aside>

            <section className="space-y-4 text-[0.9375rem] leading-relaxed text-ink">
              <p>{t.leadP1}</p>
              <p>{t.leadP2}</p>
              <p>{t.leadP3}</p>

              <Link
                href={decafHref}
                className="md:hidden flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span>{t.decafLinkLabel}</span>
                <span className="shrink-0 text-tea font-semibold" aria-hidden="true">&gt;&gt;</span>
              </Link>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>

              <div className="md:hidden">
                {structureImageExists ? (
                  <Image
                    src={STRUCTURE_IMAGE_SRC}
                    alt="カフェイン構造式"
                    width={480}
                    height={480}
                    className="mt-[3lh] mx-auto h-auto w-full max-w-[320px] object-contain"
                    sizes="70vw"
                  />
                ) : null}
                <p className="m-0 mt-3 text-center text-[0.875rem] leading-relaxed text-ink-muted">
                  {t.chemFormula}
                </p>
                <h2 className="m-0 mt-1 text-center text-lg font-semibold text-tea-deep">
                  Caffeine
                </h2>
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.intakeTitle}</h2>
              <p>{t.intakeIntro}</p>

              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full min-w-[520px] border-collapse text-left text-[0.875rem]">
                  <thead>
                    <tr className="bg-cream">
                      {t.intakeTableH.map((h) => (
                        <th key={h} className="border-b border-border px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.intakeRows.map(([label, val], i) => (
                      <tr key={i}>
                        <td className={`px-3 py-2 ${i < t.intakeRows.length - 1 ? "border-b border-border" : ""}`}>{label}</td>
                        <td className={`px-3 py-2 ${i < t.intakeRows.length - 1 ? "border-b border-border" : ""}`}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>{t.intakeNote}</p>
              <p>{t.caffeineIntro}</p>

              <div className="overflow-x-auto rounded border border-border">
                <table className="w-full min-w-[780px] border-collapse text-left text-[0.875rem]">
                  <thead>
                    <tr className="bg-cream">
                      {t.caffeineTableH.map((h) => (
                        <th key={h} className="border-b border-border px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.caffeineRows.map(([name, amount, note], i) => (
                      <tr key={i}>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{name}</td>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{amount}</td>
                        <td className={`px-3 py-2 ${i < t.caffeineRows.length - 1 ? "border-b border-border" : ""}`}>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">
                {t.decafH2Prefix}
                <Link href={decafHref} className="text-inherit underline underline-offset-2">
                  {t.decafH2Link}
                </Link>
              </h2>
              <p>{t.decafP1}</p>
              <p>
                {t.decafP2Prefix}
                <Link href={decafHref} className="text-tea underline underline-offset-2">
                  {t.decafP2Link}
                </Link>
                {t.decafP2Suffix}
              </p>

              <ol className="m-0 pl-5">
                {t.decafListItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>

              <p>{t.decafP3}</p>

              <div className="md:hidden">
                <Link
                  href={decafHref}
                  className="mx-auto block w-full max-w-[420px] no-underline rounded-lg border border-border bg-washi p-3 text-inherit transition-colors hover:bg-cream"
                >
                  <Image
                    src={decafImagePath}
                    alt={t.decafProductAlt}
                    width={640}
                    height={640}
                    className="h-auto w-full rounded object-cover"
                    sizes="80vw"
                  />
                  <p className="m-0 mt-3 text-center text-[0.9375rem] font-semibold text-tea-deep">
                    {t.decafProductName}
                  </p>
                </Link>
              </div>

              {/* FAQ */}
              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.faqTitle}</h2>
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

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.summaryTitle}</h2>
              <p>{t.summaryP}</p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
