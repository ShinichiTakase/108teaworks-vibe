import { mkdir, appendFile, stat } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/microcms";
import { getShippingByPrefecture } from "@/lib/shippingByPrefecture";

const SHIPPING_DIR = path.resolve(process.cwd(), "data/shipping");

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

async function logShipping(req: NextRequest, shipping: number, prefecture: string) {
  try {
    const ip = getClientIp(req);
    if (EXCLUDED_PREFIXES.some((p) => ip.startsWith(p))) return;
    const { date, time } = nowJST();
    const filePath = path.join(SHIPPING_DIR, `shipping_${date}.csv`);
    const row = [date, time, ip, shipping, prefecture].map((v) => csvEscape(String(v))).join(",") + "\n";

    await mkdir(SHIPPING_DIR, { recursive: true });

    const header = "date,time,ip,shipping_fee,prefecture\n";
    try {
      const s = await stat(filePath);
      if (s.size === 0) await appendFile(filePath, header, "utf8");
    } catch {
      await appendFile(filePath, header, "utf8");
    }
    await appendFile(filePath, row, "utf8");
  } catch (e) {
    console.error("[shipping/log]", e);
  }
}

const FREE_SHIPPING_THRESHOLD = 20000;
const FLAT_SHIPPING = 280;
const RANK_THRESHOLD = 6.0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prefecture,
      items,
      subtotal,
    } = body as {
      prefecture?: string;
      items?: { slug: string; quantity: number }[];
      subtotal?: number;
    };

    if (typeof prefecture !== "string" || !Array.isArray(items) || typeof subtotal !== "number") {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 }
      );
    }

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      await logShipping(req, 0, prefecture.trim());
      return NextResponse.json({ ok: true, shipping: 0 });
    }

    const { contents: products } = await getProducts({ noCache: true });
    const rankBySlug = new Map<string, number>();
    const normalizeSlug = (s: string) => s.replace(/-/g, "_");
    const normalizeSlugHyphen = (s: string) => s.replace(/_/g, "-");
    for (const p of products) {
      const slug = (p.SLUG ?? p.id ?? "").trim();
      if (!slug || p.SHIP_RANK == null) continue;
      const rank = Number(p.SHIP_RANK);
      if (Number.isNaN(rank)) continue;
      rankBySlug.set(slug, rank);
      rankBySlug.set(normalizeSlug(slug), rank);
      rankBySlug.set(normalizeSlugHyphen(slug), rank);
    }

    let rankSum = 0;
    for (const { slug, quantity } of items) {
      const s = (slug || "").trim();
      const rank =
        rankBySlug.get(s) ??
        rankBySlug.get(normalizeSlug(s)) ??
        rankBySlug.get(normalizeSlugHyphen(s)) ??
        0;
      rankSum += rank * (quantity || 0);
    }

    if (rankSum <= RANK_THRESHOLD) {
      await logShipping(req, FLAT_SHIPPING, prefecture.trim());
      return NextResponse.json({ ok: true, shipping: FLAT_SHIPPING });
    }

    const shippingResult = await getShippingByPrefecture(prefecture.trim(), { noCache: true });
    const shipping = shippingResult !== null ? shippingResult.fee : FLAT_SHIPPING;
    await logShipping(req, shipping, prefecture.trim());
    return NextResponse.json({ ok: true, shipping });
  } catch (e) {
    console.error("[api/checkout/shipping]", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
