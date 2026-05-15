import { notFound } from "next/navigation";
import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import {
  getChapterBySlug,
  getAdjacentChapters,
  getAllChapterSlugs,
} from "@/lib/isecha_rekishi";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) return {};
  const path = `/isecha_no_rekishi/${params.slug}`;
  return {
    title: `${chapter.title}`,
    description: chapter.description,
    alternates: buildAlternatesForLocales(path),
  };
}

export default async function IsechaChapterPage({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(params.slug);
  const breadcrumbPath = `/isecha_no_rekishi/${params.slug}`;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems(breadcrumbPath, "ja", { productName: chapter.shortTitle })} />
      <div className={INNER_CLASS}>
        <article aria-labelledby="chapter-heading" className="mb-12">
          {/* パンくず */}
          <nav aria-label="パンくず" className="mb-6 text-[0.8125rem] text-ink-muted">
            <Link href="/isecha_no_rekishi/" className="hover:text-tea-deep hover:underline">
              伊勢茶の歴史
            </Link>
            <span className="mx-1.5">›</span>
            <span>{chapter.shortTitle}</span>
          </nav>

          {/* 前後ナビ（上） */}
          <nav
            aria-label="前後の章（上）"
            className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4"
          >
            <div className="min-w-0 flex-1">
              {prev ? (
                <Link
                  href={`/isecha_no_rekishi/${prev.slug}/`}
                  className="group flex flex-col gap-0.5 text-left"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    ◀ 前の章
                  </span>
                  <span className="truncate text-[0.875rem] text-ink group-hover:text-tea-deep">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <Link
              href="/isecha_no_rekishi/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/isecha_no_rekishi/${next.slug}/`}
                  className="group flex flex-col items-end gap-0.5"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    次の章 ▶
                  </span>
                  <span className="truncate text-[0.875rem] text-ink group-hover:text-tea-deep">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>

          {/* 本文（markdownのH1がページタイトルになる） */}
          {chapter.contentHtml.trim() ? (
            <div
              id="chapter-heading"
              className="prose prose-sm max-w-3xl
                prose-headings:font-heading prose-headings:text-tea-deep
                prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-8
                prose-h2:mt-10 prose-h3:mt-8
                prose-p:text-ink prose-p:leading-loose prose-p:my-4
                prose-a:text-tea-deep prose-a:underline-offset-4
                prose-strong:text-ink
                prose-li:text-ink prose-li:my-1
                prose-table:text-[0.8125rem] prose-th:text-ink prose-td:text-ink
                prose-hr:border-border prose-hr:my-8
                prose-img:mx-auto prose-img:rounded-md prose-img:shadow-sm prose-img:my-6
                [&_em]:text-[0.8125rem] [&_em]:text-ink-muted"
              dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
            />
          ) : (
            <p className="text-[0.9375rem] text-ink-muted">（本文準備中）</p>
          )}

          {/* 前後ナビ */}
          <nav
            aria-label="前後の章"
            className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6"
          >
            <div className="min-w-0 flex-1">
              {prev ? (
                <Link
                  href={`/isecha_no_rekishi/${prev.slug}/`}
                  className="group flex flex-col gap-0.5 text-left"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    ◀ 前の章
                  </span>
                  <span className="truncate text-[0.875rem] text-ink group-hover:text-tea-deep">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <Link
              href="/isecha_no_rekishi/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/isecha_no_rekishi/${next.slug}/`}
                  className="group flex flex-col items-end gap-0.5"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    次の章 ▶
                  </span>
                  <span className="truncate text-[0.875rem] text-ink group-hover:text-tea-deep">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>

          {/* PDFダウンロード */}
          <div className="mt-8 text-center">
            <a
              href="/pdf/isecha_no_rekishi.pdf"
              download
              className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-muted underline underline-offset-4 hover:text-tea-deep"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDFをダウンロードする
            </a>
          </div>
        </article>
        <PageEndProductList locale="ja" />
      </div>
    </main>
  );
}
