"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/** サムネイル8個分の高さでHERO画像の縦幅に合わせる（タブレット・PC） */
const MAX_THUMBNAILS = 8;
const ZOOM = 3;
const SWIPE_THRESHOLD_PX = 40;

type Props = {
  imagePaths: string[];
  alt: string;
};

export default function ProductImageGallery({ imagePaths, alt }: Props) {
  const [mainIndex, setMainIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  /** サムネイル縦積みカラムの高さをHERO画像の実測高さに正確に合わせる（flexのstretchだけだと
   * サムネイル側の内容依存の高さと循環参照してしまい、意図しない縦長レイアウトになるため） */
  const [heroHeight, setHeroHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeroHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paths = imagePaths.length > 0 ? imagePaths : [];
  const mainSrc = paths[mainIndex] ?? paths[0];
  const thumbnails = paths.slice(0, MAX_THUMBNAILS);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartX.current;
      touchStartX.current = null;
      if (startX === null || paths.length <= 1) return;
      const endX = e.changedTouches[0]?.clientX ?? startX;
      const dx = endX - startX;
      if (dx <= -SWIPE_THRESHOLD_PX) {
        setMainIndex((i) => (i + 1) % paths.length);
      } else if (dx >= SWIPE_THRESHOLD_PX) {
        setMainIndex((i) => (i - 1 + paths.length) % paths.length);
      }
    },
    [paths.length]
  );

  const tx = -((ZOOM - 1) * mouse.x);
  const ty = -((ZOOM - 1) * mouse.y);
  const imageStyle = isHovered
    ? {
        transform: `translate(${tx}px, ${ty}px) scale(${ZOOM})`,
        transformOrigin: "0 0",
        transition: "none",
      }
    : {
        transform: "translate(0, 0) scale(1)",
        transformOrigin: "0 0",
        transition: "transform 0.2s ease-out",
      };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {/* サムネイル縦積み：タブレット・PCのみ。8個でHERO画像の縦幅に合わせ、少ない場合は上端揃え */}
        {thumbnails.length > 1 && (
          <div
            className="hidden md:grid w-14 shrink-0 gap-2 lg:w-16"
            style={{
              gridTemplateRows: "repeat(8, minmax(0, 1fr))",
              height: heroHeight != null ? `${heroHeight}px` : undefined,
            }}
          >
            {thumbnails.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainIndex(i)}
                className={`block h-full w-full rounded overflow-hidden border-2 transition-colors ${
                  mainIndex === i ? "border-tea-deep" : "border-border hover:border-tea"
                }`}
                aria-label={`画像 ${i + 1} を表示`}
              >
                <Image
                  src={src}
                  alt={`${alt}（${i + 1}）`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg bg-cream aspect-square w-full md:max-w-md md:cursor-move"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {mainSrc ? (
            <Image
              src={mainSrc}
              alt={alt}
              width={400}
              height={400}
              className="h-full w-full object-contain"
              style={imageStyle}
            />
          ) : (
            <div className="h-full w-full bg-cream" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* ドットナビゲーション：スマホのみ。スワイプで切り替え、現在位置を強調 */}
      {paths.length > 1 && (
        <div className="flex md:hidden items-center justify-center gap-1.5" role="tablist" aria-label={`${alt}の画像切り替え`}>
          {paths.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={mainIndex === i}
              onClick={() => setMainIndex(i)}
              aria-label={`画像 ${i + 1} を表示`}
              className={`h-2 rounded-full transition-all ${
                mainIndex === i ? "w-5 bg-tea-deep" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
