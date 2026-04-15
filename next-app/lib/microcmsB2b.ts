type MicrocmsListResponse<T> = { contents: T[]; totalCount: number };

const getBaseUrl = () => {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}.microcms.io/api/v1`;
};

const getReadKey = () => process.env.MICROCMS_API_KEY?.trim();
const getWriteKey = () =>
  (process.env.MICROCMS_WRITE_API_KEY || process.env.MICROCMS_API_KEY)?.trim();

const getLinesFieldId = () => process.env.MICROCMS_B2B_LINES_FIELD_ID?.trim() || "lines";

export type MicrocmsWriteResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export type B2bLine = {
  fieldId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
};

export type B2bItem = {
  id: string;
  title?: string;
  customerName?: string;
  customerEmail?: string;
  note?: string;
  itemsTotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  grandTotal?: number;
  taxMode?: "inclusive" | "exclusive" | string;
  taxRate?: number;
  tokenHash?: string;
  expiresAt?: string;
  openedAt?: string;
  sentAt?: string;
  paidAt?: string;
  status?: string;
  stripePaymentIntentId?: string;
  lines?: B2bLine[];
  publishedAt?: string;
  revisedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeItem(raw: Record<string, unknown>): B2bItem {
  const id = typeof raw.id === "string" ? raw.id : "";
  const n = (k: string) => raw[k] ?? raw[k.toLowerCase()];
  const num = (k: string) => {
    const v = n(k);
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const t = Number(v);
      return Number.isFinite(t) ? t : undefined;
    }
    return undefined;
  };
  const str = (k: string) => (typeof n(k) === "string" ? (n(k) as string) : undefined);
  const dt = (k: string) => str(k);
  const linesRaw = n(getLinesFieldId()) ?? n("lines");
  const lines = Array.isArray(linesRaw)
    ? (linesRaw as unknown[]).map((x) => {
        const o = x && typeof x === "object" ? (x as Record<string, unknown>) : {};
        return {
          fieldId: typeof o.fieldId === "string" ? o.fieldId : undefined,
          productName: typeof o.productName === "string" ? o.productName : undefined,
          quantity: typeof o.quantity === "number" ? o.quantity : typeof o.quantity === "string" ? Number(o.quantity) : undefined,
          unitPrice: typeof o.unitPrice === "number" ? o.unitPrice : typeof o.unitPrice === "string" ? Number(o.unitPrice) : undefined,
          lineTotal: typeof o.lineTotal === "number" ? o.lineTotal : typeof o.lineTotal === "string" ? Number(o.lineTotal) : undefined,
        } satisfies B2bLine;
      })
    : undefined;

  return {
    id,
    title: str("title"),
    customerName: str("customerName"),
    customerEmail: str("customerEmail"),
    note: str("note"),
    itemsTotal: num("itemsTotal"),
    shippingFee: num("shippingFee"),
    taxAmount: num("taxAmount"),
    grandTotal: num("grandTotal"),
    taxMode: (str("taxMode") as any) ?? undefined,
    taxRate: num("taxRate"),
    tokenHash: str("tokenHash"),
    expiresAt: dt("expiresAt"),
    openedAt: dt("openedAt"),
    sentAt: dt("sentAt"),
    paidAt: dt("paidAt"),
    status: str("status"),
    stripePaymentIntentId: str("stripePaymentIntentId"),
    lines,
    publishedAt: str("publishedAt"),
    revisedAt: str("revisedAt"),
    createdAt: str("createdAt"),
    updatedAt: str("updatedAt"),
  };
}

async function fetchList(url: URL, key: string): Promise<MicrocmsListResponse<B2bItem>> {
  const res = await fetch(url.toString(), {
    headers: { "X-MICROCMS-API-KEY": key },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[microcmsB2b] list failed", res.status, text.slice(0, 500));
    return { contents: [], totalCount: 0 };
  }
  const json = (await res.json()) as { contents?: Record<string, unknown>[]; totalCount?: number };
  const raw = Array.isArray(json.contents) ? json.contents : [];
  return {
    contents: raw.map((c) => normalizeItem(c)),
    totalCount: typeof json.totalCount === "number" ? json.totalCount : raw.length,
  };
}

/**
 * 一覧（検索あり）
 * - search がある場合、title/customerName/customerEmail/note の contains を OR 相当で合算する
 */
export async function listB2b(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<MicrocmsListResponse<B2bItem>> {
  const base = getBaseUrl();
  const key = getReadKey();
  if (!base || !key) return { contents: [], totalCount: 0 };

  const limit = Math.min(100, Math.max(1, Math.floor(params?.limit ?? 50)));
  const offset = Math.max(0, Math.floor(params?.offset ?? 0));
  const search = (params?.search ?? "").trim();

  const buildUrl = (filters?: string) => {
    const url = new URL(`${base}/b2b`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("orders", "-sentAt,-createdAt");
    if (filters) url.searchParams.set("filters", filters);
    return url;
  };

  if (!search) {
    return fetchList(buildUrl(), key);
  }

  const esc = (v: string) => encodeURIComponent(v);
  const filtersList = [
    `title[contains]${esc(search)}`,
    `customerName[contains]${esc(search)}`,
    `customerEmail[contains]${esc(search)}`,
    `note[contains]${esc(search)}`,
  ];

  const results = await Promise.all(filtersList.map((f) => fetchList(buildUrl(f), key)));
  const map = new Map<string, B2bItem>();
  for (const r of results) {
    for (const it of r.contents) {
      if (it?.id) map.set(it.id, it);
    }
  }
  const merged = Array.from(map.values());
  // microCMSの orders では OR合算が崩れるので、念のため sentAt/createdAt っぽい順に並べ直し
  merged.sort((a, b) => {
    const ad = a.sentAt ?? a.createdAt ?? "";
    const bd = b.sentAt ?? b.createdAt ?? "";
    return bd.localeCompare(ad);
  });
  return { contents: merged, totalCount: merged.length };
}

export async function getB2bById(id: string): Promise<B2bItem | null> {
  const base = getBaseUrl();
  const key = getReadKey();
  if (!base || !key) return null;
  const safe = id.trim();
  if (!safe) return null;
  const res = await fetch(`${base}/b2b/${encodeURIComponent(safe)}`, {
    headers: { "X-MICROCMS-API-KEY": key },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Record<string, unknown>;
  const item = normalizeItem(json);
  return item.id ? item : null;
}

export async function getB2bByTokenHash(tokenHash: string): Promise<B2bItem | null> {
  const base = getBaseUrl();
  const key = getReadKey();
  if (!base || !key) return null;
  const hash = tokenHash.trim();
  if (!hash) return null;

  const url = new URL(`${base}/b2b`);
  url.searchParams.set("filters", `tokenHash[equals]${encodeURIComponent(hash)}`);
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { "X-MICROCMS-API-KEY": key },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { contents?: Record<string, unknown>[] };
  const list = Array.isArray(json.contents) ? json.contents : [];
  if (list.length === 0) return null;
  const item = normalizeItem(list[0]);
  return item.id ? item : null;
}

export async function patchB2bById(id: string, patch: Record<string, unknown>): Promise<boolean> {
  const base = getBaseUrl();
  const key = getWriteKey();
  if (!base || !key) return false;
  const safe = id.trim();
  if (!safe) return false;
  const res = await fetch(`${base}/b2b/${encodeURIComponent(safe)}`, {
    method: "PATCH",
    headers: {
      "X-MICROCMS-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[microcmsB2b] patch failed", res.status, text.slice(0, 500));
    return false;
  }
  return true;
}

export async function patchB2bByIdDetailed(
  id: string,
  patch: Record<string, unknown>
): Promise<MicrocmsWriteResult> {
  const base = getBaseUrl();
  const key = getWriteKey();
  if (!base || !key) return { ok: false, status: 0, message: "not_configured" };
  const safe = id.trim();
  if (!safe) return { ok: false, status: 0, message: "invalid_id" };
  const res = await fetch(`${base}/b2b/${encodeURIComponent(safe)}`, {
    method: "PATCH",
    headers: {
      "X-MICROCMS-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[microcmsB2b] patch failed", res.status, text.slice(0, 500));
    return { ok: false, status: res.status, message: text };
  }
  return { ok: true };
}

export async function createB2b(input: Record<string, unknown>): Promise<{ ok: true; id: string } | { ok: false }> {
  const base = getBaseUrl();
  const key = getWriteKey();
  if (!base || !key) return { ok: false };

  const res = await fetch(`${base}/b2b`, {
    method: "POST",
    headers: {
      "X-MICROCMS-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[microcmsB2b] create failed", res.status, text.slice(0, 500));
    return { ok: false };
  }
  const json = (await res.json().catch(() => null)) as { id?: unknown } | null;
  const id = json && typeof json.id === "string" ? json.id : "";
  return id ? { ok: true, id } : { ok: false };
}

