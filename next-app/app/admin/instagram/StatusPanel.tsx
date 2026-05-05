"use client";
import { useCallback, useEffect, useState } from "react";
import RefreshButton from "./RefreshButton";

type TokenStatus = {
  hasToken: boolean;
  expiresAt: string | null;
  daysRemaining: number | null;
  obtainedAt: string | null;
  source: "file" | "env" | "none";
};

function daysColor(d: number | null): string {
  if (d === null) return "text-ink-muted";
  if (d <= 0) return "text-red-600 font-bold";
  if (d <= 14) return "text-orange-500 font-semibold";
  if (d <= 30) return "text-yellow-600";
  return "text-green-700";
}

export default function StatusPanel() {
  const [status, setStatus] = useState<TokenStatus | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/instagram/status");
    setStatus((await res.json()) as TokenStatus);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!status) {
    return <p className="text-sm text-ink-muted">読み込み中...</p>;
  }

  const sourceLabel =
    status.source === "file"
      ? "data/instagram_token.json"
      : status.source === "env"
      ? ".env (未初期化)"
      : "なし";

  return (
    <div className="rounded border border-border bg-white p-6 space-y-5">
      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-ink-muted">状態</dt>
        <dd>{status.hasToken ? "トークンあり" : "トークンなし"}</dd>

        <dt className="text-ink-muted">保存場所</dt>
        <dd className="font-mono text-xs">{sourceLabel}</dd>

        <dt className="text-ink-muted">有効期限</dt>
        <dd>
          {status.expiresAt
            ? new Date(status.expiresAt).toLocaleDateString("ja-JP")
            : "不明"}
        </dd>

        <dt className="text-ink-muted">残り日数</dt>
        <dd className={daysColor(status.daysRemaining)}>
          {status.daysRemaining !== null ? `${status.daysRemaining} 日` : "不明"}
        </dd>

        <dt className="text-ink-muted">最終取得日</dt>
        <dd>
          {status.obtainedAt
            ? new Date(status.obtainedAt).toLocaleDateString("ja-JP")
            : "—"}
        </dd>
      </dl>

      <div className="border-t border-border pt-4 space-y-2">
        <RefreshButton onRefreshed={load} />
        <p className="text-xs text-ink-muted">
          残り 30 日を切ると次回のトップページ表示時に自動更新されます。
        </p>
      </div>
    </div>
  );
}
