import { notFound } from "next/navigation";
import Link from "next/link";
import { MAIN_CLASS as SHARED_MAIN_CLASS, INNER_CLASS as SHARED_INNER_CLASS } from "@/components/Layout";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import {
  getChapterBySlug,
  getAdjacentChapters,
  getAllChapterSlugs,
} from "@/lib/mie_chagyo_shi";

// スマホでの読了体験を優先し、本文表示幅をサイト共通レイアウトより広く取る
const MAIN_CLASS = SHARED_MAIN_CLASS.replace("px-4", "px-2 sm:px-4");
const INNER_CLASS = SHARED_INNER_CLASS.replace("w-[90%]", "w-full sm:w-[90%]");

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) return {};
  const path = `/mie_chagyo_shi/${params.slug}`;
  return {
    title: `${chapter.shortTitle}｜三重県茶業史｜伊勢茶の藤八茶寮`,
    description: chapter.description,
    alternates: buildAlternatesForLocales(path),
  };
}

export default async function MieChaGyoShiChapterPage({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(params.slug);
  const breadcrumbPath = `/mie_chagyo_shi/${params.slug}`;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema
        items={getBreadcrumbItems(breadcrumbPath, { productName: chapter.shortTitle })}
      />
      <div className={INNER_CLASS}>
        <article aria-labelledby="chapter-heading" className="mb-12">
          {/* パンくず */}
          <nav aria-label="パンくず" className="mb-6 hidden text-[0.8125rem] text-ink-muted sm:block">
            <Link
              href="/mie_chagyo_shi/toc/"
              className="hover:text-tea-deep hover:underline"
            >
              三重県茶業史
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
                  href={`/mie_chagyo_shi/${prev.slug}/`}
                  className="group flex flex-col gap-0.5 text-left"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    ◀ 前の章
                  </span>
                  <span className="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <Link
              href="/mie_chagyo_shi/toc/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/mie_chagyo_shi/${next.slug}/`}
                  className="group flex flex-col items-end gap-0.5"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    次の章 ▶
                  </span>
                  <span className="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>

          {/* 本文 */}
          {chapter.contentHtml.trim() ? (
            <div
              id="chapter-heading"
              className="prose prose-sm max-w-3xl
                prose-headings:font-heading prose-headings:text-tea-deep
                prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-8
                prose-h2:mt-10 prose-h2:text-lg
                prose-h3:mt-8 prose-h3:text-base
                prose-p:text-ink prose-p:leading-loose prose-p:my-4
                prose-a:text-tea-deep prose-a:underline-offset-4
                prose-strong:text-ink
                prose-li:text-ink prose-li:my-1
                prose-table:text-[0.8125rem] prose-th:text-ink prose-th:bg-washi prose-td:text-ink
                prose-hr:border-border prose-hr:my-8
                prose-img:mx-auto prose-img:rounded-md prose-img:shadow-sm prose-img:my-6 prose-img:max-w-full
                [&_em]:text-[0.8125rem] [&_em]:text-ink-muted"
              dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
            />
          ) : (
            <p className="text-[0.9375rem] text-ink-muted">（本文準備中）</p>
          )}

          {/* 前後ナビ（下） */}
          <nav
            aria-label="前後の章"
            className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6"
          >
            <div className="min-w-0 flex-1">
              {prev ? (
                <Link
                  href={`/mie_chagyo_shi/${prev.slug}/`}
                  className="group flex flex-col gap-0.5 text-left"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    ◀ 前の章
                  </span>
                  <span className="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">
                    {prev.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <Link
              href="/mie_chagyo_shi/toc/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/mie_chagyo_shi/${next.slug}/`}
                  className="group flex flex-col items-end gap-0.5"
                >
                  <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                    次の章 ▶
                  </span>
                  <span className="hidden truncate text-[0.875rem] text-ink group-hover:text-tea-deep sm:block">
                    {next.shortTitle}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>
        </article>
        <PageEndProductList />
      </div>
    </main>
  );
}
