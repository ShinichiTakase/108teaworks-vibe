"use client";

import { useState } from "react";
import { usePaymentRequestAvailability } from "@/hooks/usePaymentRequestAvailability";

type Props = {
  amount: number;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

function createPaymentRequestAndShow(
  supportedMethod: string,
  amountYen: number
): Promise<PaymentResponse | null> {
  if (typeof window === "undefined" || !("PaymentRequest" in window)) return Promise.resolve(null);
  const value = String(Math.round(amountYen));
  try {
    const request = new PaymentRequest(
      [{ supportedMethods: supportedMethod }],
      {
        total: { label: "合計", amount: { currency: "JPY", value } },
      }
    );
    return request.show();
  } catch {
    return Promise.resolve(null);
  }
}

export default function PaymentRequestButtons({
  amount,
  disabled = false,
  onSuccess,
  onError,
}: Props) {
  const { googlePay, applePay, loading } = usePaymentRequestAvailability();
  const [pending, setPending] = useState<"google" | "apple" | null>(null);

  const handlePay = async (method: "https://google.com/pay" | "https://apple.com/apple-pay") => {
    if (amount <= 0 || disabled) return;
    setPending(method === "https://google.com/pay" ? "google" : "apple");
    try {
      const response = await createPaymentRequestAndShow(method, amount);
      if (response) {
        await response.complete("success");
        onSuccess?.();
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setPending(null);
    }
  };

  if (loading) return null;

  if (!googlePay && !applePay) {
    return (
      <p className="m-0 text-[0.75rem] text-ink-muted">
        Google Pay / Apple Pay は対応ブラウザ・お支払い設定が有効な場合にのみ表示されます。
      </p>
    );
  }

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      {googlePay && (
        <button
          type="button"
          disabled={disabled || pending !== null}
          onClick={() => handlePay("https://google.com/pay")}
          className="flex-1 min-w-0 py-3 px-4 rounded-lg border-2 border-border bg-[#4285f4] text-white text-[0.9375rem] font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Google Payで支払う"
        >
          {pending === "google" ? "処理中…" : "Google Payで買う"}
        </button>
      )}
      {applePay && (
        <button
          type="button"
          disabled={disabled || pending !== null}
          onClick={() => handlePay("https://apple.com/apple-pay")}
          className="flex-1 min-w-0 py-3 px-4 rounded-lg border-2 border-border bg-black text-white text-[0.9375rem] font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Apple Payで支払う"
        >
          {pending === "apple" ? "処理中…" : "Apple Payで買う"}
        </button>
      )}
    </div>
  );
}
