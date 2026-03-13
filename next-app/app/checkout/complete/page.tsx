"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { CHECKOUT_COMPLETE_TEXTS } from "@/lib/checkoutCompleteTexts";

type CompleteSummary = {
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  shipping: number;
  total: number;
  includedTax: number;
  orderNo: string;
};

function detectLocaleFromPath(pathname: string | null): Locale {
  if (!pathname) return "ja";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/zh")) return "zh";
  return "ja";
}

export default function CheckoutCompletePage() {
  const [summary, setSummary] = useState<CompleteSummary | null>(null);
  const pathname = usePathname();
  const locale = detectLocaleFromPath(pathname);
  const t = CHECKOUT_COMPLETE_TEXTS[locale];

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("lastOrderSummary");
      if (stored) {
        setSummary(JSON.parse(stored) as CompleteSummary);
      }
      sessionStorage.removeItem("lastOrderSummary");
    } catch {
      setSummary(null);
    }
  }, []);

  const formatPrice = (n: number) => `¥${Math.round(n).toLocaleString()}`;

  return (
    <article className="mb-10 flex justify-center">
      <div className="w-[90%] max-w-[800px]">
        <h1 className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep">
          {t.title}
        </h1>
        <p className="mb-6 text-[0.9375rem] text-ink">
          {t.subtitle}
        </p>

        {summary && (
          <section
            className="mt-4 rounded-xl border border-border bg-washi px-4 py-4 text-[0.9375rem]"
            aria-label={t.sectionAria}
          >
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">
            {t.sectionTitle}
          </h2>
          <table className="w-full border-collapse text-[0.875rem]">
            <thead>
              <tr className="bg-cream">
                <th className="border border-border px-2 py-1 text-left">{t.thProduct}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thQty}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thUnitPrice}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thAmount}</th>
              </tr>
            </thead>
            <tbody>
              {summary.items.map((it, idx) => (
                <tr key={`${it.name}-${idx}`}>
                  <td className="border border-border px-2 py-1 align-top">
                    {it.name}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {it.quantity}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {formatPrice(it.unitPrice)}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {formatPrice(it.amount)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right">
                  {t.shipping}
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.shipping)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  {t.total}
                </td>
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  {formatPrice(summary.total)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right">
                  {t.includedTax}
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.includedTax)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-right text-[0.875rem] text-ink-muted">
            {t.orderNoLabel}<span className="font-semibold">{summary.orderNo}</span>
          </div>
        </section>
        )}
      </div>
    </article>
  );
}

