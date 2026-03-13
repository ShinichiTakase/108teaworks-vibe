"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

const NAV_KEYS = [
  { key: "products" as const, href: "/" },
  { key: "about" as const, href: "/about" },
  { key: "isecha" as const, href: "/isecha" },
  { key: "howToBrew" as const, href: "/how-to-brew" },
  { key: "userGuide" as const, href: "/user-guide" },
  { key: "notice" as const, href: "/notice" },
  { key: "wholesale" as const, href: "/wholesale" },
] as const;

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

function buildLocalizedHref(locale: Locale, href: string): string {
  if (locale === "ja") return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function GlobalNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = detectLocaleFromPath(pathname || "/");
  const t = COMMON_TEXTS[locale];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      window.location.href = href;
    }
    setOpen(false);
  };

  const linkClass = "no-underline font-semibold hover:text-tea-deep hover:underline underline-offset-4";
  const linkClassMobile = "block px-4 py-1.5 text-sm font-semibold text-ink no-underline hover:bg-washi";

  return (
    <div className="relative bg-cream">
      <nav
        aria-label={t.aria.mainMenu}
        className="hidden md:flex justify-center py-3 text-[1rem] text-ink"
      >
        <ul className="flex flex-wrap justify-center gap-4">
          {NAV_KEYS.map((item) => {
            const localized = buildLocalizedHref(locale, item.href);
            const label = t.nav[item.key];
            return (
              <li key={item.key}>
                <Link
                  href={localized}
                  className={linkClass}
                  onClick={(e) => handleNavClick(e, localized)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="md:hidden">
        <div className="flex justify-end pr-3 pt-1 pb-1">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border bg-cream/90 px-3 py-0.5 text-ink shadow-sm"
            aria-label={t.aria.menuButton}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="mr-2 text-sm font-semibold">Menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-4 bg-ink rounded" />
              <span className="block h-[2px] w-4 bg-ink rounded" />
              <span className="block h-[2px] w-4 bg-ink rounded" />
            </span>
          </button>
        </div>
        {open && (
          <div className="mt-2 pb-2 px-2">
            <div className="rounded-lg bg-cream/95 shadow-lg py-2 text-sm text-left min-w-[9rem] ml-auto max-w-xs">
              {NAV_KEYS.map((item) => {
                const localized = buildLocalizedHref(locale, item.href);
                const label = t.nav[item.key];
                return (
                  <Link
                    key={item.key}
                    href={localized}
                    className={linkClassMobile}
                    onClick={(e) => handleNavClick(e, localized)}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

