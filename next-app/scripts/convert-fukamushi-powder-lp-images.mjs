/**
 * 深蒸し茶パウダーLP（/ise-cha/fukamushi-powder-lp/）用の画像を
 * public/images/fukamushi-powder-lp/ に配置する。
 * HERO画像はPNG→WebPに変換（見た目の劣化がない範囲で軽量化）。他は既にWebPのためコピーのみ。
 *
 * 使用: node scripts/convert-fukamushi-powder-lp-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.join(__dirname, "../public/images/fukamushi-powder-lp");

const conversions = [
  { src: "D:/藤八茶寮/緑茶パウダーLP/lp_greentea_powder_0.png", dest: path.join(destDir, "hero.webp") },
  { src: "D:/Users/Desktop/Work/緑茶ラテ.png", dest: path.join(destDir, "matcha-latte.webp") },
];

const copies = [
  { src: "D:/Users/Desktop/Work/100g.webp", dest: path.join(destDir, "100g.webp") },
  { src: "D:/Users/Desktop/Work/500g.webp", dest: path.join(destDir, "500g.webp") },
];

async function main() {
  fs.mkdirSync(destDir, { recursive: true });

  for (const { src, dest } of conversions) {
    if (!fs.existsSync(src)) {
      console.error("missing:", src);
      process.exit(1);
    }
    const before = fs.statSync(src).size;
    const info = await sharp(src)
      .rotate()
      .webp({ quality: 92, effort: 6, smartSubsample: true })
      .toFile(dest);
    console.log("OK", path.basename(dest), info.width, "x", info.height, "before", before, "after", info.size);
  }

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
