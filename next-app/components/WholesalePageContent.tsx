"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PartnerLogos from "@/components/PartnerLogos";
import WholesaleForm, { type WholesaleFormStep } from "@/components/WholesaleForm";
import { WHOLESALE_TEXTS } from "@/lib/wholesaleTexts";

export default function WholesalePageContent() {
  const [formStep, setFormStep] = useState<WholesaleFormStep>("form");
  const t = WHOLESALE_TEXTS;

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
                src="/images/wholesale/partner.webp"
                alt={t.altImage}
                width={400}
                height={300}
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>

          <PartnerLogos className="mb-10" />

          <div className="mb-10 rounded-lg border border-tea-light/60 bg-cream/30 px-4 py-4">
            <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">業務用パウダーの商品と使い方</h2>
            <p className="m-0 mb-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              カフェのラテや製菓材料には、無糖の深蒸し茶パウダー・ほうじ茶パウダーを500gでご用意しています。
            </p>
            <ul className="m-0 space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              <li><Link href="/ise-cha/fukamushi-powder-lp/" className="text-tea underline underline-offset-2">業務用緑茶パウダーの使い方と500g商品を見る</Link></li>
              <li><Link href="/ise-cha/roasted-powder-lp/" className="text-tea underline underline-offset-2">業務用ほうじ茶パウダーのラテ・製菓用途と500g商品を見る</Link></li>
            </ul>
          </div>
        </section>
      )}

      <section className={formStep === "done" ? "mb-12 max-w-3xl" : "max-w-3xl"}>
        <WholesaleForm onStepChange={setFormStep} />
      </section>
    </>
  );
}
