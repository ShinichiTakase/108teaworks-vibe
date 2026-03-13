const getBaseUrl = () => {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}.microcms.io/api/v1`;
};

// customers への書き込み専用キーを優先し、なければ通常キーを使う
const getApiKey = () =>
  (process.env.MICROCMS_WRITE_API_KEY || process.env.MICROCMS_API_KEY)?.trim();

export type CustomerInput = {
  email: string;
  name: string;
  tel: string;
  zipcode?: string;
  prefectures?: string;
  city?: string;
  address?: string;
  approval: 0 | 1;
  // password は将来用（今回は保存しない）
};

function escFilterValue(v: string): string {
  return encodeURIComponent(v);
}

export async function customerExistsByEmailTel(email: string, tel: string): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return false;
  const url = new URL(`${base}/customers`);
  // microCMS filters: field[equals]value[and]field[equals]value
  url.searchParams.set(
    "filters",
    `email[equals]${escFilterValue(email)}[and]tel[equals]${escFilterValue(tel)}`
  );
  url.searchParams.set("limit", "1");
  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[microcmsCustomers] customerExistsByEmailTel failed",
        res.status,
        text.slice(0, 500)
      );
      return false;
    }
    const json = (await res.json()) as { contents?: unknown[] };
    return Array.isArray(json.contents) && json.contents.length > 0;
  } catch {
    return false;
  }
}

export async function createCustomer(input: CustomerInput): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return false;
  const url = new URL(`${base}/customers`);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        name: input.name,
        tel: input.tel,
        zipcode: input.zipcode ?? "",
        prefectures: input.prefectures ?? "",
        city: input.city ?? "",
        address: input.address ?? "",
        approval: input.approval,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[microcmsCustomers] createCustomer failed",
        res.status,
        text.slice(0, 500)
      );
      return false;
    }
    return true;
  } catch (e) {
    console.error("[microcmsCustomers] createCustomer error", e);
    return false;
  }
}

export async function upsertCustomerOnce(input: CustomerInput): Promise<void> {
  if (!input.email?.trim() || !input.tel?.trim()) return;
  const exists = await customerExistsByEmailTel(input.email.trim(), input.tel.trim());
  if (exists) return;
  await createCustomer({
    ...input,
    email: input.email.trim(),
    tel: input.tel.trim(),
  });
}

