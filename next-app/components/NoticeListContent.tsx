import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getNotices, bodyToExcerpt } from "@/lib/microcms";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateManyForLocale } from "@/lib/translateForLocale";

const PER_PAGE = 10;

function formatDate(iso: string | undefined, locale: Locale): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const loc = locale === "ja" ? "ja-JP" : locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : "en-US";
    return d.toLocaleDateString(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function noticeBasePath(locale: Locale): string {
  return locale === "ja" ? "/notice" : `/${locale}/notice`;
}

function noticeDetailHref(locale: Locale, slug: string): string {
  return locale === "ja" ? `/notice/${slug}` : `/${locale}/notice/${slug}`;
}

type Props = {
  locale: Locale;
  page: number;
};

export default async function NoticeListContent({ locale, page }: Props) {
  const offset = (page - 1) * PER_PAGE;
  const { contents, totalCount } = await getNotices(PER_PAGE, offset);
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const t = COMMON_TEXTS[locale];
  const base = noticeBasePath(locale);

  const titles = contents.map((c) => c.title ?? "");
  const excerpts = contents.map((c) => bodyToExcerpt(c.body, 120) ?? "");
  const allTexts = [...titles, ...excerpts];
  const translatedAll =
    locale === "ja" ? allTexts : await translateManyForLocale(allTexts, locale);
  const translatedTitles = translatedAll.slice(0, contents.length);
  const translatedExcerpts = translatedAll.slice(contents.length);

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="notice-heading" className="mb-10">
          <h1
            id="notice-heading"
            className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.notice.title}
          </h1>

          {contents.length === 0 ? (
            <p className="text-[0.9375rem] text-ink-muted">{t.notice.empty}</p>
          ) : (
            <ul className="list-none m-0 p-0 space-y-6">
              {contents.map((item, idx) => {
                const slug = item.slug ?? item.id;
                const href = noticeDetailHref(locale, slug);
                const title = translatedTitles[idx] ?? item.title ?? "";
                const excerpt = translatedExcerpts[idx];
                return (
                  <li key={item.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="mb-2">
                      <Link
                        href={href}
                        className="font-heading text-lg font-bold text-tea-deep no-underline hover:text-tea hover:underline underline-offset-2"
                      >
                        {title}
                      </Link>
                    </div>
                    <div className="mb-2 inline-block rounded border border-border bg-washi px-3 py-1 text-left text-[0.8125rem] text-ink-muted">
                      {formatDate(item.publishedAt, locale)}
                    </div>
                    {excerpt && (
                      <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {excerpt}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <nav
              aria-label={t.pagination.noticeAria}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {currentPage > 1 && (
                <Link
                  href={currentPage === 2 ? base : `${base}?page=${currentPage - 1}`}
                  className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                >
                  {t.pagination.prev}
                </Link>
              )}
              <span className="flex items-center gap-2 px-2 text-[0.875rem] text-ink-muted">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                  p === currentPage ? (
                    <span
                      key={p}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-tea-deep bg-tea-deep/10 font-semibold text-tea-deep"
                      aria-current="page"
                    >
                      {p}
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={p === 1 ? base : `${base}?page=${p}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-border text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                    >
                      {p}
                    </Link>
                  )
                )}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`${base}?page=${currentPage + 1}`}
                  className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                >
                  {t.pagination.next}
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
