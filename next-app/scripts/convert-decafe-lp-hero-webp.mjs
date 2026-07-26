/**
 * D:\藤八茶寮\カフェインカットLP\lp_caffeinecut.png を同一解像度のまま WebP に変換する。
 *
 * 使用: node scripts/convert-decafe-lp-hero-webp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = "D:\\藤八茶寮\\カフェインカットLP\\lp_caffeinecut.png";
const destPath = path.join(__dirname, "../public/images/decafe-lp/hero.webp");

async function main() {
  if (!fs.existsSync(srcPath)) {
    console.error("missing:", srcPath);
    process.exit(1);
  }

  const before = fs.statSync(srcPath).size;
  const info = await sharp(srcPath)
    .rotate()
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(destPath);

  console.log("OK hero.webp", info.width, "x", info.height, "before", before, "after", info.size, "delta", info.size - before);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
