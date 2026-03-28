/**
 * 都道府県別送料（microCMS の shipping は廃止。マスタは lib/data/shipping-by-prefecture.json を編集）
 */
import shippingData from "@/lib/data/shipping-by-prefecture.json";

type ShippingRow = { prefectures?: string; fee?: number; PREFECTURES?: string; FEE?: number };

/** 都道府県名を正規化（末尾の 都・道・府・県 を除いた部分。マッチング用） */
function normalizePrefectureName(s: string): string {
  const t = s.trim();
  if (t.endsWith("県") || t.endsWith("府") || t.endsWith("都")) return t.slice(0, -1);
  if (t.endsWith("道") && t !== "北海道") return t.slice(0, -1);
  return t;
}

export type ShippingByPrefectureResult = { fee: number; matchedPrefecture: string } | null;

function getRows(): ShippingRow[] {
  const data = shippingData as { contents?: ShippingRow[] };
  return Array.isArray(data.contents) ? data.contents : [];
}

/**
 * 都道府県をキーに送料を取得（lib/data/shipping-by-prefecture.json）。
 * options は API 互換のため受け取るが、静的 JSON のため noCache は無視する。
 */
export async function getShippingByPrefecture(
  prefecture: string,
  _options?: { noCache?: boolean },
): Promise<ShippingByPrefectureResult> {
  if (!prefecture.trim()) return null;
  const list = getRows();
  const input = prefecture.trim();
  const inputNorm = normalizePrefectureName(input);
  for (const row of list) {
    const p = (row.prefectures ?? row.PREFECTURES ?? "").trim();
    if (!p) continue;
    const amount = row.fee ?? row.FEE;
    if (typeof amount !== "number" || Number.isNaN(amount)) continue;
    if (p === input) return { fee: amount, matchedPrefecture: p };
    if (normalizePrefectureName(p) === inputNorm) return { fee: amount, matchedPrefecture: p };
  }
  return null;
}
