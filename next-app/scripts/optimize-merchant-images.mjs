import sharp from "sharp";
import { readdir, stat, rename, unlink, readFile, writeFile } from "fs/promises";
import { join } from "path";

sharp.cache(false);

const MERCHANT_DIR = new URL("../public/images/merchant", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImages(full)));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function optimize(filePath) {
  const beforeStat = await stat(filePath);

  // バッファ経由で読み込み、ファイルロックを即座に解放する
  const inputBuffer = await readFile(filePath);
  const outputBuffer = await sharp(inputBuffer)
    .webp({ quality: 85, effort: 6, smartSubsample: true })
    .toBuffer();

  const dest = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

  if (outputBuffer.length < beforeStat.size) {
    await writeFile(dest, outputBuffer);
    if (dest !== filePath) await unlink(filePath);
    return { path: dest, before: beforeStat.size, after: outputBuffer.length };
  } else {
    return { path: filePath, before: beforeStat.size, after: beforeStat.size, skipped: true };
  }
}

const files = await findImages(MERCHANT_DIR);
console.log(`Found ${files.length} images\n`);

let totalBefore = 0;
let totalAfter = 0;
let skipped = 0;

for (const file of files) {
  const result = await optimize(file);
  totalBefore += result.before;
  totalAfter += result.after;
  const saved = result.before - result.after;
  const pct = ((saved / result.before) * 100).toFixed(1);
  const rel = file.replace(MERCHANT_DIR, "").replace(/\\/g, "/");
  if (result.skipped) {
    console.log(`  skip  ${rel}  (already optimal)`);
    skipped++;
  } else {
    console.log(`  -${pct.padStart(5)}%  ${rel}  (${(result.before / 1024).toFixed(0)} → ${(result.after / 1024).toFixed(0)} KB)`);
  }
}

const totalSaved = totalBefore - totalAfter;
console.log(`\n${"─".repeat(60)}`);
console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
console.log(`Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${((totalSaved / totalBefore) * 100).toFixed(1)}%)`);
console.log(`Skipped (already optimal): ${skipped} files`);
