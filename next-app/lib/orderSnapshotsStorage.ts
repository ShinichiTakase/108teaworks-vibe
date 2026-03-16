/**
 * 注文確定メール本文をファイルで保存し、注文番号＋メールで照合する。
 * microCMS を使わず、サーバーの書き込み可能なディレクトリに JSON で保存する。
 *
 * 環境変数 ORDER_SNAPSHOTS_DIR に保存先ディレクトリのパスを指定する。
 * 例: ORDER_SNAPSHOTS_DIR=./data/order_snapshots
 * 未設定または書き込み不可の場合は保存・取得ともスキップ（発送完了メールは注文明細なしで送信可能）。
 *
 * ※ Vercel など書き込み不可の環境では保存されません。Docker / 自前サーバーなど
 *    永続ディスクがある環境で利用してください。
 */

import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DEFAULT_DIR = ".data/order_snapshots";

function getDir(): string | null {
  const env = process.env.ORDER_SNAPSHOTS_DIR?.trim();
  if (env) return path.resolve(process.cwd(), env);
  return path.resolve(process.cwd(), DEFAULT_DIR);
}

function sanitizeOrderNo(orderNo: string): string {
  return orderNo.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function emailHash(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 16);
}

function filename(orderNo: string, email: string): string {
  return `${sanitizeOrderNo(orderNo)}_${emailHash(email)}.json`;
}

/** 注文確定メール本文を保存する。失敗時はログのみで例外は投げない。 */
export async function saveOrderSnapshot(
  orderNo: string,
  email: string,
  body: string
): Promise<void> {
  const dir = getDir();
  if (!dir) return;

  const orderNoTrim = orderNo.trim();
  const emailTrim = email.trim().toLowerCase();
  if (!orderNoTrim || !emailTrim) return;

  const filePath = path.join(dir, filename(orderNoTrim, emailTrim));
  const payload = JSON.stringify({ orderNo: orderNoTrim, email: emailTrim, body });

  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, payload, "utf8");
  } catch (e) {
    console.warn("[orderSnapshotsStorage] save failed (dir may be read-only):", (e as Error).message);
  }
}

/** 注文番号とメールで保存済みメール本文を1件取得する。 */
export async function getOrderSnapshotByOrderNoAndEmail(
  orderNo: string,
  email: string
): Promise<{ body: string } | null> {
  const dir = getDir();
  if (!dir) return null;

  const orderNoTrim = orderNo.trim();
  const emailTrim = email.trim().toLowerCase();
  if (!orderNoTrim || !emailTrim) return null;

  const filePath = path.join(dir, filename(orderNoTrim, emailTrim));

  try {
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw) as { orderNo?: string; email?: string; body?: string };
    if (data.email !== emailTrim || data.orderNo !== orderNoTrim) return null;
    const body = data.body;
    return typeof body === "string" ? { body } : null;
  } catch {
    return null;
  }
}
