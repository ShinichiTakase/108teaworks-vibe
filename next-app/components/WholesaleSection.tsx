import Link from "next/link";
import PartnerLogos from "@/components/PartnerLogos";
import type { Locale } from "@/lib/i18n";
import { HOME_WHOLESALE_TEXTS } from "@/lib/homeSectionTexts";

type Props = { locale?: Locale };

export default function WholesaleSection({ locale = "ja" }: Props) {
  const t = HOME_WHOLESALE_TEXTS[locale];
  const wholesaleHref = locale === "ja" ? "/wholesale/" : `/${locale}/wholesale`;
  return (
    <section
      className="mb-12"
      id="wholesale"
      aria-labelledby="wholesale-heading"
    >
      <h2
        id="wholesale-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        {t.heading}
      </h2>
      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:gap-8">
        <figure className="m-0 shrink-0 md:w-[40%] md:max-w-[400px]">
          {/* public/images/wholesale/partner.jpg を配置（108teaworks.com と同じ画像） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/wholesale/partner.jpg"
            alt={t.imgAlt}
            width={400}
            height={300}
            className="block w-full h-auto rounded object-cover"
            loading="lazy"
          />
        </figure>
        <div className="flex-1 min-w-0">
          <p className="m-0 text-[0.9375rem] text-ink-muted">
            {t.intro}
          </p>
          <p className="m-0 mt-2 text-[0.9375rem] text-ink-muted">
            <strong>{t.productsTitle}</strong>
          </p>
          <ul className="wholesale__list list-disc pl-5 mt-1 mb-2 text-[0.9375rem] text-ink-muted ml-[1em]">
            <li>{t.product1}</li>
            <li>{t.product2}</li>
            <li>{t.product3}</li>
          </ul>
          <p className="m-0 text-[0.9375rem] text-ink-muted">
            <strong>{t.formatTitle}</strong>
          </p>
          <ul className="wholesale__list list-disc pl-5 mt-1 text-[0.9375rem] text-ink-muted ml-[1em]">
            <li>{t.format1}</li>
            <li>{t.format2}</li>
            <li>{t.format3}</li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center">
        <Link
          href={wholesaleHref}
          className="inline-block py-4 px-8 text-[0.9375rem] font-medium text-cream bg-tea-deep rounded no-underline transition-colors hover:bg-tea focus:outline-2 focus:outline-tea-light focus:outline-offset-2"
        >
          {t.formLinkText}
        </Link>
      </p>
      <PartnerLogos className="mt-10" />
    </section>
  );
}
