import styles from "@/components/ProductTasteImages.module.css";

type Props = {
  paths: string[];
  altBase: string;
  /** ルート要素に追加（例: 右カラム内で幅を抑える） */
  className?: string;
};

/**
 * 商品「味わい」補足画像。
 * スマホは常に2列横並び・拡大なし。md 以上は4枚未満を縦1列、4枚以上は2列。md 以上のみホバーで2倍拡大。
 */
export default function ProductTasteImages({ paths, altBase, className = "" }: Props) {
  if (paths.length === 0) return null;

  /** 4枚未満だけ md 以上で1列（縦積み）。4枚以上は常に2列。 */
  const gridModifier = paths.length < 4 ? styles.stackWide : "";

  /**
   * 基準 11rem の 7.5 倍を上限にし、親幅でクリップ（md 以上）。
   * スマホは2列のため min-width を緩め、親に収める。
   * absolute の img は intrinsic 幅が出ないため、md 以上で max(11rem, …) を併用。
   */
  const rootWidth =
    "w-full max-w-full shrink-0 max-md:min-w-0 md:min-w-[max(11rem,min(100%,calc(11rem*7.5)))]";

  return (
    <div
      className={[styles.grid, gridModifier, rootWidth, className].filter(Boolean).join(" ")}
      aria-label={altBase ? `${altBase} の味わい・茶葉の写真` : "味わい・茶葉の写真"}
    >
      {paths.map((src, i) => (
        <div
          key={src}
          className="group relative z-0 overflow-visible rounded-lg border border-border bg-washi shadow-sm md:hover:z-30 md:focus-within:z-30"
        >
          <div className="relative aspect-square w-full overflow-visible rounded-[inherit]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={altBase ? `${altBase} 味わい・茶葉 ${i + 1}` : `味わい・茶葉 ${i + 1}`}
              className="absolute inset-0 h-full w-full object-cover rounded-[inherit] transition-transform duration-200 ease-out will-change-transform origin-center md:group-hover:scale-[2] md:group-focus-within:scale-[2] md:group-hover:shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
