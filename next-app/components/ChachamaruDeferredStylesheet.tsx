/**
 * 茶々丸ウィジェット用 CSS。
 * 以前は media="print" → onLoad で all に切り替える非ブロッキング読み込みをしていたが、
 * キャッシュヒット時に load が先に終わり onLoad が発火しないと画面にスタイルが当たらず、
 * パネルが本文末尾に素の DOM として表示される不具合があったため、通常の stylesheet 読み込みに統一する。
 */
export default function ChachamaruDeferredStylesheet() {
  return <link rel="stylesheet" href="/css/chachamaru-widget.css" />;
}
