"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { COMMON_TEXTS } from "@/lib/commonTexts";

type Props = {
  shipRank: number;
  locale?: Locale;
  className?: string;
};

export default function ShipRankInfo({ shipRank, locale: localeProp, className }: Props) {
  const locale = localeProp ?? "ja";
  const t = COMMON_TEXTS[locale].product;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div
      className={`rounded-lg border-2 border-tea/30 bg-washi px-3 py-2.5 text-[0.8125rem] text-ink-muted space-y-1.5 ${className ?? ""}`}
    >
      <p className="m-0 leading-relaxed text-[0.9375rem] text-ink">
        {t.shipRankPre}
        <span className="relative inline-block">
          <button
            type="button"
            onClick={() => setTooltipOpen((v) => !v)}
            onBlur={() => setTooltipOpen(false)}
            className="underline decoration-dotted decoration-tea/60 cursor-help font-medium text-tea-deep"
            aria-describedby="ship-rank-tooltip"
          >
            {t.shipRankLink}
          </button>
          <span
            id="ship-rank-tooltip"
            role="tooltip"
            className={`absolute bottom-full left-0 mb-2 w-64 rounded-lg bg-ink/90 text-white text-[0.75rem] leading-snug px-3 py-2 z-20 shadow-xl pointer-events-none whitespace-normal text-left transition-opacity ${tooltipOpen ? "opacity-100" : "opacity-0"}`}
          >
            {t.shipRankTooltip}
          </span>
        </span>
        {t.shipRankMid && <>{t.shipRankMid} </>}
        <strong className="font-bold text-tea-deep">{shipRank.toFixed(1)}</strong>
        {t.shipRankSuffix && <> {t.shipRankSuffix}</>}
      </p>
      <p className="m-0 leading-relaxed">{t.shipRankDetail}</p>
      <p className="m-0 leading-relaxed font-semibold text-ink">{t.shipRankFree}</p>
    </div>
  );
}
