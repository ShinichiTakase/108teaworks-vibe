"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
const stripePromise = loadStripe(STRIPE_PK);

type Line = { productName?: string; quantity?: number; unitPrice?: number; lineTotal?: number };
type Item = {
  id: string;
  title?: string;
  customerName?: string;
  customerEmail?: string;
  lines?: Line[];
  itemsTotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  grandTotal?: number;
  expiresAt?: string;
  paidAt?: string;
  status?: string;
  stripePaymentIntentId?: string;
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

export default function B2bPayPage({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [paying, setPaying] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const paymentIntentIdRef = useRef<string | null>(null);
  const clientSecretRef = useRef<string | null>(null);

  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const paymentElementRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const amount = useMemo(() => Math.round(item?.grandTotal ?? 0), [item?.grandTotal]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/b2b/${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
          const msg =
            data?.error === "expired"
              ? "このURLは有効期限が切れています。"
              : data?.error === "not_found"
                ? "リンクが見つかりませんでした。"
                : `表示に失敗しました（HTTP ${res.status}）`;
          if (!cancelled) setError(msg);
          if (!cancelled) setItem(null);
          return;
        }
        if (!cancelled) setItem(data.item as Item);
      } catch {
        if (!cancelled) setError("表示に失敗しました。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Stripe Payment Element mount (PI を先に作って clientSecret で初期化する)
  useEffect(() => {
    if (!STRIPE_PK) return;
    if (!cardContainerRef.current) return;
    if (!item) return;
    if (amount < 1) return;
    if (item.paidAt) return;

    let cancelled = false;
    (async () => {
      try {
        setCardReady(false);
        setError(null);
        if (!stripeRef.current) stripeRef.current = await stripePromise;
        const stripe = stripeRef.current;
        if (!stripe || cancelled) return;

        // 1) PaymentIntent を作成（または再作成）
        const payRes = await fetch("/api/checkout/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            billing: { name: item.customerName, email: item.customerEmail },
            cancelPreviousId: paymentIntentIdRef.current ?? undefined,
          }),
        });
        const payData = await payRes.json().catch(() => null);
        const clientSecret = payData?.clientSecret;
        const piId = payData?.id;
        if (!payRes.ok || typeof clientSecret !== "string" || clientSecret.length < 10) {
          throw new Error("payment_intent_create_failed");
        }
        if (typeof piId === "string" && piId.startsWith("pi_")) paymentIntentIdRef.current = piId;
        clientSecretRef.current = clientSecret;

        // 2) elements を clientSecret で初期化して Payment Element をマウント
        // すでに elements がある場合は作り直す（clientSecret は後から差し替えできないため）
        try {
          paymentElementRef.current?.destroy?.();
        } catch {
          // noop
        }
        paymentElementRef.current = null;
        elementsRef.current = null;

        const elements = stripe.elements({
          clientSecret,
          appearance: { theme: "stripe" },
        } as any);
        elementsRef.current = elements;
        const paymentElement = elements.create("payment", {
          fields: { billingDetails: "never" },
        } as any);
        paymentElementRef.current = paymentElement;
        paymentElement.mount(cardContainerRef.current!);
        paymentElement.on("ready", () => {
          if (!cancelled) setCardReady(true);
        });
        window.setTimeout(() => {
          if (!cancelled) setCardReady(true);
        }, 1500);
      } catch (e) {
        console.error("[b2b] stripe init failed", e);
        if (!cancelled) setError("決済の初期化に失敗しました。少し時間をおいて再読み込みしてください。");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item, amount]);

  const handlePay = async () => {
    if (!item) return;
    if (item.paidAt) return;
    if (!stripeRef.current || !elementsRef.current) return;
    if (paying) return;
    const clientSecret = clientSecretRef.current;
    if (!clientSecret) {
      setError("決済の初期化が完了していません。再読み込みしてください。");
      return;
    }

    try {
      setPaying(true);
      setError(null);

      const { error: submitError } = await (elementsRef.current as any).submit();
      if (submitError) {
        setError(submitError.message ?? "支払い情報を確認してください。");
        return;
      }

      const stripe = stripeRef.current;
      const result = await stripe.confirmPayment({
        elements: elementsRef.current,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/b2b/${encodeURIComponent(token)}/`,
          payment_method_data: {
            billing_details: {
              name: item.customerName,
              email: item.customerEmail,
            },
          },
        },
        redirect: "if_required",
      } as any);

      if (result.error) {
        console.error("[b2b] confirmPayment error", result.error);
        setError(result.error.message ?? "決済に失敗しました。");
        return;
      }
      const pi = result.paymentIntent;
      if (!pi || pi.status !== "succeeded") {
        setError("決済ステータスの確認に失敗しました。");
        return;
      }

      const completeRes = await fetch(`/api/b2b/${encodeURIComponent(token)}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: pi.id }),
      });
      const completeData = await completeRes.json().catch(() => null);
      if (!completeRes.ok || !completeData?.ok) {
        setError("決済は完了しましたが、反映処理に失敗しました。管理者へご連絡ください。");
        return;
      }

      // 再取得して表示更新
      const again = await fetch(`/api/b2b/${encodeURIComponent(token)}`, { cache: "no-store" });
      const againData = await again.json().catch(() => null);
      if (again.ok && againData?.ok) setItem(againData.item as Item);
    } catch (e) {
      console.error("[b2b] pay failed", e);
      setError("決済に失敗しました。");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-washi py-10 px-4">
        <div className="mx-auto max-w-3xl text-ink-muted">読み込み中…</div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-washi py-10 px-4">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-4 text-red-700">
          {error ?? "表示できませんでした。"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-washi py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="m-0 text-xl font-semibold text-tea-deep">{item.title ?? "お支払いページ"}</h1>
        <p className="m-0 mt-1 text-[0.875rem] text-ink-muted">
          {item.customerName ?? "お客様"}様 / 有効期限: {formatDt(item.expiresAt)}
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[680px] border-collapse text-[0.9375rem]">
            <thead className="bg-[#f3f4f6]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-ink">商品名</th>
                <th className="text-center px-4 py-3 font-semibold text-ink">数量</th>
                <th className="text-right px-4 py-3 font-semibold text-ink">単価</th>
                <th className="text-right px-4 py-3 font-semibold text-ink">合計</th>
              </tr>
            </thead>
            <tbody>
              {(item.lines ?? []).map((l, i) => {
                const qty = typeof l.quantity === "number" ? l.quantity : 0;
                const unit = typeof l.unitPrice === "number" ? l.unitPrice : 0;
                const total =
                  typeof l.lineTotal === "number" && Number.isFinite(l.lineTotal) ? l.lineTotal : qty * unit;
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3">{l.productName ?? "—"}</td>
                    <td className="px-4 py-3 text-center">{qty}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(unit)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(total)}</td>
                  </tr>
                );
              })}
              <tr className="border-t border-border">
                <td className="px-4 py-3" colSpan={2}></td>
                <td className="px-4 py-3 text-right text-ink-muted">商品合計</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(item.itemsTotal)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3" colSpan={2}></td>
                <td className="px-4 py-3 text-right text-ink-muted">送料</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(item.shippingFee)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3" colSpan={2}></td>
                <td className="px-4 py-3 text-right text-ink-muted">消費税</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{formatYen(item.taxAmount)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3" colSpan={2}></td>
                <td className="px-4 py-3 text-right font-semibold text-tea-deep">総合計</td>
                <td className="px-4 py-3 text-right font-bold text-tea-deep whitespace-nowrap">{formatYen(item.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {item.paidAt ? (
          <div className="mt-6 rounded-xl border border-border bg-white p-4 text-green-700">
            お支払いが完了しました（{formatDt(item.paidAt)}）
            {item.stripePaymentIntentId ? (
              <div className="mt-2 text-[0.8125rem] text-ink-muted">PaymentIntent: {item.stripePaymentIntentId}</div>
            ) : null}
          </div>
        ) : !STRIPE_PK ? (
          <div className="mt-6 rounded-xl border border-border bg-white p-4 text-red-700">
            決済を開始できません（Stripeの公開キーが未設定です）。
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-border bg-white p-5">
            <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">お支払い</h2>
            <div className="rounded-lg border-2 border-border bg-white p-3 min-h-[120px]">
              <div ref={cardContainerRef} />
            </div>
            {error && <p className="m-0 mt-3 text-sm text-red-700">{error}</p>}
            <button
              type="button"
              onClick={handlePay}
              disabled={paying || !cardReady}
              className="mt-4 w-full rounded-lg border-2 border-tea bg-tea py-3 px-4 font-semibold text-white hover:bg-tea-light hover:border-tea-light disabled:opacity-50"
            >
              {paying ? "決済中…" : `カードで支払う（${formatYen(item.grandTotal)}）`}
            </button>
            <p className="m-0 mt-3 text-[0.8125rem] text-ink-muted">
              クレジットカード決済はStripeを利用しています。
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

