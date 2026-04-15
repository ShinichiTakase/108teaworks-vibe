"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Line = {
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
};

type Item = {
  id: string;
  title?: string;
  customerName?: string;
  customerEmail?: string;
  note?: string;
  itemsTotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  grandTotal?: number;
  taxMode?: string;
  taxRate?: number;
  expiresAt?: string;
  openedAt?: string;
  sentAt?: string;
  paidAt?: string;
  status?: string;
  stripePaymentIntentId?: string;
  lines?: Line[];
};

function formatYen(n: number | undefined): string {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0;
  return `¥${v.toLocaleString()}`;
}

function formatDt(s: string | undefined): string {
  if (!s) return "—";
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return s;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function statusLabel(s: string | undefined): string {
  const v = (s ?? "").trim().toLowerCase();
  if (!v) return "—";
  if (v === "draft") return "下書き";
  if (v === "sent") return "送信済み";
  if (v === "opened") return "閲覧済み";
  if (v === "paid") return "支払済み";
  if (v === "void") return "無効";
  return s ?? "—";
}

export default function AdminB2bDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  const isEditable = !item?.sentAt;

  const fetchItem = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/b2b/${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.item) {
        setError(`取得に失敗しました（HTTP ${res.status}）`);
        setItem(null);
        return;
      }
      setItem(data.item as Item);
    } catch {
      setError("取得に失敗しました。");
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const computed = useMemo(() => {
    const lines = item?.lines ?? [];
    const itemsTotal = lines.reduce((s, l) => {
      const qty = typeof l.quantity === "number" ? l.quantity : 0;
      const unit = typeof l.unitPrice === "number" ? l.unitPrice : 0;
      const amt = typeof l.lineTotal === "number" ? l.lineTotal : qty * unit;
      return s + Math.round(amt);
    }, 0);
    return { itemsTotal };
  }, [item]);

  const updateItem = (patch: Partial<Item>) => {
    setItem((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateLine = (idx: number, patch: Partial<Line>) => {
    setItem((prev) => {
      if (!prev) return prev;
      const lines = Array.isArray(prev.lines) ? [...prev.lines] : [];
      lines[idx] = { ...(lines[idx] ?? {}), ...patch };
      return { ...prev, lines };
    });
  };

  const addLine = () => {
    setItem((prev) => {
      if (!prev) return prev;
      const lines = Array.isArray(prev.lines) ? [...prev.lines] : [];
      lines.push({ productName: "", quantity: 1, unitPrice: 0, lineTotal: 0 });
      return { ...prev, lines };
    });
  };

  const removeLine = (idx: number) => {
    setItem((prev) => {
      if (!prev) return prev;
      const lines = Array.isArray(prev.lines) ? prev.lines.filter((_, i) => i !== idx) : [];
      return { ...prev, lines };
    });
  };

  const handleSave = async () => {
    if (!item) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/b2b/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title ?? "",
          customerName: item.customerName ?? "",
          customerEmail: item.customerEmail ?? "",
          note: item.note ?? "",
          taxMode: item.taxMode ?? "inclusive",
          taxRate: item.taxRate ?? 0.1,
          shippingFee: item.shippingFee ?? 0,
          lines: (item.lines ?? []).map((l) => {
            const q = typeof l.quantity === "number" ? l.quantity : 0;
            const u = typeof l.unitPrice === "number" ? l.unitPrice : 0;
            const a = typeof l.lineTotal === "number" ? l.lineTotal : q * u;
            return {
              fieldId: (process.env.NEXT_PUBLIC_B2B_LINE_CUSTOM_FIELD_ID || "products") as string,
              productName: l.productName ?? "",
              quantity: q,
              unitPrice: u,
              lineTotal: a,
            };
          }),
          // 金額はmicroCMSの値を尊重（必要なら create/patch 側でサーバ計算に寄せる）
          itemsTotal: item.itemsTotal ?? computed.itemsTotal,
          taxAmount: item.taxAmount ?? 0,
          grandTotal: item.grandTotal ?? 0,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(
          data?.error === "already_sent"
            ? "送信済みのため編集できません。"
            : `保存に失敗しました（HTTP ${res.status}）`
        );
        return;
      }
      setMessage("保存しました。");
      await fetchItem();
    } catch {
      setError("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!item) return;
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/b2b/${encodeURIComponent(id)}/send`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        const err =
          data?.error === "invalid_email"
            ? "メールアドレスを確認してください。"
            : data?.error === "smtp_not_configured"
              ? "SMTP設定がありません（SMTP_HOST/USER/PASS など）。"
              : data?.error === "already_paid"
                ? "すでに支払済みです。"
                : `送信に失敗しました（HTTP ${res.status}）`;
        setError(err);
        return;
      }
      setMessage("送信しました。");
      await fetchItem();
    } catch {
      setError("送信に失敗しました。");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-washi py-10 px-4">
        <div className="mx-auto max-w-4xl text-ink-muted">読み込み中…</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-washi py-10 px-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/admin/b2b" className="text-[0.875rem] font-semibold text-tea hover:underline">
            一覧に戻る
          </Link>
          <div className="mt-4 rounded-lg border border-border bg-white p-4 text-red-700">
            {error ?? "見つかりませんでした。"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-washi py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <div>
            <Link href="/admin/b2b" className="text-[0.875rem] font-semibold text-tea hover:underline">
              ← 一覧に戻る
            </Link>
            <h1 className="m-0 mt-2 text-xl font-semibold text-tea-deep">B2B 明細</h1>
          </div>
          <div className="text-right text-[0.875rem] text-ink-muted">
            <div>ステータス：{statusLabel(item.status)}</div>
            <div>送信：{formatDt(item.sentAt)}</div>
            <div>閲覧：{formatDt(item.openedAt)}</div>
            <div>支払：{formatDt(item.paidAt)}</div>
          </div>
        </div>

        {(error || message) && (
          <div
            className={`mb-4 rounded-lg border border-border bg-white p-3 ${
              error ? "text-red-700" : "text-green-700"
            }`}
            role="alert"
          >
            {error ?? message}
          </div>
        )}

        <div className="rounded-xl border border-border bg-white p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">タイトル</label>
            <input
              value={item.title ?? ""}
              onChange={(e) => updateItem({ title: e.target.value })}
              disabled={!isEditable}
              className="w-full rounded border border-border bg-white px-3 py-2 disabled:bg-washi"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">顧客名</label>
              <input
                value={item.customerName ?? ""}
                onChange={(e) => updateItem({ customerName: e.target.value })}
                disabled={!isEditable}
                className="w-full rounded border border-border bg-white px-3 py-2 disabled:bg-washi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">メールアドレス</label>
              <input
                value={item.customerEmail ?? ""}
                onChange={(e) => updateItem({ customerEmail: e.target.value })}
                disabled={!isEditable}
                className="w-full rounded border border-border bg-white px-3 py-2 disabled:bg-washi"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">メモ（検索対象）</label>
            <textarea
              value={item.note ?? ""}
              onChange={(e) => updateItem({ note: e.target.value })}
              disabled={!isEditable}
              rows={3}
              className="w-full rounded border border-border bg-white px-3 py-2 disabled:bg-washi"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="m-0 text-base font-semibold text-tea-deep">明細</h2>
            {isEditable && (
              <button
                type="button"
                onClick={addLine}
                className="rounded border border-border bg-white px-3 py-1 text-sm font-semibold text-tea hover:bg-cream"
              >
                行を追加
              </button>
            )}
          </div>

          <div className="space-y-3">
            {(item.lines ?? []).map((l, i) => {
              const qty = typeof l.quantity === "number" ? l.quantity : 0;
              const unit = typeof l.unitPrice === "number" ? l.unitPrice : 0;
              const lineTotal = typeof l.lineTotal === "number" ? l.lineTotal : qty * unit;
              return (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_140px_140px_auto] items-end"
                >
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1">商品名</label>
                    <input
                      value={l.productName ?? ""}
                      onChange={(e) => updateLine(i, { productName: e.target.value })}
                      disabled={!isEditable}
                      className="w-full rounded border border-border bg-white px-3 py-2 disabled:bg-washi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1">数量</label>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                      disabled={!isEditable}
                      className="w-full rounded border border-border bg-white px-3 py-2 text-right disabled:bg-washi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1">単価</label>
                    <input
                      type="number"
                      value={unit}
                      onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })}
                      disabled={!isEditable}
                      className="w-full rounded border border-border bg-white px-3 py-2 text-right disabled:bg-washi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-muted mb-1">合計</label>
                    <div className="rounded border border-border bg-washi px-3 py-2 text-right">
                      {formatYen(lineTotal)}
                    </div>
                  </div>
                  <div className="sm:pb-1">
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        disabled={(item.lines?.length ?? 0) <= 1}
                        className="rounded border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-cream disabled:opacity-40"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-border pt-4 space-y-2 text-[0.9375rem]">
            <div className="flex justify-between">
              <span className="text-ink-muted">商品合計</span>
              <span className="font-semibold">{formatYen(item.itemsTotal ?? computed.itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">送料</span>
              <span className="font-semibold">{formatYen(item.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">消費税</span>
              <span className="font-semibold">{formatYen(item.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-base text-tea-deep">
              <span className="font-semibold">総合計</span>
              <span className="font-bold">{formatYen(item.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {isEditable ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg border-2 border-tea bg-white py-3 px-4 font-semibold text-tea hover:bg-cream disabled:opacity-50"
              >
                {saving ? "保存中…" : "保存"}
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="flex-1 rounded-lg border-2 border-tea bg-tea py-3 px-4 font-semibold text-white hover:bg-tea-light hover:border-tea-light disabled:opacity-50"
              >
                {sending ? "送信中…" : "送信"}
              </button>
            </>
          ) : (
            <div className="w-full rounded-lg border border-border bg-white p-4 text-ink-muted">
              送信済みのため、この画面からは編集できません。
              {item.stripePaymentIntentId ? (
                <div className="mt-2">PaymentIntent: {item.stripePaymentIntentId}</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

