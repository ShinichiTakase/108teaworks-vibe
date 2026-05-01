/**
 * GET /api/admin/cart/[filename]
 * 指定された CSV ファイルの内容を行配列として返す。
 * ファイル名はサニタイズしてディレクトリトラバーサルを防ぐ。
 */

import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const CART_DIR = path.resolve(process.cwd(), "data/cart");

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const raw = params.filename ?? "";
  // ファイル名に cart_ プレフィックスと .csv サフィックス、英数字と _ のみ許可
  if (!/^cart_\d{8}\.csv$/.test(raw)) {
    return NextResponse.json({ error: "invalid_filename" }, { status: 400 });
  }

  const filePath = path.join(CART_DIR, raw);
  // パストラバーサル防止
  if (!filePath.startsWith(CART_DIR + path.sep) && filePath !== CART_DIR) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const content = await readFile(filePath, "utf8");
    const lines = content.split("\n").filter((l) => l.trim() !== "");
    const [headerLine, ...rows] = lines;
    const headers = headerLine?.split(",") ?? [];
    const records = rows.map((line) => {
      // 簡易CSV パース（ダブルクォートエスケープ対応）
      const cols: string[] = [];
      let cur = "";
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuote) {
          if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (ch === '"') { inQuote = false; }
          else { cur += ch; }
        } else {
          if (ch === '"') { inQuote = true; }
          else if (ch === ",") { cols.push(cur); cur = ""; }
          else { cur += ch; }
        }
      }
      cols.push(cur);
      return cols;
    });
    return NextResponse.json({ headers, records });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
