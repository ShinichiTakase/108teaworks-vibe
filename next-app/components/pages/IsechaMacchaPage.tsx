import Image from "next/image";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { ISECHA_MACCHA_SECTIONS } from "@/lib/isechaMacchaContent";
import { ISECHA_MACCHA_IMAGE_GROUPS } from "@/lib/isechaMacchaImages";

type Props = {
  locale: Locale;
};

export default function IsechaMacchaPage({ locale }: Props) {
  const h1 = COMMON_TEXTS[locale].nav.isechaMaccha;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <IsechaSubNav locale={locale} current="maccha" />
          <h1 className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep">
            {h1}
          </h1>

          <div className="grid grid-cols-1 items-start gap-8 text-left lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,280px)_1fr]">
            <aside className="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:max-w-none lg:sticky lg:top-24">
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
                        <figure key={fig.src} className="m-0">
                          <div className="overflow-hidden rounded-md bg-cream/40">
                            <Image
                              src={fig.src}
                              alt={fig.alt}
                              width={800}
                              height={800}
                              className="aspect-square h-auto w-full object-cover"
                              sizes="(max-width: 1024px) min(100vw - 3rem, 24rem), 280px"
                            />
                          </div>
                          <figcaption className="mt-2 text-center text-[0.8125rem] leading-snug text-ink-muted">
                            {fig.caption}
                          </figcaption>
                        </figure>
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
