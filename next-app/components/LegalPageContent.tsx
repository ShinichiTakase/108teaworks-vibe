import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import { LEGAL_TEXTS } from "@/lib/legalTexts";

export default function LegalPageContent() {
  const t = LEGAL_TEXTS;

  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <div className={INNER_CLASS}>
        <section aria-labelledby="legal-heading" className="mb-12">
          <h1
            id="legal-heading"
            className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.h1}
          </h1>

          <div className="text-[0.9375rem] leading-relaxed text-ink-muted">
            <dl className="divide-y divide-border border border-border rounded-md">
              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.tradeName}
                </dt>
                <dd className="m-0">{t.tradeNameValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.homepage}
                </dt>
                <dd className="m-0">
                  <a
                    href="https://108teaworks.com/"
                    className="text-tea no-underline hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://108teaworks.com/
                  </a>
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.representative}
                </dt>
                <dd className="m-0">{t.representativeValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.advisor}
                </dt>
                <dd className="m-0">{t.advisorValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.address}
                </dt>
                <dd className="m-0">{t.addressValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.contact}
                </dt>
                <dd className="m-0">
                  <a
                    href="mailto:info@108teaworks.com"
                    className="text-tea no-underline hover:underline"
                  >
                    info@108teaworks.com
                  </a>
                  {t.contactAnd}
                  <a
                    href="tel:050-6860-7347"
                    className="text-tea no-underline hover:underline"
                  >
                    050-6860-7347
                  </a>
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.hours}
                </dt>
                <dd className="m-0">{t.hoursValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.price}
                </dt>
                <dd className="m-0">{t.priceValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.extraCosts}
                </dt>
                <dd className="m-0">{t.extraCostsValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.payment}
                </dt>
                <dd className="m-0">{t.paymentValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.paymentTiming}
                </dt>
                <dd className="m-0">{t.paymentTimingValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.delivery}
                </dt>
                <dd className="m-0 space-y-2">
                  <p className="m-0">{t.deliveryValue}</p>
                  <p className="m-0">{t.deliveryAreaNote}</p>
                </dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.returns}
                </dt>
                <dd className="m-0">{t.returnsValue}</dd>
              </div>

              <div className="flex flex-col md:flex-row md:items-start px-4 py-3">
                <dt className="w-32 md:w-40 flex-none md:pr-4 font-semibold text-ink mb-1 md:mb-0 whitespace-nowrap">
                  {t.cancel}
                </dt>
                <dd className="m-0">{t.cancelValue}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
