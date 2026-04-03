import Image from "next/image";
import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import type { Locale } from "@/lib/i18n";
import { buildLocalizedPath } from "@/lib/urlPath";
import { ISECHA_TEXTS } from "./IsechaPage";

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
          <h1
            id="isecha-books-heading"
            className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep"
          >
            {booksRegionLabel}
          </h1>

          <div className="mb-12" role="region" aria-label={booksRegionLabel}>
            <div className="mb-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
              <article className="flex flex-col text-left">
                <figure className="mb-4 overflow-hidden rounded-md">
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
                <h2 className="mt-0 mb-3 text-lg font-semibold text-tea-deep md:text-xl">
                  <Link
                    href={rekishi}
                    target="_self"
                    className="no-underline hover:underline underline-offset-4"
                  >
                    {t.bookHistoryTitle}
                  </Link>
                </h2>
                <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {t.bookHistoryP1}
                </p>
                <p className="mb-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {t.bookHistoryP2}
                </p>
                <p className="mb-0 text-right text-[0.9375rem] leading-relaxed text-ink-muted">
                  <Link
                    href={rekishi}
                    target="_self"
                    className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                  >
                    {t.bookHistoryLinkText}
                  </Link>
                </p>
              </article>

              <article className="flex flex-col text-left">
                <figure className="mb-4 overflow-hidden rounded-md">
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
                <h2 className="mt-0 mb-3 text-lg font-semibold text-tea-deep md:text-xl">
                  <Link
                    href={kabatadani}
                    target="_self"
                    className="no-underline hover:underline underline-offset-4"
                  >
                    {t.bookKawamataTitle}
                  </Link>
                </h2>
                <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {t.bookKawamataP1}
                </p>
                <p className="mb-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {t.bookKawamataP2}
                </p>
                <p className="mb-0 text-right text-[0.9375rem] leading-relaxed text-ink-muted">
                  <Link
                    href={kabatadani}
                    target="_self"
                    className="text-tea-deep underline underline-offset-4 hover:text-tea-deeper"
                  >
                    {t.bookKawamataLinkText}
                  </Link>
                </p>
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
