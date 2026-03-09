"use client";

import { useState, useEffect } from "react";

const PAYMENT_REQUEST_SUPPORTED =
  typeof window !== "undefined" && "PaymentRequest" in window;

function createPaymentRequest(supportedMethod: string): PaymentRequest | null {
  if (!PAYMENT_REQUEST_SUPPORTED) return null;
  try {
    return new PaymentRequest(
      [{ supportedMethods: supportedMethod }],
      {
        total: { label: "合計", amount: { currency: "JPY", value: "0" } },
      }
    );
  } catch {
    return null;
  }
}

export type PaymentRequestAvailability = {
  googlePay: boolean;
  applePay: boolean;
  loading: boolean;
};

export function usePaymentRequestAvailability(): PaymentRequestAvailability {
  const [state, setState] = useState<PaymentRequestAvailability>({
    googlePay: false,
    applePay: false,
    loading: true,
  });

  useEffect(() => {
    if (!PAYMENT_REQUEST_SUPPORTED) {
      setState({ googlePay: false, applePay: false, loading: false });
      return;
    }

    let cancelled = false;

    const check = async () => {
      const results = { googlePay: false, applePay: false };

      try {
        // Safari / iOS: ApplePaySession で Apple Pay 利用可否を判定
        const ApplePaySession = typeof window !== "undefined" ? (window as unknown as { ApplePaySession?: { canMakePayment(): Promise<boolean> } }).ApplePaySession : undefined;
        if (ApplePaySession) {
          try {
            const canApple = await ApplePaySession.canMakePayment();
            if (cancelled) return;
            results.applePay = canApple === true;
          } catch {
            // ignore
          }
        }

        if (PAYMENT_REQUEST_SUPPORTED) {
          const googlePayRequest = createPaymentRequest("https://google.com/pay");
          if (googlePayRequest) {
            const canGoogle = await googlePayRequest.canMakePayment();
            if (cancelled) return;
            results.googlePay = Boolean(
              canGoogle === true || (typeof canGoogle === "object" && canGoogle !== null && (canGoogle as { googlePay?: boolean }).googlePay)
            );
          }

          if (!results.applePay) {
            const applePayRequest = createPaymentRequest("https://apple.com/apple-pay");
            if (applePayRequest) {
              const canApple = await applePayRequest.canMakePayment();
              if (cancelled) return;
              results.applePay = Boolean(
                canApple === true || (typeof canApple === "object" && canApple !== null && (canApple as { applePay?: boolean }).applePay)
              );
            }
          }
        }
      } catch {
        // ignore
      }

      if (!cancelled) {
        setState({ ...results, loading: false });
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
