/**
 * 茶々丸コンシェルジュ API クライアント
 * WEBサイト用: https://tea.edgeailab.jp/ask にリクエストし、受けたレスポンスを表示する
 *
 * 配置例: wp-content/themes/astra/js/chachamaru.js
 * 読み込み: <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/chachamaru.js"></script>
 */
(function () {
  'use strict';
  window.chachamaruLoaded = true;

  // API ベースURL（本番: https://tea.edgeailab.jp）
  var CHACHAMARU_API_BASE = 'https://tea.edgeailab.jp';
  var CHACHAMARU_ASK_URL = CHACHAMARU_API_BASE + '/ask';
  var CHACHAMARU_ASK_STREAM_URL = CHACHAMARU_API_BASE + '/ask_stream';
  var SESSION_STORAGE_KEY = 'chachamaru_session_id';

  /** 同一タブで共通の session_id を返す（「いくら？」の続きで直前の商品を参照するため） */
  function getOrCreateSessionId() {
    try {
      var id = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (id) return id;
      id = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
      return id;
    } catch (e) {
      return 'web_' + Date.now();
    }
  }

  /**
   * API レスポンス（text/plain）をパースする
   * 形式: "質問文", INTENT, 0.00s\n回答文
   */
  function parseAskResponse(text) {
    if (!text || typeof text !== 'string') return { answer: '', intent: '', elapsed: '' };
    text = text.trim();  // サーバー送信のキープアライブ空白を除去
    var firstNewline = text.indexOf('\n');
    var meta = firstNewline >= 0 ? text.slice(0, firstNewline) : text;
    var answer = firstNewline >= 0 ? text.slice(firstNewline + 1).trim() : '';
    var parts = meta.split(',');
    return {
      question: parts[0] ? parts[0].replace(/^"|"$/g, '').trim() : '',
      intent: parts[1] ? parts[1].trim() : '',
      elapsed: parts[2] ? parts[2].trim() : '',
      answer: answer
    };
  }

  /**
   * HTMLエンティティをデコード（iPhone等でAPIがエスケープして返す場合にリンクを表示するため）
   */
  function decodeHtmlEntities(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }

  /**
   * 回答にHTMLの<a>タグが含まれるか（商品リンク用。含まれる場合は innerHTML で表示すること）
   * エスケープ済みの文字列もデコードしてから判定する
   */
  function answerContainsLink(answer) {
    if (!answer || typeof answer !== 'string') return false;
    var decoded = decodeHtmlEntities(answer);
    return /<a\s+href\s*=\s*["']?https?:\/\//i.test(decoded) || decoded.indexOf('<a href="') !== -1;
  }

  /** RAG 回答は 90〜100 秒かかることがあるため、クライアント側の待ち時間（ミリ秒） */
  var ASK_FETCH_TIMEOUT_MS = 180000;  // 3分（プロキシの read timeout もこれ以上に設定すること）
  window.CHACHAMARU_TIMEOUT_MS = ASK_FETCH_TIMEOUT_MS;  // DevTools で読み込み確認用

  /**
   * 質問を送信し、回答を取得する
   * @param {string} question - 質問文
   * @param {string} [sessionId] - セッションID（省略可）
   * @returns {Promise<{answer:string, intent:string, elapsed:string}>}
   */
  function askChachamaru(question, sessionId) {
    var payload = { question: question };
    payload.session_id = sessionId || getOrCreateSessionId();
    var url = (typeof window.chachamaruVars !== 'undefined' && window.chachamaruVars.proxyUrl)
      ? window.chachamaruVars.proxyUrl
      : CHACHAMARU_ASK_URL;

    var controller = new AbortController();
    var timeoutId = setTimeout(function () {
      controller.abort();
    }, ASK_FETCH_TIMEOUT_MS);

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(function (res) {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('API error: ' + res.status);
        return res.text();
      })
      .then(parseAskResponse)
      .catch(function (err) {
        clearTimeout(timeoutId);
        throw err;
      });
  }

  /**
   * ストリーミングで質問を送信し、トークン受信ごとに onToken、完了時に onDone を呼ぶ
   * @param {string} question - 質問文
   * @param {string} [sessionId] - セッションID
   * @param {{ onStart?: function(), onToken?: function(string), onDone?: function({answer:string, intent:string, elapsed:string}), onError?: function(string) }} [callbacks]
   * @returns {Promise<{answer:string, intent:string, elapsed:string}>}
   */
  function askChachamaruStream(question, sessionId, callbacks) {
    var cbs = callbacks || {};
    var payload = { question: question };
    payload.session_id = sessionId || getOrCreateSessionId();
    var baseUrl = (typeof window.chachamaruVars !== 'undefined' && window.chachamaruVars.proxyUrl)
      ? window.chachamaruVars.proxyUrl
      : CHACHAMARU_ASK_URL;
    var streamUrl = baseUrl.replace(/\/ask\/?$/, '') + '/ask_stream';
    if (streamUrl.indexOf('/ask_stream') === -1) streamUrl = CHACHAMARU_ASK_STREAM_URL;

    return fetch(streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('API error: ' + res.status);
        if (!res.body) throw new Error('Stream not supported');
        return res.body.getReader();
      })
      .then(function (reader) {
        var decoder = new TextDecoder();
        var buf = '';
        var result = { answer: '', intent: '', elapsed: '' };
        var streamStarted = false;

        function maybeStart() {
          if (streamStarted) return;
          streamStarted = true;
          if (typeof cbs.onStart === 'function') cbs.onStart();
        }

        function processLine(line) {
          if (line.indexOf('data: ') !== 0) return;
          try {
            var j = JSON.parse(line.slice(6));
            var ev = j.event;
            if (ev === 'token' && j.token != null) {
              maybeStart();
              if (typeof cbs.onToken === 'function') cbs.onToken(j.token);
            } else if (ev === 'done') {
              maybeStart();
              result.answer = j.answer != null ? j.answer : '';
              result.intent = j.intent != null ? j.intent : '';
              result.elapsed = j.elapsed != null ? j.elapsed : '';
              if (typeof cbs.onDone === 'function') cbs.onDone(result);
            } else if (ev === 'error' && typeof cbs.onError === 'function') {
              cbs.onError(j.message || 'エラー');
            }
          } catch (e) { /* ignore parse error */ }
        }

        function read() {
          return reader.read().then(function (chunk) {
            if (chunk.done) return result;
            buf += decoder.decode(chunk.value, { stream: true });
            var parts = buf.split('\n\n');
            buf = parts.pop();
            for (var i = 0; i < parts.length; i++) {
              var lines = parts[i].split('\n');
              for (var k = 0; k < lines.length; k++) {
                if (lines[k].indexOf('data: ') === 0) processLine(lines[k]);
              }
            }
            return read();
          });
        }
        return read();
      });
  }

  /** 接続切断などで失敗したときに1回だけ自動でやり直す（間欠的な CancelledError 対策） */
  function askChachamaruWithRetry(question, sessionId, alreadyRetried) {
    alreadyRetried = !!alreadyRetried;
    return askChachamaru(question, sessionId)
      .then(function (data) {
        var isErrorResponse = (data.answer || '').indexOf('申し訳ございません') !== -1;
        if (isErrorResponse && !alreadyRetried) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              askChachamaruWithRetry(question, sessionId, true).then(resolve, reject);
            }, 2000);
          });
        }
        return data;
      })
      .catch(function (err) {
        var isRetryable = err.name === 'AbortError' || (err.message && (err.message.indexOf('fetch') !== -1 || err.message.indexOf('network') !== -1));
        if (isRetryable && !alreadyRetried) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              askChachamaruWithRetry(question, sessionId, true).then(resolve, reject);
            }, 2000);
          });
        }
        throw err;
      });
  }

  /**
   * 回答を表示する（<a>タグを含む場合は innerHTML で描画しリンクを有効に）
   * @param {string} answer - 表示する回答文（PRODUCT時は <a href="...">商品名</a> を含むHTML）
   * @param {HTMLElement|string} outputEl - 表示先要素またはセレクタ
   */
  function showAnswer(answer, outputEl) {
    var el = typeof outputEl === 'string' ? document.querySelector(outputEl) : outputEl;
    if (el) {
      el.style.whiteSpace = 'pre-wrap';
      var decoded = decodeHtmlEntities(answer || '');
      if (answerContainsLink(decoded || answer)) {
        el.innerHTML = decoded || answer || '';
      } else {
        el.textContent = answer || '';
      }
    }
  }

  /**
   * ローディング表示
   */
  function setLoading(outputEl, loading) {
    var el = typeof outputEl === 'string' ? document.querySelector(outputEl) : outputEl;
    if (!el) return;
    if (loading) {
      el.textContent = '送信中…';
      el.classList.add('chachamaru-loading');
    } else {
      el.classList.remove('chachamaru-loading');
    }
  }

  // グローバルに公開
  window.Chachamaru = {
    apiBase: CHACHAMARU_API_BASE,
    ask: askChachamaru,
    askStream: askChachamaruStream,
    parseResponse: parseAskResponse,
    showAnswer: showAnswer,
    setLoading: setLoading,
    answerContainsLink: answerContainsLink
  };

  // フォーム送信で自動送信: data-chachamaru 属性付きフォームを探す
  function runFormInit() {
    var form = document.querySelector('[data-chachamaru]');
    if (!form) return;

    var input = form.querySelector('input[name="question"], input[name="q"], textarea[name="question"], textarea[name="q"]') || form.querySelector('input[type="text"], textarea');
    var outputSelector = form.getAttribute('data-chachamaru');
    var output = outputSelector ? document.querySelector(outputSelector) : document.getElementById('chachamaru-answer');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input || !input.value.trim()) return;

      var q = input.value.trim();
      setLoading(output, true);
      output.textContent = '';

      askChachamaruStream(q, getOrCreateSessionId(), {
        onToken: function (token) {
          output.textContent += token;
        },
        onDone: function (data) {
          setLoading(output, false);
          showAnswer(data.answer, output);
        },
        onError: function () {
          setLoading(output, false);
          showAnswer('申し訳ございません。しばらくしてからお試しください。', output);
        }
      }).catch(function (err) {
        setLoading(output, false);
        showAnswer('申し訳ございません。しばらくしてからお試しください。', output);
        console.error('Chachamaru API error:', err);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFormInit);
  } else {
    runFormInit();
  }

  /** pathname から locale を取得（/en/ -> en, /ko/ -> ko, /zh/ -> zh, それ以外 -> ja） */
  function getLocaleFromPath() {
    var path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    if (path.indexOf('/en') === 0) return 'en';
    if (path.indexOf('/ko') === 0) return 'ko';
    if (path.indexOf('/zh') === 0) return 'zh';
    return 'ja';
  }

  var defaultT = {
    fabAriaLabel: '茶々丸と話す',
    fabLabel: '茶々丸と話す',
    avatarAlt: '茶々丸',
    greeting: 'どんな御用ですか?',
    closeAriaLabel: '閉じる',
    inputPlaceholder: 'メッセージを入力',
    sendButton: '送信',
    thinking: '考え中…'
  };

  // ========== フローティングウィジェット（アイコン + チャットパネル） ==========
  function runWidgetInit() {
    var vars = typeof window.chachamaruVars !== 'undefined' ? window.chachamaruVars : {};
    var iconUrl = vars.iconUrl || '';
    var useReactBar = !!vars.useReactBar;
    var locale = getLocaleFromPath();
    var t = (vars.texts && vars.texts[locale]) ? vars.texts[locale] : (vars.texts && vars.texts.ja) ? vars.texts.ja : defaultT;
    t = t || defaultT;

    var fab = null;
    if (!useReactBar) {
      fab = document.createElement('button');
      fab.id = 'chachamaru-toggle';
      fab.className = 'chachamaru-fab';
      fab.style.bottom = '230px';
      fab.setAttribute('aria-label', t.fabAriaLabel);
      var fabImg = document.createElement('img');
      fabImg.id = 'chachamaru-fab-icon';
      fabImg.alt = t.avatarAlt;
      if (iconUrl) fabImg.src = iconUrl;
      var fabLabel = document.createElement('span');
      fabLabel.className = 'chachamaru-fab-label';
      fabLabel.textContent = t.fabLabel;
      fab.appendChild(fabImg);
      fab.appendChild(fabLabel);
      document.body.appendChild(fab);
    }

    var panel = document.createElement('div');
    panel.id = 'chachamaru-panel';
    panel.className = 'chachamaru-panel chachamaru-panel--closed';
    panel.style.bottom = '230px';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="chachamaru-panel__header">' +
        '<img src="" alt="' + (t.avatarAlt || '茶々丸').replace(/"/g, '&quot;') + '" class="chachamaru-panel__avatar" id="chachamaru-panel-avatar">' +
        '<div class="chachamaru-panel__greeting">' + (t.greeting || 'どんな御用ですか?').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
        '<button type="button" class="chachamaru-panel__close" aria-label="' + (t.closeAriaLabel || '閉じる').replace(/"/g, '&quot;') + '">&times;</button>' +
      '</div>' +
      '<div id="chachamaru-messages" class="chachamaru-panel__messages"></div>' +
      '<div class="chachamaru-panel__footer">' +
        '<input type="text" id="chachamaru-input" placeholder="' + (t.inputPlaceholder || 'メッセージを入力').replace(/"/g, '&quot;') + '">' +
        '<button type="button" id="chachamaru-send">' + (t.sendButton || '送信').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</button>' +
      '</div>';

    var panelAvatar = panel.querySelector('#chachamaru-panel-avatar');
    if (iconUrl && panelAvatar) panelAvatar.src = iconUrl;

    document.body.appendChild(panel);

    (function injectThinkingStyle() {
      if (document.getElementById('chachamaru-thinking-style')) return;
      var style = document.createElement('style');
      style.id = 'chachamaru-thinking-style';
      style.textContent = '.chachamaru-thinking { display: inline-flex; align-items: center; gap: 0.5em; } .chachamaru-thinking-text { color: inherit; opacity: 0.85; }';
      document.head.appendChild(style);
    })();
    var messagesEl = document.getElementById('chachamaru-messages');
    var inputEl = document.getElementById('chachamaru-input');
    var sendBtn = document.getElementById('chachamaru-send');

    function openPanel() {
      panel.classList.remove('chachamaru-panel--closed');
      panel.setAttribute('aria-hidden', 'false');
      if (fab) fab.classList.add('chachamaru-fab--hidden');
      inputEl.focus();
    }
    function closePanel() {
      panel.classList.add('chachamaru-panel--closed');
      panel.setAttribute('aria-hidden', 'true');
      if (fab) fab.classList.remove('chachamaru-fab--hidden');
    }

    if (fab) fab.addEventListener('click', openPanel);
    panel.querySelector('.chachamaru-panel__close').addEventListener('click', closePanel);
    if (typeof window !== 'undefined') window.openChachamaru = openPanel;

    var thinkingText = t.thinking || '考え中…';
    function appendMessage(text, type) {
      var div = document.createElement('div');
      div.className = 'chachamaru-msg chachamaru-msg--' + type;
      if (type === 'loading') {
        var safeThinking = (thinkingText || '考え中…').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        div.innerHTML = '<span class="chachamaru-thinking"><span class="loading02"><span></span></span><span class="chachamaru-thinking-text">' + safeThinking + '</span></span>';
      } else if (type === 'assistant') {
        var decoded = decodeHtmlEntities(text || '');
        if (answerContainsLink(decoded || text)) {
          div.style.whiteSpace = 'pre-wrap';
          div.innerHTML = decoded || text || '';
        } else {
          div.textContent = text || '';
        }
      } else {
        div.textContent = text || '';
      }
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function sendMessage() {
      var q = inputEl.value.trim();
      if (!q) return;
      inputEl.value = '';
      appendMessage(q, 'user');
      var loadingEl = appendMessage('', 'loading');

      var streamEl;
      askChachamaruStream(q, getOrCreateSessionId(), {
        onStart: function () {
          loadingEl.remove();
          streamEl = appendMessage('', 'assistant');
        },
        onToken: function (token) {
          if (streamEl) {
            if (streamEl.lastChild && streamEl.lastChild.nodeType === 3) {
              streamEl.lastChild.textContent += token;
            } else {
              streamEl.appendChild(document.createTextNode(token));
            }
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        },
        onDone: function (data) {
          if (!streamEl) return;
          var decoded = decodeHtmlEntities(data.answer || '');
          if (answerContainsLink(decoded || data.answer)) {
            streamEl.style.whiteSpace = 'pre-wrap';
            streamEl.innerHTML = decoded || data.answer || '';
          } else {
            streamEl.textContent = data.answer || '';
          }
          messagesEl.scrollTop = messagesEl.scrollHeight;
        },
        onError: function () {
          if (streamEl) streamEl.textContent = '申し訳ございません。しばらくしてからお試しください。';
        }
      }).catch(function () {
        if (streamEl && streamEl.parentNode) {
          streamEl.textContent = '申し訳ございません。しばらくしてからお試しください。';
        } else {
          if (loadingEl && loadingEl.parentNode) loadingEl.remove();
          appendMessage('申し訳ございません。しばらくしてからお試しください。', 'assistant');
        }
      });
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runWidgetInit);
  } else {
    runWidgetInit();
  }
})();
