"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { WorkerMessageHandler } from "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  // @ts-expect-error pdfjs worker type
  WorkerMessageHandler,
  import.meta.url,
).toString();

const PDF_URL = "/pdf/kahadadani_no_ocha.pdf";

export default function KabatadaniViewer() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 1ページ目＝表紙
  const [zoom, setZoom] = useState(1); // 1.0 = 等倍

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = numPages ? currentPage < numPages : false;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setZoom(1);
    // 表紙以外は2ページずつ戻す
    if (currentPage === 2) {
      setCurrentPage(1);
    } else {
      setCurrentPage((prev) => Math.max(2, prev - 2));
    }
  };

  const handleNext = () => {
    if (!canGoNext || !numPages) return;
    setZoom(1);
    if (currentPage === 1) {
      // 表紙の次は見開き開始（2ページ目から）
      setCurrentPage(2);
    } else {
      const next = currentPage + 2;
      setCurrentPage(Math.min(next, numPages));
    }
  };

  // 表紙かどうかでレイアウトを切り替え
  const isCover = currentPage === 1;

  // 見開き時：右ページ＝currentPage、左ページ＝currentPage+1（存在すれば）
  const rightPage = currentPage;
  const leftPage = numPages && currentPage + 1 <= numPages ? currentPage + 1 : null;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(1.6, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.6, prev - 0.2));
  };

  return (
    <div className="mx-auto max-w-[1200px] rounded-xl bg-cream p-2 md:p-3 shadow-md">
      <div className="relative flex h-[70vh] flex-col rounded-lg bg-cream shadow-inner">
        <div className="flex-1 overflow-hidden">
          <Document
            file={PDF_URL}
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
                  href={PDF_URL}
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
                // 表紙：1ページのみ中央に表示
                <Page
                  pageNumber={1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md !m-0"
                  width={520 * zoom}
                />
              ) : (
                // 見開き：右開き（右が偶数／奇数関係なく currentPage、左が currentPage+1）
                <div className="flex h-full items-center justify-center gap-2 md:gap-3">
                  {/* 左：ページ番号が大きい方 */}
                  {leftPage && (
                    <Page
                      pageNumber={leftPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-md !m-0"
                      width={480 * zoom}
                    />
                  )}
                  {/* 右：ページ番号が小さい方 */}
                  <Page
                    pageNumber={rightPage}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-md !m-0"
                    width={480 * zoom}
                  />
                </div>
              )}
            </div>
          </Document>
        </div>

        {/* ページ送りコントロール */}
        <div className="flex items-center justify-between border-t border-border bg-cream/90 px-3 py-1 text-xs md:text-[0.8125rem] text-ink">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
              canGoNext
                ? "border-border bg-white text-ink hover:border-tea-deep hover:text-tea-deep"
                : "border-border/40 bg-cream text-ink-muted cursor-not-allowed"
            }`}
          >
            <span className="text-sm">◀</span>
            <span>次のページ</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-[0.75rem] text-ink-muted">
              {numPages
                ? isCover
                  ? `1 / ${numPages} ページ（表紙）`
                  : `${rightPage}${leftPage ? `–${leftPage}` : ""} / ${numPages} ページ`
                : "ページ数を取得中…"}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                className="inline-flex items-center justify-center rounded-full border border-border bg-white px-2 py-0.5 text-[0.75rem] hover:border-tea-deep hover:text-tea-deep"
              >
                －
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
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
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
              canGoPrev
                ? "border-border bg-white text-ink hover:border-tea-deep hover:text-tea-deep"
                : "border-border/40 bg-cream text-ink-muted cursor-not-allowed"
            }`}
          >
            <span>前のページ</span>
            <span className="text-sm">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}

