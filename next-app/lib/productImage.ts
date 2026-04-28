import fs from "fs";
import path from "path";

const PRODUCTS_IMAGE_DIR = ["public", "images", "products"];
const IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"]);

function sortByFilenameAsc(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function readImageFilesAsc(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => {
      const p = path.join(dir, f);
      return fs.statSync(p).isFile() && IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase());
    })
    .sort(sortByFilenameAsc);
}

function getFallbackImage(): string {
  const root = path.join(process.cwd(), ...PRODUCTS_IMAGE_DIR);
  if (!fs.existsSync(root)) return "";

  const dirs = fs
    .readdirSync(root)
    .filter((name) => fs.statSync(path.join(root, name)).isDirectory())
    .sort(sortByFilenameAsc);

  for (const dirName of dirs) {
    const files = readImageFilesAsc(path.join(root, dirName));
    if (files.length > 0) {
      return `/images/products/${dirName}/${files[0]}`;
    }
  }

  return "";
}

const FALLBACK_IMAGE = getFallbackImage();

/**
 * public/images/products/{slug}/ 内の全ファイルパスを辞書順で返す（メインは先頭、サムネイルは2番目以降）
 */
export function getProductImagePaths(slug: string): string[] {
  if (!slug || typeof slug !== "string") return FALLBACK_IMAGE ? [FALLBACK_IMAGE] : [];
  const dir = path.join(process.cwd(), ...PRODUCTS_IMAGE_DIR, slug);
  try {
    const files = readImageFilesAsc(dir);
    if (files.length === 0) return FALLBACK_IMAGE ? [FALLBACK_IMAGE] : [];
    return files.map((f) => `/images/products/${slug}/${f}`);
  } catch {
    return FALLBACK_IMAGE ? [FALLBACK_IMAGE] : [];
  }
}

/**
 * public/images/products/{slug}/ 内でファイル名が辞書順で一番若いファイルのパスを返す
 */
export function getProductImagePath(slug: string): string {
  const paths = getProductImagePaths(slug);
  return paths[0] ?? "";
}

/**
 * public/images/products/{slug}/taste/ 内の .webp を辞書順で返す（無ければ空配列）
 */
export function getProductTasteImagePaths(slug: string): string[] {
  if (!slug || typeof slug !== "string") return [];
  if (slug.includes("..") || slug.includes("/") || slug.includes("\\")) return [];
  const dir = path.join(process.cwd(), ...PRODUCTS_IMAGE_DIR, slug, "taste");
  try {
    if (!fs.existsSync(dir)) return [];
    const files = fs
      .readdirSync(dir)
      .filter((f) => {
        if (!f.toLowerCase().endsWith(".webp")) return false;
        const p = path.join(dir, f);
        return fs.statSync(p).isFile();
      })
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    return files.map((f) => `/images/products/${slug}/taste/${f}`);
  } catch {
    return [];
  }
}
