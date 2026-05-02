import { NextResponse } from "next/server";
import { diagnoseInstagramFetch } from "@/lib/instagram";

/**
 * 本番で Instagram 取得失敗の原因を切り分けるデバッグ用。
 * GET /api/debug-instagram
 */
export async function GET() {
  const diagnosis = await diagnoseInstagramFetch(3);
  return NextResponse.json({ ok: true, ...diagnosis });
}
