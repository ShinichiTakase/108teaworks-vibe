"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { detectLocaleFromPath, isJaOnlyBookPath, isProductDetailPath } from "@/lib/urlPath";

const locales = [
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
];

function stripLocaleFromPath(pathname: string): string {
  return pathname.replace(/^\/(ja|en|ko|zh)(?=\/|$)/, "") || "/";
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  if (isJaOnlyBookPath(pathname)) return null;
  const currentLocale = detectLocaleFromPath(pathname);
  const basePath = stripLocaleFromPath(pathname);

  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  const getHref = (code: string) => {
    if (code === "ja") {
      return basePath === "/" ? "/" : basePath;
    }
    return basePath === "/" ? `/${code}` : `/${code}${basePath}`;
  };

  const bottomClass = isProductDetailPath(pathname) ? "bottom-[84px]" : "bottom-4";

  return (
    <div className={`fixed ${bottomClass} right-4 z-50 text-left`}>
      <details className="group inline-block">
        <summary className="list-none cursor-pointer rounded-full bg-cream/90 shadow px-3 py-1.5 text-sm font-semibold flex items-center gap-1 select-none text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-[#d9002b]" />
          <span>{current.label}</span>
        </summary>
        <div className="mt-1 rounded-lg bg-cream/95 shadow-lg py-2 text-sm font-semibold min-w-[8rem]">
          {locales.map((locale) => (
            <Link
              key={locale.code}
              href={getHref(locale.code)}
              className="flex items-center gap-1 px-3 py-1.5 hover:bg-washi no-underline text-ink"
            >
              <span aria-hidden="true">{locale.flag}</span>
              <span>{locale.label}</span>
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}

