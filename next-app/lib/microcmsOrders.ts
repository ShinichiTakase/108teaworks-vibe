const getBaseUrl = () => {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}.microcms.io/api/v1`;
};

const getApiKey = () =>
  (process.env.MICROCMS_WRITE_API_KEY || process.env.MICROCMS_API_KEY)?.trim();

export type OrderLineForMicrocms = {
  fieldId: "order_line";
  product: string;
  count: number;
  price: number;
};

export type PostOrderInput = {
  orderNo: string;
  email: string;
  orderDateTime: string;
  shipping: number;
  discount: number;
  orderTotal: number;
  orderLines: OrderLineForMicrocms[];
};

export type OrderItem = {
  id: string;
  orderDateTime: string;
  orderNo: string;
  email: string;
  shipping: number;
  discount: number;
  orderTotal: number;
  orderLines: OrderLineForMicrocms[];
  sentDateTime?: string;
  deletedDateTime?: string;
  shippingNumber?: string;
};

export type OrderListResponse = {
  contents: OrderItem[];
  totalCount: number;
};

function escFilterValue(v: string): string {
  return encodeURIComponent(v);
}

const MICROCMS_MAX_LIMIT = 100;

/** 注文一覧を取得（orderDateTime が新しい順、ページネーション対応） */
export async function listOrders(
  limit: number,
  offset: number = 0
): Promise<OrderListResponse> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) {
    return { contents: [], totalCount: 0 };
  }
  const safeLimit = Math.min(MICROCMS_MAX_LIMIT, Math.max(1, Math.floor(limit)));
  const safeOffset = Math.max(0, Math.floor(offset));

  const url = new URL(`${base}/orders`);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("offset", String(safeOffset));
  url.searchParams.set("orders", "-orderDateTime");
  // 削除フラグが立っているレコードは一覧から除外
  url.searchParams.set("filters", "deletedDateTime[not_exists]");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[microcmsOrders] listOrders failed", res.status, await res.text());
      return { contents: [], totalCount: 0 };
    }
    const json = (await res.json()) as { contents?: OrderItem[]; totalCount?: number };
    return {
      contents: Array.isArray(json.contents) ? json.contents : [],
      totalCount: typeof json.totalCount === "number" ? json.totalCount : 0,
    };
  } catch (e) {
    console.error("[microcmsOrders] listOrders error", e);
    return { contents: [], totalCount: 0 };
  }
}

/** 注文を1件取得（明細ページ用） */
export async function getOrderById(id: string): Promise<OrderItem | null> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key || !id.trim()) return null;

  try {
    const res = await fetch(`${base}/orders/${encodeURIComponent(id.trim())}`, {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error("[microcmsOrders] getOrderById failed", res.status, await res.text());
      }
      return null;
    }
    return (await res.json()) as OrderItem;
  } catch (e) {
    console.error("[microcmsOrders] getOrderById error", e);
    return null;
  }
}

/** 発送完了メール送信済みとして記録（sentDateTime、任意で shippingNumber を書き込む） */
export async function markOrderShipped(id: string, shippingNumber?: string): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key || !id.trim()) return false;

  const payload: Record<string, unknown> = { sentDateTime: new Date().toISOString() };
  const trimmedShippingNumber = shippingNumber?.trim();
  if (trimmedShippingNumber) {
    payload.shippingNumber = trimmedShippingNumber;
  }

  try {
    const res = await fetch(`${base}/orders/${encodeURIComponent(id.trim())}`, {
      method: "PATCH",
      headers: {
        "X-MICROCMS-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[microcmsOrders] markOrderShipped failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[microcmsOrders] markOrderShipped error", e);
    return false;
  }
}

/** 注文を論理削除（deletedDateTime に削除日時を書き込む） */
export async function softDeleteOrder(id: string): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key || !id.trim()) return false;

  try {
    const res = await fetch(`${base}/orders/${encodeURIComponent(id.trim())}`, {
      method: "PATCH",
      headers: {
        "X-MICROCMS-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deletedDateTime: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[microcmsOrders] softDeleteOrder failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[microcmsOrders] softDeleteOrder error", e);
    return false;
  }
}

export async function orderExistsByOrderNo(orderNo: string): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return false;
  const url = new URL(`${base}/orders`);
  url.searchParams.set("filters", `orderNo[equals]${escFilterValue(orderNo.trim())}`);
  url.searchParams.set("limit", "1");
  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[microcmsOrders] orderExistsByOrderNo failed",
        res.status,
        text.slice(0, 500)
      );
      return false;
    }
    const json = (await res.json()) as { contents?: unknown[] };
    return Array.isArray(json.contents) && json.contents.length > 0;
  } catch (e) {
    console.error("[microcmsOrders] orderExistsByOrderNo error", e);
    return false;
  }
}

/**
 * microCMS orders API へ POST。環境未設定時は何もせず false。
 * 移行スクリプトと同じペイロード形（repeat の fieldId: order_line）。
 */
export async function postOrder(input: PostOrderInput): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return false;

  const orderNo = input.orderNo.trim();
  const email = input.email.trim();
  if (!orderNo || !email || input.orderLines.length === 0) return false;

  const payload: Record<string, unknown> = {
    orderDateTime: input.orderDateTime,
    orderNo,
    email,
    shipping: Math.round(input.shipping),
    discount: Math.round(input.discount),
    orderTotal: Math.round(input.orderTotal),
    orderLines: input.orderLines,
  };

  const includeTitle =
    process.env.MICROCMS_ORDERS_INCLUDE_TITLE === "1" ||
    process.env.MICROCMS_ORDERS_INCLUDE_TITLE === "true";
  if (includeTitle) {
    payload.title = orderNo;
  }

  try {
    const res = await fetch(`${base}/orders`, {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[microcmsOrders] postOrder failed", res.status, text.slice(0, 500));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[microcmsOrders] postOrder error", e);
    return false;
  }
}
