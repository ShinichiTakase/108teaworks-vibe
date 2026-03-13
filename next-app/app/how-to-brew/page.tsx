import Image from "next/image";
import Link from "next/link";
import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import PromoVideoBanner from "@/components/PromoVideoBanner";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { HOW_TO_BREW_TEXTS } from "@/lib/howToBrewTexts";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

/** トップページの商品一覧を指定フィルターで絞り込んだURL */
function productsFilterHref(locale: Locale, filterValue: string): string {
  const path = locale === "ja" ? "/" : `/${locale}`;
  return `${path}?filter=${encodeURIComponent(filterValue)}`;
}

export const dynamic = "force-dynamic";

type Props = {
  params?: { lang?: string };
};

function detectLocaleFromParams(params?: { lang?: string }): Locale {
  const raw = params?.lang;
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  if (raw && supported.includes(raw as Locale)) return raw as Locale;
  return "ja";
}

export async function generateMetadata({ params }: Props = {}) {
  const locale = detectLocaleFromParams(params);
  const seo = getFixedSeo("/how-to-brew", locale);
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/how-to-brew"),
  };
}

export default function HowToBrewPage({ params }: Props = {}) {
  const locale = detectLocaleFromParams(params);
  const t = HOW_TO_BREW_TEXTS[locale];

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="howto-heading" className="mb-12">
          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src="/images/how-to-brew/top.jpg"
                alt={t.altTop}
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 md:order-2">
              <h1
                id="howto-heading"
                className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
              >
                {t.h1}
              </h1>
              <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.lead1}
              </p>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.lead2}
              </p>
            </div>
          </div>

          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
            {t.sec1Title}
          </h2>
          <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.sec1P1}
          </p>
          <ul className="mb-6 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            <li>{t.sec1Li1}</li>
            <li>{t.sec1Li2}</li>
            <li>{t.sec1Li3}</li>
          </ul>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.tbTitle}
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.tbNote}
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.tbStep1}</li>
                <li>{t.tbStep2}</li>
                <li>{t.tbStep3}</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.tbBody}
              </p>
              <div className="flex justify-end mt-3">
                <Link
                  href={productsFilterHref(locale, "ティーバッグ")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.productLinkTeabag}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS[locale].product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/how-to-brew/tea-bag.jpg"
                alt={t.altTeaBag}
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.leafTitle}
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.leafNote}
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.leafStep1}</li>
                <li>{t.leafStep2}</li>
                <li>{t.leafStep3}</li>
                <li>{t.leafStep4}</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.leafBody}
              </p>
              <div className="flex justify-end mt-3">
                <Link
                  href={productsFilterHref(locale, "リーフ（茶葉）")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.productLinkLeaf}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS[locale].product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/how-to-brew/pot.jpg"
                alt={t.altPot}
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <div className="mb-10">
            <h3 className="mt-0 mb-2 text-[0.9375rem] font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
              {t.kyusuTitle}
            </h3>
            <ul className="mb-0 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              <li>{t.kyusuLi1}</li>
              <li>{t.kyusuLi2}</li>
              <li>{t.kyusuLi3}</li>
              <li>{t.kyusuLi4}</li>
            </ul>
            <div className="flex justify-end mt-3">
              <Link
                href={productsFilterHref(locale, "深蒸し茶")}
                className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
              >
                <span className="text-base font-bold">{t.productLinkFukamushi}</span>
                <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                  {COMMON_TEXTS[locale].product.viewDetails}
                </span>
              </Link>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <figure className="order-2 overflow-hidden rounded-md md:order-1">
              <Image
                src="/images/how-to-brew/water.jpg"
                alt={t.altWater}
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </figure>
            <div className="order-1 md:order-2">
              <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep">
                {t.mizudashiTitle}
              </h2>
              <p className="mb-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.mizudashiNote}
              </p>
              <ol className="mb-4 list-decimal pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <li>{t.mizudashiStep1}</li>
                <li>{t.mizudashiStep2}</li>
                <li>{t.mizudashiStep3}</li>
              </ol>
              <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.mizudashiBody}
              </p>
              <div className="flex justify-end mt-3">
                <Link
                  href={productsFilterHref(locale, "ティーバッグ")}
                  className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
                >
                  <span className="text-base font-bold">{t.productLinkMizudashiTeabag}</span>
                  <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                    {COMMON_TEXTS[locale].product.viewDetails}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            {t.powderReasonTitle}
          </h3>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.powderReasonBody}
          </p>

          <div className="mb-10">
            <PromoVideoBanner />
          </div>

          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            {t.latteTitle}
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="flex flex-col justify-between text-[0.9375rem] leading-relaxed text-ink-muted">
              <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                {t.latteGreenTitle}
              </h3>
              <ul className="mb-2 list-disc pl-5">
                {t.latteGreenList.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <p className="mb-0">
                {t.latteGreenBody}
              </p>
            </div>
            <div className="flex items-stretch">
              <figure className="w-full overflow-hidden rounded-md">
                <Image
                  src="/images/how-to-brew/green-tea-latte.jpg"
                  alt={t.altGreenLatte}
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover md:h-44"
                />
              </figure>
            </div>
            <div className="flex flex-col justify-between text-[0.9375rem] leading-relaxed text-ink-muted">
              <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
                {t.latteHojichaTitle}
              </h3>
              <ul className="mb-2 list-disc pl-5">
                {t.latteHojichaList.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <p className="mb-0">
                {t.latteHojichaBody}
              </p>
            </div>
            <div className="flex items-stretch">
              <figure className="w-full overflow-hidden rounded-md">
                <Image
                  src="/images/how-to-brew/roasted-tea-latte.jpg"
                  alt={t.altHojichaLatte}
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover md:h-44"
                />
              </figure>
            </div>
          </div>
          <div className="flex justify-end mb-6">
            <Link
              href={productsFilterHref(locale, "パウダー")}
              className="inline-flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg border border-tea-light bg-washi text-tea-deep no-underline transition-colors hover:border-tea-deep hover:bg-cream hover:shadow-sm"
            >
              <span className="text-base font-bold">{t.productLinkLattePowder}</span>
              <span className="shrink-0 text-[0.8125rem] font-normal text-tea" aria-hidden="true">
                {COMMON_TEXTS[locale].product.viewDetails}
              </span>
            </Link>
          </div>
          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            {t.powderVsMatchaTitle}
          </h2>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            {t.powderWhatTitle}
          </h3>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.powderWhatBody}
          </p>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            {t.matchaWhatTitle}
          </h3>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.matchaWhatBody}
          </p>
          <h2 className="mt-0 mb-3 text-base font-semibold text-tea-deep underline underline-offset-4 decoration-tea-soft">
            {t.storageTitle}
          </h2>
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.storageIntro}
          </p>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            {t.storageOpenTitle}
          </h3>
          <ul className="mb-3 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.storageOpenList.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <h3 className="mb-2 text-[0.9375rem] font-semibold text-tea-deep">
            {t.storageUnopenedTitle}
          </h3>
          <ul className="mb-4 list-disc pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.storageUnopenedList.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>

          <p className="mb-0 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.storageOutro}
          </p>
        </section>
      </div>
    </main>
  );
}

