import Link from "next/link";
import { getNotices, bodyToExcerpt, stripHtml } from "@/lib/microcms";
import { HOME_NEWS_TEXTS } from "@/lib/homeSectionTexts";
import { formatDateByLocale } from "@/lib/formatters";
import { buildHref } from "@/lib/urlPath";

const DISPLAY_LIMIT = 4;

function noticeHref(slug: string, id: string): string {
  return buildHref(`/notice/${slug || id}`);
}

export default async function NewsList() {
  const { contents } = await getNotices(DISPLAY_LIMIT, 0);
  const t = HOME_NEWS_TEXTS;

  return (
    <section
      className="mb-12"
      id="news"
      aria-labelledby="news-heading"
      aria-label={t.sectionAria}
    >
      <h2
        id="news-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        {t.heading}
      </h2>
      {contents.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-muted m-0">{t.empty}</p>
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contents.map((item) => {
            const href = noticeHref(item.slug ?? "", item.id);
            const excerpt = bodyToExcerpt(item.body, 120);
            const displayDate = item.date ?? item.publishedAt;
            return (
              <li key={item.id} className="m-0">
                <Link
                  href={href}
                  className="flex flex-col h-full p-4 rounded border border-border bg-washi no-underline text-ink transition-colors hover:text-tea-deep hover:border-tea"
                >
                  <span className="order-1 block font-bold text-[0.9375rem] leading-snug mb-1">
                    {stripHtml(item.title)}
                  </span>
                  <span className="order-2 block text-[0.8125rem] text-ink-muted text-right mb-2">
                    {formatDateByLocale(displayDate)}
                  </span>
                  <p className="order-3 flex-1 m-0 mb-1 text-sm text-ink-muted leading-relaxed line-clamp-5">
                    {excerpt || " "}
                  </p>
                  <span className="order-4 block text-[0.8125rem] text-tea text-right">
                    {t.readMore}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
