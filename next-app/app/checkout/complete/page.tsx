"use client";

import { useEffect, useRef, useState } from "react";
import { CHECKOUT_COMPLETE_TEXTS } from "@/lib/checkoutCompleteTexts";
import { fbTrack } from "@/lib/metaPixel";
import {
  setEnhancedConversionUserData,
  type EnhancedConversionUserData,
} from "@/lib/googleEnhancedConversions";

type CompleteSummary = {
  items: {
    slug: string;
    name: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  shipping: number;
  total: number;
  includedTax: number;
  orderNo: string;
};

type PendingGtagWork = {
  data: CompleteSummary;
  storedUserData: string | null;
  fired: boolean;
};

type HiddenContactFields = {
  email: string;
  phone: string;
};

export default function CheckoutCompletePage() {
  const [summary, setSummary] = useState<CompleteSummary | null>(null);
  const [hiddenContact, setHiddenContact] = useState<HiddenContactFields | null>(null);
  const t = CHECKOUT_COMPLETE_TEXTS;

  // sessionStorage の読み取り・削除と、gtagの発火要否（fired）は ref に持たせ、
  // React 18 Strict Mode の開発時二重マウント（mount→cleanup→再mount）を跨いで保持する。
  // setInterval はこの二重マウントの1回目のcleanupで確実に破棄されるため、
  // 通常の state/クロージャ変数だけで管理すると、2回目のmount時にはsessionStorageが
  // 既に空になっていて再試行できず、ポーリングが二度と発火しなくなる。
  const consumedSessionStorageRef = useRef(false);
  const pendingGtagRef = useRef<PendingGtagWork | null>(null);

  useEffect(() => {
    let pollIntervalId: number | undefined;

    try {
      if (!consumedSessionStorageRef.current) {
        consumedSessionStorageRef.current = true;
        const stored = sessionStorage.getItem("lastOrderSummary");
        const storedUserData = sessionStorage.getItem("lastOrderUserData");
        sessionStorage.removeItem("lastOrderSummary");
        sessionStorage.removeItem("lastOrderUserData");

        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData) as EnhancedConversionUserData;
            setHiddenContact({
              email: userData.email ?? "",
              phone: userData.phone_number ?? "",
            });
          } catch {
            // JSON.parse失敗時は hidden フィールドを出力しない
          }
        }

        if (stored) {
          const data = JSON.parse(stored) as CompleteSummary;
          setSummary(data);
          const getCookie = (name: string) =>
            document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2] ?? "";
          try {
            fbTrack(
              "Purchase",
              {
                value: data.total,
                currency: "JPY",
                content_ids: data.items.map((i) => i.slug),
                content_type: "product",
              },
              {
                event_source_url: window.location.href,
                fbc: getCookie("_fbc"),
                fbp: getCookie("_fbp"),
              },
            );
          } catch (e) {
            console.error("[debug] fbTrack failed, continuing to gtag", e);
          }

          if (typeof window !== "undefined" && typeof (window as any).clarity === "function") {
            (window as any).clarity("set", "purchase", "true");
          }

          pendingGtagRef.current = { data, storedUserData, fired: false };
        }
      }

      const pending = pendingGtagRef.current;
      if (pending && !pending.fired) {
        // gtag.js は strategy="lazyOnload" で読み込まれるため、このuseEffect実行時点では
        // window.gtag がまだ未定義のことがある。二重発火防止フラグ（pending.fired）を立てた上で、
        // 100ms間隔・最大2秒（20回）だけポーリングしてから実行する。
        const runGtagTracking = (gtagFn: (...args: unknown[]) => void) => {
          if (pending.fired) return;
          pending.fired = true;
          const { data, storedUserData } = pending;

          // 拡張コンバージョン用の user_data は、購入コンバージョンイベントの直前に set する
          // （Google 広告の手動設定の要件：conversion イベントより先に gtag('set','user_data',...) を呼ぶ）
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData) as EnhancedConversionUserData;
              setEnhancedConversionUserData(userData);
            } catch {
              console.log("[debug] enhanced conversion skipped", {
                reason: "lastOrderUserData の JSON.parse に失敗",
              });
            }
          } else {
            console.log("[debug] enhanced conversion skipped", {
              reason:
                "sessionStorage に lastOrderUserData が無い（buildEnhancedConversionUserData が null を返した、またはチェックアウト時に保存されなかった可能性）",
            });
          }

          const purchaseEventParams = {
            transaction_id: data.orderNo,
            value: data.total,
            currency: "JPY",
            items: data.items.map((i) => ({
              item_id: i.slug,
              item_name: i.name,
              price: i.unitPrice,
              quantity: i.quantity,
            })),
          };
          try {
            gtagFn("event", "purchase", purchaseEventParams);
          } catch (e) {
            console.error("[debug] gtag purchase call THREW", e);
          }
        };

        const gtagNow = typeof window !== "undefined" ? window.gtag : undefined;
        if (typeof gtagNow === "function") {
          runGtagTracking(gtagNow);
        } else if (typeof window !== "undefined") {
          let attempts = 0;
          const maxAttempts = 20; // 100ms × 20 = 最大2秒待つ
          pollIntervalId = window.setInterval(() => {
            attempts += 1;
            const gtagPolled = window.gtag;
            if (typeof gtagPolled === "function") {
              window.clearInterval(pollIntervalId);
              pollIntervalId = undefined;
              runGtagTracking(gtagPolled);
            } else if (attempts >= maxAttempts) {
              window.clearInterval(pollIntervalId);
              pollIntervalId = undefined;
              console.log("[debug] enhanced conversion skipped", {
                reason: "window.gtag が2秒待ってもロードされなかった（gtag.js 未ロード等）",
                hasGtagFn: typeof window.gtag,
              });
            }
          }, 100);
        }
      }
    } catch (e) {
      console.error("[debug] checkout/complete useEffect error", e);
      setSummary(null);
    }

    return () => {
      if (pollIntervalId !== undefined) {
        window.clearInterval(pollIntervalId);
      }
    };
  }, []);

  const formatPrice = (n: number) => `¥${Math.round(n).toLocaleString()}`;

  return (
    <article className="mb-10 flex justify-center">
      <div className="w-[90%] max-w-[800px]">
        {hiddenContact && (
          <>
            <input type="hidden" name="phone" id="phone" value={hiddenContact.phone} />
            <input type="hidden" name="email" id="email" value={hiddenContact.email} />
          </>
        )}
        <h1 className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep">
          {t.title}
        </h1>
        <p className="mb-6 text-[0.9375rem] text-ink">
          {t.subtitle}
        </p>

        {summary && (
          <section
            className="mt-4 rounded-xl border border-border bg-washi px-4 py-4 text-[0.9375rem]"
            aria-label={t.sectionAria}
          >
          <h2 className="m-0 mb-3 text-base font-semibold text-tea-deep">
            {t.sectionTitle}
          </h2>
          <table className="w-full border-collapse text-[0.875rem]">
            <thead>
              <tr className="bg-cream">
                <th className="border border-border px-2 py-1 text-left">{t.thProduct}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thQty}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thUnitPrice}</th>
                <th className="border border-border px-2 py-1 text-right">{t.thAmount}</th>
              </tr>
            </thead>
            <tbody>
              {summary.items.map((it, idx) => (
                <tr key={`${it.name}-${idx}`}>
                  <td className="border border-border px-2 py-1 align-top">
                    {it.name}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {it.quantity}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {formatPrice(it.unitPrice)}
                  </td>
                  <td className="border border-border px-2 py-1 text-right align-top">
                    {formatPrice(it.amount)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right">
                  {t.shipping}
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.shipping)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  {t.total}
                </td>
                <td className="border border-border px-2 py-1 text-right font-semibold">
                  {formatPrice(summary.total)}
                </td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1" />
                <td className="border border-border px-2 py-1 text-right">
                  {t.includedTax}
                </td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatPrice(summary.includedTax)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-right text-[0.875rem] text-ink-muted">
            {t.orderNoLabel}<span className="font-semibold">{summary.orderNo}</span>
          </div>
        </section>
        )}
      </div>
    </article>
  );
}

