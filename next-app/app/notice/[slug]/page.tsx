import Link from "next/link";
import { notFound } from "next/navigation";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getNoticeBySlug, getNoticeById, decodeHtmlEntities, repairMalformedHrefs } from "@/lib/microcms";

export const dynamic = "force-dynamic";

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
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  let notice = await getNoticeBySlug(slug);
  if (!notice) notice = await getNoticeById(slug);
  if (!notice) return { title: "お知らせ｜伊勢茶の藤八茶寮" };
  return {
    title: `${notice.title}｜お知らせ｜伊勢茶の藤八茶寮`,
    description: notice.title,
  };
}

export default async function NoticeDetailPage({ params }: Props) {
  const { slug } = await params;
  let notice = await getNoticeBySlug(slug);
  if (!notice) notice = await getNoticeById(slug);
  if (!notice) notFound();

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-10">
          <header className="mb-6">
            <h1 className="m-0 mb-3 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
              {notice.title}
            </h1>
            <div className="inline-block rounded border border-border bg-washi px-3 py-1 text-left text-[0.8125rem] text-ink-muted">
              {formatDate(notice.publishedAt)}
            </div>
          </header>
          {notice.body && (
            <div
              className="notice-body text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:no-underline [&_a:hover]:text-tea-deep [&_a:hover]:underline [&_img]:max-w-full [&_img]:h-auto [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: repairMalformedHrefs(decodeHtmlEntities(notice.body)) }}
            />
          )}
          <p className="mt-6">
            <Link
              href="/notice"
              className="text-[0.9375rem] text-tea no-underline hover:text-tea-deep hover:underline"
            >
              ← お知らせ一覧へ
            </Link>
          </p>
        </article>
      </div>
    </main>
  );
}
