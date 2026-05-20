"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildLocalizedHref, detectLocaleFromPath } from "@/lib/urlPath";

export default function FloatingCartBar() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
  const t = COMMON_TEXTS[locale];

  const FREE_SHIPPING_THRESHOLD = 10000;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const rankSum = items.reduce((sum, i) => sum + (i.shipRank ?? 0) * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : rankSum <= 6.0 ? 380 : 880;
  const shippingLabel = shipping === 0 ? t.cart.shippingFreeShort : `¥${shipping.toLocaleString()}`;
  const checkoutHref = buildLocalizedHref(locale, "/checkout");
  const isCartOrCheckout =
    /^\/cart(\/|$)/.test(pathname) ||
    /^\/checkout(\/|$)/.test(pathname) ||
    /^\/(en|ko|zh)\/(cart|checkout)(\/|$)/.test(pathname);
  if (isCartOrCheckout || cartItemCount === 0) return null;

  const activeItems = items.filter((item) => item.quantity > 0);

  return (
    <div
      className="fixed right-0 z-50 flex flex-col w-52 rounded-l-xl overflow-hidden shadow-xl bottom-[60px] sm:bottom-[max(calc(35%_+_4em),294px)]"
    >
      {/* 購入手続きへ — 緑・半透過 */}
      <Link
        href={checkoutHref}
        className="flex items-center gap-2 px-4 py-3 text-white no-underline font-semibold text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: "rgba(45, 80, 22, 0.88)" }}
        aria-label={`${t.floatingCheckout}（カート${cartItemCount}点）`}
      >
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>
        <span className="whitespace-nowrap">{t.floatingCheckout}</span>
      </Link>

      {/* 商品一覧 — スクロール対象はアイテムのみ */}
      <div
        className="overflow-y-auto max-h-32"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          borderLeft: "2px solid rgba(45, 80, 22, 0.45)",
        }}
      >
        {activeItems.map((item, index) => (
          <div
            key={item.slug}
            className="px-3 py-2"
            style={{
              borderTop: index === 0 ? "none" : "1px solid rgba(45, 80, 22, 0.22)",
              color: "#2d5016",
            }}
          >
            <div className="text-xs font-medium leading-tight line-clamp-2">{item.title}</div>
            <div className="flex justify-between items-center text-xs mt-0.5 opacity-90">
              <span>×{item.quantity}</span>
              <span className="font-semibold">¥{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 送料・合計・送料無料メッセージ — 常に表示 */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          borderLeft: "2px solid rgba(45, 80, 22, 0.45)",
          borderBottom: "2px solid rgba(45, 80, 22, 0.45)",
        }}
      >
        <div
          className="px-3 py-1.5 flex justify-between items-center text-xs"
          style={{
            borderTop: "1px solid rgba(45, 80, 22, 0.30)",
            color: "#2d5016",
          }}
        >
          <span>{t.cart.shipping}</span>
          <span className="font-semibold">{shippingLabel}</span>
        </div>
        <div
          className="px-3 py-2 flex justify-between items-center text-sm font-bold"
          style={{
            borderTop: "1px solid rgba(45, 80, 22, 0.45)",
            color: "#2d5016",
            backgroundColor: "rgba(240, 248, 230, 0.70)",
          }}
        >
          <span>{t.cart.total}</span>
          <span>¥{(subtotal + shipping).toLocaleString()}</span>
        </div>
        {subtotal >= FREE_SHIPPING_THRESHOLD * 0.5 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <div
            className="px-3 py-1.5 text-xs text-center font-medium"
            style={{
              borderTop: "1px solid rgba(45, 80, 22, 0.30)",
              color: "#2d5016",
              backgroundColor: "rgba(240, 248, 230, 0.70)",
            }}
          >
            {t.cart.freeShippingRemainPrefix}¥{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{t.cart.freeShippingRemain}
          </div>
        )}
      </div>
    </div>
  );
}
