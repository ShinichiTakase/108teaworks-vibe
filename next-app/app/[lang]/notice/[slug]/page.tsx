import Link from "next/link";
import { notFound } from "next/navigation";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { getNoticeBySlug, getNoticeById, prepareBodyForDetail, stripHtml } from "@/lib/microcms";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { translateForLocale } from "@/lib/translateForLocale";
import { buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SUPPORTED: Locale[] = ["ja", "en", "ko", "zh"];

function formatDate(iso: string | undefined, locale: Locale): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const loc = locale === "ja" ? "ja-JP" : locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : "en-US";
    return d.toLocaleDateString(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function noticeListHref(locale: Locale): string {
  return locale === "ja" ? "/notice" : `/${locale}/notice`;
}

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  let notice = await getNoticeBySlug(slug);
  if (!notice) notice = await getNoticeById(slug);
  if (!notice) {
    return {
      title: COMMON_TEXTS[locale].notice.title,
      alternates: buildAlternatesForLocales(`/notice/${slug}`),
    };
  }
  const baseTitle = stripHtml(notice.title);
  const title =
    locale === "ja" ? baseTitle : await translateForLocale(baseTitle ?? "", locale);
  const raw = (notice.body ?? notice.title ?? "").replace(/<[^>]+>/g, "");
  const desc =
    locale === "ja" ? raw.slice(0, 160) : (await translateForLocale(raw.slice(0, 400), locale)).slice(0, 160);
  return {
    title: `${title}｜${COMMON_TEXTS[locale].notice.title}`,
    description: desc,
    alternates: buildAlternatesForLocales(`/notice/${notice.slug ?? notice.id}`),
  };
}

export default async function LocalizedNoticeDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : "ja";
  let notice = await getNoticeBySlug(slug);
  if (!notice) notice = await getNoticeById(slug);
  if (!notice) notFound();

  const t = COMMON_TEXTS[locale];
  const listHref = noticeListHref(locale);
  const baseTitle = stripHtml(notice.title);
  const title =
    locale === "ja" ? baseTitle : await translateForLocale(baseTitle ?? "", locale);
  const bodyRaw = notice.body ? prepareBodyForDetail(notice.body) : "";
  const body =
    locale === "ja" || !bodyRaw
      ? bodyRaw
      : await translateForLocale(bodyRaw, locale, { tagHandling: "html" });

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <article className="mb-10">
          <header className="mb-6">
            <h1 className="m-0 mb-3 font-heading text-xl font-semibold text-tea-deep md:text-2xl">
              {title}
            </h1>
            <div className="inline-block rounded border border-border bg-washi px-3 py-1 text-left text-[0.8125rem] text-ink-muted">
              {formatDate(notice.publishedAt, locale)}
            </div>
          </header>
          {body && (
            <div
              className="notice-body text-[0.9375rem] leading-relaxed text-ink [&_a]:text-tea [&_a]:no-underline [&_a:hover]:text-tea-deep [&_a:hover]:underline [&_img]:max-w-full [&_img]:h-auto [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
          <p className="mt-6">
            <Link
              href={listHref}
              className="text-[0.9375rem] text-tea no-underline hover:text-tea-deep hover:underline"
            >
              {t.notice.backToList}
            </Link>
          </p>
        </article>
      </div>
    </main>
  );
}
