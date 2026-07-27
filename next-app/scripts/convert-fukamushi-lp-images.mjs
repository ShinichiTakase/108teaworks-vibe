/**
 * 深蒸し茶LP（/ise-cha/fukamushi-lp/）のHERO画像・水出し氷出しセクション画像を
 * public/images/fukamushi-lp/ に配置する。PNG→WebPに変換（見た目の劣化がない範囲で軽量化）。
 *
 * 使用: node scripts/convert-fukamushi-lp-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.join(__dirname, "../public/images/fukamushi-lp");

const targets = [
  { src: "D:/Users/Desktop/Work/lp_greentea_0.png", dest: path.join(destDir, "hero.webp") },
  { src: "D:/Users/Desktop/Work/ice_greentea.png", dest: path.join(destDir, "coldbrew.webp") },
];

async function main() {
  fs.mkdirSync(destDir, { recursive: true });

  for (const { src, dest } of targets) {
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
