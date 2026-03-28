"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { WorkerMessageHandler } from "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  WorkerMessageHandler,
  import.meta.url,
).toString();

const DEFAULT_PDF_URL = "/pdf/kahadadani_no_ocha.pdf";

/** 見開きではなく1ページ表示に切り替える上限幅（Tailwind の sm 相当） */
const NARROW_MAX_PX = 640;

const GAP_SPREAD = 12;
const MAX_COVER_WIDTH = 520;
const MAX_SPREAD_HALF = 480;
const MIN_PAGE_WIDTH = 108;

type KabatadaniViewerProps = {
  pdfUrl?: string;
};

export default function KabatadaniViewer({ pdfUrl = DEFAULT_PDF_URL }: KabatadaniViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window !== "undefined" ? Math.max(240, window.innerWidth - 64) : 600,
  );

  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`);
    const syncNarrow = () => setIsNarrow(mq.matches);
    syncNarrow();
    mq.addEventListener("change", syncNarrow);
    return () => mq.removeEventListener("change", syncNarrow);
  }, []);

  const measurePane = useCallback(() => {
    const el = paneRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w > 0) setContainerWidth(w);
  }, []);

  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    measurePane();
    const ro = new ResizeObserver(() => measurePane());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measurePane]);

  const onDocumentLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    requestAnimationFrame(measurePane);
  };

  const isCover = currentPage === 1;
  /** 狭い画面：常に1ページ。広い画面：表紙以外は見開き */
  const spreadMode = !isNarrow && !isCover;

  const rightPage = currentPage;
  const leftPage = numPages && currentPage + 1 <= numPages ? currentPage + 1 : null;

  const innerAvail = Math.max(240, containerWidth);
  const coverW = Math.max(MIN_PAGE_WIDTH, Math.min(MAX_COVER_WIDTH * zoom, innerAvail));
  const singleW = Math.max(MIN_PAGE_WIDTH, Math.min(MAX_COVER_WIDTH * zoom, innerAvail));
  const spreadHalfW = Math.max(
    MIN_PAGE_WIDTH,
    Math.min(MAX_SPREAD_HALF * zoom, Math.floor((innerAvail - GAP_SPREAD) / 2)),
  );

  const canGoPrev = currentPage > 1;
  const canGoNext = numPages ? currentPage < numPages : false;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setZoom(1);
    if (isNarrow) {
      setCurrentPage((p) => p - 1);
      return;
    }
    if (currentPage === 2) {
      setCurrentPage(1);
    } else {
      setCurrentPage((prev) => Math.max(2, prev - 2));
    }
  };

  const handleNext = () => {
    if (!canGoNext || !numPages) return;
    setZoom(1);
    if (isNarrow) {
      setCurrentPage((p) => Math.min(p + 1, numPages));
      return;
    }
    if (currentPage === 1) {
      setCurrentPage(2);
    } else {
      const next = currentPage + 2;
      setCurrentPage(Math.min(next, numPages));
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.6, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.6, prev - 0.2));
  };

  const pageLabel =
    numPages == null
      ? "ページ数を取得中…"
      : isCover
        ? `1 / ${numPages} ページ（表紙）`
        : isNarrow
          ? `${currentPage} / ${numPages} ページ`
          : `${rightPage}${leftPage ? `–${leftPage}` : ""} / ${numPages} ページ`;

  const navBtnClass = (enabled: boolean) =>
    `inline-flex items-center justify-center gap-1 rounded-full border px-2 py-1 min-[641px]:px-3 transition-colors ${
      enabled
        ? "border-border bg-white text-ink hover:border-tea-deep hover:text-tea-deep"
        : "border-border/40 bg-cream text-ink-muted cursor-not-allowed"
    }`;

  return (
    <div className="mx-auto max-w-[1200px] rounded-xl bg-cream p-2 md:p-3 shadow-md">
      <div className="relative flex h-[70vh] flex-col rounded-lg bg-cream shadow-inner">
        <div ref={paneRef} className="min-h-0 flex-1 overflow-hidden">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex h-full items-center justify-center text-[0.9375rem] text-ink-muted">
                読み込み中…
              </div>
            }
            error={
              <div className="flex h-full items-center justify-center px-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                PDF を読み込めませんでした。
                <a
                  href={pdfUrl}
                  className="ml-1 text-tea-deep underline underline-offset-4"
                >
                  ダウンロードはこちら
                </a>
                からご覧ください。
              </div>
            }
          >
            <div className="flex h-full items-center justify-center px-1.5 py-2 md:px-3 md:py-3">
              {isCover ? (
                <Page
                  pageNumber={1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md !m-0 max-h-full w-auto max-w-full"
                  width={coverW}
                />
              ) : isNarrow ? (
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md !m-0 max-h-full w-auto max-w-full"
                  width={singleW}
                />
              ) : (
                <div className="flex h-full max-w-full items-center justify-center gap-2 md:gap-3">
                  {leftPage != null && (
                    <Page
                      pageNumber={leftPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-md !m-0 max-h-full w-auto shrink"
                      width={spreadHalfW}
                    />
                  )}
                  <Page
                    pageNumber={rightPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-md !m-0 max-h-full w-auto shrink"
                    width={spreadHalfW}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-1 border-t border-border bg-cream/90 px-2 py-1 text-xs min-[641px]:gap-2 min-[641px]:px-3 md:text-[0.8125rem] text-ink">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="次のページ"
            className={navBtnClass(!!canGoNext)}
          >
            <span className="text-base leading-none" aria-hidden="true">
              ◀
            </span>
            <span className="hidden min-[641px]:inline">次のページ</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 min-[641px]:gap-3">
            <div className="truncate text-center text-[0.7rem] text-ink-muted min-[641px]:text-[0.75rem]">
              {pageLabel}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="縮小"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-2 py-0.5 text-[0.75rem] hover:border-tea-deep hover:text-tea-deep"
              >
                －
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="拡大"
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-2 py-0.5 text-[0.75rem] hover:border-tea-deep hover:text-tea-deep"
              >
                ＋
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="前のページ"
            className={navBtnClass(!!canGoPrev)}
          >
            <span className="hidden min-[641px]:inline">前のページ</span>
            <span className="text-base leading-none" aria-hidden="true">
              ▶
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
