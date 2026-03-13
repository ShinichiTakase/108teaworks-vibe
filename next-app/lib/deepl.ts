const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_API_KEY) {
  // サーバー起動時に気付きやすくするための明示的なエラー
  console.warn(
    "[deepl] DEEPL_API_KEY が設定されていません。翻訳機能は無効になります。"
  );
}

// DeepL のターゲット言語コード
export type DeeplTargetLang = "JA" | "EN" | "KO" | "FR" | "ZH";

// ひとまず単純なメモリキャッシュ（プロセス再起動でクリアされる）
const cache = new Map<string, string>();

function getDeeplEndpoint() {
  // 必要であれば .env.local で明示的に上書き可能にしておく
  // 例: DEEPL_API_ENDPOINT=https://api-free.deepl.com/v2/translate
  if (process.env.DEEPL_API_ENDPOINT) {
    return process.env.DEEPL_API_ENDPOINT;
  }

  // デフォルトは Free プラン前提のエンドポイントにする。
  // Pro を使う場合は DEEPL_API_ENDPOINT で上書きしてもらう。
  return "https://api-free.deepl.com/v2/translate";
}

export interface TranslateOptions {
  text: string;
  targetLang: DeeplTargetLang;
  /** 明示的に指定したい場合のみ。省略時は DeepL に自動判定させる。 */
  sourceLang?:
    | "JA"
    | "EN"
    | "KO"
    | "FR"
    | "ZH"
    | "DE"
    | "ES"
    | "IT"
    | "NL"
    | "PL"
    | "PT"
    | "RU"
    | "ZH";
  /** キャッシュを無視して毎回 DeepL を叩きたい場合のみ true */
  forceRefresh?: boolean;
  /** HTML タグを保持して翻訳する場合 "html" */
  tagHandling?: "html";
}

export interface TranslateManyOptions {
  texts: string[];
  targetLang: DeeplTargetLang;
  sourceLang?:
    | "JA"
    | "EN"
    | "KO"
    | "FR"
    | "ZH"
    | "DE"
    | "ES"
    | "IT"
    | "NL"
    | "PL"
    | "PT"
    | "RU"
    | "ZH";
  forceRefresh?: boolean;
}

/**
 * DeepL API を使って単一テキストを翻訳する小さなヘルパー。
 * App Router のサーバーコンポーネント／API ルートから直接呼び出す想定。
 */
export async function translateText(
  options: TranslateOptions
): Promise<string> {
  const { text, targetLang, sourceLang, forceRefresh, tagHandling } = options;

  if (!DEEPL_API_KEY) {
    // キー未設定時はサイレントに元テキストを返す
    return text;
  }

  const trimmed = text.trim();
  if (!trimmed) return text;

  const cacheKey = `${sourceLang ?? "AUTO"}:${targetLang}:${tagHandling ?? ""}:${trimmed}`;
  if (!forceRefresh && cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const endpoint = getDeeplEndpoint();

  const params = new URLSearchParams();
  params.set("text", trimmed);
  params.set("target_lang", targetLang);
  if (sourceLang) {
    params.set("source_lang", sourceLang);
  }
  if (tagHandling === "html") {
    params.set("tag_handling", "html");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // 2025/11 以降はヘッダーでの認証が必須
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
    },
    body: params.toString(),
    // DeepL 側でそこそこ時間がかかるので若干長めに
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(
      `[deepl] Translation request failed: ${res.status} ${res.statusText}`
    );
    try {
      const body = await res.text();
      console.error("[deepl] Response body:", body);
    } catch {
      // ignore
    }
    return text;
  }

  type DeeplResponse = {
    translations: { text: string }[];
  };

  const data = (await res.json()) as DeeplResponse;
  const translated = data.translations?.[0]?.text ?? text;

  cache.set(cacheKey, translated);
  return translated;
}

/**
 * DeepL API を使って複数テキストを一括翻訳するヘルパー。
 * 同じ targetLang / sourceLang のテキストをまとめて送ることで、
 * API コール数を大きく削減するために使用する。
 */
export async function translateTexts(
  options: TranslateManyOptions
): Promise<string[]> {
  const { texts, targetLang, sourceLang, forceRefresh } = options;

  if (!DEEPL_API_KEY) {
    return texts;
  }
  if (!texts.length) return [];

  const trimmedList = texts.map((t) => t.trim());

  // すべて空文字ならそのまま返す
  if (trimmedList.every((t) => !t)) {
    return texts;
  }

  const keys = trimmedList.map(
    (t) => `${sourceLang ?? "AUTO"}:${targetLang}:${t}`
  );

  // まずキャッシュを確認
  const results: (string | null)[] = new Array(texts.length).fill(null);
  const missingIndices: number[] = [];

  keys.forEach((key, idx) => {
    if (!trimmedList[idx]) {
      results[idx] = texts[idx];
      return;
    }
    if (!forceRefresh && cache.has(key)) {
      results[idx] = cache.get(key)!;
    } else {
      missingIndices.push(idx);
    }
  });

  if (missingIndices.length === 0) {
    // すべてキャッシュから取れた
    return results.map((r, i) => (r == null ? texts[i] : r)) as string[];
  }

  const endpoint = getDeeplEndpoint();
  const params = new URLSearchParams();

  for (const idx of missingIndices) {
    params.append("text", trimmedList[idx]);
  }
  params.set("target_lang", targetLang);
  if (sourceLang) {
    params.set("source_lang", sourceLang);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
    },
    body: params.toString(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(
      `[deepl] Translation request (many) failed: ${res.status} ${res.statusText}`
    );
    try {
      const body = await res.text();
      console.error("[deepl] Response body:", body);
    } catch {
      // ignore
    }
    // 失敗時は元のテキストを返す（部分的キャッシュは残す）
    return texts;
  }

  type DeeplManyResponse = {
    translations: { text: string }[];
  };

  const data = (await res.json()) as DeeplManyResponse;
  const translatedList = data.translations ?? [];

  // DeepL は送った順に translations を返す想定
  missingIndices.forEach((idx, order) => {
    const translatedText = translatedList[order]?.text;
    const finalText = translatedText ?? texts[idx];
    results[idx] = finalText;
    cache.set(keys[idx], finalText);
  });

  return results.map((r, i) => (r == null ? texts[i] : r)) as string[];
}

