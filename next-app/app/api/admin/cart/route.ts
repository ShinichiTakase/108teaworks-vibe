/**
 * GET /api/admin/cart
 * data/cart/ 内の CSV ファイル一覧を新しい順で返す。
 */

import { readdir, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const CART_DIR = path.resolve(process.cwd(), "data/cart");

export async function GET() {
  try {
    let entries: string[] = [];
    try {
      entries = await readdir(CART_DIR);
    } catch {
      // ディレクトリがまだ存在しない場合は空リストを返す
      return NextResponse.json({ files: [] });
    }

    const csvFiles = entries.filter((f) => f.startsWith("cart_") && f.endsWith(".csv"));

    // ファイル名に日付が含まれているため名前で降順ソート（新しい順）
    csvFiles.sort((a, b) => b.localeCompare(a));

    const files = await Promise.all(
      csvFiles.map(async (name) => {
        const filePath = path.join(CART_DIR, name);
        const s = await stat(filePath).catch(() => null);
        return { name, size: s?.size ?? 0 };
      })
    );

    return NextResponse.json({ files });
  } catch (e) {
    console.error("[api/admin/cart]", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
