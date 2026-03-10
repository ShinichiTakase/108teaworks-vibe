#!/usr/bin/env node
/**
 * 領収書PDF用の日本語フォント（Noto Serif JP）を取得するスクリプト。
 * 実行: node scripts/download-receipt-font.mjs
 * 取得先: Google Fonts (GitHub)
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "fonts");
const FONT_FILE = "NotoSerifJP-Regular.otf";

// 候補URL（いずれかが利用可能な場合に取得）
const FONT_URLS = [
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifjp/NotoSerifJP-Regular.otf",
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notoserifjp/NotoSerifJP-Regular.otf",
];

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  const outPath = path.join(OUT_DIR, FONT_FILE);
  console.log("Downloading Noto Serif JP (Regular)...");
  let lastError;
  for (const url of FONT_URLS) {
    try {
      const buf = await download(url);
      if (buf.length < 1000) continue;
      fs.writeFileSync(outPath, buf);
      console.log("Saved:", outPath);
      return;
    } catch (e) {
      lastError = e;
    }
  }
  console.error("Download failed:", lastError?.message || "all URLs failed");
  console.error("");
  console.error("Please add the font manually:");
  console.error("1. Open https://fonts.google.com/noto/specimen/Noto+Serif+JP");
  console.error("2. Click 'Download family' to get the ZIP");
  console.error("3. Unzip and copy NotoSerifJP-Regular.otf to next-app/public/fonts/");
  process.exit(1);
}

main();
