(function () {
  "use strict";

  var panelId = "chachamaru-chat-panel";
  var overlayId = "chachamaru-chat-overlay";

  function getOrCreatePanel() {
    var existing = document.getElementById(panelId);
    if (existing) return existing;

    var overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.4);display:none;";
    overlay.addEventListener("click", closePanel);

    var panel = document.createElement("div");
    panel.id = panelId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "茶々丸チャット");
    panel.style.cssText =
      "position:fixed;top:0;right:0;bottom:0;width:min(100%,360px);max-width:100%;" +
      "z-index:9999;background:#f5f2eb;box-shadow:-4px 0 12px rgba(0,0,0,0.15);" +
      "display:flex;flex-direction:column;font-family:serif;";

    var header = document.createElement("div");
    header.style.cssText =
      "padding:12px 16px;border-bottom:1px solid #e5e0d8;display:flex;align-items:center;justify-content:space-between;background:#1e3c1a;color:#fff;";
    header.innerHTML =
      '<span style="font-weight:600;">茶々丸</span>' +
      '<button type="button" id="chachamaru-close" aria-label="閉じる" style="background:transparent;border:none;color:inherit;cursor:pointer;font-size:1.25rem;line-height:1;">&times;</button>';
    header.querySelector("#chachamaru-close").addEventListener("click", closePanel);

    var body = document.createElement("div");
    body.style.cssText = "flex:1;overflow:auto;padding:16px;color:#1a1a1a;";
    body.innerHTML =
      "<p style='margin:0 0 1em;'>こんにちは。茶々丸です。お茶やご注文についてお気軽にどうぞ。</p>" +
      "<p style='margin:0;font-size:0.875rem;color:#4a4a4a;'>（ここにチャットUI・LLM連携を実装できます）</p>";

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    return panel;
  }

  function openPanel() {
    var overlay = document.getElementById(overlayId);
    var panel = document.getElementById(panelId);
    if (!panel) panel = getOrCreatePanel();
    if (!overlay) overlay = document.getElementById(overlayId);
    if (overlay) overlay.style.display = "block";
    panel.style.display = "flex";
    panel.setAttribute("aria-hidden", "false");
    if (overlay) overlay.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    var overlay = document.getElementById(overlayId);
    var panel = document.getElementById(panelId);
    if (overlay) {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }
    if (panel) {
      panel.style.display = "none";
      panel.setAttribute("aria-hidden", "true");
    }
  }

  window.openChachamaru = function () {
    openPanel();
  };
})();
