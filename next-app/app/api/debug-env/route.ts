import { NextResponse } from "next/server";

/**
 * 環境変数がコンテナに渡っているか確認する用（本番では削除または認証で保護すること）
 * GET /api/debug-env → { ok, hasDomain, hasKey }
 */
export async function GET() {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  const key = process.env.MICROCMS_API_KEY?.trim();
  const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const instagramUserId = process.env.INSTAGRAM_USER_ID?.trim();
  return NextResponse.json({
    ok: true,
    hasDomain: Boolean(domain),
    hasKey: Boolean(key),
    domainLength: domain?.length ?? 0,
    hasInstagramToken: Boolean(instagramToken),
    hasInstagramUserId: Boolean(instagramUserId),
    instagramUserIdLength: instagramUserId?.length ?? 0,
  });
}
