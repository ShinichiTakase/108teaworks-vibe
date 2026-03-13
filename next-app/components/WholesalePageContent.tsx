"use client";

import { useState } from "react";
import Image from "next/image";
import PartnerLogos from "@/components/PartnerLogos";
import WholesaleForm, { type WholesaleFormStep } from "@/components/WholesaleForm";
import type { Locale } from "@/lib/i18n";
import { WHOLESALE_TEXTS } from "@/lib/wholesaleTexts";

type Props = {
  locale?: Locale;
};

export default function WholesalePageContent({ locale: localeProp }: Props) {
  const locale = localeProp ?? "ja";
  const [formStep, setFormStep] = useState<WholesaleFormStep>("form");
  const t = WHOLESALE_TEXTS[locale];

  return (
    <>
      {formStep !== "done" && (
        <section
          aria-labelledby="wholesale-heading"
          className="mb-12 max-w-4xl"
        >
          <h1
            id="wholesale-heading"
            className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <p className="mb-6 text-[0.9375rem] font-semibold text-tea-deep">
            {t.tagline}
          </p>

          <div className="mb-8 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <p className="mb-0">{t.p1}</p>
              <p className="mb-0">{t.p2}</p>
              <p className="mb-0">{t.p3}</p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/wholesale/partner.jpg"
                alt={t.altImage}
                width={400}
                height={300}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <PartnerLogos className="mb-10" />
        </section>
      )}

      <section className={formStep === "done" ? "mb-12 max-w-3xl" : "max-w-3xl"}>
        <WholesaleForm onStepChange={setFormStep} locale={locale} />
      </section>
    </>
  );
}
