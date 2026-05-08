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
  "wakocha-isecha",
  "3teabag-ise-wakocha",
] as const;

type WakochaTexts = {
  h1: string;
  leadP: string;
  sec1Title: string;
  sec1P1: string;
  sec1P2: string;
  sec1P3: string;
  sec2Title: string;
  sec2P1: string;
  sec2P2: string;
  sec2Link1Text: string;
  sec2Link2Text: string;
  sec3Title: string;
  productNames: readonly [string, string];
  viewDetails: string;
  sec4Title: string;
  sec4StraightLabel: string;
  sec4StraightItems: readonly [string, string, string];
  sec4MilkLabel: string;
  sec4MilkItems: readonly [string, string, string];
  sec4IceLabel: string;
  sec4IceItems: readonly [string, string];
  sec4LinkText: string;
  sec4LinkHref: string;
  sec5Title: string;
  faqs: readonly { q: string; a: React.ReactNode }[];
  breadcrumbName: string;
};

const TEXTS: Record<Locale, WakochaTexts> = {
  ja: {
    h1: "和紅茶の通販｜川俣谷産シングルオリジン伊勢茶",
    leadP:
      "和紅茶とは、日本の緑茶品種の茶葉を完全発酵させた国産紅茶です。インド・スリランカ産の紅茶とは異なり、渋みが少なく、やさしい甘みと花のような繊細な香りが特徴です。藤八茶寮の和紅茶は、三重県松阪市・川俣谷の自家茶畑で育てたシングルオリジン伊勢茶を完全発酵させたティーバッグです。ストレートでも、ミルクティーでもお楽しみいただけます。",
    sec1Title: "和紅茶とは——日本の緑茶品種が生む、繊細な紅茶",
    sec1P1:
      "同じ茶の木から摘んだ茶葉でも、製法（発酵度）によって緑茶・ウーロン茶・紅茶と全く異なるお茶になります。和紅茶は、日本の緑茶品種（やぶきた等）の茶葉を完全発酵させることで作られる国産紅茶です。",
    sec1P2:
      "インドのアッサム種やスリランカのセイロン種と比べ、日本の緑茶品種はタンニンが少ないため、完全発酵させても渋みが出にくいのが特徴です。その分、やさしい甘みと花・果実のような繊細な香りが際立ちます。ミルクを加えても茶葉本来の風味が消えにくく、ミルクティーとの相性も抜群です。",
    sec1P3:
      "一方で、国産茶葉を使った和紅茶は生産量が少なく希少性が高いお茶です。伊勢茶の産地・川俣谷で丁寧に育てられた茶葉から作る和紅茶は、この土地でしか生まれない特別な一杯です。",
    sec2Title: "川俣谷産シングルオリジンの和紅茶",
    sec2P1:
      "川俣谷の茶葉は、山に囲まれた谷地形が午後の日照を自然に遮ることで、アミノ酸（テアニン）が豊富に蓄えられます。テアニンが豊富な茶葉を完全発酵させると、アミノ酸が複雑な香り成分に変化し、甘みと香りがより際立つ和紅茶に仕上がります。",
    sec2P2:
      "深蒸し茶・ほうじ茶・和紅茶——これらはすべて同じ川俣谷の茶畑から生まれます。産地の個性をそのままに、製法を変えることで異なる表情を見せるのが、シングルオリジンならではの楽しみ方です。",
    sec2Link1Text: "同じ茶畑の深蒸し茶はこちら",
    sec2Link2Text: "同じ茶畑のほうじ茶はこちら",
    sec3Title: "藤八茶寮の和紅茶 商品一覧",
    productNames: [
      "伊勢茶 和紅茶 ティーバッグ 8個",
      "伊勢茶 和紅茶 ティーバッグ 3個",
    ],
    viewDetails: "詳しく見る >>",
    sec4Title: "和紅茶の美味しい楽しみ方",
    sec4StraightLabel: "ストレートティー",
    sec4StraightItems: [
      "お湯の温度：90〜95℃",
      "蒸らし時間：2〜3分（緑茶より長め）",
      "茶葉の甘みと香りをそのまま楽しめます",
    ],
    sec4MilkLabel: "ミルクティー",
    sec4MilkItems: [
      "濃いめに抽出（蒸らし3〜4分）してから温めた牛乳を加える",
      "渋みが少ないため牛乳との相性が良い",
      "砂糖なしでも自然な甘みが感じられます",
    ],
    sec4IceLabel: "アイスティー",
    sec4IceItems: [
      "熱めに抽出したものを氷の上に注ぐだけ",
      "美しいアンバー色のアイスティーに",
    ],
    sec4LinkText: "詳しい淹れ方はお茶の淹れ方ページをご覧ください",
    sec4LinkHref: "/how-to-brew/",
    sec5Title: "よくある質問",
    faqs: [
      {
        q: "和紅茶と外国産の紅茶はどう違いますか？",
        a: "和紅茶は日本の緑茶品種を使って作るため、インドやスリランカ産の紅茶と比べてタンニンが少なく渋みが出にくいのが特徴です。やさしい甘みと花・果実のような繊細な香りがあり、ストレートで飲んでも渋くなりにくいです。",
      },
      {
        q: "ミルクティーにできますか？",
        a: "はい。渋みが少ないため牛乳との相性が良く、茶葉本来の甘みと香りが牛乳に負けずに感じられます。砂糖なしでも自然な甘みをお楽しみいただけます。",
      },
      {
        q: "カフェインは含まれますか？",
        a: (
          <>
            含まれます。和紅茶のカフェイン量は100mlあたり約17mgで、一般的な緑茶と同程度です。夜の摂取が気になる方は
            <Link href="/ise-cha/decaf/" className="text-tea underline underline-offset-2">
              カフェインカット緑茶
            </Link>
            もご検討ください。
          </>
        ),
      },
      {
        q: "アイスティーにできますか？",
        a: "はい。熱めに抽出したものを氷の上に注ぐだけで、美しいアンバー色のアイスティーが楽しめます。",
      },
      {
        q: "賞味期限はどのくらいですか？",
        a: "製造から1年です。開封後は湿気を避けて保存し、お早めにお召し上がりください。",
      },
    ],
    breadcrumbName: "和紅茶の通販",
  },

  en: {
    h1: "Japanese Black Tea Online | Single-Origin Ise Tea Wakocha | Fujihachi Saryo",
    leadP:
      "Wakocha is Japanese black tea — made by fully fermenting leaves from Japanese green tea cultivars. Unlike teas from India or Sri Lanka, wakocha has less tannin, resulting in a gentle sweetness and delicate floral aroma with very little bitterness. Fujihachi Saryo's wakocha is made from single-origin Ise tea grown in our own fields in Kawamatatani, Matsusaka, Mie Prefecture. Enjoy it straight or as a milk tea.",
    sec1Title: "What is wakocha? — the delicate black tea born from Japanese green tea cultivars",
    sec1P1:
      "The same tea leaf can become green tea, oolong tea, or black tea depending on the degree of fermentation applied during processing. Wakocha — Japanese black tea — is made by fully fermenting leaves from Japanese green tea cultivars such as Yabukita.",
    sec1P2:
      "Compared with Indian Assam or Sri Lankan Ceylon varieties, Japanese green tea cultivars contain less tannin, so even when fully fermented the tea remains low in bitterness. Instead, a gentle sweetness and delicate floral, fruity aroma come to the fore. The tea's original flavour is not easily overpowered by milk, making it an excellent choice for milk tea as well.",
    sec1P3:
      "Japanese black tea made from domestic leaves is produced in small quantities, making it a rare and precious tea. The wakocha crafted from carefully tended leaves in Kawamatatani — the home of Ise tea — is a cup that can only come from this place.",
    sec2Title: "Single-origin wakocha from Kawamatatani",
    sec2P1:
      "The tea leaves from Kawamatatani are rich in amino acids (theanine), thanks to the valley's terrain that naturally blocks afternoon sunlight. When these theanine-rich leaves are fully fermented, the amino acids transform into complex aromatic compounds, yielding a wakocha with pronounced sweetness and fragrance.",
    sec2P2:
      "Deep-steamed sencha, houjicha, and wakocha — all three are born from the same tea fields in Kawamatatani. Watching the same terroir express itself differently through different processing methods is one of the joys of single-origin tea.",
    sec2Link1Text: "Deep-steamed sencha from the same tea fields",
    sec2Link2Text: "Houjicha from the same tea fields",
    sec3Title: "Wakocha Products from Fujihachi Saryo",
    productNames: [
      "Ise Tea Wakocha Teabags × 8",
      "Ise Tea Wakocha Teabags × 3",
    ],
    viewDetails: "View details >>",
    sec4Title: "How to Enjoy Wakocha",
    sec4StraightLabel: "Straight tea",
    sec4StraightItems: [
      "Water temperature: 90–95°C",
      "Steeping time: 2–3 minutes (longer than for green tea)",
      "Enjoy the tea's natural sweetness and aroma at its purest",
    ],
    sec4MilkLabel: "Milk tea",
    sec4MilkItems: [
      "Brew strong (steep 3–4 minutes), then add warmed milk",
      "Low tannin means it pairs exceptionally well with milk",
      "Natural sweetness comes through even without sugar",
    ],
    sec4IceLabel: "Iced tea",
    sec4IceItems: [
      "Simply brew hot and pour over ice",
      "The liquor turns a beautiful amber colour",
    ],
    sec4LinkText: "For detailed brewing instructions, see our How to Brew page",
    sec4LinkHref: "/en/how-to-brew/",
    sec5Title: "Frequently Asked Questions",
    faqs: [
      {
        q: "How is wakocha different from foreign black teas?",
        a: "Because wakocha uses Japanese green tea cultivars, it contains less tannin than Indian or Sri Lankan teas, resulting in far less bitterness. It has a gentle sweetness and a delicate floral, fruity aroma — and does not become astringent when drunk straight.",
      },
      {
        q: "Can I make milk tea with it?",
        a: "Yes. Its low tannin content means it pairs beautifully with milk — the tea's natural sweetness and aroma still come through clearly. You can enjoy its natural sweetness without adding sugar.",
      },
      {
        q: "Does it contain caffeine?",
        a: (
          <>
            Yes. Wakocha contains approximately 17 mg of caffeine per 100 ml — similar to regular green tea. If you are looking to reduce your caffeine intake, please consider our{" "}
            <Link href="/en/ise-cha/decaf/" className="text-tea underline underline-offset-2">
              low-caffeine green tea
            </Link>
            .
          </>
        ),
      },
      {
        q: "Can I make iced tea with it?",
        a: "Yes. Simply brew hot and pour directly over ice for a beautiful amber-coloured iced tea.",
      },
      {
        q: "What is the shelf life?",
        a: "The shelf life is one year from the date of manufacture. After opening, store away from moisture and consume as soon as possible.",
      },
    ],
    breadcrumbName: "Japanese Black Tea Online",
  },

  ko: {
    h1: "와코차 통신판매｜가와마타다니산 싱글 오리진 이세차",
    leadP:
      "와코차(일본홍차)란 일본의 녹차 품종 찻잎을 완전 발효시킨 국산 홍차입니다. 인도·스리랑카산 홍차와 달리 떫은맛이 적고, 부드러운 단맛과 꽃 같은 섬세한 향이 특징입니다. 후지하치야의 와코차는 미에현 마쓰사카시·가와마타다니의 자가 찻밭에서 기른 싱글 오리진 이세차를 완전 발효시킨 티백입니다. 스트레이트로도, 밀크티로도 즐기실 수 있습니다.",
    sec1Title: "와코차란? — 일본 녹차 품종이 만드는 섬세한 홍차",
    sec1P1:
      "같은 차나무에서 딴 찻잎이라도 제조법（발효도）에 따라 녹차·우롱차·홍차로 전혀 다른 차가 됩니다. 와코차는 일본의 녹차 품종（야부키타 등）의 찻잎을 완전 발효시켜 만드는 국산 홍차입니다.",
    sec1P2:
      "인도의 아삼종이나 스리랑카의 실론종과 비교해 일본 녹차 품종은 타닌이 적기 때문에 완전 발효시켜도 떫은맛이 나기 어려운 것이 특징입니다. 그만큼 부드러운 단맛과 꽃·과실 같은 섬세한 향이 돋보입니다. 우유를 넣어도 찻잎 본래의 풍미가 사라지지 않아 밀크티와도 잘 어울립니다.",
    sec1P3:
      "한편, 국산 찻잎을 사용한 와코차는 생산량이 적고 희소성이 높은 차입니다. 이세차의 산지·가와마타다니에서 정성스럽게 키운 찻잎으로 만드는 와코차는 이 땅에서만 태어날 수 있는 특별한 한 잔입니다.",
    sec2Title: "가와마타다니산 싱글 오리진 와코차",
    sec2P1:
      "가와마타다니의 찻잎은 산에 둘러싸인 골짜기 지형이 오후 일조를 자연스럽게 차단하여 아미노산（테아닌）이 풍부하게 쌓입니다. 테아닌이 풍부한 찻잎을 완전 발효시키면 아미노산이 복잡한 향기 성분으로 변화하여 단맛과 향이 더욱 돋보이는 와코차가 됩니다.",
    sec2P2:
      "후카무시 녹차·호지차·와코차——이 모든 차가 같은 가와마타다니의 찻밭에서 태어납니다. 산지의 개성을 그대로, 제조법을 바꿈으로써 다른 표정을 보여주는 것이 싱글 오리진만의 즐거움입니다.",
    sec2Link1Text: "같은 찻밭의 후카무시 녹차는 이쪽",
    sec2Link2Text: "같은 찻밭의 호지차는 이쪽",
    sec3Title: "후지하치야의 와코차 상품 목록",
    productNames: [
      "이세차 와코차 티백 8개",
      "이세차 와코차 티백 3개",
    ],
    viewDetails: "자세히 보기 >>",
    sec4Title: "와코차를 맛있게 즐기는 법",
    sec4StraightLabel: "스트레이트 티",
    sec4StraightItems: [
      "물 온도：90〜95℃",
      "우리는 시간：2〜3분（녹차보다 길게）",
      "찻잎의 단맛과 향을 그대로 즐길 수 있습니다",
    ],
    sec4MilkLabel: "밀크티",
    sec4MilkItems: [
      "진하게 우려（3〜4분）낸 후 따뜻한 우유를 넣습니다",
      "떫은맛이 적어 우유와의 궁합이 좋습니다",
      "설탕 없이도 자연스러운 단맛을 느낄 수 있습니다",
    ],
    sec4IceLabel: "아이스 티",
    sec4IceItems: [
      "뜨겁게 우려낸 것을 얼음 위에 붓기만 합니다",
      "아름다운 앰버색 아이스티가 됩니다",
    ],
    sec4LinkText: "자세한 우리는 법은 우려내기 페이지를 참고해 주세요",
    sec4LinkHref: "/ko/how-to-brew/",
    sec5Title: "자주 묻는 질문",
    faqs: [
      {
        q: "와코차와 외국산 홍차는 어떻게 다른가요？",
        a: "와코차는 일본 녹차 품종을 사용하기 때문에 인도나 스리랑카산 홍차에 비해 타닌이 적고 떫은맛이 나기 어려운 것이 특징입니다. 부드러운 단맛과 꽃·과실 같은 섬세한 향이 있어 스트레이트로 마셔도 떫지 않습니다.",
      },
      {
        q: "밀크티로 만들 수 있나요？",
        a: "네. 떫은맛이 적어 우유와의 궁합이 좋고, 찻잎 본래의 단맛과 향이 우유에 지지 않고 느껴집니다. 설탕 없이도 자연스러운 단맛을 즐기실 수 있습니다.",
      },
      {
        q: "카페인은 들어있나요？",
        a: (
          <>
            들어있습니다. 와코차의 카페인 양은 100ml당 약 17mg으로 일반 녹차와 비슷한 수준입니다. 밤에 카페인 섭취가 신경 쓰이는 분은{" "}
            <Link href="/ko/ise-cha/decaf/" className="text-tea underline underline-offset-2">
              카페인 컷 녹차
            </Link>
            도 검토해 주세요.
          </>
        ),
      },
      {
        q: "아이스티로 만들 수 있나요？",
        a: "네. 뜨겁게 우려낸 것을 얼음 위에 붓기만 하면 아름다운 앰버색 아이스티를 즐길 수 있습니다.",
      },
      {
        q: "유통기한은 얼마나 되나요？",
        a: "제조일로부터 1년입니다. 개봉 후에는 습기를 피해 보관하시고, 빨리 드시기를 권장합니다.",
      },
    ],
    breadcrumbName: "와코차 통신판매",
  },

  zh: {
    h1: "和红茶网购｜川俣谷产单一产地伊势茶",
    leadP:
      "和红茶是将日本绿茶品种的茶叶完全发酵制成的国产红茶。与印度、斯里兰卡产红茶不同，单宁含量少，涩味轻微，具有柔和甜味和花朵般细腻香气。藤八茶寮的和红茶以三重县松阪市·川俣谷自家茶园栽培的单一产地伊势茶完全发酵制成，提供茶包形态。既可享用原味，也可做成奶茶。",
    sec1Title: "和红茶是什么？——日本绿茶品种孕育的细腻红茶",
    sec1P1:
      "同一棵茶树采摘的茶叶，因制法（发酵程度）不同，可变为绿茶、乌龙茶或红茶。和红茶是将日本绿茶品种（薮北种等）的茶叶完全发酵制成的国产红茶。",
    sec1P2:
      "与印度阿萨姆种或斯里兰卡锡兰种相比，日本绿茶品种单宁含量较低，即便完全发酵也不易产生涩味。相应地，柔和的甜味与花朵、果实般的细腻香气更加突出。加入牛奶后茶叶本来的风味也不易消散，与奶茶的搭配尤为出色。",
    sec1P3:
      "另一方面，使用国产茶叶制成的和红茶产量稀少，弥足珍贵。以伊势茶产地·川俣谷精心培育的茶叶制成的和红茶，是只有这片土地才能诞生的特别一杯。",
    sec2Title: "川俣谷产单一产地和红茶",
    sec2P1:
      "川俣谷的茶叶因山谷地形自然遮挡午后阳光，富含氨基酸（茶氨酸）。将富含茶氨酸的茶叶完全发酵后，氨基酸转化为复杂的芳香成分，成就甜味与香气更为突出的和红茶。",
    sec2P2:
      "深蒸绿茶、焙茶、和红茶——这三种茶均来自川俣谷的同一片茶园。保留产地个性，通过不同制法呈现不同风貌，正是单一产地茶的独特魅力。",
    sec2Link1Text: "同一茶园的深蒸绿茶请点击此处",
    sec2Link2Text: "同一茶园的焙茶请点击此处",
    sec3Title: "藤八茶寮的和红茶商品一览",
    productNames: [
      "伊势茶和红茶茶包 8个",
      "伊势茶和红茶茶包 3个",
    ],
    viewDetails: "查看详情 >>",
    sec4Title: "和红茶的饮用方法",
    sec4StraightLabel: "原味冲泡",
    sec4StraightItems: [
      "水温：90～95℃",
      "浸泡时间：2～3分钟（比绿茶稍长）",
      "直接品味茶叶的甜味与香气",
    ],
    sec4MilkLabel: "奶茶",
    sec4MilkItems: [
      "浓泡（浸泡3～4分钟）后加入温热牛奶",
      "单宁少，与牛奶搭配极佳",
      "不加糖也能感受到自然甜味",
    ],
    sec4IceLabel: "冰茶",
    sec4IceItems: [
      "热泡后直接倒在冰块上即可",
      "呈现美丽的琥珀色",
    ],
    sec4LinkText: "详细冲泡方法请参阅冲泡方法页面",
    sec4LinkHref: "/zh/how-to-brew/",
    sec5Title: "常见问题",
    faqs: [
      {
        q: "和红茶与外国红茶有何不同？",
        a: "和红茶使用日本绿茶品种，与印度或斯里兰卡红茶相比单宁含量更低，涩味极少。具有柔和甜味与花朵、果实般的细腻香气，原味饮用也不会感到苦涩。",
      },
      {
        q: "可以做成奶茶吗？",
        a: "可以。由于单宁少，与牛奶搭配极佳，茶叶本来的甜味与香气不会被牛奶掩盖，依然清晰可感。不加糖也能享受到自然甜味。",
      },
      {
        q: "含有咖啡因吗？",
        a: (
          <>
            含有。和红茶每100ml咖啡因含量约17mg，与一般绿茶相当。如担心晚间摄入咖啡因，请参考我们的
            <Link href="/zh/ise-cha/decaf/" className="text-tea underline underline-offset-2">
              低咖啡因绿茶
            </Link>
            。
          </>
        ),
      },
      {
        q: "可以做冰茶吗？",
        a: "可以。将热泡好的茶直接倒在冰块上，即可享用颜色美丽的琥珀色冰茶。",
      },
      {
        q: "保质期是多久？",
        a: "自制造之日起1年。开封后请避免受潮保存，并尽快饮用。",
      },
    ],
    breadcrumbName: "和红茶网购",
  },
};

type Props = { locale: Locale };

export default async function WakochaPage({ locale }: Props) {
  const t = TEXTS[locale];
  const pt = COMMON_TEXTS[locale].product;
  const basePath = locale === "ja" ? "" : `/${locale}`;
  const canonicalUrl = `${SITE_BASE_URL}${basePath}/ise-cha/wakocha/`;
  const breadcrumbPath =
    locale === "ja" ? "/ise-cha/wakocha" : `/${locale}/ise-cha/wakocha`;

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

  const faqsForSchema = t.faqs.map(({ q, a }) => ({
    q,
    a: typeof a === "string" ? a : "",
  }));

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
      <FaqJsonLd questions={faqsForSchema} />
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, locale, { productName: t.breadcrumbName })}
      />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="wakocha" />
          <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
            {t.h1}
          </h1>

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
                {productData[1].imagePath && (
                  <Link href={productData[1].href} className="block no-underline">
                    <figure className="m-0 overflow-hidden rounded transition-opacity hover:opacity-90">
                      <Image
                        src={productData[1].imagePath}
                        alt={productData[1].name}
                        width={640}
                        height={640}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 60vw, 320px"
                      />
                    </figure>
                  </Link>
                )}
                <Link
                  href={productData[1].href}
                  className="flex items-center justify-between gap-2 w-full py-2.5 px-3 rounded-lg border-2 border-tea-light bg-washi text-[0.9375rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span>{productData[1].name}</span>
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

              <h2 className="m-0 mt-8 text-lg font-semibold text-tea-deep">{t.sec2Title}</h2>
              <p>{t.sec2P1}</p>
              <p>{t.sec2P2}</p>
              <p className="flex flex-wrap gap-4">
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/fukamushi")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2Link1Text}
                </Link>
                <Link
                  href={buildLocalizedPath(locale, "/ise-cha/houjicha")}
                  className="text-tea underline underline-offset-2"
                >
                  {t.sec2Link2Text}
                </Link>
              </p>
            </section>
          </div>

          {/* セクション3：商品一覧（全幅） */}
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
                    {p.name}
                  </span>
                  <span className="block text-right text-[0.875rem] font-bold text-tea-deep">
                    {formatPriceYen(p.price)}{" "}
                    <span className="text-[0.75rem] text-ink-muted font-normal">
                      {pt.taxIncluded}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* セクション4：楽しみ方 */}
          <div className="mt-12">
            <h2 className="m-0 mb-4 text-lg font-semibold text-tea-deep">{t.sec4Title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4StraightLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4StraightItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4MilkLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4MilkItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-washi p-4">
                <p className="m-0 mb-3 font-semibold text-tea-deep text-[0.9375rem]">
                  {t.sec4IceLabel}
                </p>
                <ul className="m-0 space-y-1.5 pl-4 text-[0.9375rem] leading-relaxed text-ink">
                  {t.sec4IceItems.map((item, i) => (
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
        </article>
      </div>
    </main>
  );
}
