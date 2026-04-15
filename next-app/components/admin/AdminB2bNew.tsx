"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Line = { productName: string; quantity: number; unitPrice: number };

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

export default function AdminB2bNew() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [taxMode, setTaxMode] = useState<"inclusive" | "exclusive">("inclusive");
  const [taxRate, setTaxRate] = useState(0.1);
  const [shippingFee, setShippingFee] = useState(0);
  const [lines, setLines] = useState<Line[]>([{ productName: "", quantity: 1, unitPrice: 0 }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const computed = useMemo(() => {
    const lineTotals = lines.map((l) => Math.max(0, Math.round(l.quantity) * Math.round(l.unitPrice)));
    const itemsTotal = lineTotals.reduce((s, x) => s + x, 0);
    const baseTotal = itemsTotal + Math.max(0, Math.round(shippingFee));
    const rate = Number.isFinite(taxRate) ? taxRate : 0.1;
    const taxAmount =
      taxMode === "exclusive"
        ? Math.round(baseTotal * rate)
        : Math.max(0, baseTotal - Math.floor(baseTotal / (1 + rate)));
    const grandTotal = taxMode === "exclusive" ? baseTotal + taxAmount : baseTotal;
    return { lineTotals, itemsTotal, taxAmount, grandTotal };
  }, [lines, shippingFee, taxMode, taxRate]);

  const updateLine = (idx: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, { productName: "", quantity: 1, unitPrice: 0 }]);
  const removeLine = (idx: number) => setLines((prev) => prev.filter((_, i) => i !== idx));

  const handleCreate = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        title,
        customerName,
        customerEmail,
        note,
        taxMode,
        taxRate,
        shippingFee,
        lines: lines.map((l, i) => ({
          productName: l.productName,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          lineTotal: computed.lineTotals[i] ?? 0,
        })),
        itemsTotal: computed.itemsTotal,
        taxAmount: computed.taxAmount,
        grandTotal: computed.grandTotal,
      };
      const res = await fetch("/api/admin/b2b/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || typeof data.id !== "string") {
        setMessage(`作成に失敗しました（HTTP ${res.status}）`);
        return;
      }
      router.push(`/admin/b2b/${encodeURIComponent(data.id)}`);
    } catch {
      setMessage("作成に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-washi py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h1 className="m-0 text-xl font-semibold text-tea-deep">B2B 新規作成</h1>
          <Link href="/admin/b2b" className="text-[0.875rem] font-semibold text-tea hover:underline">
            一覧に戻る
          </Link>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-white p-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">タイトル</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-border bg-white px-3 py-2"
              placeholder="例: B2B-2026-0001 山田商事"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">顧客名</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded border border-border bg-white px-3 py-2"
                placeholder="例: 山田商事"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">メールアドレス</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded border border-border bg-white px-3 py-2"
                placeholder="example@company.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">メモ（検索対象）</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded border border-border bg-white px-3 py-2"
              placeholder="社内メモ。相手には表示しない想定。"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">消費税区分</label>
              <select
                value={taxMode}
                onChange={(e) => setTaxMode(e.target.value as any)}
                className="w-full rounded border border-border bg-white px-3 py-2"
              >
                <option value="inclusive">内税</option>
                <option value="exclusive">外税</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">消費税率</label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full rounded border border-border bg-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">送料</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full rounded border border-border bg-white px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 text-base font-semibold text-tea-deep">明細</h2>
            <button
              type="button"
              onClick={addLine}
              className="rounded border border-border bg-white px-3 py-1 text-sm font-semibold text-tea hover:bg-cream"
            >
              行を追加
            </button>
          </div>

          <div className="space-y-3">
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_140px_140px_auto] items-end">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">商品名</label>
                  <input
                    value={l.productName}
                    onChange={(e) => updateLine(i, { productName: e.target.value })}
                    className="w-full rounded border border-border bg-white px-3 py-2"
                    placeholder="例: 伊勢茶（煎茶）"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">数量</label>
                  <input
                    type="number"
                    value={l.quantity}
                    onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                    className="w-full rounded border border-border bg-white px-3 py-2 text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">単価</label>
                  <input
                    type="number"
                    value={l.unitPrice}
                    onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })}
                    className="w-full rounded border border-border bg-white px-3 py-2 text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1">合計</label>
                  <div className="rounded border border-border bg-washi px-3 py-2 text-right">
                    {formatYen(computed.lineTotals[i] ?? 0)}
                  </div>
                </div>
                <div className="sm:pb-1">
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    disabled={lines.length <= 1}
                    className="rounded border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-cream disabled:opacity-40"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-border pt-4 space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <span className="text-ink-muted">商品合計</span>
              <span className="font-semibold">{formatYen(computed.itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">送料</span>
              <span className="font-semibold">{formatYen(Math.max(0, Math.round(shippingFee)))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">消費税</span>
              <span className="font-semibold">{formatYen(computed.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base text-tea-deep">
              <span className="font-semibold">総合計</span>
              <span className="font-bold">{formatYen(computed.grandTotal)}</span>
            </div>
          </div>
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-border bg-white p-3 text-red-700" role="alert">
            {message}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="flex-1 rounded-lg border-2 border-tea bg-tea py-3 px-4 font-semibold text-white hover:bg-tea-light hover:border-tea-light disabled:opacity-50"
          >
            {saving ? "作成中…" : "作成する"}
          </button>
        </div>
      </div>
    </main>
  );
}

