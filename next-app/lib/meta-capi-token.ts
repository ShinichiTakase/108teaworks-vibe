import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

interface TokenData {
  access_token: string;
  expires_at: string; // ISO 8601
  obtained_at: string; // ISO 8601
}

export interface CapiTokenStatus {
  hasToken: boolean;
  expiresAt: string | null;
  daysRemaining: number | null;
  obtainedAt: string | null;
  source: "file" | "env" | "none";
}

const TOKEN_FILE = path.resolve(process.cwd(), "data/meta_capi_token.json");
const REFRESH_THRESHOLD_DAYS = 30;

function sanitize(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

async function loadTokenData(): Promise<TokenData | null> {
  try {
    const content = await readFile(TOKEN_FILE, "utf8");
    return JSON.parse(content) as TokenData;
  } catch {
    return null;
  }
}

async function saveTokenData(data: TokenData): Promise<void> {
  await mkdir(path.dirname(TOKEN_FILE), { recursive: true });
  await writeFile(TOKEN_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function exchangeToken(
  token: string,
): Promise<{ access_token: string; expires_in: number } | null> {
  const appId = sanitize(process.env.INSTAGRAM_APP_ID);
  const appSecret = sanitize(process.env.INSTAGRAM_APP_SECRET);
  if (!appId || !appSecret) {
    console.warn("[meta-capi-token] INSTAGRAM_APP_ID/SECRET not set — cannot refresh");
    return null;
  }

  const url = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("fb_exchange_token", token);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      console.error("[meta-capi-token] exchange failed", res.status, err);
      return null;
    }
    return (await res.json()) as { access_token: string; expires_in: number };
  } catch (e) {
    console.error("[meta-capi-token] exchange error", e);
    return null;
  }
}

export async function getCapiToken(): Promise<string | null> {
  noStore();

  let tokenData = await loadTokenData();

  // 初回: env から読んでファイルを初期化
  if (!tokenData) {
    const envToken = sanitize(process.env.META_CAPI_ACCESS_TOKEN);
    if (!envToken || envToken === "YOUR_TOKEN_HERE") return null;

    tokenData = {
      access_token: envToken,
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      obtained_at: new Date().toISOString(),
    };
    await saveTokenData(tokenData).catch(() => {});
  }

  const daysRemaining =
    (new Date(tokenData.expires_at).getTime() - Date.now()) / 86400000;

  if (daysRemaining < REFRESH_THRESHOLD_DAYS) {
    const refreshed = await exchangeToken(tokenData.access_token);
    if (refreshed) {
      const newData: TokenData = {
        access_token: refreshed.access_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        obtained_at: new Date().toISOString(),
      };
      await saveTokenData(newData).catch(() => {});
      console.info("[meta-capi-token] token refreshed, new expiry:", newData.expires_at);
      return newData.access_token;
    }
    // 更新失敗 — まだ有効なら使い続ける
    if (daysRemaining > 0) return tokenData.access_token;
    console.error("[meta-capi-token] token expired and refresh failed");
    return null;
  }

  return tokenData.access_token;
}

export async function getCapiTokenStatus(): Promise<CapiTokenStatus> {
  noStore();

  const tokenData = await loadTokenData();
  if (tokenData) {
    const daysRemaining =
      (new Date(tokenData.expires_at).getTime() - Date.now()) / 86400000;
    return {
      hasToken: true,
      expiresAt: tokenData.expires_at,
      daysRemaining: Math.floor(daysRemaining),
      obtainedAt: tokenData.obtained_at,
      source: "file",
    };
  }

  const envToken = sanitize(process.env.META_CAPI_ACCESS_TOKEN);
  const hasEnvToken = Boolean(envToken) && envToken !== "YOUR_TOKEN_HERE";
  return {
    hasToken: hasEnvToken,
    expiresAt: null,
    daysRemaining: null,
    obtainedAt: null,
    source: hasEnvToken ? "env" : "none",
  };
}

export async function forceRefreshCapiToken(): Promise<{
  ok: boolean;
  expiresAt?: string;
  error?: string;
}> {
  const tokenData = await loadTokenData();
  const envToken = sanitize(process.env.META_CAPI_ACCESS_TOKEN);
  const currentToken =
    tokenData?.access_token ??
    (envToken !== "YOUR_TOKEN_HERE" ? envToken : "");
  if (!currentToken) return { ok: false, error: "トークンがありません" };

  const refreshed = await exchangeToken(currentToken);
  if (!refreshed)
    return {
      ok: false,
      error: "更新失敗 — INSTAGRAM_APP_ID / INSTAGRAM_APP_SECRET を確認してください",
    };

  const newData: TokenData = {
    access_token: refreshed.access_token,
    expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    obtained_at: new Date().toISOString(),
  };
  await saveTokenData(newData);
  return { ok: true, expiresAt: newData.expires_at };
}
