"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type B2bRow = {
  id: string;
  title?: string;
  customerName?: string;
  customerEmail?: string;
  grandTotal?: number;
  status?: string;
  sentAt?: string;
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

export default function AdminB2bList() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<B2bRow[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchList = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      if (search.trim()) sp.set("q", search.trim());
      const res = await fetch(`/api/admin/b2b/list?${sp.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(`取得に失敗しました（HTTP ${res.status}）`);
        setRows([]);
        return;
      }
      const list = Array.isArray(data.contents) ? (data.contents as any[]) : [];
      setRows(
        list.map((x) => ({
          id: String(x.id ?? ""),
          title: typeof x.title === "string" ? x.title : undefined,
          customerName: typeof x.customerName === "string" ? x.customerName : undefined,
          customerEmail: typeof x.customerEmail === "string" ? x.customerEmail : undefined,
          grandTotal: typeof x.grandTotal === "number" ? x.grandTotal : undefined,
          status:
            typeof x.status === "string"
              ? x.status
              : Array.isArray(x.status)
                ? (x.status.find((s: unknown) => typeof s === "string") as string | undefined)
                : undefined,
          sentAt: typeof x.sentAt === "string" ? x.sentAt : undefined,
        }))
      );
    } catch (e) {
      setError("取得に失敗しました。");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row: B2bRow) => {
    const label = `${row.customerName ?? "—"} / ${row.customerEmail ?? "—"} / ${formatYen(row.grandTotal)}`;
    const ok = window.confirm(`この取引を削除します。よろしいですか？\n\n${label}\n\n※この操作は取り消せません。`);
    if (!ok) return;

    setDeletingId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/b2b/${encodeURIComponent(row.id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(`削除に失敗しました（HTTP ${res.status}）`);
        return;
      }
      setRows((prev) => prev.filter((x) => x.id !== row.id));
    } catch {
      setError("削除に失敗しました。");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchList("");
  }, []);

  const hasQuery = useMemo(() => !!q.trim(), [q]);

  return (
    <main className="min-h-screen bg-washi py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="m-0 text-xl font-semibold text-tea-deep">B2B 取引一覧</h1>
            <p className="m-0 mt-1 text-[0.875rem] text-ink-muted">
              検索対象：タイトル / 顧客名 / メールアドレス / メモ
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/b2b/new"
              className="inline-flex items-center justify-center rounded-lg border-2 border-tea bg-tea px-4 py-2 font-semibold text-white hover:bg-tea-light hover:border-tea-light"
            >
              新規作成
            </Link>
          </div>
        </div>

        <form
          className="flex flex-col sm:flex-row gap-2 mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            fetchList(q);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="例: 山田 / yamada@example.com / 見積 / メモ"
            className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-ink"
          />
          <button
            type="submit"
            className="rounded-lg border-2 border-tea bg-white px-4 py-2 font-semibold text-tea hover:bg-cream"
          >
            検索
          </button>
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                fetchList("");
              }}
              className="rounded-lg border border-border bg-white px-4 py-2 font-semibold text-ink-muted hover:bg-cream"
            >
              クリア
            </button>
          )}
        </form>

        {error && (
          <div className="mb-4 rounded-lg border border-border bg-white p-3 text-red-700">{error}</div>
        )}

        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[860px] border-collapse text-[0.9375rem]">
            <thead className="bg-[#f3f4f6]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-ink">送信日時</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">顧客名</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">メール</th>
                <th className="text-right px-4 py-3 font-semibold text-ink">総合計</th>
                <th className="text-left px-4 py-3 font-semibold text-ink">ステータス</th>
                <th className="text-right px-4 py-3 font-semibold text-ink">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-ink-muted" colSpan={6}>
                    読み込み中…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-ink-muted" colSpan={6}>
                    {hasQuery ? "該当なし" : "まだ取引がありません"}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-washi">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/admin/b2b/${encodeURIComponent(r.id)}`} className="font-semibold text-tea hover:underline">
                        {formatDt(r.sentAt)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{r.customerName ?? "—"}</td>
                    <td className="px-4 py-3">{r.customerEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(r.grandTotal)}</td>
                    <td className="px-4 py-3">{statusLabel(r.status)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(r)}
                        disabled={deletingId === r.id}
                        className="rounded border border-red-200 bg-white px-3 py-1 text-[0.8125rem] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === r.id ? "削除中…" : "削除"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

