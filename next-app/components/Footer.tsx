"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

function detectLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  return (match ? match[1] : "ja") as Locale;
}

function buildLocalizedHref(locale: Locale, href: string): string {
  if (locale === "ja") return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const t = COMMON_TEXTS[locale];
  const privacyHref = buildLocalizedHref(locale, "/privacy-policy");
  const legalHref = buildLocalizedHref(locale, "/legal");

  return (
    <footer
      className="mt-16 bg-footer-top border-t border-b border-border"
      role="contentinfo"
    >
      <div className="w-full">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-left text-[0.8125rem] text-ink-muted leading-relaxed">
            <Link href={privacyHref} className="text-tea no-underline hover:underline">
              {t.footer.privacyPolicy}
            </Link>
            <span className="mx-2 text-ink-muted">｜</span>
            <Link href={legalHref} className="text-tea no-underline hover:underline">
              {t.footer.legal}
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full bg-footer-middle">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-right text-[0.8125rem] text-ink leading-relaxed">
            {t.footer.address}
            <br />
            <Link
              href="mailto:info@108teaworks.com"
              className="text-tea no-underline hover:underline"
            >
              info@108teaworks.com
            </Link>{" "}
            /{" "}
            <Link
              href="tel:050-6860-7347"
              className="text-tea no-underline hover:underline"
            >
              050-6860-7347
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-center text-[0.8125rem] text-ink-muted leading-relaxed">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
