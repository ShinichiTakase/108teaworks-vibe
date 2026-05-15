"use client";

import { useEffect, useState } from "react";

const COVERS = [
  { src: "/images/kabatadani/cover-1.webp", alt: "川俣谷の茶園と朝霧" },
  { src: "/images/kabatadani/cover-2.webp", alt: "伊勢茶発祥の地 川俣谷のお茶 表紙" },
  { src: "/images/kabatadani/cover-3.webp", alt: "川俣谷の地図" },
  { src: "/images/kabatadani/cover-4.webp", alt: "川俣谷・櫛田川の流れ" },
];

const INTERVAL_MS = 4000;

export default function KabatadaniCoverSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % COVERS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mb-8 w-full rounded-lg overflow-hidden">
      {COVERS.map((cover, i) => (
        // 表示中の画像だけ normal flow に置き、コンテナ高さをその画像のアスペクト比に追従させる
        // 非表示の画像は absolute で重ねて不透明度 0
        <img
          key={cover.src}
          src={cover.src}
          alt={cover.alt}
          className={`block w-full h-auto transition-opacity duration-1000 ${
            i === current
              ? "relative opacity-100"
              : "absolute top-0 left-0 w-full opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        />
      ))}

      {/* ドットインジケーター */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {COVERS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`スライド ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-4 bg-white" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
