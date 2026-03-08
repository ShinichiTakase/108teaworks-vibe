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
