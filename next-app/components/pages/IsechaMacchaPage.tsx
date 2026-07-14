import Image from "next/image";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { ISECHA_MACCHA_SECTIONS } from "@/lib/isechaMacchaContent";
import {
  ISECHA_MACCHA_IMAGE_GROUPS,
  type IsechaMacchaFigure,
} from "@/lib/isechaMacchaImages";

type Props = {
  locale: Locale;
};

function MacchaFigureBlock({
  fig,
  sizes,
  captionClassName = "mt-2 text-center text-[0.8125rem] leading-snug text-ink-muted",
}: {
  fig: IsechaMacchaFigure;
  sizes: string;
  captionClassName?: string;
}) {
  return (
    <figure className="m-0 min-w-0">
      <div className="overflow-hidden rounded-md bg-cream/40">
        <Image
          src={fig.src}
          alt={fig.alt}
          width={800}
          height={800}
          className="aspect-square h-auto w-full object-cover"
          sizes={sizes}
        />
      </div>
      <figcaption className={captionClassName}>{fig.caption}</figcaption>
    </figure>
  );
}

/**
 * スマホ（lg 未満）: 該当セクション本文の直後に表示。デスクトップは左カラムに同一画像あり。
 * 0=碾茶・深蒸し緑茶 / 1=抹茶・パウダー緑茶 / 3=緑茶アイス（「冷めても美味しい」節の後）
 */
const MACCHA_MOBILE_INSERT: Array<{
  sectionIndex: number;
  layout: "row2" | "center";
  groupIndex: number;
}> = [
  { sectionIndex: 0, layout: "row2", groupIndex: 0 },
  { sectionIndex: 1, layout: "row2", groupIndex: 1 },
  { sectionIndex: 3, layout: "center", groupIndex: 2 },
];

export default function IsechaMacchaPage({ locale }: Props) {
  const h1 = COMMON_TEXTS[locale].nav.isechaMaccha;

  function renderMobileInsert(sectionIndex: number) {
    const rule = MACCHA_MOBILE_INSERT.find((r) => r.sectionIndex === sectionIndex);
    if (!rule) return null;
    const group = ISECHA_MACCHA_IMAGE_GROUPS[rule.groupIndex];
    if (!group?.length) return null;

    if (rule.layout === "row2") {
      return (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:hidden">
          {group.map((fig) => (
            <MacchaFigureBlock
              key={fig.src}
              fig={fig}
              sizes="(max-width: 1024px) 44vw, 280px"
              captionClassName="mt-2 text-center text-[0.7rem] leading-snug text-ink-muted sm:text-[0.8125rem]"
            />
          ))}
        </div>
      );
    }

    return (
      <div className="mt-6 flex justify-center lg:hidden">
        <div className="w-full max-w-xs">
          {group.map((fig) => (
            <MacchaFigureBlock
              key={fig.src}
              fig={fig}
              sizes="(max-width: 1024px) min(100vw - 2rem, 20rem), 280px"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="maccha" />
          <h1 className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep">
            {h1}
          </h1>

          <section className="mb-8 rounded-lg border border-tea-light/60 bg-cream/30 p-4">
            <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              抹茶とパウダー緑茶は、どちらも同じ茶の木から生まれますが、原料と製法が異なります。
            </p>
            <p className="m-0 mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              抹茶は碾茶を挽いた粉、パウダー緑茶は煎茶を微粉末化した粉で、味わいと使いどころに違いがあります。
            </p>
            <p className="m-0 mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              飲み方や用途に合わせて選ぶことで、それぞれの魅力をよりはっきり楽しめます。
            </p>
          </section>

          <div className="grid grid-cols-1 items-start gap-8 text-left lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,280px)_1fr]">
            <aside className="hidden shrink-0 lg:sticky lg:top-24 lg:block lg:max-w-none">
              <div className="flex flex-col gap-6">
                {ISECHA_MACCHA_IMAGE_GROUPS.map((group, gi) => (
                  <div key={gi}>
                    {gi > 0 ? (
                      <div
                        className="mb-6 border-0 border-t border-tea-light/40 pt-6"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="flex flex-col gap-5">
                      {group.map((fig) => (
                        <MacchaFigureBlock
                          key={fig.src}
                          fig={fig}
                          sizes="(max-width: 1024px) min(100vw - 3rem, 24rem), 280px"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="min-w-0 max-w-3xl">
              <div className="space-y-8">
                {ISECHA_MACCHA_SECTIONS.map((section, i) => (
                  <section key={i}>
                    <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                      {section.heading}
                    </h2>
                    <div className="space-y-4">
                      {section.paragraphs.map((text, j) => (
                        <p
                          key={j}
                          className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted"
                        >
                          {text}
                        </p>
                      ))}
                    </div>
                    {renderMobileInsert(i)}
                  </section>
                ))}

                <section>
                  <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">抹茶とパウダー緑茶の比較表</h2>
                  <h3 className="m-0 mb-3 text-[0.95rem] font-semibold text-tea-deep">比較軸（原料・製法・味・栄養・用途・向く人）</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-[0.875rem] text-ink-muted">
                      <thead>
                        <tr className="bg-cream">
                          <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">比較軸</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">抹茶</th>
                          <th className="border border-border px-3 py-2 text-left font-semibold text-tea-deep">パウダー緑茶（藤八茶寮）</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-3 py-2">原料</td>
                          <td className="border border-border px-3 py-2">碾茶（てんちゃ）</td>
                          <td className="border border-border px-3 py-2">煎茶（せんちゃ）</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-3 py-2">栽培・製法</td>
                          <td className="border border-border px-3 py-2">覆下栽培の碾茶を挽いて仕上げる</td>
                          <td className="border border-border px-3 py-2">露地栽培の煎茶を微粉末化する</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-3 py-2">味の傾向</td>
                          <td className="border border-border px-3 py-2">まろやかな甘み</td>
                          <td className="border border-border px-3 py-2">甘みに加えて渋み・苦み・香りの広がり</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-3 py-2">栄養の取り入れ方</td>
                          <td className="border border-border px-3 py-2">粉を飲むため茶葉由来成分を取り入れやすい</td>
                          <td className="border border-border px-3 py-2">煎茶をまるごと粉末化し、茶葉由来成分を取り入れやすい</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-3 py-2">使いやすい用途</td>
                          <td className="border border-border px-3 py-2">点てて飲む、和菓子など</td>
                          <td className="border border-border px-3 py-2">ラテ、製菓、日常のドリンク</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-3 py-2">向く人</td>
                          <td className="border border-border px-3 py-2">抹茶らしい甘みや点て飲みを楽しみたい方</td>
                          <td className="border border-border px-3 py-2">お茶感のあるコクを料理や飲み物で活かしたい方</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">用途別の結論</h2>
                  <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">ラテ向き</h3>
                  <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                    ラテにしたときの「お茶感」を重視するなら、パウダー緑茶が向いています。
                    ミルクと合わせても渋みと香りの芯が残り、味の輪郭を保ちやすいのが特長です。
                  </p>
                  <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">製菓向き</h3>
                  <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                    焼き菓子やアイスなど、他の素材と合わせる場合は、仕上がりの方向性で選ぶのがおすすめです。
                    やわらかな甘みを活かしたいなら抹茶、香りとコクを前に出したいならパウダー緑茶が使いやすくなります。
                  </p>
                  <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">点て飲み向き</h3>
                  <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                    点てて味わう飲み方を中心に楽しむ場合は、抹茶が基本の選択肢です。
                    一方で、日常的に手軽に溶かして飲みたい場合は、パウダー緑茶の扱いやすさが活きます。
                  </p>
                </section>

                <section>
                  <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">よくある質問（FAQ）</h2>
                  <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">どちらが体に良いですか？</h3>
                  <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                    どちらも茶葉由来の成分を取り入れやすい点が魅力です。
                    「どちらが良いか」は一概に決めるより、日々の飲み方や続けやすさ、目的に合わせて選ぶのがおすすめです。
                  </p>
                  <h3 className="m-0 mb-2 text-[0.95rem] font-semibold text-tea-deep">ラテにはどちらが向いていますか？</h3>
                  <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                    ラテでは、ミルクに負けない風味の出しやすさから、パウダー緑茶が使いやすい場面が多いです。
                    やわらかな甘みを前面に出したい場合は抹茶、コクや香りの奥行きを重視する場合はパウダー緑茶が向いています。
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
