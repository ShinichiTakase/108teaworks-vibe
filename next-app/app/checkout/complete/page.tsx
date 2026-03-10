"use client";

import { useEffect, useState } from "react";

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

export default function CheckoutCompletePage() {
  const [summary, setSummary] = useState<CompleteSummary | null>(null);

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
          ご購入ありがとうございます。
        </h1>
        <p className="mb-6 text-[0.9375rem] text-ink">
          またのご利用をお待ちしております。
        </p>

        {summary && (
          <section
            className="mt-4 rounded-xl border border-border bg-washi px-4 py-4 text-[0.9375rem]"
            aria-label="ご注文内容の詳細"
          >
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">
            ご注文内容
          </h2>
          <table className="w-full border-collapse text-[0.875rem]">
            <thead>
              <tr className="bg-cream">
                <th className="border border-border px-2 py-1 text-left">商品</th>
                <th className="border border-border px-2 py-1 text-right">数量</th>
                <th className="border border-border px-2 py-1 text-right">単価</th>
                <th className="border border-border px-2 py-1 text-right">金額</th>
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
                  送料
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.shipping)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  合計
                </td>
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  {formatPrice(summary.total)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right">
                  内消費税
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.includedTax)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-right text-[0.875rem] text-ink-muted">
            注文番号：<span className="font-semibold">{summary.orderNo}</span>
          </div>
        </section>
        )}
      </div>
    </article>
  );
}

