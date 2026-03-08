import Link from "next/link";
import { getNotices, bodyToExcerpt } from "@/lib/microcms";

const DISPLAY_LIMIT = 4;

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function NewsList() {
  const { contents } = await getNotices(DISPLAY_LIMIT, 0);

  return (
    <section
      className="mb-12"
      id="news"
      aria-labelledby="news-heading"
      aria-label="お知らせ一覧"
    >
      <h2
        id="news-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        最新のお知らせ
      </h2>
      {contents.length === 0 ? (
        <p className="text-[0.9375rem] text-ink-muted m-0">お知らせはありません。</p>
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contents.map((item) => {
            const href = `/notice/${item.slug ?? item.id}`;
            const excerpt = bodyToExcerpt(item.body, 120);
            return (
              <li key={item.id} className="m-0">
                <Link
                  href={href}
                  className="flex flex-col h-full p-4 rounded border border-border bg-washi no-underline text-ink transition-colors hover:text-tea-deep hover:border-tea"
                >
                  <span className="order-1 block font-bold text-[0.9375rem] leading-snug mb-1">
                    {item.title}
                  </span>
                  <span className="order-2 block text-[0.8125rem] text-ink-muted text-right mb-2">
                    {formatDate(item.publishedAt)}
                  </span>
                  <p className="order-3 flex-1 m-0 mb-1 text-sm text-ink-muted leading-relaxed line-clamp-5">
                    {excerpt || " "}
                  </p>
                  <span className="order-4 block text-[0.8125rem] text-tea text-right">
                    …もっと読む
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
