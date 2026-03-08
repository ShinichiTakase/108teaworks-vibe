"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

const THUMB_SRC = "/images/thumbnail/green-tea-latte.jpg";
const VIDEO_SRC = "/mp4/houjicha_latte.mp4";

const linkClass = "text-tea no-underline hover:text-tea-deep focus:outline-none focus:underline";

export default function PromoVideoBanner() {
  const [popupOpen, setPopupOpen] = useState(false);

  const openPopup = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setPopupOpen(false);
  }, []);

  return (
    <>
      <section
        aria-label="ほうじ茶ラテ動画"
        className="border-b border-border bg-washi/80 px-3 py-3 w-[90%] max-w-4xl mx-auto"
      >
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={openPopup}
            className="flex-shrink-0 rounded overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-tea focus:ring-offset-1"
            aria-label="ほうじ茶ラテの動画を再生"
          >
            <Image
              src={THUMB_SRC}
              alt="ほうじ茶ラテの動画"
              width={100}
              height={75}
              className="w-[100px] h-[75px] object-cover"
            />
          </button>
          <div className="flex-1 min-w-0 text-[0.9375rem] md:text-base leading-relaxed text-ink">
            <p className="m-0">
              外苑前{" "}
              <a
                href="https://www.instagram.com/__newwa__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                カフェ 柔和 (にゅうわ)
              </a>
              のオーナーでインフルエンサーの
              <a
                href="https://www.instagram.com/__wadakanami__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                @__wadakanami__
              </a>
              さんが、藤八茶寮の
              <a href="/products/houjicha-powder-80g" target="_self" className={linkClass}>
                ほうじ茶パウダー
              </a>
              を使って、とっても楽しいほうじ茶ラテを作ってくれました。ぜひご覧ください。もちろん、
              <a
                href="https://www.instagram.com/__newwa__/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                カフェ 柔和
              </a>
              でもお楽しみいただけます。{" "}
              <button
                type="button"
                onClick={openPopup}
                className="inline-flex items-center gap-1 mt-1.5 rounded-full border border-tea bg-transparent px-3 py-1 text-[0.875rem] font-medium text-tea no-underline cursor-pointer hover:bg-tea hover:text-cream hover:border-tea transition-colors focus:outline-none focus:ring-2 focus:ring-tea focus:ring-offset-1"
                aria-label="ほうじ茶ラテの動画を再生"
              >
                <span aria-hidden="true">▶</span>
                動画を見る
              </button>
            </p>
          </div>
        </div>
      </section>

      {popupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ほうじ茶ラテ動画"
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-lg bg-ink rounded overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-ink/70 text-cream flex items-center justify-center text-lg leading-none hover:bg-ink"
              aria-label="閉じる"
            >
              ×
            </button>
            <video
              src={VIDEO_SRC}
              autoPlay
              playsInline
              controls
              className="w-full h-auto"
              onEnded={handleVideoEnded}
            />
          </div>
        </div>
      )}
    </>
  );
}
