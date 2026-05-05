"use client";
import { useState } from "react";

export default function RefreshButton({ onRefreshed }: { onRefreshed: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/instagram/refresh", { method: "POST" });
      const data = (await res.json()) as { ok: boolean; expiresAt?: string; error?: string };
      if (data.ok && data.expiresAt) {
        const date = new Date(data.expiresAt).toLocaleDateString("ja-JP");
        setMessage({ ok: true, text: `更新成功 — 新しい有効期限: ${date}` });
        onRefreshed();
      } else {
        setMessage({ ok: false, text: data.error ?? "更新に失敗しました" });
      }
    } catch {
      setMessage({ ok: false, text: "通信エラー" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded bg-tea px-4 py-2 text-sm text-white hover:bg-tea-deep disabled:opacity-50 transition-colors"
      >
        {loading ? "更新中..." : "今すぐトークンを更新"}
      </button>
      {message && (
        <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
