/**
 * 深蒸し茶LP（/ise-cha/fukamushi-lp/）用の画像を public/images/fukamushi-lp/ に配置する。
 * HERO画像はPNG→WebPに変換（見た目の劣化がない範囲で軽量化）。他は既にWebPのためコピーのみ。
 *
 * 使用: node scripts/convert-fukamushi-lp-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.join(__dirname, "../public/images/fukamushi-lp");

const heroSrc = "D:/藤八茶寮/緑茶LP/lp_greentea_0.png";
const heroDest = path.join(destDir, "hero.webp");

const copies = [
  { src: "D:/Users/Desktop/Work/水出し.webp", dest: path.join(destDir, "coldbrew.webp") },
  { src: "D:/Users/Desktop/Work/catechin.webp", dest: path.join(destDir, "catechin.webp") },
  { src: "D:/Users/Desktop/Work/Caffeine_structure.webp", dest: path.join(destDir, "caffeine.webp") },
];

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

  for (const { src, dest } of copies) {
    if (!fs.existsSync(src)) {
      console.error("missing:", src);
      process.exit(1);
    }
    fs.copyFileSync(src, dest);
    console.log("OK copied", path.basename(dest));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
