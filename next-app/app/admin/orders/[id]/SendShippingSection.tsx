"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  id: string;
  toEmail: string;
  orderNo: string;
};

export default function SendShippingSection({ id, toEmail, orderNo }: Props) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSend() {
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders/send-shipping-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          toEmail,
          orderNo,
          trackingNumber: trackingNumber.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage("発送完了メールを送信しました。");
        router.refresh();
      } else {
        setStatus("error");
        const err =
          data.error === "invalid_email"
            ? "送信先メールアドレスを確認してください。"
            : data.error === "self_send"
              ? "送信元・管理者アドレスには送信できません。"
              : data.error === "invalid_order_no"
                ? "注文番号を確認してください。"
                : data.error === "smtp_not_configured"
                  ? "メール送信の設定がありません。"
                  : "送信に失敗しました。";
        setMessage(err);
      }
    } catch {
      setStatus("error");
      setMessage("送信に失敗しました。");
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label htmlFor="trackingNumber" className="block text-sm font-medium text-ink mb-1">
          お問い合わせ番号・追跡番号（任意）
        </label>
        <input
          id="trackingNumber"
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          disabled={status === "sending"}
          className="w-full rounded border border-border bg-white px-3 py-2 text-ink disabled:opacity-50"
          placeholder="例: 1234-5678-9012"
        />
      </div>

      {message && (
        <p className={`text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`} role="alert">
          {message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link
          href="/admin/orders/"
          className="rounded border border-border px-4 py-2 text-sm text-ink no-underline hover:bg-cream"
        >
          戻る
        </Link>
        <button
          type="button"
          onClick={handleSend}
          disabled={status === "sending"}
          className="rounded-lg border-2 border-tea bg-tea px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50"
        >
          {status === "sending" ? "送信中…" : "発送完了メール送信"}
        </button>
      </div>
    </div>
  );
}
