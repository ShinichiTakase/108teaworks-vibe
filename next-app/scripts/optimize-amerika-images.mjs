/**
 * public/images の tea_garden / ranji を実 JPEG に再エンコード（軽量化）。
 * ranji は幅を約 60% にリサイズ。
 *
 * 使用: npm run images:amerika （要: sharp）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const teaPath = path.join(imagesDir, "tea_garden.jpg");
const ranjiPath = path.join(imagesDir, "ranji.jpg");

async function main() {
  if (!fs.existsSync(teaPath)) {
    console.error("missing:", teaPath);
    process.exit(1);
  }
  if (!fs.existsSync(ranjiPath)) {
    console.error("missing:", ranjiPath);
    process.exit(1);
  }

  const teaTmp = path.join(imagesDir, "tea_garden.optimizing.jpg");
  const ranjiTmp = path.join(imagesDir, "ranji.optimizing.jpg");

  // 茶庭: 長辺 1000px 程度、JPEG 品質 85
  const teaInfo = await sharp(teaPath)
    .rotate()
    .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(teaTmp);

  // 蘭字: 幅を 60%（ファイル・表示の両方を抑える）
  const ranjiMeta = await sharp(ranjiPath).metadata();
  const targetW = Math.max(1, Math.round((ranjiMeta.width ?? 800) * 0.6));
  const ranjiInfo = await sharp(ranjiPath)
    .rotate()
    .resize({ width: targetW, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(ranjiTmp);

  fs.renameSync(teaTmp, teaPath);
  fs.renameSync(ranjiTmp, ranjiPath);

  console.log("OK tea_garden.jpg", teaInfo.width, "x", teaInfo.height, "bytes", teaInfo.size);
  console.log("OK ranji.jpg", ranjiInfo.width, "x", ranjiInfo.height, "bytes", ranjiInfo.size);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
