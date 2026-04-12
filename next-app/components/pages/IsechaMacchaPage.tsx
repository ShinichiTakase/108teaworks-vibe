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
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
