import Image from "next/image";
import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";

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
    cardTitle: string;
    cardBody: string;
    sec3Title: string;
    sec3P1: string;
    altKawamata: string;
    altField: string;
  }
> = {
  ja: {
    h1: "伊勢茶とは",
    intro:
      "伊勢茶は、三重県内で生産されるお茶の総称として親しまれているブランド名です。その歴史は古く、江戸時代には既に「伊勢国（現在の三重県）」の特産品として広く栽培されていました。現在では三重県全域が産地となっており、地域の豊かな風土がその深い味わいを育んでいます。",
    sec1Title: "伊勢茶発祥の地 川俣谷のお茶",
    sec1P1:
      "店主・高瀬晴香のの大叔父であり日本茶インストラクターリーダーである高瀬孝二の著書「伊勢茶発祥の地 川俣谷のお茶」がPDFで全文ご覧いただけるようになりました。",
    sec1P2:
      "伊勢茶発祥の地・川俣谷を舞台に、将軍への献上や明治の対米輸出を主導した先駆者たちの情熱と歩みを、日本茶インストラクターリーダーである著者が専門的知見から紐解きます。幻の手もみ技法から戦後の復活劇まで、一千年にわたる良質な伊勢茶の歴史を凝縮した、お茶のプロならではの視点が光る読み物です。古の伊勢商人が世界を夢見た軌跡をたどり、深蒸し茶の香りに隠された驚きの物語をぜひご覧ください。",
    sec1P3:
      "【著者略歴】高瀬 孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。令和６年 瑞宝双光章を受章。主な著書に「三重県茶業史」がある。",
    sec1LinkText: "伊勢茶発祥の地 川俣谷のお茶を読む",
    sec2Title1: "全国第3位を誇る「お茶どころ」",
    sec2P1:
      "三重県は静岡県・鹿児島県に次いで全国第3位の生産量を誇る日本有数の茶産地です。意外と知られていない事実ですが、日本のお茶の多くがここ三重県で支えられています。",
    sec2Title2: "伊勢茶の特徴「深蒸し茶の味わい」",
    sec2P2:
      "伊勢茶を代表する深蒸し茶は、茶の葉を深く蒸して茶葉の葉柄や軸などに多く含有するテアニンなど旨みの成分の浸出を容易にする製法で、旨みが濃くまろやかな味のお茶として全国の品評会で常に上位を独占しています。",
    cardTitle: "深蒸し茶",
    cardBody:
      "普通の煎茶が約30〜40秒ほど蒸すのに対し、深蒸し茶はその2〜4倍（約60〜180秒）の時間をかけて蒸します。この長い蒸し工程によって茶葉の細胞がより壊れ、渋みが抑えられ、まろやかで濃厚な味わいが生まれます。茶の水色（すいしょく）は、細かい茶葉が溶け込むことで濁りのある深い緑色になるのが特徴です。また、煎茶よりも低めの温度（70℃前後）で淹れると、甘みがより引き立ちます。",
    sec3Title: "伊勢茶の「味」が愛される理由：恵まれた風土と力強い茶葉",
    sec3P1:
      "三重県、とりわけ「南勢地域」は古くからお茶の栽培に最適な条件が奇跡的なバランスで整った場所です。この地域は、年間を通じて温暖な気候に恵まれ燦々と降り注ぐ日照時間が非常に長いのが特徴です。また宮川をはじめとする清流がもたらす適度な雨量と湿潤な空気がお茶の木を健やかに育て上げます。こうした厳しいながらも豊かな自然環境に耐え、養分をたっぷりと蓄えた茶葉は他産地にはない肉厚で力強い葉へと成長します。",
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
    cardTitle: "Fukamushi sencha",
    cardBody:
      "Whereas standard sencha is steamed for about 30–40 seconds, fukamushi is steamed for two to four times longer (about 60–180 seconds). This longer steaming breaks down the leaf cells more, reduces astringency, and produces a smooth, full-bodied taste. The liquor tends to be a deep, cloudy green because of the fine particles. Brewing at a slightly lower temperature (around 70°C) than usual brings out more sweetness.",
    sec3Title: "Why Ise tea tastes so good: climate and robust leaves",
    sec3P1:
      "Mie, especially the “Nansei” area, has long had conditions that are remarkably well suited to tea. The region enjoys a mild climate and very long hours of sunshine. Rivers such as the Miyagawa provide ample rain and humidity, which keep the tea plants healthy. The leaves that grow in this demanding but fertile environment store plenty of nutrients and develop a thickness and strength rarely found elsewhere.",
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
    cardTitle: "후카무시차",
    cardBody:
      "일반 녹차가 약 30~40초 정도 찌는 데 비해, 후카무시차는 그 2~4배(약 60~180초)의 시간을 두고 쪄냅니다. 이 긴 찌는 공정으로 찻잎 세포가 더 파괴되어 떫은맛이 억제되고, 부드럽고 진한 맛이 납니다. 차의 수색은 가는 찻잎이 녹아들어 흐린 듯한 진한 녹색이 되는 것이 특징입니다. 또한 녹차보다 낮은 온도(70℃ 전후)로 우리면 단맛이 더 돋보입니다.",
    sec3Title: "이세차 「맛」이 사랑받는 이유: 풍요로운 풍토와 강인한 찻잎",
    sec3P1:
      "미에현, 특히 「난세이 지역」은 예로부터 차 재배에 최적의 조건이 기적적인 균형으로 갖춰진 곳입니다. 이 지역은 일년 내내 따뜻한 기후와 강렬한 일조 시간이 매우 긴 것이 특징입니다. 또한 미야강을 비롯한 맑은 물이 가져다주는 적당한 강수량과 습한 공기가 차나무를 건강하게 키웁니다. 이런 가혹하면서도 풍요로운 자연 환경에 견디며 영양을 가득 축적한 찻잎은 다른 산지에는 없는 두껍고 강인한 잎으로 자랍니다.",
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
    cardTitle: "深蒸茶",
    cardBody:
      "普通煎茶约蒸30～40秒，而深蒸茶则需2～4倍时间（约60～180秒）。长时间蒸制使茶叶细胞更充分破裂，涩味减轻，形成醇厚浓郁的口感。茶汤因细碎茶叶溶出而呈带浊的深绿色。用略低于煎茶的温度（约70℃）冲泡，甜味更突出。",
    sec3Title: "伊势茶「味」受喜爱的理由：得天独厚的风土与强韧茶芽",
    sec3P1:
      "三重县，尤其是「南势地区」，自古以来就是茶栽培条件奇迹般均衡的地方。该地区全年气候温暖、日照时间长，宫川等清流带来适度的雨量与湿润空气，滋养茶树。在这样的严酷而丰饶的自然环境中，蓄满养分的茶芽生长为他处少有的厚实强韧的叶片。",
    altKawamata: "伊势茶发祥地 川俣谷",
    altField: "深蒸茶茶园",
  },
};

function kabatadaniHref(locale: Locale): string {
  return locale === "ja" ? "/kabatadani_no_ocha" : `/${locale}/kabatadani_no_ocha`;
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
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.sec2P2}
              </p>
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
          </div>
        </section>
      </div>
    </main>
  );
}
