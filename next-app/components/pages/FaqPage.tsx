import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import FaqJsonLd from "@/components/FaqJsonLd";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { FAQ_CATEGORIES, FAQ_FLAT_ITEMS, FAQ_H1, FAQ_INTRO } from "@/lib/faqTexts";
import { SITE_BASE_URL } from "@/lib/siteConstants";

export default function FaqPage() {
  const canonicalUrl = `${SITE_BASE_URL}/faq/`;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <ArticleJsonLd
        headline={FAQ_H1}
        description={FAQ_INTRO}
        imageUrl="/images/Organization.png"
        canonicalUrl={canonicalUrl}
        inLanguage="ja"
      />
      <FaqJsonLd questions={FAQ_FLAT_ITEMS} />
      <BreadcrumbListSchema items={getBreadcrumbItems("/faq")} />
      <div className={INNER_CLASS}>
        <article className="mb-12">
          <h1
            id="faq-heading"
            className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep md:text-2xl"
          >
            {FAQ_H1}
          </h1>
          <p className="mb-10 text-[0.9375rem] leading-relaxed text-ink-muted">{FAQ_INTRO}</p>

          <nav aria-label="FAQカテゴリー" className="mb-10">
            <ul className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((category, i) => (
                <li key={i}>
                  <a
                    href={`#faq-category-${i}`}
                    className="inline-block rounded-full border border-tea-light bg-washi px-3 py-1.5 text-[0.8125rem] font-medium text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream"
                  >
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {FAQ_CATEGORIES.map((category, i) => (
              <section key={i} id={`faq-category-${i}`} aria-labelledby={`faq-category-${i}-heading`}>
                <h2
                  id={`faq-category-${i}-heading`}
                  className="m-0 mb-4 text-lg font-semibold text-tea-deep"
                >
                  {category.title}
                </h2>
                <dl className="space-y-0 divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {category.items.map(({ q, a }, j) => (
                    <details key={j} className="group bg-washi open:bg-white">
                      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                        <dt className="flex-1 text-[0.9375rem] font-semibold text-tea-deep leading-relaxed">
                          <span className="mr-2 text-tea">Q.</span>
                          {q}
                        </dt>
                        <span
                          className="mt-0.5 shrink-0 text-tea-deep/50 transition-transform group-open:rotate-180"
                          aria-hidden
                        >
                          ▾
                        </span>
                      </summary>
                      <dd className="m-0 px-4 pb-4 pt-1">
                        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                          <span className="mr-2 font-semibold text-tea-deep/70">A.</span>
                          {a}
                        </p>
                      </dd>
                    </details>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
