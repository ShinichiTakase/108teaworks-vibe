#!/usr/bin/env node
/**
 * next-app/data/orders（または .data/order_snapshots）の JSON を microCMS orders API に POST する。
 *
 * 進め方（推奨）:
 *   1) ペイロード確認（microCMS には書かない）
 *        node scripts/migrate-orders-to-microcms.mjs --dry-run
 *        curl 用 JSON をファイルへ: --export ./data/orders-microcms-export を追加
 *   2) 問題なければ POST（--dry-run を外す）
 *        node scripts/migrate-orders-to-microcms.mjs
 *   手動 POST: ./scripts/post-microcms-orders-curl.sh ./data/orders-microcms-export
 *
 * 想定するローカル JSON:
 * - 従来スナップショット: { orderNo, email, body }（body は注文確認メール HTML）
 * - または既に構造化: { orderNo, email, orderDateTime?, shipping?, discount?, orderTotal?, orderLines: [...] }
 *
 * 環境変数（.env.local 可）: MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY
 * 注文 JSON の場所:
 *   - .env.local の ORDER_SNAPSHOTS_DIR は Docker だと /app/... になりがち。ホストでこのスクリプトを
 *     実行するときは、そのパス上に *.json が無ければ無視し、next-app 直下の data/orders 等を探す。
 *   - ホストの絶対パスを明示したいときは --source または、ホスト用に ORDER_SNAPSHOTS_DIR を
 *     /mnt/.../next-app/data/orders のように書く（microCMS 用のキーはそのまま .env.local でよい）。
 * CLI: --dry-run  --source DIR  --export DIR  --help
 * 環境変数: ORDER_SNAPSHOTS_DIR → MIGRATE_ORDERS_DIR の順（いずれも「このマシンで *.json が取れる」ときだけ採用）、
 *           MIGRATE_DRY_RUN=1, MIGRATE_EXPORT_DIR
 *           MIGRATE_INCLUDE_TITLE=1 … スキーマに title がある API だけ付与（既定は付けない）
 *
 * Ubuntu: ./scripts/migrate-orders-to-microcms.sh
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** ログは stderr のみ */
function say(...args) {
  console.error(...args);
}

/** ファイル読込・サマリーは stdout / stderr 両方 */
function sayBoth(...args) {
  const line = args.map(String).join(" ");
  console.error(line);
  console.log(line);
}

/** 単独引数のディレクトリパス解決（cwd または next-app 基準） */
function tryResolveDirArg(a) {
  if (typeof a !== "string" || a.startsWith("-")) return null;
  const candidates = [
    path.isAbsolute(a) ? a : path.resolve(process.cwd(), a),
    path.isAbsolute(a) ? a : path.resolve(ROOT, a),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
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

const fromEnvLocal = loadEnvLocal();
const env = { ...process.env, ...fromEnvLocal };
/** シェル（migrate-orders-to-microcms.sh の --export 等）で渡した MIGRATE_* は .env.local の空行で消さない */
const MIGRATE_SHELL_KEYS = [
  "MIGRATE_EXPORT_DIR",
  "MIGRATE_ORDERS_DIR",
  "MIGRATE_DRY_RUN",
  "MIGRATE_INCLUDE_TITLE",
  "MIGRATE_OMIT_TITLE",
  "ORDER_SNAPSHOTS_DIR",
];
for (const k of MIGRATE_SHELL_KEYS) {
  const fromShell = process.env[k];
  if (fromShell != null && String(fromShell).trim() !== "") {
    env[k] = fromShell;
  }
}

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

function parseCli(argv) {
  let dry = env.MIGRATE_DRY_RUN === "1" || env.MIGRATE_DRY_RUN === "true";
  /** --source のみ（.env のパスは resolveSourceDir で別扱い。Docker 内パスを誤採用しない） */
  let sourceOverride = null;
  let exportDir = env.MIGRATE_EXPORT_DIR?.trim() || null;
  const raw = argv.slice(2);
  const args = [];
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    const prev = i > 0 ? raw[i - 1] : "";
    /** --source DIR / --export DIR の DIR はディレクトリ短縮形にしない（二重 --source になる） */
    if (prev === "--source" || prev === "--export") {
      args.push(a);
      continue;
    }
    const dir = tryResolveDirArg(a);
    if (dir) {
      args.push("--source", dir);
      continue;
    }
    args.push(a);
  }
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dry-run") dry = true;
    else if (a === "--source") {
      if (!args[i + 1]) {
        say("error: --source の後にディレクトリを指定してください");
        process.exit(1);
      }
      sourceOverride = args[++i];
    } else if (a === "--export") {
      if (!args[i + 1]) {
        say("error: --export の後に出力ディレクトリを指定してください");
        process.exit(1);
      }
      exportDir = args[++i];
    } else if (a === "-h" || a === "--help") {
      say(`migrate-orders-to-microcms — data/orders → microCMS orders

  node scripts/migrate-orders-to-microcms.mjs --dry-run
  node scripts/migrate-orders-to-microcms.mjs --dry-run --export ./data/orders-microcms-export
  node scripts/migrate-orders-to-microcms.mjs --source /path/to/json
  node scripts/migrate-orders-to-microcms.mjs

要: MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY（--dry-run 時は不要）
`);
      process.exit(0);
    } else {
      say("error: 不明な引数:", a, "（--dry-run / --source DIR / --export DIR / --help）");
      process.exit(1);
    }
  }
  return { dry, sourceOverride, exportDir };
}

function isJsonFileName(name) {
  return name.toLowerCase().endsWith(".json");
}

function listJsonInDir(dirAbs) {
  if (!fs.existsSync(dirAbs) || !fs.statSync(dirAbs).isDirectory()) return [];
  return fs.readdirSync(dirAbs).filter(isJsonFileName).sort();
}

/**
 * 注文 JSON ディレクトリが有効か検証。ダメなら Error を throw（パス誤りを明示する）
 */
function assertReadableOrdersDirectory(absPath, hint) {
  const resolved = path.resolve(absPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(
      `ソースディレクトリが存在しません。\n  パス: ${resolved}\n  ヒント: ${hint}`,
    );
  }
  const st = fs.statSync(resolved);
  if (!st.isDirectory()) {
    throw new Error(
      `ソースパスはディレクトリではありません（ファイル等）。\n  パス: ${resolved}`,
    );
  }
  try {
    fs.accessSync(resolved, fs.constants.R_OK | fs.constants.X_OK);
  } catch (e) {
    throw new Error(
      `ソースディレクトリを読み取れません（権限を確認）。\n  パス: ${resolved}\n  詳細: ${e.message}`,
    );
  }
  try {
    fs.readdirSync(resolved);
  } catch (e) {
    throw new Error(
      `ソースディレクトリの一覧取得に失敗しました。\n  パス: ${resolved}\n  詳細: ${e.message}`,
    );
  }
  return resolved;
}

function resolveEnvPath(raw) {
  const t = raw.trim();
  if (!t) return null;
  return path.isAbsolute(t) ? t : path.resolve(ROOT, t);
}

/** どのパスが採用されるか・件数がターミナルで追えるようにする */
function logSourceDirResolution(sourceFromArgv) {
  const rootAbs = path.resolve(ROOT);
  say("[migrate-orders] ROOT（next-app）:", rootAbs);
  if (sourceFromArgv) {
    const abs = resolveEnvPath(sourceFromArgv);
    const n = listJsonInDir(abs).length;
    say("[migrate-orders] --source（明示）:", abs, "→ *.json", String(n), "件");
    return;
  }
  const envKeys = ["ORDER_SNAPSHOTS_DIR", "MIGRATE_ORDERS_DIR"];
  say(
    "[migrate-orders] 環境変数（このマシンで *.json が1件以上あるときだけ採用。Docker の /app/... はホストでは 0 件扱いでスキップ）:",
  );
  for (const key of envKeys) {
    const raw = env[key]?.trim();
    if (!raw) {
      say(" ", key, "=（未設定）");
      continue;
    }
    const abs = resolveEnvPath(raw);
    const n = listJsonInDir(abs).length;
    say(" ", key, "=", abs, "→ *.json", String(n), "件");
  }
  const candidates = [
    path.join(ROOT, "data", "orders"),
    path.join(ROOT, ".data", "order_snapshots"),
  ];
  say("[migrate-orders] 上記が使えない場合の自動候補（*.json が1件以上ある最初のディレクトリを採用）:");
  for (const c of candidates) {
    const abs = path.resolve(c);
    if (!fs.existsSync(abs)) {
      say(" ", abs, "→ パスなし");
      continue;
    }
    if (!fs.statSync(abs).isDirectory()) {
      say(" ", abs, "→ ディレクトリではない");
      continue;
    }
    const all = fs.readdirSync(abs);
    const j = all.filter(isJsonFileName);
    say(" ", abs, "→ *.json", String(j.length), "件（エントリ計", String(all.length), "）");
  }
  say("[migrate-orders] いずれも 0 件なら参照のみ試すパス:", path.resolve(ROOT, "data", "orders"));
}

/**
 * --source: ユーザー指定をそのまま返す（存在・件数は main で検証）
 * それ以外: ORDER_SNAPSHOTS_DIR → MIGRATE_ORDERS_DIR の順で「*.json が取れる」パスのみ採用し、
 *           だめなら data/orders / .data/order_snapshots を探索
 */
function resolveSourceDir(sourceFromArgv) {
  if (sourceFromArgv) {
    return resolveEnvPath(sourceFromArgv);
  }
  const envKeysOrder = ["ORDER_SNAPSHOTS_DIR", "MIGRATE_ORDERS_DIR"];
  for (const key of envKeysOrder) {
    const raw = env[key]?.trim();
    if (!raw) continue;
    const abs = resolveEnvPath(raw);
    if (listJsonInDir(abs).length > 0) {
      say("[migrate-orders] 採用:", key, "→", abs);
      return abs;
    }
  }
  const candidates = [
    path.join(ROOT, "data", "orders"),
    path.join(ROOT, ".data", "order_snapshots"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
      const files = listJsonInDir(c);
      if (files.length > 0) return path.resolve(c);
    }
  }
  return path.resolve(ROOT, "data", "orders");
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

  // 既定は title なし（'title' is unexpected key 対策）。スキーマに title がある API だけ MIGRATE_INCLUDE_TITLE=1
  const includeTitle =
    env.MIGRATE_INCLUDE_TITLE === "1" || env.MIGRATE_INCLUDE_TITLE === "true";
  const forceOmitTitle =
    env.MIGRATE_OMIT_TITLE === "1" || env.MIGRATE_OMIT_TITLE === "true";
  if (includeTitle && !forceOmitTitle) {
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

function writeExportPayload(exportRoot, sourceFileName, payload) {
  fs.mkdirSync(exportRoot, { recursive: true });
  const base = path.basename(sourceFileName, ".json");
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  const dest = path.join(exportRoot, `${safe}.microcms.json`);
  fs.writeFileSync(dest, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  say("[export]", dest);
}

async function main() {
  const cli = parseCli(process.argv);
  if (cli.exportDir) {
    env.MIGRATE_EXPORT_DIR = cli.exportDir;
  }
  const sourceFromArgv = cli.sourceOverride;

  const domain = env.MICROCMS_SERVICE_DOMAIN?.trim();
  const apiKey = env.MICROCMS_API_KEY?.trim();
  const dry = cli.dry;
  const exportDirRaw = env.MIGRATE_EXPORT_DIR?.trim();
  const exportDirAbs = exportDirRaw
    ? path.isAbsolute(exportDirRaw)
      ? exportDirRaw
      : path.resolve(ROOT, exportDirRaw)
    : null;

  say("[migrate-orders] 開始");
  sayBoth("[migrate-orders] 開始（この行が見えれば Node は起動しています）");
  if (dry) {
    say("[migrate-orders] DRY RUN: microCMS には書き込みません（本番は --dry-run を付けずに実行）");
  }
  if (exportDirAbs) {
    say("[migrate-orders] エクスポート先:", exportDirAbs);
  }

  if (!dry && (!domain || !apiKey)) {
    sayBoth("[migrate-orders] エラー: 本番 POST には MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が必要です（.env.local）。");
    sayBoth("[migrate-orders] 確認だけなら: --dry-run を付けて再実行してください。");
    process.exit(1);
  }

  const apiBase = domain ? `https://${domain}.microcms.io/api/v1` : "";
  logSourceDirResolution(sourceFromArgv);
  const sourceDir = resolveSourceDir(sourceFromArgv);
  const hint =
    sourceFromArgv != null
      ? "--source のパスが正しいか、コマンドが改行で分断されていないか確認してください。"
      : "--source でホスト上の絶対パス（例: .../next-app/data/orders）を指定するか、ディレクトリを作成してください。";

  let sourceDirAbs;
  try {
    sourceDirAbs = assertReadableOrdersDirectory(sourceDir, hint);
    sayBoth("[migrate-orders] ソースディレクトリ検証OK:", sourceDirAbs);
  } catch (e) {
    sayBoth("========== [migrate-orders] パス検証エラー ==========");
    sayBoth(String(e.message));
    sayBoth("====================================================");
    process.exit(1);
  }

  const files = listJsonInDir(sourceDirAbs);
  if (files.length === 0) {
    sayBoth("========== [migrate-orders] 終了サマリー ==========");
    sayBoth("[migrate-orders] 参照ディレクトリ:", sourceDirAbs);
    sayBoth("[migrate-orders] 一覧の *.json 件数: 0（処理したファイルはありません）");
    sayBoth("====================================================");
    say("[migrate-orders] 移行対象の *.json が 0 件です（このため microCMS は空のままです）。");
    say("[migrate-orders] 参照ディレクトリ（絶対パス）:", sourceDirAbs);
    try {
      if (fs.existsSync(sourceDirAbs) && fs.statSync(sourceDirAbs).isDirectory()) {
        const entries = fs.readdirSync(sourceDirAbs);
        const preview = entries.slice(0, 40);
        say(
          "[migrate-orders] ディレクトリ内のファイル例（最大40件）:",
          preview.length ? preview.join(", ") : "（空）",
        );
        if (entries.length > 40) say("  … 他", String(entries.length - 40), "件");
      }
    } catch (e) {
      say("[migrate-orders] ディレクトリ一覧の取得に失敗:", e.message);
    }
    say("[migrate-orders] 次を確認してください:");
    say("  ・.env.local の ORDER_SNAPSHOTS_DIR が Docker 用（例 /app/data/orders）だけのとき、ホストでは参照されず data/orders を見に行きます。JSON が無ければ --source でホスト絶対パスを指定:");
    say("    例: --source /mnt/nvme01/project/108teaworks-vibe/next-app/data/orders");
    say("  ・Docker のボリュームなら、マウント先のホスト側ディレクトリを指定する");
    process.exit(0);
  }

  say("[migrate-orders] 採用したソース（絶対パス）:", sourceDirAbs);
  say("[migrate-orders] 件数:", String(files.length), dry ? "(DRY RUN)" : "");
  say("[migrate-orders] 処理順（ファイル名昇順）:");
  const idxW = String(files.length).length;
  for (let i = 0; i < files.length; i++) {
    say(" ", String(i + 1).padStart(idxW, " "), "/", String(files.length), files[i]);
  }

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
  let jsonReadOk = 0;

  for (let fi = 0; fi < files.length; fi++) {
    const file = files[fi];
    const step = `${fi + 1}/${files.length}`;
    const filePath = path.join(sourceDirAbs, file);
    const fileAbs = path.resolve(filePath);
    sayBoth("[オープン試行]", step, "ディレクトリ:", sourceDirAbs, "ファイル名:", file);
    sayBoth("[オープン試行]", step, "フルパス:", fileAbs);
    let record;
    try {
      record = JSON.parse(fs.readFileSync(filePath, "utf8"));
      jsonReadOk += 1;
      sayBoth("[オープン・読込OK]", step, fileAbs);
    } catch (e) {
      sayBoth("[オープン失敗]", step, fileAbs, "—", e.name, e.message);
      fail += 1;
      continue;
    }

    const built = buildPayload(record);
    if (built.error) {
      sayBoth("[ペイロード不可]", fileAbs, "—", built.error);
      fail += 1;
      continue;
    }

    const { payload } = built;

    if (exportDirAbs) {
      writeExportPayload(exportDirAbs, file, payload);
    }

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
  sayBoth("========== [migrate-orders] 終了サマリー ==========");
  sayBoth("[migrate-orders] ソースディレクトリ:", sourceDirAbs);
  sayBoth("[migrate-orders] 一覧の *.json 件数:", String(files.length));
  sayBoth(
    "[migrate-orders] ファイルを開いて JSON として読み込めた件数:",
    String(jsonReadOk),
    "件",
  );
  if (dry) {
    sayBoth("[migrate-orders] dry-run: ペイロード確認まで成功した件数:", String(ok), "件");
  } else {
    sayBoth("[migrate-orders] microCMS 新規 POST 成功:", String(ok), "件");
    sayBoth("[migrate-orders] 既存 orderNo でスキップ:", String(skip), "件");
  }
  sayBoth("[migrate-orders] 失敗（読込・ペイロード・POST）合計:", String(fail), "件");
  sayBoth("====================================================");
  if (dry && ok > 0) {
    say(
      "[migrate-orders] 問題なければ --dry-run を外して再実行すると microCMS に POST されます。",
    );
    if (exportDirAbs) {
      say(
        "[migrate-orders] または ./scripts/post-microcms-orders-curl.sh",
        exportDirAbs,
        "で curl POST できます。",
      );
    }
  }
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  sayBoth("========== [migrate-orders] 未処理例外 ==========");
  sayBoth(e instanceof Error ? e.message : String(e));
  if (e instanceof Error && e.stack) {
    console.error(e.stack);
  }
  sayBoth("====================================================");
  process.exit(1);
});
