import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { PRIVACY_TEXTS } from "@/lib/privacyTexts";

type Props = {
  locale: Locale;
};

export default function PrivacyPolicyContent({ locale }: Props) {
  const t = PRIVACY_TEXTS[locale];

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="privacy-heading" className="mb-12">
          <h1
            id="privacy-heading"
            className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.intro}
          </p>

          {t.sections.map((sec, i) => (
            <div key={i}>
              <h2 className="mt-8 mb-3 text-base font-semibold text-tea-deep">
                {sec.title}
              </h2>
              {Array.isArray(sec.body) ? (
                <>
                  {sec.intro && (
                    <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {sec.intro}
                    </p>
                  )}
                  <ul className="mb-4 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {sec.body.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {sec.body}
                </p>
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
