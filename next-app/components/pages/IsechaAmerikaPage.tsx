import Image from "next/image";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";

const TEXTS: Record<
  Locale,
  {
    h1: string;
    altTeaGarden: string;
    altRanji: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
  }
> = {
  ja: {
    h1: "アメリカと伊勢茶",
    altTeaGarden:
      "19世紀末から20世紀初頭の日本風茶屋。西洋風のテーブルと椅子が並ぶ開放的な亭と、庭の石灯籠",
    altRanji:
      "明治期の日本茶輸出用「蘭字」ラベル。富士山と茶摘みの図、GARDEN GROWN JAPAN TEA 等の欧文",
    p1:
      "当店のルーツである高瀬藤八が、伊勢茶の輸出に情熱を傾けた幕末から明治。その挑戦の先には、まだ見ぬ異国・アメリカとの深い絆がありました。",
    p2:
      "開国間もない日本において、お茶は生糸と並び、国を支える最重要の輸出品でした。『日本茶業史』によれば、当時初めて海を渡った日本茶のそのほとんどが、実は伊勢の地で育まれたものだったと記されています。",
    p3:
      "今でこそ「アメリカといえばコーヒーや紅茶」というイメージがありますが、当時の情勢は少し異なりました。独立から100年ほど経ったアメリカにおいて、イギリスが権益を握る紅茶は非常に高価な「高嶺の花」。そこへ届いたのが、芳醇で健やかな伊勢茶でした。",
    p4:
      "安価で質の高い日本茶は、瞬く間にアメリカの人々の心を捉え、空前のブームを巻き起こします。ある旅行者の日記には、当時のニューヨークに1,500軒もの日本茶喫茶店が立ち並び、人々が砂糖やミルクを入れてその新しい味わいを楽しんでいた様子が生き生きと描かれています。アメリカの人々が人生で初めて日常的に親しんだ「お茶」は、実は紅茶ではなく、この伊勢茶だったのかもしれません。",
    p5:
      "また、その輸出を彩ったのが「蘭字（らんじ）」と呼ばれる美しいラベルです。浮世絵師が下絵を描き、彫師と刷師が仕上げた木版多色刷りの和紙は、日本の伝統技法と西洋のタイポグラフィが溶け合った、まさにグラフィックデザインの先駆け。その華やかな意匠は、海を越えた先でも芸術品として愛されました。",
    p6:
      "かつて遥か海を越え、異国の日常に彩りを添えた伊勢茶。その誇り高い歴史を、私たちは今も一服のお茶に込めて守り続けています",
  },
  en: {
    h1: "Ise Tea and America",
    altTeaGarden:
      "Late 19th–early 20th-century Japanese-style tea garden pavilion with Western café tables and a stone lantern",
    altRanji:
      "Meiji-era “Ranji” export label: Mount Fuji, tea pickers, and English lettering including “GARDEN GROWN JAPAN TEA”",
    p1:
      "Our shop’s roots lie with Takase Tōhachi, who poured his energy into exporting Ise tea from the late Edo through the Meiji era. Beyond that endeavour stretched a deep bond with a distant land: America.",
    p2:
      "In a Japan newly opened to the world, tea stood alongside raw silk among the nation’s most critical exports. According to the History of the Japanese Tea Industry, most of the Japanese tea that first crossed the ocean was in fact grown in the Ise region.",
    p3:
      "Today we picture America as coffee and black tea, but the situation then was different. A century after independence, black tea dominated by British interests was costly—a luxury few could afford. What arrived instead was fragrant, wholesome Ise tea.",
    p4:
      "Affordable, high-quality Japanese tea quickly won American hearts and sparked an extraordinary boom. One traveller’s diary vividly describes some 1,500 Japanese tea rooms lining New York, where people sweetened and milked this new taste. The “tea” Americans first took into daily life may not have been black tea at all, but Ise tea.",
    p5:
      "Colouring those exports were beautiful labels called ranji. Woodblock polychrome prints on Japanese paper—designs from ukiyo-e artists, carved and printed by specialists—merged traditional craft with Western typography, pioneering graphic design in its own right. Those vivid designs were cherished as art overseas.",
    p6:
      "Ise tea once crossed the ocean to brighten everyday life in another country. We still honour that proud history in every cup we serve.",
  },
  ko: {
    h1: "미국과 이세차",
    altTeaGarden:
      "19세기 말~20세기 초 일본식 찻집 정자와 서양식 테이블·의자, 돌 등롱이 보이는 역사 사진",
    altRanji:
      "메이지 시대 일본차 수출용 ‘란지’ 라벨. 후지산과 다줍기, GARDEN GROWN JAPAN TEA 등 영문 표기",
    p1:
      "당점의 뿌리인 다카세 토하치가 막말에서 메이지에 걸쳐 이세차 수출에 열정을 쏟았습니다. 그 도전 너머에는 아직 보지 못한 이국, 미국과의 깊은 인연이 있었습니다.",
    p2:
      "개국 직후의 일본에서 차는 생사와 나란히 나라를 떠받치는 최중요 수출품이었습니다. 『일본차업사』에 따르면, 당시 처음 바다를 건넌 일본차 대부분이 사실은 이세 땅에서 자란 것으로 기록되어 있습니다.",
    p3:
      "지금은 ‘미국 하면 커피와 홍차’라는 이미지가 있지만, 당시는 조금 달랐습니다. 독립 100년쯤 지난 미국에서 영국의 이권이 깔린 홍차는 매우 비싼 ‘꽃 중의 꽃’. 그곳에 도착한 것이 향기롭고 건강한 이세차였습니다.",
    p4:
      "저렴하면서 질 좋은 일본차는 순식간에 미국 사람들의 마음을 사로잡고 전무후무한 붐을 일으켰습니다. 어떤 여행자의 일기에는 당시 뉴욕에 1,500곳이나 되는 일본차 찻집이 늘어서 사람들이 설탕과 우유를 넣어 새로운 맛을 즐기던 모습이 생생히 그려져 있습니다. 미국인이 인생에서 처음 일상적으로 사랑한 ‘차’는 사실 홍차가 아니라 이 이세차였을지도 모릅니다.",
    p5:
      "그 수출을 빛낸 것이 ‘란지(蘭字)’라 불리는 아름다운 라벨입니다. 우키요에 화가가 초안을 그리고 목판으로 다색 인쇄한 화선지는 일본 전통 기법과 서양 타이포그래피가 어우러진, 그야말로 그래픽 디자인의 선구. 화려한 의장은 바다를 건넌 뒤에도 예술품으로 사랑받았습니다.",
    p6:
      "먼 바다를 건너 이국의 일상에 색채를 더했던 이세차. 그 자랑스러운 역사를 우리는 지금도 한 잔의 차에 담아 이어 가고 있습니다.",
  },
  zh: {
    h1: "美国与伊势茶",
    altTeaGarden:
      "十九世纪末至二十世纪初的日本式茶庭与凉亭，内摆西式桌椅，前景有石灯笼",
    altRanji:
      "明治时期日本茶外销「兰字」标签：富士山、采茶图与英文 GARDEN GROWN JAPAN TEA 等字样",
    p1:
      "本店渊源所自的高濑藤八，自幕末至明治倾心于伊势茶出口。在那番挑战的前方，是与尚属陌生的国度——美国之间深厚的缘分。",
    p2:
      "在刚开国的日本，茶叶与生丝并列，是支撑国家最重要的出口品之一。据《日本茶业史》记载，当时首度漂洋过海的日本茶，绝大多数其实孕育于伊势这片土地。",
    p3:
      "如今人们常以为「美国就是咖啡与红茶」，但当时的局面略有不同。独立约百年之际，由英国掌控利益的红茶在美国极为昂贵，犹如高岭之花。而抵达彼处的，正是芳醇而健康的伊势茶。",
    p4:
      "价廉质优的日本茶迅速俘获美国民众的心，掀起空前热潮。一位旅行者的日记生动描绘：当时的纽约林立着约一千五百家日本茶茶馆，人们加糖加奶品尝这崭新的滋味。美国人人生中首度日常亲近的「茶」，或许并非红茶，而正是这伊势茶。",
    p5:
      "装点这些出口的，还有称为「兰字」的精美标签。浮世绘画稿经雕版、刷师以木版多色套印于和纸，融合日本传统与西文活字，堪称平面设计的先驱。那华丽的意匠跨海之后仍被当作艺术品珍爱。",
    p6:
      "伊势茶曾远渡重洋，为异国的日常增添色彩。这份值得骄傲的历史，我们至今仍倾注于每一杯茶中。",
  },
};

type Props = {
  locale: Locale;
};

export default function IsechaAmerikaPage({ locale }: Props) {
  const t = TEXTS[locale];

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <h1 className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep">
            {t.h1}
          </h1>

          <div className="mb-10 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10">
            <div className="order-2 min-w-0 text-left md:order-1">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.p1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.p2}
              </p>
            </div>
            <div className="order-1 flex justify-end md:order-2">
              <figure className="m-0 w-full max-w-md shrink-0 overflow-hidden rounded-md">
                <Image
                  src="/images/tea_garden.jpg"
                  alt={t.altTeaGarden}
                  width={1000}
                  height={712}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 28rem"
                />
              </figure>
            </div>
          </div>

          {/* 上段と同じ gap。左列は画像幅のみ（auto）で、ranji 右〜本文左の余白を tea_garden 左〜本文右に近づける */}
          <div className="mb-10 grid grid-cols-1 items-start gap-8 md:grid-cols-[auto_1fr] md:gap-x-10 md:gap-y-0">
            <figure className="order-2 m-0 w-full max-w-[19.2rem] shrink-0 overflow-hidden rounded-md md:order-1">
              <Image
                src="/images/ranji.jpg"
                alt={t.altRanji}
                width={512}
                height={614}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 85vw, 19.2rem"
              />
            </figure>
            <div className="order-1 min-w-0 text-left md:order-2">
              <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.p3}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.p4}
              </p>
            </div>
          </div>

          <div className="text-left">
            <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.p5}
            </p>
            <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t.p6}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
