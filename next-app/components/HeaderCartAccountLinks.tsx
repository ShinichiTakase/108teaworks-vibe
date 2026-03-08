"use client";

import Link from "next/link";

const CartIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block w-[1.1em] h-[1.1em] ${className ?? ""}`} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  </span>
);

export default function HeaderCartAccountLinks() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-tea-deep no-underline hover:text-tea hover:underline"
      >
        <span className="flex-shrink-0 w-[1.1em] h-[1.1em]">
          <CartIcon className="w-full h-full" />
        </span>
        カート
      </Link>
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-tea-deep no-underline hover:text-tea hover:underline"
      >
        <span className="flex-shrink-0 w-[1.1em] h-[1.1em] inline-block" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        マイアカウント
      </Link>
    </div>
  );
}
