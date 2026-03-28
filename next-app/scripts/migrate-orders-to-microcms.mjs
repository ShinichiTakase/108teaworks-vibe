#!/usr/bin/env node
/**
 * next-app/data/orders（または .data/order_snapshots）の JSON を microCMS orders API に POST する。
 *
 * 想定するローカル JSON:
 * - 従来スナップショット: { orderNo, email, body }（body は注文確認メール HTML）
 * - または既に構造化: { orderNo, email, orderDateTime?, shipping?, discount?, orderTotal?, orderLines: [{product,count,price}] }
 *
 * 環境変数（.env.local 可）:
 * - MICROCMS_SERVICE_DOMAIN
 * - MICROCMS_API_KEY（orders への POST 権限あり）
 *
 * オプション:
 * - MIGRATE_ORDERS_DIR … 読み込みディレクトリ（未設定時は data/orders → .data/order_snapshots の順で存在する方）
 * - MIGRATE_DRY_RUN=1 … POST せずペイロードのみ表示
 * - MIGRATE_OMIT_TITLE=1 … ペイロードに title を付けない（スキーマに title が無い場合）
 *
 * 実行:
 *   node scripts/migrate-orders-to-microcms.mjs
 * Ubuntu: ./scripts/migrate-orders-to-microcms.sh（.env.local を source してから node 実行）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** ログは stderr のみ（SSH / リダイレクトで stdout が見えない場合があるため） */
function say(...args) {
  console.error(...args);
}

function loadEnvLocal() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return {};
  const text = fs.readFileSync(p, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.replace(/\r/g, "").trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = { ...process.env, ...loadEnvLocal() };

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cellText(html) {
  return decodeEntities(stripTags(html)).trim();
}

function parseYen(s) {
  const str = String(s);
  const neg = /-\s*[¥￥]|−/.test(str);
  const digits = str.replace(/[^\d]/g, "");
  const n = parseInt(digits, 10) || 0;
  return neg ? -Math.abs(n) : n;
}

/** orderNo R-YYYYMMDDHHmmss → ISO（JST として解釈） */
function orderNoToDateTimeISO(orderNo) {
  const m = String(orderNo).match(/^R-(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}+09:00`;
}

/**
 * buildOrderHtml が生成した table から明細・送料・値引・合計を抽出
 */
function parseOrderHtmlBody(body) {
  const tbodyMatch = String(body).match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) {
    return { lines: [], shipping: 0, discount: 0, orderTotal: 0, parseError: "no tbody" };
  }
  const tbody = tbodyMatch[1];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const lines = [];
  let shipping = 0;
  let discount = 0;
  let orderTotal = 0;
  let trMatch;
  while ((trMatch = trRegex.exec(tbody)) !== null) {
    const trInner = trMatch[1];
    const cells = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(trInner)) !== null) {
      cells.push(cellText(tdMatch[1]));
    }
    if (cells.length < 4) continue;

    const c0 = cells[0];
    const c1 = cells[1].replace(/\s/g, "");
    const c2 = cells[2];
    const c3 = cells[3];

    const qtyNum = /^\d+$/.test(c1) ? parseInt(c1, 10) : NaN;

    if (c0 && Number.isFinite(qtyNum) && qtyNum >= 0) {
      lines.push({
        product: c0,
        count: qtyNum,
        price: Math.abs(parseYen(c3)),
      });
      continue;
    }

    if (/送料|Shipping|运费|배송|配送/.test(c2)) {
      shipping = Math.abs(parseYen(c3));
      continue;
    }
    if (/割引|Discount|折扣|할인|値引/.test(c2)) {
      discount = Math.abs(parseYen(c3));
      continue;
    }
    if (/合計|Total|总计|합계|ご注文合計/.test(c2)) {
      orderTotal = Math.abs(parseYen(c3));
      continue;
    }
    if (/消費税|内税|Tax|税額|부가세|税费/.test(c2)) {
      continue;
    }
  }

  return { lines, shipping, discount, orderTotal, parseError: null };
}

function resolveSourceDir() {
  const fromEnv = env.MIGRATE_ORDERS_DIR?.trim();
  if (fromEnv) {
    const abs = path.isAbsolute(fromEnv) ? fromEnv : path.resolve(ROOT, fromEnv);
    return abs;
  }
  const candidates = [
    path.join(ROOT, "data", "orders"),
    path.join(ROOT, ".data", "order_snapshots"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
      const files = fs.readdirSync(c).filter((f) => f.endsWith(".json"));
      if (files.length > 0) return c;
    }
  }
  return path.join(ROOT, "data", "orders");
}

function buildPayload(record) {
  const orderNo = String(record.orderNo ?? "").trim();
  const email = String(record.email ?? "").trim();
  if (!orderNo || !email) return { error: "missing orderNo or email" };

  let orderDateTime =
    typeof record.orderDateTime === "string" && record.orderDateTime.trim()
      ? record.orderDateTime.trim()
      : null;
  if (!orderDateTime) {
    orderDateTime = orderNoToDateTimeISO(orderNo) ?? new Date().toISOString();
  }

  let shipping = Number(record.shipping);
  let discount = Number(record.discount);
  let orderTotal = Number(record.orderTotal);
  let orderLines = [];

  if (Array.isArray(record.orderLines) && record.orderLines.length > 0) {
    orderLines = record.orderLines.map((row) => ({
      fieldId: "order_line",
      product: String(row.product ?? "").trim(),
      count: Math.max(0, Math.round(Number(row.count) || 0)),
      price: Math.max(0, Math.round(Number(row.price) || 0)),
    }));
    if (!Number.isFinite(shipping)) shipping = 0;
    if (!Number.isFinite(discount)) discount = 0;
    if (!Number.isFinite(orderTotal)) orderTotal = 0;
  } else if (typeof record.body === "string" && record.body.trim()) {
    const parsed = parseOrderHtmlBody(record.body);
    if (parsed.parseError) return { error: parsed.parseError };
    orderLines = parsed.lines.map((row) => ({
      fieldId: "order_line",
      product: row.product,
      count: row.count,
      price: row.price,
    }));
    shipping = parsed.shipping;
    discount = parsed.discount;
    orderTotal = parsed.orderTotal;
  } else {
    return { error: "no body or orderLines" };
  }

  if (orderLines.length === 0) {
    return { error: "no line items parsed" };
  }

  const payload = {
    orderDateTime,
    orderNo,
    email,
    shipping: Math.round(shipping),
    discount: Math.round(discount),
    orderTotal: Math.round(orderTotal),
    orderLines,
  };

  // microCMS のリスト型は「タイトル」フィールドが必須のことが多い（スキーマに無ければ MIGRATE_OMIT_TITLE=1）
  if (env.MIGRATE_OMIT_TITLE !== "1" && env.MIGRATE_OMIT_TITLE !== "true") {
    Object.assign(payload, { title: orderNo });
  }

  return { payload };
}

async function orderExists(apiBase, apiKey, orderNo) {
  const url = new URL(`${apiBase}/orders`);
  url.searchParams.set("filters", `orderNo[equals]${encodeURIComponent(orderNo)}`);
  url.searchParams.set("limit", "1");
  const res = await fetch(url.toString(), {
    headers: { "X-MICROCMS-API-KEY": apiKey },
  });
  if (!res.ok) return false;
  const json = await res.json();
  return Array.isArray(json.contents) && json.contents.length > 0;
}

async function main() {
  const domain = env.MICROCMS_SERVICE_DOMAIN?.trim();
  const apiKey = env.MICROCMS_API_KEY?.trim();
  const dry = env.MIGRATE_DRY_RUN === "1" || env.MIGRATE_DRY_RUN === "true";

  say("[migrate-orders] 開始");
  if (dry) {
    say("[migrate-orders] DRY RUN: microCMS には書き込みません（登録するには --dry-run を付けずに実行）");
  }

  if (!dry && (!domain || !apiKey)) {
    say("本番移行時は MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が必要です。");
    process.exit(1);
  }

  const apiBase = domain ? `https://${domain}.microcms.io/api/v1` : "";
  const sourceDir = resolveSourceDir();

  if (!fs.existsSync(sourceDir)) {
    say("[migrate-orders] ソースディレクトリがありません:", sourceDir);
    say(
      "[migrate-orders] mkdir するか、MIGRATE_ORDERS_DIR または --source で既存パスを指定してください。",
    );
    process.exit(1);
  }

  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    say("[migrate-orders] 移行対象の *.json が 0 件です（このため microCMS は空のままです）。");
    say("[migrate-orders] 参照ディレクトリ:", sourceDir);
    say("[migrate-orders] 次を確認してください:");
    say("  ・注文スナップショットの実パス（例: ORDER_SNAPSHOTS_DIR で保存している場所）");
    say("  ・ファイル名が .json で終わること");
    say("  ・別ディレクトリなら:");
    say("    MIGRATE_ORDERS_DIR=/path/to/json ./scripts/migrate-orders-to-microcms.sh --dry-run");
    say("    または ./scripts/migrate-orders-to-microcms.sh --dry-run --source /path/to/json");
    process.exit(0);
  }

  say("[migrate-orders] ソース:", sourceDir);
  say("[migrate-orders] 件数:", String(files.length), dry ? "(DRY RUN)" : "");

  if (!dry && apiKey) {
    const testUrl = `${apiBase}/orders?limit=1`;
    const tr = await fetch(testUrl, { headers: { "X-MICROCMS-API-KEY": apiKey } });
    const testBody = await tr.text();
    say("[migrate-orders] GET /orders?limit=1 → HTTP", String(tr.status));
    if (!tr.ok) {
      say("[migrate-orders] GET が失敗しました（キーに GET が無い場合は無視して POST を試します）。本文:", testBody.slice(0, 300));
    }
  }

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    let record;
    try {
      record = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.error("[skip]", file, "JSON parse error", e.message);
      fail += 1;
      continue;
    }

    const built = buildPayload(record);
    if (built.error) {
      console.error("[skip]", file, built.error);
      fail += 1;
      continue;
    }

    const { payload } = built;

    if (dry) {
      say("---", file, "---");
      say(JSON.stringify(payload, null, 2));
      ok += 1;
      continue;
    }

    const exists = await orderExists(apiBase, apiKey, payload.orderNo);
    if (exists) {
      say("[skip exists]", payload.orderNo, file);
      skip += 1;
      continue;
    }

    const res = await fetch(`${apiBase}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MICROCMS-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      say("[fail]", file, String(res.status), text);
      fail += 1;
      continue;
    }

    say("[ok]", payload.orderNo, file);
    ok += 1;
  }

  say("[migrate-orders] 完了 ok=", String(ok), "skip=", String(skip), "fail=", String(fail));
  if (dry && ok > 0) {
    say(
      "[migrate-orders] 上記が問題なければ、--dry-run を外して再実行すると microCMS に POST されます。",
    );
  }
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
