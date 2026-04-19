type Props = {
  paths: string[];
  altBase: string;
  /** ルート要素に追加（例: 右カラム内で幅を抑える） */
  className?: string;
};

/**
 * 商品「味わい」補足画像。4枚未満は1列、4枚以上は2列グリッド。
 * ホバーで 2 倍拡大（はみ出し表示）。
 */
export default function ProductTasteImages({ paths, altBase, className = "" }: Props) {
  if (paths.length === 0) return null;

  const gridCols = paths.length >= 4 ? "grid-cols-2" : "grid-cols-1";
  /**
   * 基準 11rem の 7.5 倍（以前の 15 倍の半分）を上限にし、親幅でクリップ。
   * absolute の img は intrinsic 幅が出ないため、min で 11rem 未満に潰れないよう max(11rem, …) を併用。
   */
  const rootWidth =
    "w-full min-w-[max(11rem,min(100%,calc(11rem*7.5)))] max-w-full shrink-0";

  return (
    <div
      className={`grid ${gridCols} gap-3 ${rootWidth} justify-items-stretch ${className}`.trim()}
      aria-label={altBase ? `${altBase} の味わい・茶葉の写真` : "味わい・茶葉の写真"}
    >
      {paths.map((src, i) => (
        <div
          key={src}
          className="group relative z-0 overflow-visible rounded-lg border border-border bg-washi shadow-sm hover:z-30 focus-within:z-30"
        >
          <div className="relative aspect-square w-full overflow-visible rounded-[inherit]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={altBase ? `${altBase} 味わい・茶葉 ${i + 1}` : `味わい・茶葉 ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover rounded-[inherit] transition-transform duration-200 ease-out will-change-transform origin-center group-hover:scale-[2] group-focus-within:scale-[2] group-hover:shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
