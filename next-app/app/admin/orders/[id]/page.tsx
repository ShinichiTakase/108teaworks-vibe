import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/microcmsOrders";
import { getCustomerByEmail } from "@/lib/microcmsCustomers";
import { formatPriceYen, formatDateTimeJST } from "@/lib/formatters";
import SendShippingSection from "./SendShippingSection";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    robots: "noindex, nofollow",
    title: `注文明細 | 管理`,
  };
}

function customerAddress(customer: {
  zipcode?: string;
  prefectures?: string;
  city?: string;
  address?: string;
}): string {
  const zip = customer.zipcode?.trim();
  const rest = [customer.prefectures, customer.city, customer.address]
    .map((s) => s?.trim())
    .filter(Boolean)
    .join("");
  if (!zip && !rest) return "—";
  return zip ? `〒${zip} ${rest}` : rest;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  const customer = await getCustomerByEmail(order.email);

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/orders/" className="text-sm text-tea hover:underline">
            ← 注文一覧
          </Link>
          <h1 className="text-xl font-semibold text-tea-deep">注文明細</h1>
        </div>

        <div className="space-y-6 rounded border border-border bg-white p-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold text-tea-deep">注文情報</h2>
            <dl className="grid grid-cols-[8em_1fr] gap-y-1 text-sm">
              <dt className="text-ink-muted">注文番号</dt>
              <dd className="font-mono text-ink">{order.orderNo}</dd>
              <dt className="text-ink-muted">注文日時</dt>
              <dd className="text-ink">{formatDateTimeJST(order.orderDateTime)}</dd>
              <dt className="text-ink-muted">メールアドレス</dt>
              <dd className="text-ink">{order.email}</dd>
              {order.sentDateTime && (
                <>
                  <dt className="text-ink-muted">発送完了メール送信日時</dt>
                  <dd className="text-ink">
                    <span className="font-bold text-[#0000ff]">済</span>{" "}
                    {formatDateTimeJST(order.sentDateTime)}
                  </dd>
                </>
              )}
              {order.shippingNumber && (
                <>
                  <dt className="text-ink-muted">お問い合わせ番号・追跡番号</dt>
                  <dd className="text-ink">{order.shippingNumber}</dd>
                </>
              )}
            </dl>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-tea-deep">お客様情報</h2>
            <dl className="grid grid-cols-[8em_1fr] gap-y-1 text-sm">
              <dt className="text-ink-muted">氏名</dt>
              <dd className="text-ink">{customer?.name ?? "—"}</dd>
              <dt className="text-ink-muted">電話番号</dt>
              <dd className="text-ink">{customer?.tel ?? "—"}</dd>
              <dt className="text-ink-muted">住所</dt>
              <dd className="text-ink">{customer ? customerAddress(customer) : "—"}</dd>
            </dl>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-tea-deep">商品明細</h2>
            <div className="overflow-x-auto rounded border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-tea-deep border-b border-border">
                      商品名
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                      数量
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-tea-deep whitespace-nowrap border-b border-border">
                      価格
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.orderLines.map((line, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-ink">{line.product}</td>
                      <td className="px-3 py-2 text-right text-ink whitespace-nowrap">
                        {line.count}
                      </td>
                      <td className="px-3 py-2 text-right text-ink whitespace-nowrap">
                        {formatPriceYen(line.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={2} className="px-3 py-1.5 text-right text-ink-muted">
                      送料
                    </td>
                    <td className="px-3 py-1.5 text-right text-ink whitespace-nowrap">
                      {formatPriceYen(order.shipping)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-3 py-1.5 text-right text-ink-muted">
                      割引
                    </td>
                    <td className="px-3 py-1.5 text-right text-ink whitespace-nowrap">
                      {formatPriceYen(order.discount)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-3 py-1.5 text-right font-semibold text-tea-deep">
                      合計
                    </td>
                    <td className="px-3 py-1.5 text-right font-semibold text-tea-deep whitespace-nowrap">
                      {formatPriceYen(order.orderTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <SendShippingSection id={order.id} toEmail={order.email} orderNo={order.orderNo} />
        </div>
      </div>
    </main>
  );
}
