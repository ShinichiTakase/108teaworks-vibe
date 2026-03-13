import Image from "next/image";
import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

const ISECHA_TEXTS: Record<
  Locale,
  {
    h1: string;
    intro: string;
    sec1Title: string;
    sec1P1: string;
    sec1P2: string;
    sec1P3: string;
    sec1LinkText: string;
    sec2Title1: string;
    sec2P1: string;
    sec2Title2: string;
    sec2P2: string;
    sec2FeatureList: string[];
    cardTitle: string;
    cardBody: string;
    sec3Title: string;
    sec3P1: string;
    sec3P2: string;
    sec3P3: string;
    sec4Title: string;
    sec4Heian: string;
    sec4Edo: string;
    sec4Meiji: string;
    sec5Title: string;
    sec5P1: string;
    sec5P2: string;
    sec5P3: string;
    cardHojichaTitle: string;
    cardHojichaBody: string;
    cardWakochaTitle: string;
    cardWakochaBody: string;
    altKawamata: string;
    altField: string;
  }
> = {
  ja: {
    h1: "伊勢茶とは",
    intro:
      "伊勢茶は、三重県内で生産されるお茶の総称として親しまれているブランド名です。その歴史は古く、江戸時代には既に「伊勢国（現在の三重県）」の特産品として広く栽培されていました。現在では三重県全域が産地となっており、地域の豊かな風土がその深い味わいを育んでいます。",
    sec1Title: "伊勢茶発祥の地　川俣谷のお茶",
    sec1P1:
      "店主の大叔父であり日本茶インストラクターリーダーである高瀬孝二の著書「伊勢茶発祥の地　川俣谷のお茶」がPDFで全文ご覧いただけるようになりました。",
    sec1P2:
      "伊勢茶発祥の地・川俣谷を舞台に、将軍への献上や明治の対米輸出を主導した先駆者たちの情熱と歩みを日本茶インストラクターリーダーである著者が専門的知見から紐解きます。幻の手もみ技法から戦後の復活劇まで、一千年にわたる良質な伊勢茶の歴史を凝縮したお茶のプロならではの視点が光る読み物です。古の伊勢商人が世界を夢見た軌跡をたどり、深蒸し茶の香りに隠された驚きの物語をぜひご覧ください。",
    sec1P3:
      "【著者略歴】高瀬　孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。令和６年 瑞宝双光章を受章。主な著書に「三重県茶業史」がある。",
    sec1LinkText: "伊勢茶発祥の地 川俣谷のお茶を読む",
    sec2Title1: "全国第3位を誇る「お茶どころ」",
    sec2P1:
      "三重県は静岡県・鹿児島県に次いで全国第3位の生産量を誇る日本有数の茶産地です。意外と知られていない事実ですが、日本のお茶の多くがここ三重県で支えられています。",
    sec2Title2: "伊勢茶の特徴「深蒸し茶の味わい」",
    sec2P2:
      "伊勢茶を代表する深蒸し茶は、茶の葉を深く蒸して茶葉の葉柄や軸などに多く含有するテアニンなど旨みの成分の浸出を容易にする製法で、旨みが濃くまろやかな味のお茶として全国の品評会で常に上位を独占しています。",
    sec2FeatureList: [
      "味わい：芯のある渋みと記憶に残る深いコク",
      "水色：細かい茶葉が溶け込むことで濁りのある深い緑色",
      "香り：若草のような芳醇な香り",
      "淹れ方：低めの温度（70℃前後）で淹れると甘みがより引き立つ",
    ],
    cardTitle: "深蒸し茶",
    cardBody:
      "普通の煎茶が約30〜40秒ほど蒸すのに対し、深蒸し茶はその2〜4倍（約60〜180秒）の時間をかけて蒸します。この長い蒸し工程によって茶葉の細胞がより壊れ、渋みが抑えられてまろやかで濃厚な味わいが生まれます。茶の水色（すいしょく）は細かい茶葉が溶け込むことで濁りのある深い緑色になるのが特徴です。また、煎茶よりも低めの温度（70℃前後）で淹れると甘みがより引き立ちます。",
    sec3Title: "伊勢茶の「味」が愛される理由：恵まれた風土と力強い茶葉",
    sec3P1:
      "三重県、とりわけ「南勢地域」は古くからお茶の栽培に最適な条件が奇跡的なバランスで整った場所です。この地域は年間を通じて温暖な気候に恵まれ燦々と降り注ぐ日照時間が非常に長いのが特徴です。また宮川をはじめとする清流がもたらす適度な雨量と湿潤な空気がお茶の木を健やかに育て上げます。こうした厳しいながらも豊かな自然環境に耐え、養分をたっぷりと蓄えた茶葉は他産地にはない肉厚で力強い葉へと成長します。",
    sec3P2:
      "茶葉の厚みはそのまま味わいの深さへと直結します。しっかりとした厚みのある伊勢茶の葉はお湯を注いだ瞬間に力強い渋みと濃厚なコクを余すことなく解き放ちます。ただ苦いだけではない、芯の通った「お茶本来の旨み」を感じられるのが伊勢茶の醍醐味です。",
    sec3P3:
      "日照条件と独自の気候は、茶葉の中に健康成分である「カテキン」や旨み成分の「アミノ酸（テアニン）」を豊富に生成させます。そのため淹れた瞬間に広がる水色（すいしょく）は驚くほど鮮やかな緑色。鼻をくすぐる若草のような芳醇な香りと、口の中に長く留まる豊かな余韻は、日常のひとときを特別なリラックスタイムへと変えてくれます。",
    sec4Title: "伊勢茶の歴史",
    sec4Heian:
      "伊勢茶の歴史は極めて古く、平安時代の延喜年間（901～922年）まで遡ります。当初はお茶は貴重な「薬」として寺院で大切に育てられていました。",
    sec4Edo:
      "江戸時代には、御師や伊勢商人の活躍により伊勢茶が日本中に広まりました。文禄3年（1594年）の検地帳に茶が年貢として納められている記録があり、当時すでに栽培が行われていたことがうかがえます。",
    sec4Meiji:
      "明治時代には、日本茶輸出の多くを伊勢茶が担いました。明治前期には三重県が全国一の茶生産額を誇り、とくにアメリカ向け輸出で中心的な役割を果たしました。明治17年（1884年）には、椋本の駒田作五郎らが三重県製茶会社を組織し、アメリカの商会へ伊勢茶を直接輸出。全国トップの業績をあげたと伝わります。",
    sec5Title: "伊勢茶の輸出と知られざる黄金時代",
    sec5P1:
      "伊勢茶には、かつてアメリカの日常に深く溶け込み主要な輸出品として日本経済を支えた「黄金時代」がありました。しかし昭和期に入り日米関係が急速に悪化すると、隆盛を極めた伊勢茶の輸出ルートは非情にも途絶えてしまいました。もしあの歴史的な動乱がなかったなら、今頃アメリカでは、コーヒーや紅茶と並んで、日本の「煎茶」が日常的に親しまれる文化が深く根付いていたはずだと言われています。伊勢茶はそれほどまでに世界の人々の心を捉え、文化として定着する直前まで辿り着いていたのです。",
    sec5P2:
      "江戸末期の開国と共に日本の豊かな農産物は世界へと羽ばたきました。幕末から明治初期にかけて、お茶は生糸と並ぶ日本の二大輸出品として外貨獲得の柱となり、その輸出先の多くはアメリカでした。驚くべきことに当時の日本茶輸出の80％以上がアメリカ向けであり、その巨大な需要を支える中心的な役割を担っていたのが「伊勢茶」だったのです。",
    sec5P3:
      "伊勢茶がどれほど現地で愛されていたかを物語るエピソードがあります。最盛期のニューヨークではなんと2500軒以上ものティーガーデンが軒を連ね、至るところで伊勢茶が提供されていました。アメリカの人々にとって伊勢茶の爽やかな香りと深い味わいは、洗練されたひとときを彩る日常の楽しみとなっていました。",
    cardHojichaTitle: "ほうじ茶",
    cardHojichaBody:
      "ほうじ茶（焙じ茶）は、煎茶・番茶・茎茶などの緑茶を強火で焙煎してつくるお茶です。焙煎によって生まれるピラジン類という香気成分がほうじ茶特有の香ばしさを作ります。刺激が少ないため食事中のお茶に向いているほか、焙煎によってカフェインが減るので夜でも飲みやすいとされます。英語では roasted green tea と呼ばれます。",
    cardWakochaTitle: "和紅茶",
    cardWakochaBody:
      "最近人気の日本で栽培された茶葉を日本国内で紅茶として加工したお茶です。海外紅茶（アッサム種など）は渋みが強いのに対し和紅茶は中国種の茶樹を使うことが多く、甘み・旨みが出やすいのが特徴。また華やかで強い香りの海外紅茶に比べ、和紅茶はほのかで繊細な香りが魅力です。英語では Japanese black tea と呼ばれます。",
    altKawamata: "伊勢茶発祥の地 川俣谷",
    altField: "深蒸し茶の茶畑",
  },
  en: {
    h1: "What is Ise Tea",
    intro:
      "Ise tea is the name given to tea produced in Mie Prefecture. Its history is long: by the Edo period it was already grown as a specialty of Ise (today’s Mie). The whole of Mie is now a production area, and the region’s climate and soil give the tea its deep flavour.",
    sec1Title: "Tea of Kawamatadani, the birthplace of Ise tea",
    sec1P1:
      "The full text of “Tea of Kawamatadani, the Birthplace of Ise Tea” by Takase Koji—Japanese Tea Instructor Leader and great-uncle of the owner, Takase Haruka—is now available as a PDF.",
    sec1P2:
      "Set in Kawamatadani, the birthplace of Ise tea, the book traces the passion and history of pioneers who offered tea to the shogunate and led Meiji-era exports to the US. The author, a Japanese Tea Instructor Leader, draws on his expertise to cover everything from the lost hand-rolling technique to postwar revival. A concise history of a thousand years of fine Ise tea, from a tea professional’s perspective.",
    sec1P3:
      "[About the author] Takase Koji: Based in Matsusaka (former Mie Prefecture official). Retired as Senior Researcher and Director of the Tea Research Center, Mie Agricultural Technology Center. Later served as Managing Director of the Mie Prefecture Tea Council. Certified Japanese Tea Instructor Leader; dedicated lecturer for the Japanese Tea Adviser training course. Received the Order of the Sacred Treasure, Gold and Silver Rays (Reiwa 6). Author of “History of Tea in Mie Prefecture,” among others.",
    sec1LinkText: "Read Tea of Kawamatadani",
    sec2Title1: "Japan’s third-largest tea-growing region",
    sec2P1:
      "Mie Prefecture is one of Japan’s leading tea-producing areas, ranking third in production after Shizuoka and Kagoshima. A little-known fact: much of Japan’s tea is grown here in Mie.",
    sec2Title2: "The character of Ise tea: fukamushi sencha",
    sec2P2:
      "Fukamushi (deep-steamed) sencha, representative of Ise tea, is made by steaming the leaves longer so that theanine and other umami components in the stems are extracted more easily. Rich and smooth, it consistently ranks at the top in national tea competitions.",
    sec2FeatureList: [
      "Taste: a firm astringency and memorable depth",
      "Colour: a deep, cloudy green from the fine leaf particles",
      "Aroma: a rich, grassy fragrance",
      "Brewing: lower temperature (around 70°C) brings out more sweetness",
    ],
    cardTitle: "Fukamushi sencha",
    cardBody:
      "Whereas standard sencha is steamed for about 30–40 seconds, fukamushi is steamed for two to four times longer (about 60–180 seconds). This longer steaming breaks down the leaf cells more, reduces astringency, and produces a smooth, full-bodied taste. The liquor tends to be a deep, cloudy green because of the fine particles. Brewing at a slightly lower temperature (around 70°C) than usual brings out more sweetness.",
    sec3Title: "Why Ise tea tastes so good: climate and robust leaves",
    sec3P1:
      "Mie, especially the “Nansei” area, has long had conditions that are remarkably well suited to tea. The region enjoys a mild climate and very long hours of sunshine. Rivers such as the Miyagawa provide ample rain and humidity, which keep the tea plants healthy. The leaves that grow in this demanding but fertile environment store plenty of nutrients and develop a thickness and strength rarely found elsewhere.",
    sec3P2:
      "The thickness of the leaves goes hand in hand with depth of flavour. Ise tea leaves, with their substantial body, release a firm astringency and rich body the moment hot water is poured. Ise tea’s appeal lies in the “true umami of tea” you can taste—not just bitterness, but a clear, core flavour.",
    sec3P3:
      "Sunlight and the region’s climate encourage the leaves to produce catechins and amino acids (theanine). The result is a liquor of strikingly vivid green and a rich, grassy aroma that lingers. That aroma and long-lasting finish can turn an ordinary moment into a special, relaxing one.",
    sec4Title: "History of Ise tea",
    sec4Heian:
      "The history of Ise tea is very long, going back to the Engi era (901–922) of the Heian period. At first, tea was treasured as a “medicine” and cultivated with care at temples.",
    sec4Edo:
      "In the Edo period, Ise tea spread across Japan thanks to the work of oshi (pilgrim guides) and Ise merchants. Land surveys from 1594 record tea paid as tribute, showing that tea was already being grown here by then.",
    sec4Meiji:
      "In the Meiji period, Ise tea played a central role in Japan’s tea exports. In the early Meiji years, Mie had the highest tea production in the country and led exports to the United States. In 1884, Komada Sakugoro and others in Mukamoto formed the Mie Prefecture Tea Company and exported Ise tea directly to American trading houses, achieving the top results in Japan.",
    sec5Title: "Ise tea’s forgotten golden age of export",
    sec5P1:
      "Ise tea once had a “golden age” when it was a major export and part of daily life in America. After Japan–US relations deteriorated in the Showa period, that export route was cut off. It is said that without that upheaval, Japanese sencha might have taken root in America alongside coffee and black tea. Ise tea had captured people’s hearts and was on the verge of becoming a lasting part of the culture.",
    sec5P2:
      "With the opening of Japan in the late Edo period, the country’s agricultural products reached the world. From the end of the shogunate through early Meiji, tea was one of Japan’s two main exports (with raw silk) and a pillar of foreign exchange. Most of that tea went to America—over 80% of Japan’s tea exports—and Ise tea was at the centre of that demand.",
    sec5P3:
      "At the peak of the trade, New York alone had over 2,500 tea gardens where Ise tea was served. For Americans, its refreshing aroma and deep flavour became part of their daily lives.",
    cardHojichaTitle: "Hojicha",
    cardHojichaBody:
      "Hojicha (roasted tea) is made by roasting green teas such as sencha, bancha, or kukicha over high heat. Pyrazines produced by roasting give it its characteristic nutty aroma. It is mild and suits mealtimes, and roasting reduces caffeine, so it is often enjoyed in the evening. In English it is called roasted green tea.",
    cardWakochaTitle: "Japanese black tea",
    cardWakochaBody:
      "Wakocha is black tea produced in Japan from Japanese-grown leaves. Unlike stronger Assam-style teas, it often uses Chinese cultivars and tends to be sweeter and more umami. Compared with bold, fragrant overseas black teas, wakocha offers a subtle, delicate aroma. In English it is called Japanese black tea.",
    altKawamata: "Kawamatadani, birthplace of Ise tea",
    altField: "Fukamushi tea field",
  },
  ko: {
    h1: "이세차란",
    intro:
      "이세차는 미에현에서 생산되는 차의 총칭으로 사랑받는 브랜드 이름입니다. 역사는 오래되어 에도 시대에는 이미 「이세국(현재의 미에현)」의 특산품으로 널리 재배되고 있었습니다. 현재는 미에현 전역이 산지이며, 지역의 풍부한 풍토가 그 깊은 맛을 키우고 있습니다.",
    sec1Title: "이세차 발상지 가와마타다니의 차",
    sec1P1:
      "점주 다카세 하루카의 대숙부이자 일본차 인스트럭터 리더인 다카세 고지의 저서 「이세차 발상지 가와마타다니의 차」가 PDF로 전문 열람 가능해졌습니다.",
    sec1P2:
      "이세차 발상지 가와마타다니를 무대로, 장군에게의 헌상과 메이지 대미 수출을 주도한 선구자들의 열정과 발자취를 일본차 인스트럭터 리더인 저자가 전문적 견해로 풀어냅니다. 환상의 손으로 비비는 기법에서 전후 부활극까지, 천 년에 걸친 양질의 이세차 역사를 응축한, 차 전문가만의 시각이 돋보이는 읽을거리입니다.",
    sec1P3:
      "【저자 약력】다카세 고지: 마쓰사카 시 거주(전 미에현 직원). 미에현 농업기술센터 수석연구원 겸 차업센터 소장으로 정년 퇴직. 퇴직 후 미에현 차업회의소 상무이사 취임. 일본차 인스트럭터 협회 인정·일본차 인스트럭터 리더, 일본차 어드바이저 양성 강좌 전임 강사. 레이와 6년 수보쌍광장 수훈. 저서에 「미에현 차업사」가 있음.",
    sec1LinkText: "이세차 발상지 가와마타다니의 차 읽기",
    sec2Title1: "전국 3위를 자랑하는 「차 고장」",
    sec2P1:
      "미에현은 시즈오카현·가고시마현에 이어 전국 3위의 생산량을 자랑하는 일본 굴지의 차 산지입니다. 잘 알려지지 않은 사실이지만, 일본 차의 상당 부분이 이 미에현에서 지탱되고 있습니다.",
    sec2Title2: "이세차의 특징 「후카무시차의 맛」",
    sec2P2:
      "이세차를 대표하는 후카무시차는 찻잎을 깊게 쪄서 잎자루나 축 등에 많이 함유된 테아닌 등 감칠맛 성분의 용출을 쉽게 하는 제법으로, 감칠맛이 진하고 부드러운 맛의 차로 전국 품평회에서 항상 상위를 차지하고 있습니다.",
    sec2FeatureList: [
      "맛: 알맞은 떫은맛과 오래 기억에 남는 깊은 코쿠",
      "수색: 가는 찻잎이 녹아 흐린 듯한 진한 녹색",
      "향: 어린 풀 같은 풍부한 향",
      "우려내기: 낮은 온도(70℃ 전후)로 우리면 단맛이 더 돋보임",
    ],
    cardTitle: "후카무시차",
    cardBody:
      "일반 녹차가 약 30~40초 정도 찌는 데 비해, 후카무시차는 그 2~4배(약 60~180초)의 시간을 두고 쪄냅니다. 이 긴 찌는 공정으로 찻잎 세포가 더 파괴되어 떫은맛이 억제되고, 부드럽고 진한 맛이 납니다. 차의 수색은 가는 찻잎이 녹아들어 흐린 듯한 진한 녹색이 되는 것이 특징입니다. 또한 녹차보다 낮은 온도(70℃ 전후)로 우리면 단맛이 더 돋보입니다.",
    sec3Title: "이세차 「맛」이 사랑받는 이유: 풍요로운 풍토와 강인한 찻잎",
    sec3P1:
      "미에현, 특히 「난세이 지역」은 예로부터 차 재배에 최적의 조건이 기적적인 균형으로 갖춰진 곳입니다. 이 지역은 일년 내내 따뜻한 기후와 강렬한 일조 시간이 매우 긴 것이 특징입니다. 또한 미야강을 비롯한 맑은 물이 가져다주는 적당한 강수량과 습한 공기가 차나무를 건강하게 키웁니다. 이런 가혹하면서도 풍요로운 자연 환경에 견디며 영양을 가득 축적한 찻잎은 다른 산지에는 없는 두껍고 강인한 잎으로 자랍니다.",
    sec3P2:
      "찻잎의 두께는 맛의 깊이로 이어집니다. 탄탄한 두께의 이세차 잎은 뜨거운 물을 부으면 강한 떫은맛과 진한 코쿠를 남김없이 풍깁니다. 쓴맛만이 아니라, 알맞은 떫은맛과 「차 본연의 감칠맛」을 느낄 수 있는 것이 이세차의 묘미입니다.",
    sec3P3:
      "일조 조건과 독자적인 기후는 찻잎에 카테킨이나 감칠맛 성분(테아닌)을 풍부히 생성시킵니다. 그래서 우리는 순간 펼쳐지는 수색은 놀라울 만큼 선명한 녹색이고, 코를 자극하는 어린 풀 같은 풍부한 향과 입안에 오래 남는 풍요로운 여운이 일상의 한때를 특별한 휴식 시간으로 바꿔 줍니다.",
    sec4Title: "이세차의 역사",
    sec4Heian:
      "이세차의 역사는 매우 오래되어 헤이안 시대 엔기 연간(901~922년)까지 거슬러 올라갑니다. 당시 차는 귀한 「약」으로 사원에서 소중히 재배되었습니다.",
    sec4Edo:
      "에도 시대에는 오시(御師)와 이세 상인들의 활약으로 이세차가 일본 전역에 퍼졌습니다. 분로쿠 3년(1594년) 검지장에 차가 연공으로 납부된 기록이 있어, 당시 이미 재배가 이루어지고 있었음을 알 수 있습니다.",
    sec4Meiji:
      "메이지 시대에는 일본 차 수출의 상당 부분을 이세차가 담당했습니다. 메이지 전기에는 미에현이 전국 1위의 차 생산액을 자랑했으며, 특히 미국 수출에서 중심적인 역할을 했습니다. 메이지 17년(1884년)에는 무카모토의 코마다 사쿠고로 등이 미에현 제차 회사를 조직하여 미국 상회에 이세차를 직접 수출했고, 전국 최고의 실적을 올린 것으로 전해집니다.",
    sec5Title: "이세차 수출과 잊혀진 황금기",
    sec5P1:
      "이세차는 과거 미국의 일상에 깊이 스며들어 일본 경제를 지탱한 주요 수출품으로서 「황금기」가 있었습니다. 쇼와 시대에 들어 일미 관계가 급격히 악화되면서, 전성기를 누리던 이세차의 수출 루트는 무참히 끊겼습니다. 그 역사적 소용돌이가 없었다면, 지금쯤 미국에서는 커피나 홍차와 나란히 일본의 「녹차」가 일상적으로 사랑받는 문화가 뿌리내렸을 것이라고 합니다. 이세차는 그만큼 세계 사람들의 마음을 사로잡고, 문화로 자리하기 직전까지 도달해 있었던 것입니다.",
    sec5P2:
      "에도 말기 개국과 함께 일본의 풍부한 농산물은 세계로 날개를 펼쳤습니다. 막말에서 메이지 초기에 걸쳐 차는 생사와 나란히 일본 2대 수출품으로 외화 획득의 기둥이 되었고, 그 수출지의 상당수가 미국이었습니다. 당시 일본 차 수출의 80% 이상이 미국 향이었으며, 그 거대한 수요를 지탱하는 중심 역할을 했던 것이 「이세차」였습니다.",
    sec5P3:
      "이세차가 현지에서 얼마나 사랑받았는지를 말해 주는 일화가 있습니다. 전성기의 뉴욕에는 2500곳 이상의 티 가든이 늘어서 있었고, 곳곳에서 이세차가 제공되었습니다. 미국인들에게 이세차의 상쾌한 향과 깊은 맛은 세련된 한때를 물들이는 일상의 즐거움이었습니다.",
    cardHojichaTitle: "후지차",
    cardHojichaBody:
      "후지차(焙じ茶)는 녹차·반차·줄기차 등을 강불에 볶아 만든 차입니다. 볶음으로 생기는 피라진류라는 향기 성분이 후지차 특유의 고소한 향을 만듭니다. 자극이 적어 식사 중 마시기 좋고, 볶음으로 카페인이 줄어 밤에도 마시기 좋다고 합니다. 영어로는 roasted green tea라고 합니다.",
    cardWakochaTitle: "와코차",
    cardWakochaBody:
      "최근 인기인 일본에서 재배한 찻잎을 일본에서 홍차로 가공한 차입니다. 해외 홍차(아삼종 등)는 떫은맛이 강한 데 비해 와코차는 중국종 찻나무를 쓰는 경우가 많아 단맛·감칠맛이 잘 납니다. 화려하고 강한 향의 해외 홍차에 비해 와코차는 은은하고 섬세한 향이 매력입니다. 영어로는 Japanese black tea라고 합니다.",
    altKawamata: "이세차 발상지 가와마타다니",
    altField: "후카무시차 차밭",
  },
  zh: {
    h1: "什么是伊势茶",
    intro:
      "伊势茶是在三重县内生产的茶的总称，是广为人知的品牌名。其历史久远，在江户时代已作为「伊势国（现三重县）」的特产广泛栽培。如今三重县全域均为产地，当地的风土孕育了其深厚的滋味。",
    sec1Title: "伊势茶发祥地 川俣谷之茶",
    sec1P1:
      "店主高瀬晴香的叔祖父、日本茶讲师领袖高瀬孝二的著作《伊势茶发祥地 川俣谷之茶》已可全文以PDF形式阅览。",
    sec1P2:
      "以伊势茶发祥地川俣谷为舞台，由身为日本茶讲师领袖的著者从专业角度解读向将军进贡与明治对美出口的先驱者的热情与历程。从幻之手揉技法到战后复兴，浓缩千年优质伊势茶历史，呈现茶业专业人士的视角。追溯昔日伊势商人对世界的梦想，深蒸茶香气背后令人惊叹的故事，敬请一读。",
    sec1P3:
      "【作者简介】高瀬孝二：居住于松阪市（原三重县职员）。曾任三重县农业技术中心首席研究员兼茶业中心主任后退休。退休后任三重县茶业会议所常务理事。日本茶讲师协会认定·日本茶讲师领袖、日本茶顾问养成讲座专任讲师。令和6年受勋瑞宝双光章。主要著作有《三重县茶业史》等。",
    sec1LinkText: "阅读《伊势茶发祥地 川俣谷之茶》",
    sec2Title1: "位居全国第三的「茶乡」",
    sec2P1:
      "三重县是仅次于静冈县、鹿儿岛县的全国第三大产地，是日本屈指可数的茶产区。意外的是，日本许多茶都产自三重县。",
    sec2Title2: "伊势茶的特征「深蒸茶的滋味」",
    sec2P2:
      "代表伊势茶的深蒸茶，是通过长时间蒸制使茶梗等所含的茶氨酸等鲜味成分更易溶出的制法，作为鲜味浓郁、口感醇和的茶在全国品评会上常年名列前茅。",
    sec2FeatureList: [
      "滋味：适度的涩味与令人难忘的醇厚",
      "汤色：细碎茶叶溶出呈带浊的深绿色",
      "香气：如嫩草般的醇香",
      "冲泡：用略低的温度（约70℃）冲泡甜味更突出",
    ],
    cardTitle: "深蒸茶",
    cardBody:
      "普通煎茶约蒸30～40秒，而深蒸茶则需2～4倍时间（约60～180秒）。长时间蒸制使茶叶细胞更充分破裂，涩味减轻，形成醇厚浓郁的口感。茶汤因细碎茶叶溶出而呈带浊的深绿色。用略低于煎茶的温度（约70℃）冲泡，甜味更突出。",
    sec3Title: "伊势茶「味」受喜爱的理由：得天独厚的风土与强韧茶芽",
    sec3P1:
      "三重县，尤其是「南势地区」，自古以来就是茶栽培条件奇迹般均衡的地方。该地区全年气候温暖、日照时间长，宫川等清流带来适度的雨量与湿润空气，滋养茶树。在这样的严酷而丰饶的自然环境中，蓄满养分的茶芽生长为他处少有的厚实强韧的叶片。",
    sec3P2:
      "茶叶的厚度直接关系到滋味的深度。厚实的伊势茶叶在注入热水的那一刻便释放出强烈的涩味与浓郁醇厚。伊势茶的魅力在于能品味到「茶本来的鲜味」——不仅是苦，更有清晰的、有骨力的味道。",
    sec3P3:
      "日照与当地气候使茶叶中富含儿茶素与氨基酸（茶氨酸）。冲泡瞬间展开的汤色是鲜亮的绿色，若草般的醇香与口中持久的余韵，将日常一刻变为特别的放松时光。",
    sec4Title: "伊势茶的历史",
    sec4Heian:
      "伊势茶的历史极为悠久，可追溯至平安时代延喜年间（901～922年）。当时茶被视作珍贵的「药」，在寺院中精心栽培。",
    sec4Edo:
      "江户时代，在御师与伊势商人的推动下，伊势茶传遍日本。文禄3年（1594年）的检地帐中已有茶作为年贡缴纳的记载，可知当时已有栽培。",
    sec4Meiji:
      "明治时代，日本茶出口中伊势茶占据重要地位。明治前期三重县茶生产额居全国第一，尤其在对美出口中扮演核心角色。明治17年（1884年），椋本的驹田作五郎等人组建三重县制茶会社，向美国商行直接出口伊势茶，创下全国第一的业绩。",
    sec5Title: "伊势茶的出口与鲜为人知的黄金时代",
    sec5P1:
      "伊势茶曾有过深深融入美国日常生活、作为日本经济支柱出口品的「黄金时代」。但随着昭和时期日美关系急剧恶化，盛极一时的伊势茶出口路线无情地中断。若非那场历史动荡，如今在美国，日本「煎茶」或许已与咖啡、红茶一样，成为日常文化的一部分。伊势茶曾如此抓住世界人们的心，几乎就要作为一种文化落地生根。",
    sec5P2:
      "江户末期的开国使日本丰富的农产品走向世界。从幕末到明治初期，茶与生丝并列为日本两大出口品，是获取外汇的支柱，而出口目的地多为美国。当时日本茶出口的80%以上面向美国，支撑这一巨大需求的核心正是「伊势茶」。",
    sec5P3:
      "纽约鼎盛时期曾有2500家以上的茶庭鳞次栉比，处处供应伊势茶。对美国人而言，伊势茶清爽的香气与深邃的滋味，曾是点缀雅致时光的日常享受。",
    cardHojichaTitle: "焙茶",
    cardHojichaBody:
      "焙茶是将煎茶、番茶、茎茶等绿茶以强火焙煎制成的茶。焙煎产生的吡嗪类香气成分带来焙茶特有的香醇。刺激性低，适合佐餐，焙煎也减少咖啡因，适合晚间饮用。英文称 roasted green tea。",
    cardWakochaTitle: "和红茶",
    cardWakochaBody:
      "近年来流行的是在日本栽培、在日本加工成红茶的茶。与涩味较强的阿萨姆等海外红茶相比，和红茶多使用中国种茶树，甜味与鲜味更突出；与华丽浓烈的海外红茶相比，和红茶以含蓄细腻的香气见长。英文称 Japanese black tea。",
    altKawamata: "伊势茶发祥地 川俣谷",
    altField: "深蒸茶茶园",
  },
};

function kabatadaniHref(locale: Locale): string {
  return locale === "ja" ? "/kabatadani_no_ocha" : `/${locale}/kabatadani_no_ocha`;
}

/** トップページの商品一覧を指定フィルターで絞り込んだURL（filter=深蒸し茶 など） */
function productsFilterHref(locale: Locale, filterValue: string): string {
  const base = locale === "ja" ? "" : `/${locale}`;
  const path = base || "/";
  const q = `filter=${encodeURIComponent(filterValue)}`;
  return `${path}?${q}`;
}

type Props = {
  locale: Locale;
};

export default function IsechaPage({ locale }: Props) {
  const t = ISECHA_TEXTS[locale];
  const kabatadani = kabatadaniHref(locale);

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="isecha-heading" className="mb-12">
          <div className="mb-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="overflow-hidden rounded-md">
              <Link href={kabatadani}>
                <Image
                  src="/images/isecha-kawamata.jpg"
                  alt={t.altKawamata}
                  width={716}
                  height={1024}
                  className="h-auto w-full object-cover"
                />
              </Link>
            </figure>
            <div className="text-left">
              <h2 className="mt-0 mb-3 text-lg font-semibold text-tea-deep md:text-xl">
                <Link href={kabatadani} className="no-underline hover:underline underline-offset-4">
                  {t.sec1Title}
                </Link>
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec1P1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec1P2}
              </p>
              <p className="mt-4 mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec1P3}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                <Link
                  href={kabatadani}
                  className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                >
                  {t.sec1LinkText}
                </Link>
              </p>
            </div>
          </div>

          <h1
            id="isecha-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="text-left">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.intro}
              </p>
              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title1}
              </h2>
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P1}
              </p>
              <h2 className="mt-6 mb-3 text-base font-semibold text-tea-deep">
                {t.sec2Title2}
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P2}
              </p>
              <ul className="mb-4 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2FeatureList.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <figure className="overflow-hidden rounded-xl">
              <Image
                src="/images/isecha-field.jpg"
                alt={t.altField}
                width={1024}
                height={768}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="mt-4 flex justify-center md:col-span-2">
              <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
                <div>
                  <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                    {t.cardTitle}
                  </h3>
                  <p className="mb-0">{t.cardBody}</p>
                  <div className="flex justify-center md:justify-end mt-3">
                    <Link
                      href={productsFilterHref(locale, "深蒸し茶")}
                      className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                    >
                      <span className="text-base font-bold">{t.cardTitle}</span>
                      <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                        {COMMON_TEXTS[locale].product.viewDetails}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec3Title}
            </h2>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P1}
            </p>
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P2}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec3P3}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
              <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                {t.cardHojichaTitle}
              </h3>
              <p className="mb-0">{t.cardHojichaBody}</p>
              <div className="flex justify-center md:justify-end mt-3">
                <Link
                  href={productsFilterHref(locale, "ほうじ茶")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.cardHojichaTitle}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS[locale].product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec4Title}
            </h2>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Heian}
            </p>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Edo}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec4Meiji}
            </p>
          </div>

          <div className="mt-10 text-left">
            <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
              {t.sec5Title}
            </h2>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P1}
            </p>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P2}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.sec5P3}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-[720px] rounded-xl bg-[rgb(240,230,220)] px-4 py-4 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6 md:py-5">
              <h3 className="mb-2 text-[0.98rem] font-semibold text-tea-deep">
                {t.cardWakochaTitle}
              </h3>
              <p className="mb-0">{t.cardWakochaBody}</p>
              <div className="flex justify-center md:justify-end mt-3">
                <Link
                  href={productsFilterHref(locale, "和紅茶")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.cardWakochaTitle}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS[locale].product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
