/**
 * Instagram Graph API で最新メディアを取得
 * 要: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID（.env.local）
 * 参考: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
 */

import { unstable_noStore as noStore } from "next/cache";

export type InstagramMedia = {
  id: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
};

function sanitizeEnv(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  // env_file で値をクォートしているケースを吸収
  return trimmed.replace(/^['"]+|['"]+$/g, "");
}

function mapMedia(data: Array<Record<string, unknown>>, limit: number): InstagramMedia[] {
  return data
    .filter((item): item is InstagramMedia => typeof item.permalink === "string" && typeof item.media_url === "string")
    .map((item) => ({
      id: String(item.id),
      media_type: item.media_type as InstagramMedia["media_type"],
      media_url: String(item.media_url),
      permalink: String(item.permalink),
      thumbnail_url: item.thumbnail_url ? String(item.thumbnail_url) : undefined,
    }))
    .slice(0, limit);
}

async function fetchFromCandidates(token: string, userId: string, limit: number): Promise<InstagramMedia[]> {
  const fields = "id,media_type,media_url,permalink,thumbnail_url";
  const candidates = [
    `https://graph.instagram.com/v21.0/${userId}/media`,
    "https://graph.instagram.com/me/media",
    `https://graph.facebook.com/v21.0/${userId}/media`,
  ];

  for (const endpoint of candidates) {
    const url = new URL(endpoint);
    url.searchParams.set("fields", fields);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("access_token", token);

    try {
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: { message?: string; code?: number } };
        const msg = errBody?.error?.message ?? "no message";
        console.error("[instagram] fetch failed", endpoint, res.status, res.statusText, msg);
        continue;
      }

      const json = await res.json();
      const data = json.data as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("[instagram] empty data", endpoint);
        continue;
      }

      return mapMedia(data, limit);
    } catch (e) {
      console.error("[instagram] request error", endpoint, e);
    }
  }

  return [];
}

export async function fetchInstagramMedia(limit = 10): Promise<InstagramMedia[]> {
  // Docker 本番では build 時に環境変数が未注入でも、実行時に取得できるよう静的化を無効化。
  noStore();

  const token = sanitizeEnv(process.env.INSTAGRAM_ACCESS_TOKEN);
  const userId = sanitizeEnv(process.env.INSTAGRAM_USER_ID);
  if (!token || !userId) {
    return [];
  }

  try {
    return await fetchFromCandidates(token, userId, limit);
  } catch (e) {
    console.error("[instagram] unexpected error", e);
    return [];
  }
}
