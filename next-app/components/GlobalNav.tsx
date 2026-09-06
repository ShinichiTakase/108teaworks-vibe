"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildHref } from "@/lib/urlPath";

const NAV_KEYS = [
  { key: "top" as const, href: "/" },
  { key: "about" as const, href: "/about" },
  { key: "isecha" as const, href: "/ise-cha" },
  { key: "howToBrew" as const, href: "/how-to-brew" },
  { key: "faq" as const, href: "/faq" },
  { key: "userGuide" as const, href: "/user-guide" },
  { key: "notice" as const, href: "/notice" },
  { key: "wholesale" as const, href: "/wholesale" },
] as const;

export default function GlobalNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = COMMON_TEXTS;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      e.preventDefault();
      router.refresh();
    }
    setOpen(false);
  };

  const linkClass = "no-underline font-semibold hover:text-tea-deep hover:underline underline-offset-4";

  return (
    <div className="relative bg-cream">
      <nav
        aria-label={t.aria.mainMenu}
        className="hidden md:flex justify-center py-3 text-[1rem] text-ink"
      >
        <ul className="flex flex-wrap justify-center gap-4">
          {NAV_KEYS.map((item) => {
            const localized = buildHref(item.href);
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

      {/* スマホ: 画面上端付近にフローティング（右配置） */}
      <div className="md:hidden">
        <button
          type="button"
          className="fixed right-0 z-50 flex h-12 w-12 items-center justify-center rounded-l-full border-2 border-r-0 shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ top: "8px", backgroundColor: "#F1EEE7", borderColor: "#E7E2D6" }}
          aria-label={t.aria.menuButton}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="flex flex-col gap-[5px]" aria-hidden>
            <span className="block h-[2px] w-5 rounded" style={{ backgroundColor: "#1a1a1a" }} />
            <span className="block h-[2px] w-5 rounded" style={{ backgroundColor: "#1a1a1a" }} />
            <span className="block h-[2px] w-5 rounded" style={{ backgroundColor: "#1a1a1a" }} />
          </span>
        </button>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/20"
              aria-label="メニューを閉じる"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed right-0 top-[56px] z-50 min-w-[12rem] max-w-xs rounded-bl-lg rounded-l-lg border-2 border-r-0 border-t-0 py-2 shadow-lg"
              style={{ backgroundColor: "#F1EEE7", borderColor: "#E7E2D6" }}
            >
              {NAV_KEYS.map((item) => {
                const localized = buildHref(item.href);
                const label = t.nav[item.key];
                return (
                  <Link
                    key={item.key}
                    href={localized}
                    className="block px-4 py-2.5 text-sm font-semibold text-ink no-underline hover:bg-black/5"
                    onClick={(e) => handleNavClick(e, localized)}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

