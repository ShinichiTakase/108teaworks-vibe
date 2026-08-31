"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { buildHref } from "@/lib/urlPath";

const CHECKOUT_PATH_RE = /^\/checkout(\/|$)/;

export default function CartAddedPopup() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { lastAdded, clearLastAdded } = useCart();
  const checkoutHref = buildHref("/checkout");
  /** 「今すぐ買う」系ボタンでカート追加と同時にcheckoutへ遷移した直後は、
   * このポップアップがcheckoutページ上に出る。checkout自体は「買い物を続ける」先として
   * 意味を持たないため、その場合だけ遷移元へ戻る */
  const isOnCheckout = CHECKOUT_PATH_RE.test(pathname);

  const handleContinueShopping = () => {
    clearLastAdded();
    if (isOnCheckout) {
      router.back();
    }
  };

  if (!lastAdded) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={handleContinueShopping}
        aria-hidden="true"
      />

      {/* popup */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          border: "2px solid rgba(45, 80, 22, 0.65)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="カートに追加しました"
      >
        {/* ヘッダー */}
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid rgba(45, 80, 22, 0.25)" }}
        >
          <p className="text-xl font-bold tracking-wide" style={{ color: "#2d5016" }}>
            ★ カートに入れました
          </p>
        </div>

        {/* 商品情報 */}
        <div className="px-6 py-4">
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: "#2d5016" }}
          >
            {lastAdded.title}
          </p>
          <div
            className="flex justify-between items-center mt-3 text-sm"
            style={{ color: "#2d5016" }}
          >
            <span>{lastAdded.quantity}点</span>
            <span className="font-semibold text-base">
              ¥{(lastAdded.price * lastAdded.quantity).toLocaleString()}
              <span className="text-xs font-normal ml-1">（税込）</span>
            </span>
          </div>
        </div>

        {/* ボタン */}
        <div
          className="px-6 pb-6 flex gap-3"
          style={{ borderTop: "1px solid rgba(45, 80, 22, 0.15)" }}
        >
          <button
            type="button"
            onClick={handleContinueShopping}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-green-50"
            style={{
              border: "2px solid rgba(45, 80, 22, 0.55)",
              color: "#2d5016",
              backgroundColor: "white",
              marginTop: "1rem",
            }}
          >
            買い物を続ける
          </button>
          <Link
            href={checkoutHref}
            onClick={clearLastAdded}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center no-underline transition-opacity hover:opacity-90"
            style={{
              border: "2px solid rgba(45, 80, 22, 0.8)",
              color: "white",
              backgroundColor: "rgba(45, 80, 22, 0.88)",
              marginTop: "1rem",
            }}
          >
            購入手続きへ
          </Link>
        </div>
      </div>
    </div>
  );
}
