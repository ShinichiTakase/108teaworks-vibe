"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function FloatingCartBar() {
  const pathname = usePathname();
  const { items } = useCart();
  if (pathname === "/cart" || pathname === "/checkout" || items.length === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed right-0 top-1/2 z-50 -translate-y-1/2 flex items-center gap-2 py-3 pl-4 pr-3 rounded-l-lg border-2 border-r-0 border-tea bg-tea text-white no-underline font-semibold text-[0.9375rem] shadow-lg hover:bg-tea-light hover:border-tea-light transition-colors"
      aria-label="カートに移動"
    >
      <span className="inline-block w-5 h-5 shrink-0 text-white" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </span>
      <span>カートに移動</span>
    </Link>
  );
}
