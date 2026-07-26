"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMON_TEXTS } from "@/lib/commonTexts";
import { buildLocalizedHref, detectLocaleFromPath, isProductDetailPath } from "@/lib/urlPath";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = detectLocaleFromPath(pathname);
  const t = COMMON_TEXTS[locale];
  const privacyHref = buildLocalizedHref(locale, "/privacy-policy");
  const legalHref = buildLocalizedHref(locale, "/legal");
  /** 商品詳細ページは購入固定バーが常時表示されるため、コピーライトがその下に隠れないよう余白を確保 */
  const copyrightPaddingClass = isProductDetailPath(pathname) ? "pt-4 pb-[84px]" : "py-4";

  return (
    <footer
      id="site-footer"
      className="mt-16 bg-footer-top border-t border-b border-border"
      role="contentinfo"
    >
      <div className="w-full">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-[0.8125rem] text-ink-muted leading-relaxed">
            <p className="m-0 text-left">
              <Link href={privacyHref} className="text-tea no-underline hover:underline">
                {t.footer.privacyPolicy}
              </Link>
              <span className="mx-2 text-ink-muted">｜</span>
              <Link href={legalHref} className="text-tea no-underline hover:underline">
                {t.footer.legal}
              </Link>
            </p>
            <p className="m-0 text-right text-ink-muted">{t.footer.domesticShippingNote}</p>
          </div>
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
        <div className={`w-[90%] max-w-wide mx-auto ${copyrightPaddingClass}`}>
          <p className="m-0 text-center text-[0.8125rem] text-ink-muted leading-relaxed">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
