import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { Locale } from "@/lib/i18n";

const DATA_DIR = path.join(process.cwd(), "data");
const QUEUE_PATH = path.join(DATA_DIR, "review-queue.json");
const TOKEN_PATH = path.join(DATA_DIR, "review-tokens.json");
const REVIEWS_DIR = path.join(DATA_DIR, "reviews");

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
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(REVIEWS_DIR, { recursive: true });
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const buf = await fs.readFile(filePath, "utf8");
    return JSON.parse(buf) as T;
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
  const queue = await readJsonFile<ReviewQueueItem[]>(QUEUE_PATH, []);
  const entry: ReviewQueueItem = {
    token,
    createdAt: now.toISOString(),
    email: params.email,
    name: params.name,
    locale: params.locale,
    items: params.items,
  };
  queue.push(entry);
  await writeJsonFile(QUEUE_PATH, queue);
  return token;
}

export async function loadReviewQueue(): Promise<ReviewQueueItem[]> {
  await ensureDirs();
  return readJsonFile<ReviewQueueItem[]>(QUEUE_PATH, []);
}

export async function saveReviewQueue(queue: ReviewQueueItem[]): Promise<void> {
  await writeJsonFile(QUEUE_PATH, queue);
}

export async function loadReviewTokens(): Promise<ReviewTokenItem[]> {
  await ensureDirs();
  return readJsonFile<ReviewTokenItem[]>(TOKEN_PATH, []);
}

export async function saveReviewTokens(tokens: ReviewTokenItem[]): Promise<void> {
  await writeJsonFile(TOKEN_PATH, tokens);
}

export async function moveDueQueueToTokens(now: Date, daysAfter: number, tokenValidDays: number): Promise<ReviewTokenItem[]> {
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
  const newTokens: ReviewTokenItem[] = [
    ...tokens,
    ...due.map<ReviewTokenItem>((q) => ({ ...q, expiresAt })),
  ];

  await saveReviewQueue(remaining);
  await saveReviewTokens(newTokens);

  return newTokens;
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
  const filePath = path.join(REVIEWS_DIR, `${slug}.json`);
  const existing = await readJsonFile<StoredReview[]>(filePath, []);
  const merged = [...existing, ...reviews];
  await writeJsonFile(filePath, merged);
}

export async function loadReviewsForSlug(slug: string): Promise<StoredReview[]> {
  await ensureDirs();
  const filePath = path.join(REVIEWS_DIR, `${slug}.json`);
  const list = await readJsonFile<StoredReview[]>(filePath, []);
  return list
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


