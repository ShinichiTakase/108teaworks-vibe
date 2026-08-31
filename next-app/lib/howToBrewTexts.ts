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
  /** トップページ絞り込みリンクのラベル（ティーバッグ・リーフ・深蒸し・水出し用TB・ラテ用パウダー） */
  productLinkTeabag: string;
  productLinkLeaf: string;
  productLinkFukamushi: string;
  productLinkMizudashiTeabag: string;
  productLinkLattePowder: string;
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
  productLinkTeabag: "ティーバッグ",
  productLinkLeaf: "リーフ（茶葉）",
  productLinkFukamushi: "深蒸し茶",
  productLinkMizudashiTeabag: "水出し茶用ティーバッグ",
  productLinkLattePowder: "ラテに使えるパウダー（粉茶）",
};


export const HOW_TO_BREW_TEXTS: HowToBrewTexts = JA;
