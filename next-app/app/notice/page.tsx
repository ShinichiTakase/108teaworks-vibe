import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getNotices, bodyToExcerpt } from "@/lib/microcms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "お知らせ｜伊勢茶の藤八茶寮",
  description: "藤八茶寮からのお知らせ一覧です。",
};

const PER_PAGE = 10;

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

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NoticeListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PER_PAGE;

  const { contents, totalCount } = await getNotices(PER_PAGE, offset);
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="notice-heading" className="mb-10">
          <h1
            id="notice-heading"
            className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep"
          >
            お知らせ
          </h1>

          {contents.length === 0 ? (
            <p className="text-[0.9375rem] text-ink-muted">現在、お知らせはありません。</p>
          ) : (
            <ul className="list-none m-0 p-0 space-y-6">
              {contents.map((item) => {
                const slug = item.slug ?? item.id;
                const href = `/notice/${slug}`;
                const excerpt = bodyToExcerpt(item.body, 120);
                return (
                  <li key={item.id} className="border-b border-border pb-6 last:border-b-0">
                    <div className="mb-2">
                      <Link
                        href={href}
                        className="font-heading text-lg font-bold text-tea-deep no-underline hover:text-tea hover:underline underline-offset-2"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <div className="mb-2 inline-block rounded border border-border bg-washi px-3 py-1 text-left text-[0.8125rem] text-ink-muted">
                      {formatDate(item.publishedAt)}
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
              aria-label="お知らせのページネーション"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              {currentPage > 1 && (
                <Link
                  href={currentPage === 2 ? "/notice" : `/notice?page=${currentPage - 1}`}
                  className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                >
                  前へ
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
                      href={p === 1 ? "/notice" : `/notice?page=${p}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-border text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                    >
                      {p}
                    </Link>
                  )
                )}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/notice?page=${currentPage + 1}`}
                  className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                >
                  次へ
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
