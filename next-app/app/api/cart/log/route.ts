/**
 * POST /api/cart/log
 * カートに追加された商品を data/cart/cart_yyyymmdd.csv に追記する。
 * 日付は JST。IP アドレスはリクエストヘッダから取得。
 */

import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const CART_DIR = path.resolve(process.cwd(), "data/cart");

/** JST の現在日時を返す */
function nowJST(): { date: string; time: string } {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date =
    `${jst.getUTCFullYear()}${pad(jst.getUTCMonth() + 1)}${pad(jst.getUTCDate())}`;
  const time =
    `${pad(jst.getUTCHours())}:${pad(jst.getUTCMinutes())}:${pad(jst.getUTCSeconds())}`;
  return { date, time };
}

/** CSV の値をエスケープ */
function csvEscape(value: string): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const quantity = Number(body.quantity);

    if (!title || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const ip = getClientIp(req);
    const { date, time } = nowJST();

    const filePath = path.join(CART_DIR, `cart_${date}.csv`);
    const row = [date, time, ip, title, quantity]
      .map((v) => csvEscape(String(v)))
      .join(",") + "\n";

    await mkdir(CART_DIR, { recursive: true });

    // ファイルが空（新規）なら CSVヘッダを先に書く
    const header = "date,time,ip,product,quantity\n";
    try {
      const { stat } = await import("fs/promises");
      const s = await stat(filePath);
      if (s.size === 0) await appendFile(filePath, header, "utf8");
    } catch {
      // ファイルが存在しない場合はヘッダから書き始める
      await appendFile(filePath, header, "utf8");
    }

    await appendFile(filePath, row, "utf8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[cart/log]", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
