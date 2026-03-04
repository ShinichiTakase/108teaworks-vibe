"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "商品一覧", href: "#" },
  { label: "藤八茶寮について", href: "#" },
  { label: "伊勢茶とは", href: "#" },
  { label: "お茶の淹れ方", href: "#" },
  { label: "ご利用案内", href: "#" },
  { label: "パートナー募集", href: "#" },
  { label: "お問い合せ", href: "#" },
];

export default function GlobalNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-cream">
      {/* デスクトップ：メインメニュー */}
      <nav
        aria-label="メインメニュー"
        className="hidden md:flex justify-center py-3 text-[1rem] text-ink"
      >
        <ul className="flex flex-wrap gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="no-underline font-semibold hover:text-tea-deep hover:underline underline-offset-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* タブレット・スマートフォン：右上ハンバーガーメニュー */}
      <div className="md:hidden">
        <div className="flex justify-end pr-3 pt-1 pb-1">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border bg-cream/90 px-3 py-0.5 text-xs text-ink shadow-sm"
            aria-label="メニュー"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="mr-2">Menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-4 bg-ink rounded" />
              <span className="block h-[2px] w-4 bg-ink rounded" />
              <span className="block h-[2px] w-4 bg-ink rounded" />
            </span>
          </button>
        </div>
        {open && (
          <div className="mt-2 pb-2 px-2">
            <div className="rounded-lg bg-cream/95 shadow-lg py-2 text-xs text-left min-w-[9rem] ml-auto max-w-xs">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-1.5 text-ink no-underline hover:bg-washi"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

