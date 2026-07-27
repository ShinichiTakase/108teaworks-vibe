/**
 * 深蒸し茶LP（/ise-cha/fukamushi-lp/）のHERO画像を public/images/fukamushi-lp/hero.webp に配置する。
 * PNG→WebPに変換（見た目の劣化がない範囲で軽量化）。
 *
 * 使用: node scripts/convert-fukamushi-lp-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.join(__dirname, "../public/images/fukamushi-lp");

const heroSrc = "D:/Users/Desktop/Work/ice_greentea.png";
const heroDest = path.join(destDir, "hero.webp");

async function main() {
  fs.mkdirSync(destDir, { recursive: true });

  if (!fs.existsSync(heroSrc)) {
    console.error("missing:", heroSrc);
    process.exit(1);
  }
  const before = fs.statSync(heroSrc).size;
  const info = await sharp(heroSrc)
    .rotate()
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(heroDest);
  console.log("OK hero.webp", info.width, "x", info.height, "before", before, "after", info.size);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
