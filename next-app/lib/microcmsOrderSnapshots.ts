/**
 * 注文確定時に送ったメール本文を microCMS に保存し、
 * 注文番号＋注文者メールで照合して発送完了メールなどで再利用する。
 *
 * microCMS に API「order_snapshots」を作成し、以下のフィールドを用意してください。
 * - orderNo: テキスト（注文番号 R-xxxxx）
 * - email: テキスト（注文者メールアドレス）
 * - body: テキスト（長文・注文確認メールの HTML 本文）
 * 作成手順は docs/ORDER-SNAPSHOTS-SETUP.md を参照。
 */

const getBaseUrl = () => {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}.microcms.io/api/v1`;
};

const getWriteKey = () =>
  (process.env.MICROCMS_WRITE_API_KEY || process.env.MICROCMS_API_KEY)?.trim();
const getReadKey = () => process.env.MICROCMS_API_KEY?.trim();

const API_ID = "order_snapshots";

function escFilterValue(v: string): string {
  return encodeURIComponent(v);
}

/** 注文確定メール本文を保存する。失敗時はログのみで例外は投げない。 */
export async function saveOrderSnapshot(
  orderNo: string,
  email: string,
  body: string
): Promise<void> {
  const base = getBaseUrl();
  const key = getWriteKey();
  if (!base || !key) {
    console.warn("[microcmsOrderSnapshots] MICROCMS_SERVICE_DOMAIN or API key not set");
    return;
  }
  const url = `${base}/${API_ID}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNo: orderNo.trim(),
        email: email.trim().toLowerCase(),
        body,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[microcmsOrderSnapshots] save failed", res.status, text.slice(0, 300));
    }
  } catch (e) {
    console.error("[microcmsOrderSnapshots] save error", e);
  }
}

/** 注文番号とメールで保存済みメール本文を1件取得する。 */
export async function getOrderSnapshotByOrderNoAndEmail(
  orderNo: string,
  email: string
): Promise<{ body: string } | null> {
  const base = getBaseUrl();
  const key = getReadKey();
  if (!base || !key) return null;
  const orderNoTrim = orderNo.trim();
  const emailTrim = email.trim().toLowerCase();
  if (!orderNoTrim || !emailTrim) return null;

  const url = new URL(`${base}/${API_ID}`);
  url.searchParams.set(
    "filters",
    `orderNo[equals]${escFilterValue(orderNoTrim)}[and]email[equals]${escFilterValue(emailTrim)}`
  );
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-MICROCMS-API-KEY": key },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { contents?: { body?: string }[] };
    const first = Array.isArray(json.contents) ? json.contents[0] : undefined;
    const body = first?.body;
    return typeof body === "string" ? { body } : null;
  } catch {
    return null;
  }
}
