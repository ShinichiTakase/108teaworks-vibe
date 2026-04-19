import fs from "fs";
import path from "path";

const FALLBACK_IMAGE = "/images/products/product-01.webp";

const PRODUCTS_IMAGE_DIR = ["public", "images", "products"];

/**
 * public/images/products/{slug}/ 内の全ファイルパスを辞書順で返す（メインは先頭、サムネイルは2番目以降）
 */
export function getProductImagePaths(slug: string): string[] {
  if (!slug || typeof slug !== "string") return [FALLBACK_IMAGE];
  const dir = path.join(process.cwd(), ...PRODUCTS_IMAGE_DIR, slug);
  try {
    if (!fs.existsSync(dir)) return [FALLBACK_IMAGE];
    const files = fs.readdirSync(dir).filter((f) => {
      const p = path.join(dir, f);
      return fs.statSync(p).isFile();
    });
    if (files.length === 0) return [FALLBACK_IMAGE];
    files.sort();
    return files.map((f) => `/images/products/${slug}/${f}`);
  } catch {
    return [FALLBACK_IMAGE];
  }
}

/**
 * public/images/products/{slug}/ 内でファイル名が辞書順で一番若いファイルのパスを返す
 */
export function getProductImagePath(slug: string): string {
  const paths = getProductImagePaths(slug);
  return paths[0] ?? FALLBACK_IMAGE;
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
