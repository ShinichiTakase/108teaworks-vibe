import Image from "next/image";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";

const TEXTS = {
  h1: "伊勢茶とアメリカ",
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
};

export default function IsechaAmericaPage() {
  const t = TEXTS;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav current="america" />
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
