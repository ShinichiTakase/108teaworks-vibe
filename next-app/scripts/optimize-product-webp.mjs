/**
 * public/images/products 以下の .webp を同一解像度のまま再エンコードする。
 * WebP 品質は 95、effort は最大でエンコーダ負担をかけてサイズを抑える。
 *
 * 使用: npm run images:products-webp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsDir = path.join(__dirname, "../public/images/products");

const WEBP_QUALITY = 95;
const WEBP_ALPHA_QUALITY = 95;
const WEBP_EFFORT = 6;

/**
 * @param {Buffer} input
 */
async function encodeWebp(input) {
  return sharp(input, { failOn: "none" })
    .rotate()
    .webp({
      quality: WEBP_QUALITY,
      alphaQuality: WEBP_ALPHA_QUALITY,
      effort: WEBP_EFFORT,
      smartSubsample: true,
    })
    .toBuffer();
}

function collectWebpFiles(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...collectWebpFiles(full));
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".webp")) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  if (!fs.existsSync(productsDir)) {
    console.error("missing:", productsDir);
    process.exit(1);
  }

  const files = collectWebpFiles(productsDir).sort();
  if (files.length === 0) {
    console.error("no .webp under", productsDir);
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const filePath of files) {
    const beforeStat = fs.statSync(filePath);
    totalBefore += beforeStat.size;

    const input = fs.readFileSync(filePath);
    const buf = await encodeWebp(input);

    const tmp = `${filePath}.optimizing.webp`;
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, filePath);

    totalAfter += buf.length;

    const rel = path.relative(path.join(__dirname, "../public"), filePath);
    console.log(
      rel.replace(/\\/g, "/"),
      "before",
      beforeStat.size,
      "after",
      buf.length,
      "delta",
      buf.length - beforeStat.size,
    );
  }

  console.log(
    "OK",
    files.length,
    "files",
    "total before",
    totalBefore,
    "after",
    totalAfter,
    "delta",
    totalAfter - totalBefore,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
