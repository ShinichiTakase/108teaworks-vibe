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

const MailIcon = ({ className }: { className?: string }) => (
  <span className={`inline-block w-[1.1em] h-[1.1em] ${className ?? ""}`} aria-hidden="true">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
      <polyline points="3 7 12 13 21 7" />
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
        href="/inquery"
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-tea-deep no-underline hover:text-tea hover:underline"
      >
        <span className="flex-shrink-0 w-[1.1em] h-[1.1em] inline-block">
          <MailIcon className="w-full h-full" />
        </span>
        お問い合せ
      </Link>
    </div>
  );
}
