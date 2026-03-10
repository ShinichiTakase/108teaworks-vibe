import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/** 領収書1行の明細 */
export interface ReceiptLineItem {
  /** 品名 */
  name: string;
  /** 数量 */
  quantity: number;
  /** 単価（税込） */
  unitPrice: number;
  /** 金額（税込） */
  amount: number;
}

/** 領収書生成用データ */
export interface ReceiptData {
  /** 取引日時（領収書No・日付に使用） */
  transactionAt: Date;
  /** 宛名（個人: "山田 太郎 様" / 法人: "株式会社○○、経理部、山田 太郎 様" など） */
  recipientName: string;
  /** 明細行 */
  items: ReceiptLineItem[];
  /** 送料（税込） */
  shipping: number;
  /** 小計（税込） */
  subtotal: number;
  /** 消費税額 */
  taxAmount: number;
  /** 合計（税込） */
  total: number;
}

const MARGIN = 72;
const PAGE_WIDTH = 595;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FONT_NAMES = [
  "NotoSerifJP-Regular.ttf",
  "NotoSerifJP-Regular.otf",
  "NotoSerifJP[wght].ttf", // Google Fonts ZIP の変数フォント
];

/** 指定ディレクトリ内の最初の .ttf / .otf を返す（任意の日本語フォント用） */
function findFirstFontInDir(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const font = files.find((f) => /\.(ttf|otf)$/i.test(f));
  return font ? path.join(dir, font) : null;
}

/** 日本語用フォントの候補パス（先に存在したものを使用） */
function getJapaneseFontPath(): string | null {
  const cwd = process.cwd();
  const dirs = [
    path.join(cwd, "public", "fonts"),
    path.join(cwd, "next-app", "public", "fonts"),
  ];
  for (const name of FONT_NAMES) {
    for (const dir of dirs) {
      const p = path.join(dir, name);
      if (fs.existsSync(p)) return p;
    }
  }
  for (const dir of dirs) {
    const p = findFirstFontInDir(dir);
    if (p) return p;
  }
  return null;
}

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}年${m}月${day}日`;
}

function formatReceiptNo(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `R-${y}${m}${day}${h}${min}${s}`;
}

/**
 * 領収書PDFを生成して Buffer で返す。
 * 日本語表示には public/fonts/NotoSerifJP-Regular.ttf を配置してください。
 */
export function buildReceiptPdf(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: MARGIN });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const fontPath = getJapaneseFontPath();
    const useJapaneseFont = fontPath !== null;
    if (fontPath) {
      doc.registerFont("Japanese", fontPath);
      doc.font("Japanese");
    } else {
      const cwd = process.cwd();
      const searchDir = path.join(cwd, "public", "fonts");
      console.warn(
        "[receiptPdf] 日本語フォントがありません。次のいずれかに .ttf または .otf を置いてください:",
        searchDir,
        "(手順: public/fonts/README.md)"
      );
    }

    let y = 40;
    const lineHeight = 22;
    const smallLine = 18;

    // 日付（右寄せ）
    doc.fontSize(10).text(formatDate(data.transactionAt), MARGIN, y, {
      width: CONTENT_WIDTH,
      align: "right",
    });
    y += lineHeight;

    // 領収書No（右寄せ）
    doc.fontSize(10).text(formatReceiptNo(data.transactionAt), MARGIN, y, {
      width: CONTENT_WIDTH,
      align: "right",
    });
    y += lineHeight + 10;

    // タイトル「領収書」（中央）
    doc.fontSize(22).text("領収書", MARGIN, y, {
      width: CONTENT_WIDTH,
      align: "center",
    });
    y += 36 + smallLine; // タイトルと宛名の間を1行分広く

    // 宛名（左寄せ）※商習慣に合わせて当方情報より上
    doc.fontSize(12).text(`${data.recipientName} 様`, MARGIN, y);
    y += lineHeight + 16;

    // 当方情報（右寄せ）
    // - 「藤八茶寮」だけ宛名と同じサイズ
    // - 〒/住所/メール/電話は小さめに戻す
    doc.fontSize(12).text("藤八茶寮", MARGIN, y, { width: CONTENT_WIDTH, align: "right" });
    y += smallLine;
    doc.fontSize(10);
    ["〒224-0007", "神奈川県横浜市都筑区荏田南一丁目１１番２３号", "info@108teaworks.com / 050-6860-7347"].forEach(
      (line) => {
        doc.text(line, MARGIN, y, { width: CONTENT_WIDTH, align: "right" });
        y += smallLine;
      }
    );
    y += 24;

    // メモ（左寄せ）
    doc.fontSize(11);
    doc.text("お買い上げありがとうございました", MARGIN, y);
    y += smallLine;
    doc.text("下記のとおり領収いたしました", MARGIN, y);
    y += lineHeight + 16;

    // 明細テーブル（品名を広く、数量・単価・金額を狭く）
    const colW = [
      CONTENT_WIDTH * 0.52, // 品名
      CONTENT_WIDTH * 0.1,  // 数量
      CONTENT_WIDTH * 0.14, // 単価
      CONTENT_WIDTH * 0.24, // 金額
    ];
    const rowH = 22;
    const fontTable = 10;

    // ヘッダー：薄いグレー背景
    doc.fontSize(fontTable);
    if (useJapaneseFont) doc.font("Japanese");
    else doc.font("Helvetica-Bold");
    doc.rect(MARGIN, y, colW[0], rowH).fill("#e8e8e8");
    doc.rect(MARGIN + colW[0], y, colW[1], rowH).fill("#e8e8e8");
    doc.rect(MARGIN + colW[0] + colW[1], y, colW[2], rowH).fill("#e8e8e8");
    doc.rect(MARGIN + colW[0] + colW[1] + colW[2], y, colW[3], rowH).fill("#e8e8e8");
    doc.rect(MARGIN, y, colW[0], rowH).stroke();
    doc.rect(MARGIN + colW[0], y, colW[1], rowH).stroke();
    doc.rect(MARGIN + colW[0] + colW[1], y, colW[2], rowH).stroke();
    doc.rect(MARGIN + colW[0] + colW[1] + colW[2], y, colW[3], rowH).stroke();
    doc.fillColor("black").text("品名", MARGIN + 6, y + 6, { width: colW[0] - 12 });
    doc.text("数量", MARGIN + colW[0] + 4, y + 6, { width: colW[1] - 8, align: "center" });
    doc.text("単価", MARGIN + colW[0] + colW[1] + 4, y + 6, { width: colW[2] - 8, align: "right" });
    doc.text("金額", MARGIN + colW[0] + colW[1] + colW[2] + 4, y + 6, { width: colW[3] - 8, align: "right" });
    y += rowH;
    // 見出し下：二重線
    doc.moveTo(MARGIN, y).lineTo(MARGIN + CONTENT_WIDTH, y).stroke();
    doc.moveTo(MARGIN, y + 1.5).lineTo(MARGIN + CONTENT_WIDTH, y + 1.5).stroke();
    y += 2;
    if (!useJapaneseFont) doc.font("Helvetica");

    // 品名行は最低8行（足りない分は空行）
    const minItemRows = 8;
    const itemRows = Math.max(minItemRows, data.items.length);
    for (let i = 0; i < itemRows; i++) {
      const row = data.items[i];
      doc.rect(MARGIN, y, colW[0], rowH).stroke();
      doc.rect(MARGIN + colW[0], y, colW[1], rowH).stroke();
      doc.rect(MARGIN + colW[0] + colW[1], y, colW[2], rowH).stroke();
      doc.rect(MARGIN + colW[0] + colW[1] + colW[2], y, colW[3], rowH).stroke();
      if (row) {
        doc.fontSize(fontTable).text(row.name, MARGIN + 6, y + 6, { width: colW[0] - 12 });
        doc.text(String(row.quantity), MARGIN + colW[0] + 4, y + 6, { width: colW[1] - 8, align: "center" });
        doc.text(formatYen(row.unitPrice), MARGIN + colW[0] + colW[1] + 4, y + 6, { width: colW[2] - 8, align: "right" });
        doc.text(formatYen(row.amount), MARGIN + colW[0] + colW[1] + colW[2] + 4, y + 6, {
          width: colW[3] - 8,
          align: "right",
        });
      }
      y += rowH;
    }

    // 内税計算（合計=商品合計+送料、内消費税=合計-⌊合計/1.08⌋）※軽減税率 8%
    const itemsTotal = data.items.reduce((sum, r) => sum + (typeof r.amount === "number" ? r.amount : 0), 0);
    const grandTotal = itemsTotal + (data.shipping ?? 0);
    const net = Math.floor(grandTotal / 1.08);
    const includedTax = grandTotal - net;

    // まとめ（添付画像の罫線）：単価列＋金額列の2列で 2x4 ボックス
    const summaryLabelWidth = colW[2]; // 単価列
    const summaryValueWidth = colW[3]; // 金額列
    const xLabelStart = MARGIN + colW[0] + colW[1]; // 単価列の開始
    const xValueStart = xLabelStart + summaryLabelWidth; // 金額列の開始
    const xValueEnd = xValueStart + summaryValueWidth; // 金額列の右端
    const summaryRows = [
      { label: "送料", amount: data.shipping },
      { label: "合計", amount: grandTotal }, // 旧「小計」
      { label: "内消費税", amount: includedTax },
    ];

    // セルは四角で囲む（左端の縦罫線は不要＝そこは描かない、というのは「まとめブロックの左端(ページ左側)」を指すため）
    // まとめブロック自体は xLabelStart から始まるので、ここは通常の枠線で囲む
    const drawLabelCellBox = (y0: number) => {
      doc.rect(xLabelStart, y0, summaryLabelWidth, rowH).stroke();
    };
    const drawValueCellBox = (y0: number) => {
      doc.rect(xValueStart, y0, summaryValueWidth, rowH).stroke();
    };

    for (let i = 0; i < summaryRows.length; i++) {
      const { label, amount } = summaryRows[i];
      const isTotal = label === "合計";

      drawLabelCellBox(y);
      drawValueCellBox(y);

      // ラベル（合計のみ太字）
      if (useJapaneseFont) doc.font("Japanese");
      else doc.font("Times-Roman");
      if (isTotal) {
        // 日本語フォントに太字が無い場合でも見た目を太くする（少しずらして二重描画）
        doc.text(label, xLabelStart + 4, y + 6, { width: summaryLabelWidth - 12, align: "right" });
        doc.text(label, xLabelStart + 4.5, y + 6, { width: summaryLabelWidth - 12, align: "right" });
      } else {
        doc.text(label, xLabelStart + 4, y + 6, { width: summaryLabelWidth - 12, align: "right" });
      }

      // 金額（合計のみ太字）
      if (useJapaneseFont) doc.font("Japanese");
      else doc.font(isTotal ? "Times-Bold" : "Times-Roman");
      doc.text(formatYen(amount), xValueStart + 4, y + 6, {
        width: summaryValueWidth - 8,
        align: "right",
      });
      y += rowH;
    }
    if (!useJapaneseFont) doc.font("Helvetica");

    // 備考欄（下部の余白を埋める）
    y += 18;
    doc.fontSize(10).text("備考", MARGIN, y, { width: CONTENT_WIDTH, align: "left" });
    y += 18; // ラベルと枠が重ならないよう余白を確保
    const bottomLimit = doc.page.height - doc.page.margins.bottom;
    const desiredHeight = 160;
    const maxHeight = Math.max(80, bottomLimit - y - 6);
    const boxH = Math.min(desiredHeight, maxHeight);
    doc.rect(MARGIN, y, CONTENT_WIDTH, boxH).stroke();

    doc.end();
  });
}
