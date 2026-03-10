import { NextResponse } from "next/server";
import { buildReceiptPdf } from "@/lib/receiptPdf";

/** 領収書PDFのプレビュー（サンプルデータ） */
export async function GET() {
  const now = new Date();
  const items = [
    { name: "伊勢の深蒸し茶 50g", quantity: 2, unitPrice: 1080, amount: 2160 },
    { name: "ほうじ茶パウダー 80g", quantity: 1, unitPrice: 1620, amount: 1620 },
  ];
  const shipping = 280;
  const itemsTotal = items.reduce((s, r) => s + r.amount, 0);
  const total = itemsTotal + shipping;
  const net = Math.floor(total / 1.08);
  const taxAmount = total - net;

  const sample: Parameters<typeof buildReceiptPdf>[0] = {
    transactionAt: now,
    recipientName: "山田 太郎",
    items,
    shipping,
    subtotal: total, // 互換用（表示には使用しない）
    taxAmount,
    total, // 互換用（表示には使用しない）
  };

  const pdf = await buildReceiptPdf(sample);
  // Buffer は BodyInit 型に含まれないため、型上は any にキャストして返す
  return new NextResponse(pdf as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=receipt-sample.pdf",
    },
  });
}
