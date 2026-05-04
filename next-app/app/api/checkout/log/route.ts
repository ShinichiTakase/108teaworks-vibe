import { mkdir, appendFile, stat } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const CHECKOUT_DIR = path.resolve(process.cwd(), "data/checkout");

function nowJST(): { date: string; time: string } {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${jst.getUTCFullYear()}${pad(jst.getUTCMonth() + 1)}${pad(jst.getUTCDate())}`;
  const time = `${pad(jst.getUTCHours())}:${pad(jst.getUTCMinutes())}:${pad(jst.getUTCSeconds())}`;
  return { date, time };
}

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

const EXCLUDED_PREFIXES = ["118.240.42.", "101.111.181."];

function isExcludedIp(ip: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => ip.startsWith(prefix));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const total_amount = Number(body.total_amount);

    if (!Number.isFinite(total_amount) || total_amount < 0) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const ip = getClientIp(req);
    if (isExcludedIp(ip)) return NextResponse.json({ ok: true });
    const { date, time } = nowJST();

    const filePath = path.join(CHECKOUT_DIR, `checkout_${date}.csv`);
    const row = [date, time, ip, total_amount].map((v) => csvEscape(String(v))).join(",") + "\n";

    await mkdir(CHECKOUT_DIR, { recursive: true });

    const header = "date,time,ip,total_amount\n";
    try {
      const s = await stat(filePath);
      if (s.size === 0) await appendFile(filePath, header, "utf8");
    } catch {
      await appendFile(filePath, header, "utf8");
    }

    await appendFile(filePath, row, "utf8");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[checkout/log]", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
