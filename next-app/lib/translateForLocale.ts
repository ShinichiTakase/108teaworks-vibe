import type { Locale } from "./i18n";
import type { DeeplTargetLang } from "./deepl";
import { translateText, translateTexts } from "./deepl";

export function localeToDeeplTarget(locale: Locale): DeeplTargetLang | null {
  if (locale === "ja") return null;
  if (locale === "en") return "EN";
  if (locale === "ko") return "KO";
  if (locale === "zh") return "ZH";
  return null;
}

/**
 * locale が ja でなければ DeepL で翻訳、ja ならそのまま返す。
 * HTML 本文の場合は tagHandling: "html" を指定する。
 */
export async function translateForLocale(
  text: string,
  locale: Locale,
  options?: { tagHandling?: "html" }
): Promise<string> {
  const target = localeToDeeplTarget(locale);
  if (!target || !text?.trim()) return text;
  return translateText({
    text,
    targetLang: target,
    sourceLang: "JA",
    tagHandling: options?.tagHandling,
  });
}

/**
 * 複数テキストを一括で locale に合わせて翻訳。ja の場合はそのまま返す。
 */
export async function translateManyForLocale(
  texts: string[],
  locale: Locale
): Promise<string[]> {
  const target = localeToDeeplTarget(locale);
  if (!target) return texts;
  return translateTexts({
    texts,
    targetLang: target,
    sourceLang: "JA",
  });
}
