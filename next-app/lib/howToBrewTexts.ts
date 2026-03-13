import type { Locale } from "./i18n";

export type HowToBrewTexts = {
  h1: string;
  lead1: string;
  lead2: string;
  sec1Title: string;
  sec1P1: string;
  sec1Li1: string;
  sec1Li2: string;
  sec1Li3: string;
  tbTitle: string;
  tbNote: string;
  tbStep1: string;
  tbStep2: string;
  tbStep3: string;
  tbBody: string;
  leafTitle: string;
  leafNote: string;
  leafStep1: string;
  leafStep2: string;
  leafStep3: string;
  leafStep4: string;
  leafBody: string;
  kyusuTitle: string;
  kyusuLi1: string;
  kyusuLi2: string;
  kyusuLi3: string;
  kyusuLi4: string;
  mizudashiTitle: string;
  mizudashiNote: string;
  mizudashiStep1: string;
  mizudashiStep2: string;
  mizudashiStep3: string;
  mizudashiBody: string;
  powderReasonTitle: string;
  powderReasonBody: string;
  latteTitle: string;
  latteGreenTitle: string;
  latteGreenList: string[];
  latteGreenBody: string;
  latteHojichaTitle: string;
  latteHojichaList: string[];
  latteHojichaBody: string;
  powderVsMatchaTitle: string;
  powderWhatTitle: string;
  powderWhatBody: string;
  matchaWhatTitle: string;
  matchaWhatBody: string;
  storageTitle: string;
  storageIntro: string;
  storageOpenTitle: string;
  storageOpenList: string[];
  storageUnopenedTitle: string;
  storageUnopenedList: string[];
  storageOutro: string;
  altTop: string;
  altTeaBag: string;
  altPot: string;
  altWater: string;
  altGreenLatte: string;
  altHojichaLatte: string;
};

const JA: HowToBrewTexts = {
  h1: "お茶の淹れ方",
  lead1:
    "お家で楽しむお茶は、ちょっとした工夫で格段においしくなります。ポイントは、茶葉の量やお湯の量、温度、抽出時間のバランス。これさえ押さえれば、同じ茶葉でも驚くほど風味が引き立ちます。",
  lead2:
    "このページでは毎日のティータイムにすぐ使える簡単レシピとコツをご紹介します。忙しい朝でも、ほっとひと息つきたい午後でも、お家で手軽に香り豊かなお茶を楽しめます。",
  sec1Title: "味の濃淡を決める、茶葉とお湯のバランス",
  sec1P1:
    "茶葉の量・お湯の量・待ち時間の3つを意識すると、お好みの味に近づけやすくなります。",
  sec1Li1: "茶葉の量：多くすれば味は濃く、少なければ淡くなります。",
  sec1Li2:
    "お湯の量：お湯が少なければ成分が濃く、多ければ穏やかな味わいに。上質な茶葉ほど、少量で深い味を楽しめます。",
  sec1Li3:
    "待ち時間：お湯の温度が低いほど長めに、高いほど短めに。渋味が苦手な方は、短めに切り上げるのがおすすめです。",
  tbTitle: "ティーバッグのおいしい淹れ方",
  tbNote: "目安：湯量 160cc／湯温 70〜80℃",
  tbStep1: "マグカップにティーバッグを入れる",
  tbStep2: "160ccほどお湯を注ぐ",
  tbStep3: "90〜120秒ほど待って完成",
  tbBody:
    "緑茶は70〜80℃でゆっくりと淹れると甘みとコクがしっかり抽出されます。ほうじ茶は90℃くらいの高めの湯温にすると香ばしさがより際立ちます。同じティーバッグにお湯を足すことで、2煎目・3煎目も楽しめます。",
  leafTitle: "茶葉（リーフ）のおいしい淹れ方",
  leafNote: "目安：湯量 160cc／湯温 70〜80℃",
  leafStep1: "急須に茶葉を3g入れる",
  leafStep2: "160ccほどお湯を注ぐ",
  leafStep3: "蓋をして90〜120秒ほど待つ",
  leafStep4:
    "注ぐ時はゆっくりと。複数の茶碗に注ぐ場合は少量ずつ順番に注ぐことで濃度が均一になり、みなさんで同じ味を楽しめます。",
  leafBody:
    "深蒸し茶は茶葉が細かいため、網目の細かい急須（深蒸し急須）をお使いいただくと、より一層美味しくお楽しみいただけます。",
  kyusuTitle: "深蒸し茶用急須の選び方",
  kyusuLi1:
    "サイズ：200〜300ml程度が一般的です（2〜3人分）。一人で飲むことが多い場合は、少し小さめの150〜200mlを選ぶと、お湯の量がコントロールしやすく美味しく淹れられます。",
  kyusuLi2:
    "形：平べったい形や底が広いものをおすすめします。細かい茶葉が底に薄く広がるため、お湯が均一に行き渡り、旨味がしっかり抽出されます。",
  kyusuLi3:
    "素材：常滑焼（とこなめやき）や万古焼（ばんこやき）は、酸化鉄を多く含んだ粘土で焼かれており、お茶のタンニンと反応して渋みをまろやかに、コクを深くしてくれます。深蒸し茶の濃厚な味わいと非常に相性が良いです。",
  kyusuLi4:
    "茶こし：深蒸し茶は茶葉が粉っぽいため、通常の急須では目詰まりしやすいです。ステンレスメッシュの帯網や、深蒸し専用に作られた目の細かいものを選びます。",
  mizudashiTitle: "水出し茶の作り方",
  mizudashiNote:
    "目安：お水1リットルにつき、茶葉10〜15g（大さじ2〜3杯）またはティーバッグ2〜3個",
  mizudashiStep1: "ポットやボトルに茶葉（またはティーバッグ）を入れる",
  mizudashiStep2: "1リットルのお水を注ぐ",
  mizudashiStep3: "冷蔵庫で2〜6時間おく",
  mizudashiBody:
    "深蒸し茶は鮮やかな緑色とコクのある味わいに、ほうじ茶は香ばしく軽やかな仕上がりになります。作った水出し茶は衛生上、1日で飲み切ってください。",
  powderReasonTitle: "藤八茶寮のパウダー緑茶が選ばれる理由",
  powderReasonBody:
    "一般的なパウダー緑茶とは一線を画す、上質な伊勢茶の「深蒸し茶」を贅沢に原料として使用しています。本来、粉末茶はラテにすると色が沈みがちですが、藤八茶寮のパウダーなら、抹茶に引けを取らない深みのある香りと、目にも鮮やかな緑色のラテをお楽しみいただけます。深蒸し茶ならではの濃厚なコクと鮮やかな緑色を、粉末状でも損なうことなく閉じ込めました。",
  latteTitle: "緑茶ラテ・ほうじ茶ラテ",
  latteGreenTitle: "緑茶ラテ",
  latteGreenList: ["緑茶パウダー：3g", "お湯：25〜30ml", "牛乳：160cc", "砂糖：小さじ1（お好みで）"],
  latteGreenBody: "粉末緑茶を少量のお湯でよく溶かし、温めた牛乳を注いで完成です。",
  latteHojichaTitle: "ほうじ茶ラテ",
  latteHojichaList: ["ほうじ茶パウダー：3g", "お湯：25〜30ml", "牛乳：160cc", "砂糖：小さじ1（お好みで）"],
  latteHojichaBody:
    "粉末ほうじ茶を少量のお湯でよく溶かし、温めた牛乳を注いでお楽しみください。",
  powderVsMatchaTitle: "パウダー緑茶（粉末緑茶）と抹茶の違い",
  powderWhatTitle: "パウダー緑茶（粉末緑茶）とは",
  powderWhatBody:
    "普段私たちが急須で楽しむ「煎茶」をそのまま粉砕したものです。一般的な粉末茶は、抹茶特有の香気がなく、ラテにした際に色がくすみやすい傾向がありますが、日常使いしやすく、茶葉の栄養成分を丸ごと摂取できるのが利点です。太陽の光をたっぷりと浴びて育つため、健康成分であるカテキンが豊富に含まれています。",
  matchaWhatTitle: "抹茶とは",
  matchaWhatBody:
    "抹茶の原料は「碾茶（てんちゃ）」です。収穫前の約20日間、茶園を黒いネット等で覆う「覆下（おおした）栽培」を行うことで日光を遮り、旨味成分（テアニン）が渋み成分（カテキン）に変化するのを抑えます。その結果、抹茶特有の鮮やかな緑色と、深みのあるコクが生まれます。",
  storageTitle: "お茶の保存方法",
  storageIntro:
    "お茶は乾物ですが、「鮮度」が大切な農産物です。開封後・未開封それぞれで、適切な保存を心がけることで、香りと風味を長く保てます。",
  storageOpenTitle: "開封後の保存",
  storageOpenList: [
    "移り香の強い食材（コーヒーやスパイスなど）の近くは避ける",
    "密閉性の高い袋や茶缶に入れ、空気に触れさせない",
    "直射日光の当たらない冷暗所に保管する",
  ],
  storageUnopenedTitle: "未開封での長期保存",
  storageUnopenedList: [
    "冷蔵・冷凍保存で鮮度をキープ",
    "開封前は必ず常温に戻してから封を開け、結露による劣化を防ぐ",
  ],
  storageOutro:
    "開封後は2週間〜1ヶ月を目安に飲み切っていただくのがおすすめです。ぜひ、そのときどきの気分に合わせて、いちばんおいしい一杯をお楽しみください。",
  altTop: "お茶の時間のイメージ",
  altTeaBag: "ティーバッグで淹れるお茶",
  altPot: "急須で淹れるお茶",
  altWater: "水出し茶のイメージ",
  altGreenLatte: "緑茶ラテ",
  altHojichaLatte: "ほうじ茶ラテ",
};

const EN: HowToBrewTexts = {
  h1: "How to brew tea",
  lead1:
    "Tea at home can taste much better with a few simple tips. The key is the balance of leaf amount, water amount, temperature, and steeping time. Get this right and the same leaves will shine.",
  lead2:
    "This page shares easy recipes and tips for your daily tea time. Whether it’s a busy morning or a quiet afternoon, you can enjoy fragrant tea at home with minimal effort.",
  sec1Title: "Balance of leaves and water",
  sec1P1:
    "If you pay attention to the amount of leaves, the amount of water, and the steeping time, it’s easier to get the strength you like.",
  sec1Li1: "Amount of leaves: more makes it stronger, less makes it lighter.",
  sec1Li2:
    "Amount of water: less water gives a stronger brew, more gives a milder one. Good leaves often need only a small amount for a rich cup.",
  sec1Li3:
    "Steeping time: use a longer time with lower water temperature and a shorter time with higher. If you prefer less astringency, keep the time short.",
  tbTitle: "Brewing with tea bags",
  tbNote: "Guide: 160cc water / 70–80°C",
  tbStep1: "Put the tea bag in a mug",
  tbStep2: "Pour about 160cc of hot water",
  tbStep3: "Wait 90–120 seconds",
  tbBody:
    "Brewing green tea slowly at 70–80°C brings out sweetness and body. Hojicha is more aromatic at around 90°C. You can add more water to the same bag for a second and third cup.",
  leafTitle: "Brewing loose-leaf tea",
  leafNote: "Guide: 160cc water / 70–80°C",
  leafStep1: "Put about 3g of leaves in a teapot",
  leafStep2: "Pour about 160cc of hot water",
  leafStep3: "Put the lid on and wait 90–120 seconds",
  leafStep4:
    "Pour slowly. When serving several cups, pour a little into each in turn so everyone gets the same strength.",
  leafBody:
    "Fukamushi tea has fine leaves, so a teapot with a fine mesh (fukamushi kyusu) will brew it better.",
  kyusuTitle: "Choosing a kyusu for fukamushi tea",
  kyusuLi1:
    "Size: 200–300ml is common (2–3 cups). If you usually drink alone, 150–200ml makes it easier to control the amount of water and get a good brew.",
  kyusuLi2:
    "Shape: Flatter or wide-bottomed pots are best. Fine leaves spread in a thin layer so the water reaches them evenly and umami is extracted well.",
  kyusuLi3:
    "Material: Tokoname and Banko ware are made from clay rich in iron oxide, which reacts with tannins to soften astringency and deepen body. They suit fukamushi tea well.",
  kyusuLi4:
    "Strainer: Fukamushi leaves are powdery and can clog normal strainers. Use a stainless mesh or a fine-mesh strainer made for fukamushi.",
  mizudashiTitle: "Cold-brew tea",
  mizudashiNote:
    "Guide: 10–15g leaves (2–3 tbsp) or 2–3 tea bags per 1 litre of water",
  mizudashiStep1: "Put the leaves (or tea bags) in a pot or bottle",
  mizudashiStep2: "Add 1 litre of water",
  mizudashiStep3: "Leave in the fridge for 2–6 hours",
  mizudashiBody:
    "Fukamushi gives a vivid green and full-bodied cold brew; hojicha is nutty and light. Drink cold-brew tea within a day.",
  powderReasonTitle: "Why we use fukamushi for our powder",
  powderReasonBody:
    "We use premium Ise fukamushi tea as the base for our powder, not ordinary green-tea powder. While many powdered teas look dull in a latte, ours keeps a deep aroma and vivid green colour. We’ve kept the rich body and colour of fukamushi even in powder form.",
  latteTitle: "Green tea & hojicha latte",
  latteGreenTitle: "Green tea latte",
  latteGreenList: ["Green tea powder: 3g", "Hot water: 25–30ml", "Milk: 160cc", "Sugar: 1 tsp (optional)"],
  latteGreenBody: "Dissolve the powder in a little hot water, then add warmed milk.",
  latteHojichaTitle: "Hojicha latte",
  latteHojichaList: ["Hojicha powder: 3g", "Hot water: 25–30ml", "Milk: 160cc", "Sugar: 1 tsp (optional)"],
  latteHojichaBody: "Dissolve the powder in a little hot water, then add warmed milk.",
  powderVsMatchaTitle: "Powdered green tea vs matcha",
  powderWhatTitle: "What is powdered green tea",
  powderWhatBody:
    "It’s sencha (the tea we brew in a pot) simply ground into powder. It doesn’t have matcha’s special aroma and can look dull in lattes, but it’s easy for daily use and you get the full nutrients of the leaves. Grown in full sun, it’s rich in catechins.",
  matchaWhatTitle: "What is matcha",
  matchaWhatBody:
    "Matcha is made from tencha. The tea is shaded for about 20 days before harvest, which limits the conversion of theanine into catechins. The result is matcha’s vivid green colour and deep, smooth flavour.",
  storageTitle: "Storing tea",
  storageIntro:
    "Tea is a dried product but freshness matters. Storing it properly before and after opening helps keep aroma and flavour.",
  storageOpenTitle: "After opening",
  storageOpenList: [
    "Keep away from strong-smelling foods (e.g. coffee, spices)",
    "Store in an airtight bag or tin, away from air",
    "Keep in a cool, dark place, out of direct sun",
  ],
  storageUnopenedTitle: "Long-term (unopened)",
  storageUnopenedList: [
    "Refrigerate or freeze to keep freshness",
    "Bring to room temperature before opening to avoid condensation",
  ],
  storageOutro:
    "We recommend finishing opened tea within about 2 weeks to 1 month. Enjoy a cup that suits the moment.",
  altTop: "Tea time",
  altTeaBag: "Tea brewed with a bag",
  altPot: "Tea brewed in a pot",
  altWater: "Cold-brew tea",
  altGreenLatte: "Green tea latte",
  altHojichaLatte: "Hojicha latte",
};

const KO: HowToBrewTexts = {
  ...JA,
  h1: "차 우려내기",
  lead1:
    "집에서 마시는 차는 살짝만 신경 쓰면 훨씬 맛있어집니다. 포인트는 찻잎 양, 물 양, 온도, 우려 시간의 균형입니다. 이것만 지키면 같은 찻잎도 놀랄 만큼 맛이 살아납니다.",
  lead2:
    "이 페이지에서는 매일의 티타임에 바로 쓸 수 있는 간단한 레시피와 요령을 소개합니다. 바쁜 아침이든 잠깐 쉬고 싶은 오후든, 집에서 간단히 향긋한 차를 즐기실 수 있습니다.",
  sec1Title: "맛의 농담을 정하는, 찻잎과 물의 균형",
  sec1P1:
    "찻잎 양, 물 양, 대기 시간 이 세 가지를 의식하면 원하는 맛에 가까워지기 쉽습니다.",
  sec1Li1: "찻잎 양: 많으면 진하고, 적으면 연해집니다.",
  sec1Li2:
    "물 양: 물이 적으면 성분이 진하고, 많으면 부드러운 맛이 납니다. 좋은 찻잎일수록 적은 양으로 깊은 맛을 낼 수 있습니다.",
  sec1Li3:
    "대기 시간: 물 온도가 낮을수록 길게, 높을수록 짧게. 떫은맛을 싫어하시면 짧게 끊는 것이 좋습니다.",
  tbTitle: "티백으로 맛있게 우려내기",
  tbNote: "참고: 물 160cc / 온도 70~80℃",
  tbStep1: "머그컵에 티백을 넣는다",
  tbStep2: "160cc 정도 뜨거운 물을 붓는다",
  tbStep3: "90~120초 정도 기다리면 완성",
  tbBody:
    "녹차는 70~80℃에서 천천히 우리면 단맛과 깊이가 잘 나옵니다. 호지차는 90℃ 정도 더 높은 온도로 하면 고소한 맛이 더 납니다. 같은 티백에 물을 더 부으면 2차, 3차도 즐기실 수 있습니다.",
  leafTitle: "잎차(리프)로 맛있게 우려내기",
  leafNote: "참고: 물 160cc / 온도 70~80℃",
  leafStep1: "주전자에 찻잎 3g을 넣는다",
  leafStep2: "160cc 정도 뜨거운 물을 붓는다",
  leafStep3: "뚜껑을 닫고 90~120초 정도 기다린다",
  leafStep4:
    "따를 때는 천천히. 여러 잔에 나눌 때는 조금씩 번갈아 가며 붓으면 농도가 고르게 되어 같은 맛을 즐기실 수 있습니다.",
  leafBody:
    "후카무시차는 찻잎이 잘게 부서지므로, 망이 촘촘한 주전자(후카무시 주전자)를 쓰시면 더 맛있게 즐기실 수 있습니다.",
  kyusuTitle: "후카무시차용 주전자 고르기",
  kyusuLi1:
    "크기: 200~300ml가 일반적입니다(2~3인분). 혼자 마시는 경우가 많으면 150~200ml 정도의 작은 것을 고르면 물 양 조절이 쉽고 맛있게 우릴 수 있습니다.",
  kyusuLi2:
    "형태: 납작하거나 밑이 넓은 것을 추천합니다. 잘게 부순 찻잎이 밑에 얇게 퍼지므로 물이 고르게 닿아 감칠맛이 잘 우러납니다.",
  kyusuLi3:
    "재질: 도코나메·방고 야키는 산화철을 많이 포함한 점토로 구워져, 차의 탄닌과 반응해 떫은맛을 부드럽게 하고 깊이를 더합니다. 후카무시차의 진한 맛과 잘 어울립니다.",
  kyusuLi4:
    "여과망: 후카무시차는 찻잎이 가루 같아서 보통 주전자에서는 막히기 쉽습니다. 스테인리스 메쉬나 후카무시 전용의 촘촘한 망을 고르세요.",
  mizudashiTitle: "냉침차 만들기",
  mizudashiNote:
    "참고: 물 1리터당 찻잎 10~15g(큰술 2~3개) 또는 티백 2~3개",
  mizudashiStep1: "포트나 병에 찻잎(또는 티백)을 넣는다",
  mizudashiStep2: "1리터의 물을 붓는다",
  mizudashiStep3: "냉장고에서 2~6시간 두었다가 마신다",
  mizudashiBody:
    "후카무시차는 선명한 녹색과 깊은 맛, 호지차는 고소하고 가벼운 맛이 납니다. 만든 냉침차는 위생상 당일에 드세요.",
  powderReasonTitle: "후지하치야 파우더 녹차가 선택되는 이유",
  powderReasonBody:
    "일반 파우더 녹차와는 차원이 다른, 고급 이세차 「후카무시차」를 넉넉히 원료로 씁니다. 원래 분말차는 라테로 하면 색이 침침해지기 쉬우나, 후지하치야 파우더는 말차에 뒤지지 않는 깊은 향과 선명한 녹색 라테를 즐기실 수 있습니다. 후카무시차만의 진한 깊이와 선명한 녹색을 분말에서도 그대로 담았습니다.",
  latteTitle: "녹차 라테·호지차 라테",
  latteGreenTitle: "녹차 라테",
  latteGreenList: ["녹차 파우더: 3g", "뜨거운 물: 25~30ml", "우유: 160cc", "설탕: 작은술 1(선택)"],
  latteGreenBody: "녹차 파우더를 소량의 뜨거운 물에 잘 풀고, 데운 우유를 부어 완성합니다.",
  latteHojichaTitle: "호지차 라테",
  latteHojichaList: ["호지차 파우더: 3g", "뜨거운 물: 25~30ml", "우유: 160cc", "설탕: 작은술 1(선택)"],
  latteHojichaBody: "호지차 파우더를 소량의 뜨거운 물에 잘 풀고, 데운 우유를 부어 드세요.",
  powderVsMatchaTitle: "파우더 녹차와 말차의 차이",
  powderWhatTitle: "파우더 녹차란",
  powderWhatBody:
    "평소 주전자로 즐기는 「녹차」를 그대로 분쇄한 것입니다. 일반 분말차는 말차 특유의 향이 없고 라테로 하면 색이 침침해지기 쉽지만, 일상적으로 쓰기 쉽고 찻잎의 영양을 그대로 섭취할 수 있는 것이 장점입니다. 햇빛을 많이 받고 자라 카테킨이 풍부합니다.",
  matchaWhatTitle: "말차란",
  matchaWhatBody:
    "말차의 원료는 「덴차」입니다. 수확 약 20일 전부터茶园을 검은 그물 등으로 덮는 「오오시타 재배」로 햇빛을 차단해, 감칠맛 성분(테아닌)이 떫은맛 성분(카테킨)으로 바뀌는 것을 막습니다. 그 결과 말차 특유의 선명한 녹색과 깊은 맛이 납니다.",
  storageTitle: "차 보관법",
  storageIntro:
    "차는 건조식품이지만 「신선도」가 중요한 농산물입니다. 개봉 후·미개봉 각각에서 적절히 보관하면 향과 풍미를 오래 유지할 수 있습니다.",
  storageOpenTitle: "개봉 후 보관",
  storageOpenList: [
    "냄새가 강한 식재료(커피·스파이스 등) 가까이 두지 않는다",
    "밀폐성 높은 봉지나 차 통에 넣어 공기에 닿지 않게 한다",
    "직사광선이 들지 않는 서늘한 곳에 둔다",
  ],
  storageUnopenedTitle: "미개봉 장기 보관",
  storageUnopenedList: [
    "냉장·냉동 보관으로 신선도 유지",
    "개봉 전에는 반드시 실온으로 되돌린 뒤 뚜껑을 열어 결로로 인한 열화를 막는다",
  ],
  storageOutro:
    "개봉 후에는 2주~1개월을 기준으로 마시는 것을 권합니다. 그때그때 기분에 맞는 맛있는 한 잔을 즐기세요.",
  altTop: "차 시간 이미지",
  altTeaBag: "티백으로 우린 차",
  altPot: "주전자로 우린 차",
  altWater: "냉침차 이미지",
  altGreenLatte: "녹차 라테",
  altHojichaLatte: "호지차 라테",
};

const ZH: HowToBrewTexts = {
  ...JA,
  h1: "茶的冲泡方法",
  lead1:
    "在家喝茶，只要稍下功夫就会好喝很多。关键在于茶叶用量、水量、水温和冲泡时间的平衡。掌握这几点，同一款茶也能明显更香。",
  lead2:
    "本页介绍适合每日茶时间的简单冲泡法与窍门。无论忙碌的早晨还是想小歇的下午，都能在家轻松享受香气丰富的茶。",
  sec1Title: "决定浓淡的茶叶与水的平衡",
  sec1P1:
    "留意茶叶量、水量和等待时间这三项，就更容易接近您喜欢的味道。",
  sec1Li1: "茶叶量：多则浓，少则淡。",
  sec1Li2:
    "水量：水少则成分浓，水多则口感温和。品质越好的茶，少量即可泡出深味。",
  sec1Li3:
    "等待时间：水温低则时间略长，水温高则略短。不喜涩味者可缩短时间。",
  tbTitle: "茶包的美味泡法",
  tbNote: "参考：水量 160cc／水温 70～80℃",
  tbStep1: "将茶包放入马克杯",
  tbStep2: "注入约160cc热水",
  tbStep3: "等待约90～120秒即可",
  tbBody:
    "绿茶用70～80℃慢慢冲泡能充分萃出甜味与醇厚。焙茶用约90℃略高水温更能突出香气。同一茶包可续水享受二泡、三泡。",
  leafTitle: "茶叶（叶茶）的美味泡法",
  leafNote: "参考：水量 160cc／水温 70～80℃",
  leafStep1: "在茶壶中放入约3g茶叶",
  leafStep2: "注入约160cc热水",
  leafStep3: "盖上盖子等待约90～120秒",
  leafStep4:
    "倒茶时要慢。分多杯时轮流少量注入，浓度会更均匀，大家能喝到同样味道。",
  leafBody:
    "深蒸茶茶叶较细，使用网眼较细的茶壶（深蒸茶壶）能更好品尝。",
  kyusuTitle: "深蒸茶壶的挑选",
  kyusuLi1:
    "容量：一般以200～300ml（2～3人份）为多。若常一人饮用，选150～200ml小壶更易控制水量、泡出好味。",
  kyusuLi2:
    "形状：建议选扁平或底宽的款式。细碎茶叶在壶底薄铺，热水分布均匀，鲜味更易萃出。",
  kyusuLi3:
    "材质：常滑烧、万古烧等含氧化铁较多的陶土，会与茶中单宁反应，减轻涩味、加深醇厚，与深蒸茶的浓郁很相配。",
  kyusuLi4:
    "滤网：深蒸茶易成粉状，普通茶壶易堵。请选用不锈钢网或深蒸专用的细目滤网。",
  mizudashiTitle: "冷泡茶做法",
  mizudashiNote:
    "参考：每1升水约茶叶10～15g（约2～3大匙）或茶包2～3个",
  mizudashiStep1: "将茶叶（或茶包）放入壶或瓶",
  mizudashiStep2: "注入1升水",
  mizudashiStep3: "放入冰箱静置2～6小时",
  mizudashiBody:
    "深蒸茶呈鲜绿与醇厚，焙茶则香而轻盈。冷泡茶请于当日饮用完毕。",
  powderReasonTitle: "藤八茶寮粉末绿茶受青睐的理由",
  powderReasonBody:
    "我们坚持使用优质伊势「深蒸茶」为原料，与一般粉末绿茶截然不同。一般粉末茶做成拿铁容易发暗，而藤八茶寮的粉末能呈现不逊于抹茶的香气与鲜绿拿铁。我们将深蒸茶特有的醇厚与鲜绿完整保留在粉末中。",
  latteTitle: "绿茶拿铁・焙茶拿铁",
  latteGreenTitle: "绿茶拿铁",
  latteGreenList: ["绿茶粉：3g", "热水：25～30ml", "牛奶：160cc", "砂糖：1小匙（可选）"],
  latteGreenBody: "用少量热水将粉末充分溶解，倒入温牛奶即可。",
  latteHojichaTitle: "焙茶拿铁",
  latteHojichaList: ["焙茶粉：3g", "热水：25～30ml", "牛奶：160cc", "砂糖：1小匙（可选）"],
  latteHojichaBody: "用少量热水将焙茶粉充分溶解，倒入温牛奶即可享用。",
  powderVsMatchaTitle: "粉末绿茶与抹茶的区别",
  powderWhatTitle: "何为粉末绿茶",
  powderWhatBody:
    "即平时用茶壶冲泡的「煎茶」直接研磨成粉。一般粉末茶没有抹茶特有的香气，做成拿铁容易发暗，但日常使用方便，能完整摄取茶叶营养。因在阳光下生长，富含儿茶素。",
  matchaWhatTitle: "何为抹茶",
  matchaWhatBody:
    "抹茶原料为「碾茶」。采收前约20天用黑网等覆盖茶园进行「覆下栽培」，遮光以抑制鲜味成分（茶氨酸）转为涩味成分（儿茶素），从而形成抹茶特有的鲜绿与醇厚。",
  storageTitle: "茶的保存方法",
  storageIntro:
    "茶虽为干货，却是讲究「鲜度」的农产品。开封后与未开封时都注意保存，能更久保持香气与风味。",
  storageOpenTitle: "开封后保存",
  storageOpenList: [
    "避免放在气味强的食物（如咖啡、香料）附近",
    "装入密封袋或茶罐，避免接触空气",
    "存放于阴凉避光处",
  ],
  storageUnopenedTitle: "未开封长期保存",
  storageUnopenedList: [
    "冷藏或冷冻以保持鲜度",
    "开封前务必先回温至常温再开封，防止结露劣化",
  ],
  storageOutro:
    "建议开封后在约2周～1个月内饮用完毕。请随心情享受最合当下的一杯。",
  altTop: "茶时间",
  altTeaBag: "茶包冲泡的茶",
  altPot: "茶壶冲泡的茶",
  altWater: "冷泡茶",
  altGreenLatte: "绿茶拿铁",
  altHojichaLatte: "焙茶拿铁",
};

export const HOW_TO_BREW_TEXTS: Record<Locale, HowToBrewTexts> = {
  ja: JA,
  en: EN,
  ko: KO,
  zh: ZH,
};
