type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const bucketStore =
  (globalThis as { __rateLimitBuckets?: Map<string, Bucket> }).__rateLimitBuckets ??
  new Map<string, Bucket>();
(globalThis as { __rateLimitBuckets?: Map<string, Bucket> }).__rateLimitBuckets = bucketStore;

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): boolean {
  const now = Date.now();
  const existing = bucketStore.get(key);

  if (!existing || existing.resetAt <= now) {
    bucketStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  bucketStore.set(key, existing);
  return true;
}

export function getClientIp(forwardedFor: string | null): string {
  if (!forwardedFor) return "unknown";
  return forwardedFor.split(",")[0]?.trim() || "unknown";
}
