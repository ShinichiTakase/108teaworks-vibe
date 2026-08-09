"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type OrderRow = {
  id: string;
  orderNo: string;
  orderDateTimeDisplay: string;
  customerName: string;
  productSummary: string;
  orderTotalDisplay: string;
  sent: boolean;
};

type Props = {
  rows: OrderRow[];
  totalCount: number;
};

export default function OrdersTable({ rows, totalCount }: Props) {
  const router = useRouter();
  const [confirmTarget, setConfirmTarget] = useState<OrderRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function closeModal() {
    if (deleting) return;
    setConfirmTarget(null);
    setErrorMsg(null);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/orders/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmTarget.id }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setErrorMsg("削除に失敗しました");
        setDeleting(false);
        return;
      }
      setConfirmTarget(null);
      setDeleting(false);
      router.refresh();
    } catch {
      setErrorMsg("通信エラーが発生しました");
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded border border-border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="px-4 py-2 text-center font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                発送
              </th>
              <th className="px-4 py-2 text-left font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                注文日時
              </th>
              <th className="px-4 py-2 text-left font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                注文番号
              </th>
              <th className="px-4 py-2 text-left font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                お名前
              </th>
              <th className="px-4 py-2 text-left font-semibold text-tea-deep border-b border-border">
                商品
              </th>
              <th className="px-4 py-2 text-right font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                合計金額
              </th>
              <th className="px-4 py-2 text-right font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-cream/50 transition-colors align-top">
                <td className="px-4 py-2 text-center whitespace-nowrap">
                  {row.sent && <span className="font-bold text-[#0000ff]">済</span>}
                </td>
                <td className="px-4 py-2 text-ink whitespace-nowrap">
                  {row.orderDateTimeDisplay}
                </td>
                <td className="px-4 py-2 font-mono text-ink whitespace-nowrap">{row.orderNo}</td>
                <td className="px-4 py-2 text-ink whitespace-nowrap">{row.customerName}</td>
                <td className="px-4 py-2 text-ink">{row.productSummary}</td>
                <td className="px-4 py-2 text-right text-ink whitespace-nowrap">
                  {row.orderTotalDisplay}
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/orders/${row.id}/`}
                      className="rounded border border-border px-3 py-1 text-xs text-ink no-underline hover:bg-cream"
                    >
                      明細
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmTarget(row)}
                      className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-2 text-xs text-ink-muted border-t border-border">
          全 {totalCount} 件
        </p>
      </div>

      {confirmTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
            <p className="text-sm text-ink">
              <span className="font-mono font-semibold">{confirmTarget.orderNo}</span>
              のデータを削除します
            </p>
            {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={deleting}
                className="rounded border border-border px-4 py-1.5 text-sm text-ink hover:bg-cream disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="rounded bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
