import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { getAllChapterMetas } from "@/lib/mie_chagyo_shi";

export async function generateMetadata() {
  return {
    title: "目次｜三重県茶業史｜伊勢茶の藤八茶寮",
    description:
      "三重県茶業会議所設立50周年記念として刊行された「三重県茶業史」。平安時代から平成に至る伊勢茶の歴史を章別にHTMLでお読みいただけます。",
    alternates: buildAlternatesForLocales("/mie_chagyo_shi/toc"),
  };
}

export default function MieChaGyoShiTocPage() {
  const chapters = getAllChapterMetas();

  const cover      = chapters.find((c) => c.order === -1)!;
  const preface    = chapters.find((c) => c.order === 0)!;
  const ch01Secs   = chapters.filter((c) => c.order >= 1 && c.order <= 3);
  const mainChaps  = chapters.filter((c) => c.order >= 4);

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/mie_chagyo_shi/toc")} />
      <div className={INNER_CLASS}>
        <section aria-labelledby="mie-chagyo-heading" className="mb-12">
          <h1
            id="mie-chagyo-heading"
            className="m-0 mb-1 font-heading text-xl font-semibold text-tea-deep"
          >
            三重県茶業史
          </h1>
          {/* 目次 */}
          <nav aria-label="目次" className="mb-10 mt-4">
            <h2 className="mb-4 text-[0.9375rem] font-semibold text-tea-deep">目次</h2>
            <ol className="space-y-1">
              {/* 表紙 */}
              <li>
                <Link
                  href={`/mie_chagyo_shi/${cover.slug}/`}
                  className="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink transition-colors hover:bg-washi hover:text-tea-deep"
                >
                  <span>{cover.shortTitle}</span>
                </Link>
              </li>

              {/* 序 */}
              <li>
                <Link
                  href={`/mie_chagyo_shi/${preface.slug}/`}
                  className="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink transition-colors hover:bg-washi hover:text-tea-deep"
                >
                  <span className="shrink-0 text-[0.8125rem] text-ink-muted group-hover:text-tea-deep">序</span>
                  <span>{preface.shortTitle}</span>
                </Link>
              </li>

              {/* 第一章（節をインデント表示） */}
              <li>
                <span className="flex items-baseline gap-2 px-3 py-2 text-[0.9375rem] font-semibold text-tea-deep">
                  第一章　三重県茶業の沿革
                </span>
                <ol className="ml-6 space-y-0.5">
                  {ch01Secs.map((sec) => (
                    <li key={sec.slug}>
                      <Link
                        href={`/mie_chagyo_shi/${sec.slug}/`}
                        className="group flex items-baseline gap-2 rounded-md px-3 py-1.5 text-[0.9375rem] text-ink transition-colors hover:bg-washi hover:text-tea-deep"
                      >
                        <span>{sec.shortTitle}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </li>

              {/* 第二章〜第十章 */}
              {mainChaps.map((ch) => (
                <li key={ch.slug}>
                  <Link
                    href={`/mie_chagyo_shi/${ch.slug}/`}
                    className="group flex items-baseline gap-2 rounded-md px-3 py-2 text-[0.9375rem] text-ink transition-colors hover:bg-washi hover:text-tea-deep"
                  >
                    <span>{ch.shortTitle}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* 次の章へ */}
          {preface && (
            <div className="border-t border-border pt-6 text-right">
              <Link
                href={`/mie_chagyo_shi/${preface.slug}/`}
                className="group inline-flex flex-col items-end gap-0.5"
              >
                <span className="text-[0.75rem] text-ink-muted group-hover:text-tea-deep">
                  読み始める ▶
                </span>
                <span className="text-[0.875rem] text-ink group-hover:text-tea-deep">
                  {preface.shortTitle}
                </span>
              </Link>
            </div>
          )}
        </section>
        <PageEndProductList />
      </div>
    </main>
  );
}
