import { type NextRequest, NextResponse } from "next/server";
import { getCapiToken, getCapiTokenStatus } from "@/lib/meta-capi-token";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVIEW_CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const before = await getCapiTokenStatus();
  // getCapiToken() が残り30日以下なら自動更新する
  const token = await getCapiToken();
  const after = await getCapiTokenStatus();

  return NextResponse.json({
    ok: Boolean(token),
    before: { daysRemaining: before.daysRemaining, source: before.source },
    after: { daysRemaining: after.daysRemaining, expiresAt: after.expiresAt },
  });
}
