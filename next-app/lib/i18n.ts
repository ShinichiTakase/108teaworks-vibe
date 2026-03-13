export type Locale = "ja" | "en" | "ko" | "zh";

// DeepL 向けターゲット言語コード
export const localeToDeeplTarget: Record<Locale, "JA" | "EN" | "KO" | "ZH"> = {
  ja: "JA",
  en: "EN",
  ko: "KO",
  zh: "ZH",
};

