import Image from "next/image";
import Link from "next/link";
import IsechaSubNav from "@/components/IsechaSubNav";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildLocalizedPath } from "@/lib/urlPath";
import { ISECHA_TEXTS } from "./IsechaPage";

function mieChagyoShiHref(): string {
  return "/mie_chagyo_shi/";
}

function inquiryHref(locale: Locale): string {
  return buildLocalizedPath(locale, "/inquiry");
}

function kabatadaniHref(locale: Locale): string {
  return buildLocalizedPath(locale, "/kabatadani_no_ocha");
}

function isechaNoRekishiHref(locale: Locale): string {
  return buildLocalizedPath(locale, "/isecha_no_rekishi");
}

type Props = {
  locale: Locale;
};

export default function IsechaBooksPage({ locale }: Props) {
  const t = ISECHA_TEXTS[locale];
  const mie = mieChagyoShiHref();
  const inquiry = inquiryHref(locale);
  const kabatadani = kabatadaniHref(locale);
  const rekishi = isechaNoRekishiHref(locale);

  const booksRegionLabel =
    locale === "ja"
      ? "高瀬孝二著の電子書籍"
      : locale === "en"
        ? "E-books by Koji Takase"
        : locale === "ko"
          ? "다카세 고지 저 전자책"
          : "高瀬孝二著作电子书";

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="isecha-books-heading" className="mb-12">
          <IsechaSubNav locale={locale} current="books" />
          <h1
            id="isecha-books-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {COMMON_TEXTS[locale].nav.isechaBooks}
          </h1>

          <div className="mb-12" role="region" aria-label={booksRegionLabel}>
            <div className="mb-8 flex flex-col gap-8">
              <article className="flex flex-row items-start gap-4 text-left sm:gap-6">
                <figure className="w-24 shrink-0 overflow-hidden rounded-md sm:w-32 md:w-36">
                  <Link href={mie} target="_self">
                    <Image
                      src="/images/mie_chagyo_shi/cover.webp"
                      alt={t.altMieCover}
                      width={400}
                      height={604}
                      className="h-auto w-full object-cover"
                    />
                  </Link>
                </figure>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="mt-0 mb-2 text-base font-semibold text-tea-deep md:text-lg">
                    <Link
                      href={mie}
                      target="_self"
                      className="no-underline hover:underline underline-offset-4"
                    >
                      {t.bookMieTitle}
                    </Link>
                  </h2>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookMieP1}
                  </p>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookMieP2}
                  </p>
                  <div className="mb-2 rounded-md border border-border bg-washi px-3 py-2">
                    <p className="m-0 text-[0.8125rem] leading-relaxed text-ink-muted">
                      {t.bookMieNoticeBefore}
                      <Link
                        href={inquiry}
                        target="_self"
                        className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                      >
                        {t.bookMieNoticeLinkText}
                      </Link>
                      {t.bookMieNoticeAfter}
                    </p>
                  </div>
                  <p className="mb-0 mt-auto text-right text-[0.875rem] leading-relaxed text-ink-muted">
                    <Link
                      href={mie}
                      target="_self"
                      className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                    >
                      {t.bookMieLinkText}
                    </Link>
                  </p>
                </div>
              </article>

              <article className="flex flex-row items-start gap-4 text-left sm:gap-6">
                <figure className="w-24 shrink-0 overflow-hidden rounded-md sm:w-32 md:w-36">
                  <Link href={kabatadani} target="_self">
                    <Image
                      src="/images/isecha-kawamata.jpg"
                      alt={t.altKawamata}
                      width={716}
                      height={1024}
                      className="h-auto w-full object-cover"
                    />
                  </Link>
                </figure>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="mt-0 mb-2 text-base font-semibold text-tea-deep md:text-lg">
                    <Link
                      href={kabatadani}
                      target="_self"
                      className="no-underline hover:underline underline-offset-4"
                    >
                      {t.bookKawamataTitle}
                    </Link>
                  </h2>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookKawamataP1}
                  </p>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookKawamataP2}
                  </p>
                  <p className="mb-0 mt-auto text-right text-[0.875rem] leading-relaxed text-ink-muted">
                    <Link
                      href={kabatadani}
                      target="_self"
                      className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                    >
                      {t.bookKawamataLinkText}
                    </Link>
                  </p>
                </div>
              </article>

              <article className="flex flex-row items-start gap-4 text-left sm:gap-6">
                <figure className="w-24 shrink-0 overflow-hidden rounded-md sm:w-32 md:w-36">
                  <Link href={rekishi} target="_self">
                    <Image
                      src="/images/isecha_no_rekishi.jpg"
                      alt={t.altHistoryCover}
                      width={716}
                      height={1024}
                      className="h-auto w-full object-cover"
                    />
                  </Link>
                </figure>
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="mt-0 mb-2 text-base font-semibold text-tea-deep md:text-lg">
                    <Link
                      href={rekishi}
                      target="_self"
                      className="no-underline hover:underline underline-offset-4"
                    >
                      {t.bookHistoryTitle}
                    </Link>
                  </h2>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookHistoryP1}
                  </p>
                  <p className="mb-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {t.bookHistoryP2}
                  </p>
                  <p className="mb-0 mt-auto text-right text-[0.875rem] leading-relaxed text-ink-muted">
                    <Link
                      href={rekishi}
                      target="_self"
                      className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                    >
                      {t.bookHistoryLinkText}
                    </Link>
                  </p>
                </div>
              </article>
            </div>

            <div className="rounded-lg border-2 border-tea-deep bg-white px-4 py-4 text-[0.875rem] leading-relaxed text-ink-muted md:px-6 md:py-4">
              <p className="m-0">{t.authorBio}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
