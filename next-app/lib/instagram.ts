/**
 * Instagram Graph API で最新メディアを取得
 * 要: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID（.env.local）
 * 参考: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
 */

export type InstagramMedia = {
  id: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
};

export async function fetchInstagramMedia(limit = 10): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!token || !userId) {
    return [];
  }
  // IGAA 始まりのトークンは graph.instagram.com で試す
  const base = "https://graph.instagram.com";
  const url = new URL(`${base}/v21.0/${userId}/media`);
  url.searchParams.set("fields", "id,media_type,media_url,permalink,thumbnail_url");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as { error?: { message?: string; code?: number } };
      const msg = errBody?.error?.message ?? "no message";
      console.error("[instagram] fetch failed", res.status, res.statusText, msg);
      return [];
    }
    const json = await res.json();
    const data = json.data as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(data)) return [];

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
  } catch (e) {
    console.error("[instagram] unexpected error", e);
    return [];
  }
}
