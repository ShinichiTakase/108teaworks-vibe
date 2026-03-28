#!/usr/bin/env node
/**
 * lib/data/shipping-by-prefecture.json の件数・重複・ルックアップを検証する。
 * 実行: node scripts/verify-shipping-json.mjs（next-app 直下）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib", "data", "shipping-by-prefecture.json");

function normalizePrefectureName(s) {
  const t = s.trim();
  if (t.endsWith("県") || t.endsWith("府") || t.endsWith("都")) return t.slice(0, -1);
  if (t.endsWith("道") && t !== "北海道") return t.slice(0, -1);
  return t;
}

function lookup(prefecture, list) {
  const input = prefecture.trim();
  const inputNorm = normalizePrefectureName(input);
  for (const row of list) {
    const p = String(row.prefectures ?? "").trim();
    if (!p) continue;
    const fee = row.fee;
    if (typeof fee !== "number" || Number.isNaN(fee)) continue;
    if (p === input) return { fee, matchedPrefecture: p };
    if (normalizePrefectureName(p) === inputNorm) return { fee, matchedPrefecture: p };
  }
  return null;
}

function main() {
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  const data = JSON.parse(raw);
  const list = Array.isArray(data.contents) ? data.contents : [];
  const errors = [];

  if (list.length !== 47) {
    errors.push(`expected 47 prefecture rows, got ${list.length}`);
  }

  const seen = new Set();
  for (const row of list) {
    const p = String(row.prefectures ?? "").trim();
    if (!p) errors.push("empty prefectures");
    if (seen.has(p)) errors.push(`duplicate prefecture: ${p}`);
    seen.add(p);
    if (typeof row.fee !== "number" || row.fee < 0) {
      errors.push(`invalid fee for ${p}: ${row.fee}`);
    }
  }

  const cases = [
    ["東京都", "東京"],
    ["北海道", "北海道"],
    ["沖縄県", "沖縄"],
    ["京都府", "京都府"],
    ["大阪府", "大阪"],
  ];
  for (const [full, shortName] of cases) {
    const a = lookup(full, list);
    const b = lookup(shortName, list);
    if (!a) errors.push(`lookup failed: ${full}`);
    if (!b) errors.push(`lookup failed: ${shortName}`);
    if (a && b && a.fee !== b.fee) {
      errors.push(`fee mismatch ${full} (${a.fee}) vs ${shortName} (${b.fee})`);
    }
  }

  if (errors.length) {
    console.error("verify-shipping-json FAILED:");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }

  console.log("verify-shipping-json OK: 47 rows, lookups (東京/北海道/沖縄/京都/大阪) consistent");
}

main();
