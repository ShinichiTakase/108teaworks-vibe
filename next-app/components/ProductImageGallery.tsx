"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

const THUMBNAILS_PER_ROW = 4;
const MAX_THUMBNAIL_ROWS = 2;
const MAX_THUMBNAILS = THUMBNAILS_PER_ROW * MAX_THUMBNAIL_ROWS;
const ZOOM = 3;

type Props = {
  imagePaths: string[];
  alt: string;
};

export default function ProductImageGallery({ imagePaths, alt }: Props) {
  const [mainIndex, setMainIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const paths = imagePaths.length > 0 ? imagePaths : ["/images/products/product-01.webp"];
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
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-cream aspect-square max-w-md cursor-move"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainSrc}
          alt={alt}
          width={400}
          height={400}
          className="h-full w-full object-contain"
          style={imageStyle}
        />
      </div>
      {thumbnails.length > 1 && (
        <ul className="grid grid-cols-4 gap-2 list-none m-0 p-0 max-w-md">
          {thumbnails.map((src, i) => (
            <li key={i} className="m-0">
              <button
                type="button"
                onClick={() => setMainIndex(i)}
                className={`block w-full aspect-square rounded overflow-hidden border-2 transition-colors ${
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
