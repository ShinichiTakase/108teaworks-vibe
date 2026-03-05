"use client";

import { useState } from "react";
import Image from "next/image";
import PartnerLogos from "@/components/PartnerLogos";
import WholesaleForm, { type WholesaleFormStep } from "@/components/WholesaleForm";

export default function WholesalePageContent() {
  const [formStep, setFormStep] = useState<WholesaleFormStep>("form");

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
            パートナー募集（卸売り）
          </h1>

          <p className="mb-6 text-[0.9375rem] font-semibold text-tea-deep">
            「コーヒー以外もちゃんとおいしい」お店に
          </p>

          <div className="mb-8 grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              <p className="mb-0">
                コーヒーホッピングをしていると、３件目くらいでカフェイン以外のものが欲しくなりませんか？
                私はいつもレモネードを頼んでしまいます。
                そんなとき、コーヒーの代わりの選択肢として、藤八茶寮の緑茶ラテやほうじ茶ラテはいかがでしょうか。
              </p>
              <p className="mb-0">
                純度100%混じりっ気無しの粉末茶なので、甘さ加減は店舗で調整が可能です。
                800メッシュの粒度まで細かくし、冷たい水や牛乳にも溶けやすく、なめらかな口当たりをめざしました。
                ドリンクだけでなくスイーツの材料にもご利用いただけます。
              </p>
              <p className="mb-0">
                扱いやすく、オペレーションもスムーズなパウダーシリーズで、「コーヒー以外もちゃんとおいしい」に。
              </p>
            </div>
            <figure className="overflow-hidden rounded-md">
              <Image
                src="/images/wholesale/partner.jpg"
                alt="パートナー募集・伊勢茶をビジネスに"
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
        <WholesaleForm onStepChange={setFormStep} />
      </section>
    </>
  );
}
