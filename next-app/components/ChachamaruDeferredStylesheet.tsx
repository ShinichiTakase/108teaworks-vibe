"use client";

/**
 * 茶々丸ウィジェット用 CSS を非ブロッキングで読み込む。
 * media="print" で取得し、load 後に all に切り替えてクリティカルパスから外す（PageSpeed 対策）。
 */
export default function ChachamaruDeferredStylesheet() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/css/chachamaru-widget.css"
        media="print"
        onLoad={(e) => {
          e.currentTarget.media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href="/css/chachamaru-widget.css" />
      </noscript>
    </>
  );
}
