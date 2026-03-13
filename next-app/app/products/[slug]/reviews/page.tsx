import Link from "next/link";
import { notFound } from "next/navigation";
import { loadReviewsForSlug } from "@/lib/reviewsStorage";
import { formatReviewDate } from "@/lib/reviewDisplay";
import type { Locale } from "@/lib/i18n";

type Props = {
  params: { slug: string };
  searchParams?: { page?: string };
};

const PER_PAGE = 20;

export const dynamic = "force-dynamic";

export default async function ProductReviewsPage({ params, searchParams }: Props) {
  const slug = params.slug;
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);

  const all = await loadReviewsForSlug(slug);
  if (!all.length) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const slice = all.slice(start, start + PER_PAGE);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="m-0 mb-4 text-xl font-semibold text-tea-deep">レビュー一覧</h1>
      <p className="m-0 mb-6 text-[0.9375rem] text-ink-muted">
        全 {all.length} 件中 {start + 1}〜{Math.min(start + PER_PAGE, all.length)} 件を表示
      </p>
      <ul className="m-0 p-0 list-none space-y-4">
        {slice.map((r, idx) => (
          <li key={idx} className="border border-border rounded-xl p-4 bg-washi">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-tea-deep">
                <span className="shrink-0 w-5 h-5 text-ink-muted" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </span>
                {r.nickname}
              </span>
              <span className="text-[0.875rem] text-amber-500" aria-label={`評価 ${r.rating} / 5`}>
                {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
              </span>
            </div>
            <p className="m-0 mb-1 text-[0.875rem] text-ink leading-relaxed whitespace-pre-wrap">
              {r.review}
            </p>
            <p className="m-0 text-[0.75rem] text-ink-muted">
              {formatReviewDate(r.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3 text-[0.875rem]">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="px-3 py-1 rounded border border-border text-ink hover:bg-washi"
            >
              前へ
            </Link>
          )}
          <span>
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`?page=${page + 1}`}
              className="px-3 py-1 rounded border border-border text-ink hover:bg-washi"
            >
              次へ
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}

