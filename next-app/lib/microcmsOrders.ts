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

function escFilterValue(v: string): string {
  return encodeURIComponent(v);
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
