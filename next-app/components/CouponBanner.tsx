"use client";

import Link from "next/link";

const ITEMS = [
  { text: "【特集】緑茶とコレステロールの健やかな関係", href: "/ise-cha/catechin/" },
  { text: "【特集】お茶とカフェインの知っておきたい関係", href: "/ise-cha/caffeine/" },
  { text: "【特集】抹茶とパウダー緑茶、それぞれの個性", href: "/ise-cha/maccha/" },
  { text: "【特集】ニューヨークの日本茶ブーム", href: "/ise-cha/america/" },
];

export default function CouponBanner() {
  return (
    <div
      className="overflow-hidden border-b border-tea-light/30 bg-tea-deep/[0.06] py-2.5"
      role="complementary"
      aria-label="特集記事のご案内"
    >
      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <Link
              href={item.href}
              className="px-8 text-[0.875rem] font-medium tracking-wide text-tea-deep no-underline underline-offset-2 hover:underline"
            >
              {item.text}
            </Link>
            <span className="select-none text-tea-light/40" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
