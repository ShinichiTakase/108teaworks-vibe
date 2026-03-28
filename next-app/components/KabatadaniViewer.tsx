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
/** 1ページ・表紙: 縦:横 = 1.414:1（A判縦 √2） */
const PAGE_ASPECT_HEIGHT_OVER_WIDTH = 1.414;
/** 見開き表示エリアの CSS aspect-ratio（横:縦 = 2:1.414） */
const SPREAD_VIEW_ASPECT_RATIO = 2 / 1.414;
/** ビューポート端から PDF 枠までの余白（片側）。枠の横幅 = 100vw - 2×この値 */
const VIEWPORT_EDGE_GUTTER_PX = 10;
/** パネル内の PDF 用追加横余白（枠幅は vw 側で確保済みのため 0） */
const PAGE_SIDE_MARGIN = 0;
const MIN_PAGE_WIDTH = 100;

function fitPageWidthForAspect(
  paneInnerWidth: number,
  paneInnerHeight: number,
  zoom: number,
  aspectHW: number,
): number {
  const availW = Math.max(MIN_PAGE_WIDTH, paneInnerWidth);
  const availH = Math.max(80, paneInnerHeight);
  const wFitByHeight = availH / aspectHW;
  const baseW = Math.min(availW, wFitByHeight);
  let w = baseW * zoom;
  if (w * aspectHW > availH) w = availH / aspectHW;
  if (w > availW) w = availW;
  return Math.max(MIN_PAGE_WIDTH, w);
}

/** 見開き時の各ページ幅（行幅いっぱいを使い、高さだけで縮小） */
function fitSpreadHalfWidth(
  paneInnerWidth: number,
  paneInnerHeight: number,
  gap: number,
  zoom: number,
  singlePageAspectHW: number,
): number {
  const availW = Math.max(MIN_PAGE_WIDTH * 2 + gap, paneInnerWidth);
  const availH = Math.max(80, paneInnerHeight);
  const maxHalfByRow = (availW - gap) / 2;
  const maxHalfByHeight = availH / singlePageAspectHW;
  let base = Math.min(maxHalfByRow, maxHalfByHeight);
  let w = base * zoom;
  if (w * singlePageAspectHW > availH) w = availH / singlePageAspectHW;
  if (w > maxHalfByRow) w = maxHalfByRow;
  return Math.max(MIN_PAGE_WIDTH, w);
}

type KabatadaniViewerProps = {
  pdfUrl?: string;
};

export default function KabatadaniViewer({ pdfUrl = DEFAULT_PDF_URL }: KabatadaniViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isNarrow, setIsNarrow] = useState(false);
  const [paneSize, setPaneSize] = useState(() =>
    typeof window !== "undefined"
      ? {
          width: Math.max(240, window.innerWidth - 2 * VIEWPORT_EDGE_GUTTER_PX),
          height: Math.round(window.innerHeight * 0.55),
        }
      : { width: 600, height: 480 },
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
    const h = el.clientHeight;
    if (w > 0 && h > 0) setPaneSize({ width: w, height: h });
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

  const rightPage = currentPage;
  const leftPage = numPages && currentPage + 1 <= numPages ? currentPage + 1 : null;

  const innerW = Math.max(0, paneSize.width - 2 * PAGE_SIDE_MARGIN);
  /** 内側の上下パディング分を差し引き、下端が切れにくくする */
  const innerH = Math.max(80, paneSize.height - 20);
  const aspect = PAGE_ASPECT_HEIGHT_OVER_WIDTH;

  const coverW = fitPageWidthForAspect(innerW, innerH, zoom, aspect);
  const singleW = fitPageWidthForAspect(innerW, innerH, zoom, aspect);
  const spreadHalfW = fitSpreadHalfWidth(innerW, innerH, GAP_SPREAD, zoom, aspect);

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

  const vw = `calc(100vw - ${2 * VIEWPORT_EDGE_GUTTER_PX}px)`;
  const edgeShift = `calc(50% - 50vw + ${VIEWPORT_EDGE_GUTTER_PX}px)`;

  return (
    <div
      className="rounded-xl bg-cream py-2 shadow-md max-[640px]:rounded-lg max-[640px]:py-1 md:py-3"
      style={{
        width: vw,
        maxWidth: vw,
        marginLeft: edgeShift,
        marginRight: edgeShift,
      }}
    >
      <div className="relative flex flex-col rounded-lg bg-cream shadow-inner max-[640px]:min-h-[70vh] max-[640px]:rounded-md">
        <div
          ref={paneRef}
          className={
            isNarrow
              ? "min-h-0 flex-1 overflow-auto"
              : "w-full shrink-0 overflow-auto max-h-[min(85vh,90dvh)]"
          }
          style={isNarrow ? undefined : { aspectRatio: SPREAD_VIEW_ASPECT_RATIO }}
        >
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
            <div className="flex min-h-0 w-full items-start justify-center px-0 py-2 max-[640px]:min-h-full max-[640px]:items-center max-[640px]:py-1.5 md:py-2">
              {isCover ? (
                <Page
                  pageNumber={1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md !m-0 h-auto w-auto max-w-none shrink-0"
                  width={coverW}
                />
              ) : isNarrow ? (
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md !m-0 h-auto w-auto max-w-none shrink-0"
                  width={singleW}
                />
              ) : (
                <div className="flex w-full max-w-full items-start justify-center gap-2 md:gap-3 max-[640px]:min-h-full max-[640px]:items-center">
                  {leftPage != null && (
                    <Page
                      pageNumber={leftPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-md !m-0 h-auto w-auto shrink-0"
                      width={spreadHalfW}
                    />
                  )}
                  <Page
                    pageNumber={rightPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-md !m-0 h-auto w-auto shrink-0"
                    width={spreadHalfW}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-1 border-t border-border bg-cream/90 px-1 py-1 text-xs max-[640px]:px-1 min-[641px]:gap-2 min-[641px]:px-3 md:text-[0.8125rem] text-ink">
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
