import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";
import type { Locale } from "@/lib/i18n";

/**
 * 運用環境により Next.js の起動 cwd が異なるため、
 * 既に存在する data を優先して自動選択する。
 */
function resolveDataDir(): string {
  const cwd = process.cwd();
  const env = process.env.REVIEWS_DATA_DIR?.trim();

  const candidates = [
    env || null,
    path.join(cwd, "data"),
    path.join(cwd, "next-app", "data"),
    // Linux 環境でこのプロジェクトを固定パスに置いているケース
    "/mnt/nvme01/project/108teaworks-vibe/data",
    "/mnt/nvme01/project/108teaworks-vibe/next-app/data",
  ].filter(Boolean) as string[];

  const looksLikeDataRoot = (p: string) => {
    if (!existsSync(p)) return false;
    // reviews ディレクトリ or 既存のキュー/トークンがあれば採用
    if (existsSync(path.join(p, "reviews"))) return true;
    if (existsSync(path.join(p, "review-queue.json"))) return true;
    if (existsSync(path.join(p, "review-tokens.json"))) return true;
    return false;
  };

  for (const c of candidates) {
    if (looksLikeDataRoot(c)) return c;
  }

  // どれも無い場合は {cwd}/data に作成する
  return path.join(cwd, "data");
}

function dataDir(): string {
  return resolveDataDir();
}

function queuePath(): string {
  return path.join(dataDir(), "review-queue.json");
}

function tokenPath(): string {
  return path.join(dataDir(), "review-tokens.json");
}

function reviewsDir(): string {
  return path.join(dataDir(), "reviews");
}

export type ReviewQueueItem = {
  token: string;
  createdAt: string; // ISO
  email: string;
  name: string;
  locale: Locale;
  items: { slug: string; title: string }[];
};

export type ReviewTokenItem = ReviewQueueItem & {
  expiresAt: string; // ISO
};

export type StoredReview = {
  productName: string;
  nickname: string;
  rating: number;
  review: string;
  name: string;
  email: string;
  createdAt: string; // ISO
};

async function ensureDirs() {
  const dir = dataDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(path.join(dir, "reviews"), { recursive: true });
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const buf = await fs.readFile(filePath, "utf8");
    const s = buf.charCodeAt(0) === 0xfeff ? buf.slice(1) : buf; // BOM 対策
    return JSON.parse(s) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDirs();
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf8");
}

export async function enqueueReviewRequest(params: {
  email: string;
  name: string;
  locale: Locale;
  items: { slug: string; title: string }[];
}): Promise<string> {
  await ensureDirs();
  const now = new Date();
  const token = crypto.randomBytes(32).toString("hex");
  const queue = await readJsonFile<ReviewQueueItem[]>(queuePath(), []);
  const entry: ReviewQueueItem = {
    token,
    createdAt: now.toISOString(),
    email: params.email,
    name: params.name,
    locale: params.locale,
    items: params.items,
  };
  queue.push(entry);
  await writeJsonFile(queuePath(), queue);
  return token;
}

export async function loadReviewQueue(): Promise<ReviewQueueItem[]> {
  await ensureDirs();
  return readJsonFile<ReviewQueueItem[]>(queuePath(), []);
}

export async function saveReviewQueue(queue: ReviewQueueItem[]): Promise<void> {
  await writeJsonFile(queuePath(), queue);
}

export async function loadReviewTokens(): Promise<ReviewTokenItem[]> {
  await ensureDirs();
  return readJsonFile<ReviewTokenItem[]>(tokenPath(), []);
}

export async function saveReviewTokens(tokens: ReviewTokenItem[]): Promise<void> {
  await writeJsonFile(tokenPath(), tokens);
}

export async function moveDueQueueToTokens(
  now: Date,
  daysAfter: number,
  tokenValidDays: number
): Promise<{ tokens: ReviewTokenItem[]; moved: ReviewTokenItem[] }> {
  await ensureDirs();
  const queue = await loadReviewQueue();
  const threshold = now.getTime() - daysAfter * 24 * 60 * 60 * 1000;
  const due: ReviewQueueItem[] = [];
  const remaining: ReviewQueueItem[] = [];

  for (const q of queue) {
    const created = new Date(q.createdAt).getTime();
    if (!Number.isFinite(created) || created === 0 || created > now.getTime()) {
      remaining.push(q);
      continue;
    }
    if (created <= threshold) {
      due.push(q);
    } else {
      remaining.push(q);
    }
  }

  const tokens = await loadReviewTokens();
  const expiresAt = new Date(now.getTime() + tokenValidDays * 24 * 60 * 60 * 1000).toISOString();
  const moved: ReviewTokenItem[] = due.map<ReviewTokenItem>((q) => ({ ...q, expiresAt }));
  const newTokens: ReviewTokenItem[] = [...tokens, ...moved];

  await saveReviewQueue(remaining);
  await saveReviewTokens(newTokens);

  return { tokens: newTokens, moved };
}

export async function findActiveToken(token: string): Promise<ReviewTokenItem | null> {
  const tokens = await loadReviewTokens();
  const now = Date.now();
  const found = tokens.find((t) => t.token === token);
  if (!found) return null;
  const exp = new Date(found.expiresAt).getTime();
  if (!Number.isFinite(exp) || exp < now) {
    return null;
  }
  return found;
}

export async function consumeToken(token: string): Promise<ReviewTokenItem | null> {
  const tokens = await loadReviewTokens();
  let consumed: ReviewTokenItem | null = null;
  const remaining = tokens.filter((t) => {
    if (!consumed && t.token === token) {
      consumed = t;
      return false;
    }
    return true;
  });
  await saveReviewTokens(remaining);
  return consumed;
}

export async function appendReviewsForSlug(slug: string, reviews: StoredReview[]): Promise<void> {
  await ensureDirs();
  const filePath = path.join(reviewsDir(), `${slug}.json`);
  const existing = await readJsonFile<StoredReview[]>(filePath, []);
  const merged = [...existing, ...reviews];
  await writeJsonFile(filePath, merged);
}

export async function loadReviewsForSlug(slug: string): Promise<StoredReview[]> {
  await ensureDirs();
  const filePath = path.join(reviewsDir(), `${slug}.json`);
  let list: StoredReview[] = [];
  try {
    const buf = await fs.readFile(filePath, "utf8");
    const s = buf.charCodeAt(0) === 0xfeff ? buf.slice(1) : buf; // BOM 対策
    const parsed = JSON.parse(s) as unknown;
    list = Array.isArray(parsed) ? (parsed as StoredReview[]) : [];
  } catch (e) {
    // 破損したレビューJSONを検知できるように、内容は出さずファイル名のみログに残す
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[reviews] failed to parse json", { slug, filePath, error: msg });
    list = [];
  }
  return list
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


