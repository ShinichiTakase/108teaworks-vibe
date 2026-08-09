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

/** メールアドレスが既に登録されていれば true（同一メールの再登録を防ぐ） */
export async function customerExistsByEmail(email: string): Promise<boolean> {
  const base = getBaseUrl();
  const key = getApiKey();
  if (!base || !key) return false;
  const url = new URL(`${base}/customers`);
  url.searchParams.set("filters", `email[equals]${escFilterValue(email.trim())}`);
  url.searchParams.set("limit", "1");
  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[microcmsCustomers] customerExistsByEmail failed",
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

/**
 * メールアドレスの配列から customers の name をまとめて取得。
 * 同一メールに複数レコードがある場合は作成日時が最も新しいものを採用。
 * 戻り値は email -> name のマップ（見つからないメールはキーを含まない）。
 */
export async function getCustomerNamesByEmails(
  emails: string[]
): Promise<Record<string, string>> {
  const base = getBaseUrl();
  const key = getApiKey();
  const uniqueEmails = Array.from(new Set(emails.map((e) => e.trim()).filter(Boolean)));
  if (!base || !key || uniqueEmails.length === 0) return {};

  const url = new URL(`${base}/customers`);
  url.searchParams.set("limit", "100");
  url.searchParams.set("orders", "-createdAt");
  // searchParams.set が値を URL エンコードするため、ここでは encodeURIComponent を重ねない
  url.searchParams.set(
    "filters",
    uniqueEmails.map((e) => `email[equals]${e}`).join("[or]")
  );
  url.searchParams.set("fields", "email,name");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        "[microcmsCustomers] getCustomerNamesByEmails failed",
        res.status,
        await res.text()
      );
      return {};
    }
    const json = (await res.json()) as { contents?: { email?: string; name?: string }[] };
    const map: Record<string, string> = {};
    for (const c of json.contents ?? []) {
      if (c.email && c.name && !(c.email in map)) {
        map[c.email] = c.name;
      }
    }
    return map;
  } catch (e) {
    console.error("[microcmsCustomers] getCustomerNamesByEmails error", e);
    return {};
  }
}

export type CustomerRecord = {
  name: string;
  tel: string;
  zipcode?: string;
  prefectures?: string;
  city?: string;
  address?: string;
};

/**
 * メールアドレスから customers の詳細（氏名・電話番号・住所）を1件取得。
 * 同一メールに複数レコードがある場合は作成日時が最も新しいものを採用。
 */
export async function getCustomerByEmail(email: string): Promise<CustomerRecord | null> {
  const base = getBaseUrl();
  const key = getApiKey();
  const trimmed = email.trim();
  if (!base || !key || !trimmed) return null;

  const url = new URL(`${base}/customers`);
  url.searchParams.set("limit", "1");
  url.searchParams.set("orders", "-createdAt");
  url.searchParams.set("filters", `email[equals]${trimmed}`);
  url.searchParams.set("fields", "name,tel,zipcode,prefectures,city,address");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[microcmsCustomers] getCustomerByEmail failed", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { contents?: CustomerRecord[] };
    return json.contents?.[0] ?? null;
  } catch (e) {
    console.error("[microcmsCustomers] getCustomerByEmail error", e);
    return null;
  }
}

export async function upsertCustomerOnce(input: CustomerInput): Promise<void> {
  if (!input.email?.trim() || !input.tel?.trim()) return;
  const exists = await customerExistsByEmail(input.email.trim());
  if (exists) return;
  await createCustomer({
    ...input,
    email: input.email.trim(),
    tel: input.tel.trim(),
  });
}

