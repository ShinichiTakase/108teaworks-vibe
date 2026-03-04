import fs from "node:fs";
import path from "node:path";

const SUPPORTED_LOCALES = ["en", "ko", "zh", "fr"] as const;
type TargetLocale = (typeof SUPPORTED_LOCALES)[number];

type Messages = Record<string, string>;

async function translateText(
  text: string,
  targetLang: TargetLocale,
  apiKey: string,
): Promise<string> {
  const params = new URLSearchParams();
  params.set("text", text);
  params.set("target_lang", targetLang.toUpperCase());

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL request failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    translations: { text: string }[];
  };

  return data.translations[0]?.text ?? text;
}

async function main() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error("DEEPL_API_KEY が設定されていません (.env.local を確認してください)");
    process.exit(1);
  }

  const localesDir = path.join(process.cwd(), "locales");
  const sourcePath = path.join(localesDir, "ja.json");

  if (!fs.existsSync(sourcePath)) {
    console.error(`source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const source: Messages = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

  for (const locale of SUPPORTED_LOCALES) {
    const targetPath = path.join(localesDir, `${locale}.json`);
    const target: Messages = fs.existsSync(targetPath)
      ? JSON.parse(fs.readFileSync(targetPath, "utf8"))
      : {};

    const result: Messages = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (result[key]) continue;
      // eslint-disable-next-line no-console
      console.log(`Translating [${locale}] ${key}...`);
      result[key] = await translateText(value, locale, apiKey);
      await new Promise((r) => setTimeout(r, 200)); // 軽いレート制限
    }

    fs.mkdirSync(localesDir, { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(result, null, 2), "utf8");
    // eslint-disable-next-line no-console
    console.log(`Written ${targetPath}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

