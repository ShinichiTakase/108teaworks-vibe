import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getAllChapterMetas } from "@/lib/kabatadani";
import KabatadaniCoverSlideshow from "@/components/KabatadaniCoverSlideshow";

export async function generateMetadata() {
  const seo = getFixedSeo("/kabatadani_no_ocha", "ja");
  return {
    title: seo?.title ?? "伊勢茶発祥の地 川俣谷のお茶｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "伊勢茶発祥の地・川俣谷のお茶。鎌倉時代から続く伊勢茶の歴史をHTML版でお読みいただけます。",
    alternates: buildAlternatesForLocales("/kabatadani_no_ocha"),
  };
}

export default function KabatadaniNoOchaPage() {
  const chapters = getAllChapterMetas();

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/kabatadani_no_ocha", "ja")} />
      <div className={INNER_CLASS}>
        <section aria-labelledby="kabatadani-heading" className="mb-12">
          <h1
            id="kabatadani-heading"
            className="m-0 mb-1 font-heading text-xl font-semibold text-tea-deep"
          >
            伊勢茶発祥の地 川俣谷のお茶
          </h1>
          <p className="mb-6 text-[0.875rem] text-ink-muted">
            著：高瀬 孝二
          </p>

          {/* 表紙スライドショー */}
          <KabatadaniCoverSlideshow />

          {/* 目次 */}
          <nav aria-label="目次" className="mb-10">
            <h2 className="mb-4 text-[0.9375rem] font-semibold text-tea-deep">目次</h2>
            <ol className="space-y-1">
              {chapters.map((ch) => (
                <li key={ch.slug}>
                  <Link
                    href={`/kabatadani_no_ocha/${ch.slug}/`}
                    className="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink transition-colors hover:bg-washi hover:text-tea-deep"
                  >
                    <span className="shrink-0 text-[0.8125rem] text-ink-muted group-hover:text-tea-deep">
                      {ch.order === 0 ? "序" : ch.order >= 13 ? "付" : `${ch.order}`}
                    </span>
                    <span>{ch.shortTitle}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* 著者略歴 */}
          <div className="mx-auto mb-10 max-w-3xl rounded-md bg-washi px-4 py-3 text-[0.875rem] leading-relaxed text-ink-muted md:px-6 md:py-4">
            <h2 className="mt-0 mb-2 text-[0.9375rem] font-semibold text-tea-deep">
              【著者略歴】
            </h2>
            <p className="m-0">
              高瀬 孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。
              退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。
              令和６年 瑞宝双光章を受章。主な著書に「三重県茶業史」「川俣谷のお茶」「伊勢茶の歴史」がある。
            </p>
          </div>

          {/* PDFダウンロード */}
          <div className="mb-8 text-center">
            <a
              href="/pdf/kahadadani_no_ocha.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-tea-deep px-5 py-2 text-[0.875rem] text-tea-deep transition-colors hover:bg-tea-deep hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDFをダウンロードする
            </a>
          </div>

          {/* 次の章へ */}
          {chapters[0] && (
            <div className="border-t border-border pt-6 text-right">
              <Link
                href={`/kabatadani_no_ocha/${chapters[0].slug}/`}
                className="group inline-flex flex-col items-end gap-0.5"
              >
                <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                  次の章 ▶
                </span>
                <span className="text-[0.875rem] text-ink group-hover:text-tea-deep">
                  {chapters[0].shortTitle}
                </span>
              </Link>
            </div>
          )}
        </section>
        <PageEndProductList locale="ja" />
      </div>
    </main>
  );
}
