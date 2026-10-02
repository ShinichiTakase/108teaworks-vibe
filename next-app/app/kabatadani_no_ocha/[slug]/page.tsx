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
} from "@/lib/kabatadani";

type Props = { params: { slug: string } };

const CONTEXT_LINKS: Record<string, { href: string; label: string }[]> = {
  hajimeni: [{ href: "/ise-cha/", label: "現在の伊勢茶の種類と川俣谷産の商品を見る" }],
  chapter1: [{ href: "/ise-cha/", label: "川俣谷で育つ伊勢茶の特徴を見る" }],
  chapter11: [
    { href: "/ise-cha/fukamushi/", label: "深蒸し茶の製法・味わいと商品カテゴリーを見る" },
    { href: "/ise-cha/fukamushi-lp/", label: "深蒸し茶の水出し・氷出しの淹れ方を見る" },
  ],
};

export async function generateStaticParams() {
  return getAllChapterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) return {};
  const path = `/kabatadani_no_ocha/${params.slug}`;
  return {
    title: `${chapter.title}｜川俣谷のお茶｜伊勢茶の藤八茶寮`,
    description: chapter.description,
    alternates: buildAlternatesForLocales(path),
  };
}

export default async function KabatadaniChapterPage({ params }: Props) {
  const chapter = await getChapterBySlug(params.slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(params.slug);
  const contextLinks = CONTEXT_LINKS[params.slug] ?? [];
  const breadcrumbPath = `/kabatadani_no_ocha/${params.slug}`;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems(breadcrumbPath, { productName: chapter.shortTitle })} />
      <div className={INNER_CLASS}>
        <article aria-labelledby="chapter-heading" className="mb-12">
          {/* パンくず */}
          <nav aria-label="パンくず" className="mb-6 text-[0.8125rem] text-ink-muted">
            <Link href="/kabatadani_no_ocha/" className="hover:text-tea-deep hover:underline">
              川俣谷のお茶
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
                  href={`/kabatadani_no_ocha/${prev.slug}/`}
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
              href="/kabatadani_no_ocha/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/kabatadani_no_ocha/${next.slug}/`}
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

          {contextLinks.length > 0 && (
            <aside className="mt-10 rounded-lg border border-tea-light/60 bg-cream/30 px-4 py-4" aria-label="関連する伊勢茶の案内">
              <p className="m-0 mb-2 text-[0.9375rem] font-semibold text-tea-deep">本文に関連する伊勢茶の案内</p>
              <ul className="m-0 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {contextLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-tea underline underline-offset-2">{link.label}</Link></li>)}
              </ul>
            </aside>
          )}

          {/* 前後ナビ */}
          <nav
            aria-label="前後の章"
            className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6"
          >
            <div className="min-w-0 flex-1">
              {prev ? (
                <Link
                  href={`/kabatadani_no_ocha/${prev.slug}/`}
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
              href="/kabatadani_no_ocha/"
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[0.8125rem] text-ink-muted hover:border-tea-deep hover:text-tea-deep"
            >
              目次
            </Link>

            <div className="min-w-0 flex-1 text-right">
              {next ? (
                <Link
                  href={`/kabatadani_no_ocha/${next.slug}/`}
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
              href="/pdf/kahadadani_no_ocha.pdf"
              download
              className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-muted underline underline-offset-4 hover:text-tea-deep"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDFをダウンロードする
            </a>
          </div>
        </article>
        <PageEndProductList />
      </div>
    </main>
  );
}
