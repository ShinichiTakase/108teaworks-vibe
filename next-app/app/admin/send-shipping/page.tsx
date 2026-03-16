"use client";

import { useState } from "react";

export default function AdminSendShippingPage() {
  const [adminKey, setAdminKey] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/admin/send-shipping-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey,
          toEmail: toEmail.trim(),
          orderNo: orderNo.trim(),
          trackingNumber: trackingNumber.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("ok");
        setMessage("発送完了メールを送信しました。");
        setToEmail("");
        setOrderNo("");
        setTrackingNumber("");
      } else {
        setStatus("error");
        const err =
          data.error === "unauthorized"
            ? "認証キーが正しくありません。"
            : data.error === "invalid_email"
              ? "送信先メールアドレスを確認してください。"
              : data.error === "invalid_order_no"
                ? "注文番号を入力してください。"
                : data.error === "not_configured"
                  ? "サーバーに ADMIN_SHIPPING_SECRET が設定されていません。"
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
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-xl font-semibold text-tea-deep">発送完了メール送信</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminKey" className="block text-sm font-medium text-ink mb-1">
              認証キー
            </label>
            <input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
              className="w-full rounded border border-border bg-white px-3 py-2 text-ink"
              placeholder="ADMIN_SHIPPING_SECRET の値"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="toEmail" className="block text-sm font-medium text-ink mb-1">
              送信先メールアドレス <span className="text-red-600">*</span>
            </label>
            <input
              id="toEmail"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              required
              className="w-full rounded border border-border bg-white px-3 py-2 text-ink"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label htmlFor="orderNo" className="block text-sm font-medium text-ink mb-1">
              注文番号 <span className="text-red-600">*</span>
            </label>
            <input
              id="orderNo"
              type="text"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              required
              className="w-full rounded border border-border bg-white px-3 py-2 text-ink"
              placeholder="例: R-20250314120000"
            />
          </div>
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-ink mb-1">
              お問い合わせ番号・追跡番号（任意）
            </label>
            <input
              id="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full rounded border border-border bg-white px-3 py-2 text-ink"
              placeholder="例: 1234-5678-9012"
            />
          </div>
          {message && (
            <p
              className={`text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`}
              role="alert"
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-lg border-2 border-tea bg-tea py-3 px-4 font-semibold text-white transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50"
          >
            {status === "sending" ? "送信中…" : "発送完了メールを送信"}
          </button>
        </form>
        <p className="mt-6 text-[0.8125rem] text-ink-muted">
          注文確定時に届いたメールの送信元アドレス・注文番号（R-で始まる番号）を入力して送信してください。追跡番号がある場合は入力するとメールに記載されます。
        </p>
      </div>
    </main>
  );
}
