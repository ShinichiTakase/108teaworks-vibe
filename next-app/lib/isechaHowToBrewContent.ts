import type { Locale } from "@/lib/i18n";

export type HowToBrewBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: [string, string, string]; rows: [string, string, string][] };

export type IsechaHowToBrewDoc = {
  h1: string;
  imageAlt: string;
  blocks: HowToBrewBlock[];
};

export const ISECHA_HOW_TO_BREW: Record<Locale, IsechaHowToBrewDoc> = {
  ja: {
    h1: "伊勢茶を最高に楽しむ、おいしいお茶の淹れ方",
    imageAlt: "おいしい伊勢茶を淹れる様子",
    blocks: [
      {
        type: "p",
        text:
          "「伊勢茶」という言葉に惹かれてこのページを訪ねてくださる方が多いため、今回は、お茶のポテンシャルを最大限に引き出す「淹れ方の極意」をまとめました。",
      },
      {
        type: "p",
        text: "お茶は、ほんの少しの「温度」と「時間」のルールを知るだけで、驚くほど味が変わります。",
      },
      {
        type: "h2",
        text: "1. 黄金比は「お湯100ccに茶葉3g」",
      },
      {
        type: "p",
        text:
          "まずは茶葉の分量です。1人分を淹れる場合、お湯100cc（ml）に対して、茶葉は約2〜3gが目安です。",
      },
      {
        type: "ul",
        items: [
          "目分量の目安： ティースプーン軽く1杯、または中さじ1杯。",
          "器の目安： 標準的な湯呑みで約100〜150cc、マグカップなら約200〜250cc入ります。器に合わせて茶葉を調整してください。",
        ],
      },
      {
        type: "p",
        text:
          "人数が増える場合は、単純に人数倍するよりも少し控えめ（3人で6〜8gなど）でも味は出ますが、1人分だけ淹れる時は、贅沢に3gしっかり使うのが、薄くならず美味しく仕上げるコツです。",
      },
      {
        type: "h2",
        text: "2. 美味しさの正体は「成分のバランス」",
      },
      {
        type: "p",
        text:
          "なぜ、沸騰したての熱湯をそのまま注いではいけないのでしょうか？ それはお茶に含まれる3つの成分の性質が違うからです。",
      },
      {
        type: "table",
        headers: ["成分", "味の役割", "性質"],
        rows: [
          ["テアニン", "甘み・旨味", "低温でも高温でもよく溶け出す"],
          ["カテキン", "渋み", "80℃を超えると爆発的に溶け出す"],
          ["カフェイン", "苦み", "高温ほどよく溶け出す"],
        ],
      },
      {
        type: "p",
        text:
          "上質な煎茶の醍醐味は、テアニンの「甘み」とカテキンの「程よい渋み」の調和にあります。熱湯をそのまま注ぐと、カテキンとカフェインばかりが主張してしまい、せっかくの甘みが隠れて「ただ苦いだけのお茶」になってしまうのです。",
      },
      {
        type: "h2",
        text: "3. 道具いらずの「湯冷まし」テクニック",
      },
      {
        type: "p",
        text:
          "理想的な温度は70℃〜80℃。これを時計や温度計を使わずに実践する方法が、伝統的な「湯冷まし」です。",
      },
      {
        type: "ul",
        items: [
          "1) 湯呑みにお湯を注ぐ： 沸騰したお湯を、まず使う湯呑みに注ぎます。これだけで温度が約10℃下がります（約90℃）。",
          "2) そのまま1分待つ： さらに1分経つごとに約10℃ずつ下がります。",
          "3)「手の感覚」で判断：",
        ],
      },
      {
        type: "ul",
        items: [
          "熱くて持てない： まだ85℃以上。苦くなります。",
          "少し熱いけれど我慢して持てる： 約75〜80℃。ここがベストタイミング！",
          "心地よい温かさ： 70℃以下。少し温度が下がりすぎかもしれません。",
        ],
      },
      {
        type: "h2",
        text: "4. 最後の仕上げ「浸出」と「回し注ぎ」",
      },
      {
        type: "p",
        text: "適温になったお湯を急須に移したら、静かに待ちます。",
      },
      {
        type: "ul",
        items: ["普通の煎茶： 約1分", "深蒸し茶： 約30秒〜45秒（葉が細かく成分が出やすいため）"],
      },
      {
        type: "p",
        text:
          "注ぐときは、複数の湯呑みの濃さを均一にするため、「1→2、2→1」と交互に少しずつ注ぐ「回し注ぎ」を行います。そして最も大切なのが、「最後の一滴」まで絞りきること。 この一滴に旨味が凝縮されており、かつ急須に水分を残さないことで、二煎目も美味しくいただけます。",
      },
      {
        type: "p",
        text:
          "手間をかける時間は、自分を癒やす時間でもあります。歴史ある伊勢茶の香りと甘みを、ぜひ五感で味わってみてください。",
      },
    ],
  },
  en: {
    h1: "Brewing Ise Tea at Its Best",
    imageAlt: "Pouring delicious Ise tea",
    blocks: [
      {
        type: "p",
        text:
          "Many of you find this page through the words “Ise tea.” Here we summarize the essentials of brewing to bring out your tea’s full potential.",
      },
      {
        type: "p",
        text: "With just a little attention to temperature and time, the flavour changes dramatically.",
      },
      {
        type: "h2",
        text: "1. The golden ratio: about 3 g of leaf per 100 ml of water",
      },
      {
        type: "p",
        text: "For one person, use about 2–3 g of leaf per 100 ml (cc) of water.",
      },
      {
        type: "ul",
        items: [
          "Rough guide: one lightly filled teaspoon, or one level tablespoon.",
          "Vessel guide: a standard yunomi holds about 100–150 ml; a mug often 200–250 ml. Adjust the leaf to match your cup.",
        ],
      },
      {
        type: "p",
        text:
          "For several guests you can use slightly less than a straight multiple per person (e.g. 6–8 g for three), but for a single cup, a full 3 g helps avoid a thin brew.",
      },
      {
        type: "h2",
        text: "2. Flavour comes from balancing the components",
      },
      {
        type: "p",
        text:
          "Why not pour boiling water straight onto the leaves? Because three components behave differently.",
      },
      {
        type: "table",
        headers: ["Component", "Role in taste", "Behaviour"],
        rows: [
          ["Theanine", "Sweetness & umami", "Extracts well at low or high temperature"],
          ["Catechin", "Astringency", "Surges above about 80°C"],
          ["Caffeine", "Bitterness", "Extracts more at higher temperature"],
        ],
      },
      {
        type: "p",
        text:
          "Fine sencha shines when theanine’s sweetness and catechin’s gentle astringency are in balance. Boiling water pulls out too much catechin and caffeine, hiding sweetness and leaving only bitterness.",
      },
      {
        type: "h2",
        text: "3. Cooling the water—no thermometer needed",
      },
      {
        type: "p",
        text:
          "Aim for about 70–80°C. The traditional way without a thermometer is yuzamashi (cooling the water).",
      },
      {
        type: "ul",
        items: [
          "1) Pour boiling water into your yunomi first—this alone drops the temperature by about 10°C (to roughly 90°C).",
          "2) Wait about one minute—each minute drops roughly another 10°C.",
          "3) Judge by touch:",
        ],
      },
      {
        type: "ul",
        items: [
          "Too hot to hold: still above about 85°C—likely bitter.",
          "Hot but you can hold it: about 75–80°C—often the sweet spot.",
          "Comfortably warm: 70°C or below—may be a little cool.",
        ],
      },
      {
        type: "h2",
        text: "4. Steeping and round pouring",
      },
      {
        type: "p",
        text: "Once the water is at temperature, move it to your kyusu and wait quietly.",
      },
      {
        type: "ul",
        items: [
          "Standard sencha: about 1 minute.",
          "Fukamushi: about 30–45 seconds (fine leaves extract quickly).",
        ],
      },
      {
        type: "p",
        text:
          "When pouring into several cups, use “round pouring”—a little into cup 1, then cup 2, then back to 1—so strength stays even. Above all, pour out every last drop: the final drops hold concentrated umami, and leaving the pot dry helps the second infusion taste good.",
      },
      {
        type: "p",
        text:
          "The time you spend is time to unwind. Enjoy the aroma and sweetness of Ise tea with all your senses.",
      },
    ],
  },
  ko: {
    h1: "이세차를 최고로 즐기는 맛있게 우리는 법",
    imageAlt: "맛있는 이세차를 우리는 모습",
    blocks: [
      {
        type: "p",
        text:
          "「이세차」라는 말에 이끌려 이 페이지를 찾아주시는 분이 많아, 차의 잠재력을 최대한 끌어내는 우리는 요령을 정리했습니다.",
      },
      {
        type: "p",
        text: "차는 아주 조금의 「온도」와 「시간」만 알아도 맛이 놀랍게 달라집니다.",
      },
      {
        type: "h2",
        text: "1. 황금비는 「뜨거운 물 100cc에 차잎 3g」",
      },
      {
        type: "p",
        text: "먼저 차잎 분량입니다. 1인분을 우릴 때 뜨거운 물 100cc(ml)당 차잎은 약 2~3g이 기준입니다.",
      },
      {
        type: "ul",
        items: [
          "대략 분량: 티스푼으로 가볍게 한 번, 또는 중간 숟가락 한 번.",
          "그릇 기준: 표준 유노미는 약 100~150cc, 머그컵은 약 200~250cc입니다. 그릇에 맞춰 차잎을 조절하세요.",
        ],
      },
      {
        type: "p",
        text:
          "인원이 늘면 단순히 인원 배보다 조금 덜 잡아도 맛은 나지만, 1인분만 우릴 때는 넉넉히 3g을 쓰는 것이 연해지지 않고 맛있게 내는 비결입니다.",
      },
      {
        type: "h2",
        text: "2. 맛의 본질은 「성분의 균형」",
      },
      {
        type: "p",
        text:
          "왜 끓인 직후의 뜨거운 물을 그대로 붓지 말아야 할까요? 차에 들어 있는 세 가지 성질이 다르기 때문입니다.",
      },
      {
        type: "table",
        headers: ["성분", "맛의 역할", "성질"],
        rows: [
          ["테아닌", "단맛·감칠맛", "저온·고온 모두 잘 우러남"],
          ["카테킨", "떫은맛", "80℃를 넘으면 급격히 우러남"],
          ["카페인", "쓴맛", "고온일수록 잘 우러남"],
        ],
      },
      {
        type: "p",
        text:
          "좋은 잎차의 묘미는 테아닌의 단맛과 카테킨의 적당한 떫은맛의 조화에 있습니다. 뜨거운 물을 그대로 붓면 카테킨과 카페인만 두드러져 단맛이 가려져 「그저 쓴 차」가 됩니다.",
      },
      {
        type: "h2",
        text: "3. 도구 없는 「물 식히기」 테크닉",
      },
      {
        type: "p",
        text:
          "이상적인 온도는 70℃~80℃. 시계나 온도계 없이 실천하는 전통적인 방법이 「물 식히기」입니다.",
      },
      {
        type: "ul",
        items: [
          "1) 유노미에 뜨거운 물 붓기: 끓인 물을 먼저 쓸 유노미에 붓습니다. 이것만으로 약 10℃ 내려갑니다(약 90℃).",
          "2) 그대로 1분 기다리기: 1분마다 약 10℃씩 더 내려갑니다.",
          "3) 「손 감각」으로 판단:",
        ],
      },
      {
        type: "ul",
        items: [
          "너무 뜨거워 잡을 수 없음: 아직 85℃ 이상. 쓴맛이 납니다.",
          "조금 뜨겁지만 참을 만함: 약 75~80℃. 여기가 베스트!",
          "편안한 따뜻함: 70℃ 이하. 조금 식었을 수 있습니다.",
        ],
      },
      {
        type: "h2",
        text: "4. 마무리 「침출」과 「돌려 붓기」",
      },
      {
        type: "p",
        text: "적온이 된 물을 주전자로 옮긴 뒤 조용히 기다립니다.",
      },
      {
        type: "ul",
        items: [
          "보통 잎차: 약 1분",
          "후카무시차: 약 30~45초(잎이 잘게 부숴져 성분이 잘 나옴)",
        ],
      },
      {
        type: "p",
        text:
          "붓을 때 여러 잔의 농도를 맞추려 「1→2, 2→1」으로 조금씩 번갈아 붓는 「돌려 붓기」를 합니다. 가장 중요한 것은 「마지막 한 방울」까지 짜내는 것입니다. 이 한 방울에 감칠맛이 모이고, 주전자에 물을 남기지 않아야 이차도 맛있습니다.",
      },
      {
        type: "p",
        text:
          "손을 쓰는 시간은 나를 달래는 시간이기도 합니다. 역사 깊은 이세차의 향과 단맛을 오감으로 느껴 보세요.",
      },
    ],
  },
  zh: {
    h1: "尽享伊势茶：美味冲泡要诀",
    imageAlt: "冲泡美味伊势茶",
    blocks: [
      {
        type: "p",
        text:
          "许多朋友因「伊势茶」之名来到本页，在此我们整理冲泡要点，帮助您发挥茶叶的最大潜力。",
      },
      {
        type: "p",
        text: "只要略懂「温度」与「时间」的规则，滋味就会大不相同。",
      },
      {
        type: "h2",
        text: "1. 黄金比例：热水100cc配茶叶约3g",
      },
      {
        type: "p",
        text: "一人份冲泡时，以热水100毫升（cc）对应茶叶约2～3克为宜。",
      },
      {
        type: "ul",
        items: [
          "分量参考：茶匙轻轻一勺，或中匙一平勺。",
          "器具参考：标准茶碗约100～150毫升，马克杯约200～250毫升，请依容器调整茶叶。",
        ],
      },
      {
        type: "p",
        text:
          "人数增加时不必严格按人数倍增，略少（如三人6～8克）亦可；一人独饮时，用足3克更不易淡薄。",
      },
      {
        type: "h2",
        text: "2. 美味的本质在于「成分平衡」",
      },
      {
        type: "p",
        text: "为何不宜直接以沸水冲泡？因为茶中三种成分性质不同。",
      },
      {
        type: "table",
        headers: ["成分", "味觉角色", "性质"],
        rows: [
          ["茶氨酸", "甘甜、鲜爽", "低温与高温均易溶出"],
          ["儿茶素", "涩味", "超过80℃时大量溶出"],
          ["咖啡因", "苦味", "温度越高越易溶出"],
        ],
      },
      {
        type: "p",
        text:
          "优质煎茶的妙处在于茶氨酸的甘甜与儿茶素适度涩味的协调。沸水直冲则儿茶素与咖啡因过强，甘甜被掩盖，只剩苦涩。",
      },
      {
        type: "h2",
        text: "3. 不需工具的「降温」技巧",
      },
      {
        type: "p",
        text: "理想水温约70℃～80℃。不靠温度计的传统做法就是「温杯降温」。",
      },
      {
        type: "ul",
        items: [
          "1）先往茶碗中注入沸水：仅此一步约降10℃（约90℃）。",
          "2）静置约一分钟：每分钟约再降10℃。",
          "3）以「手感」判断：",
        ],
      },
      {
        type: "ul",
        items: [
          "烫到无法持握：仍高于约85℃，易苦。",
          "略烫尚可忍受：约75～80℃，常为最佳时机。",
          "温热舒适：70℃以下，可能略凉。",
        ],
      },
      {
        type: "h2",
        text: "4. 最后一步「浸泡」与「巡回斟茶」",
      },
      {
        type: "p",
        text: "水温适宜后移入茶壶，静候片刻。",
      },
      {
        type: "ul",
        items: ["一般煎茶：约1分钟", "深蒸茶：约30～45秒（叶细易出味）"],
      },
      {
        type: "p",
        text:
          "斟入多杯时，以「1→2、2→1」交替少斟，使浓度均匀。最重要的是斟尽最后一滴：此滴凝聚鲜味，且不留余水在壶内，二泡才好喝。",
      },
      {
        type: "p",
        text: "所费片刻亦是疗愈时光。请以五感细品伊势茶的香气与甘甜。",
      },
    ],
  },
};
