import type { Metadata } from "next";
import Link from "next/link";
import { listOrders, type OrderItem } from "@/lib/microcmsOrders";
import { getCustomerNamesByEmails } from "@/lib/microcmsCustomers";
import { formatPriceYen, formatDateTimeJST } from "@/lib/formatters";
import OrdersTable, { type OrderRow } from "./OrdersTable";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "注文一覧 | 管理",
};

const PER_PAGE = 30;
const PRODUCT_NAME_MAX = 25;

function truncateProductName(name: string): string {
  const chars = Array.from(name ?? "");
  if (chars.length <= PRODUCT_NAME_MAX) return chars.join("");
  return `${chars.slice(0, PRODUCT_NAME_MAX).join("")}...`;
}

function orderLinesSummary(orderLines: OrderItem["orderLines"]): string {
  if (!Array.isArray(orderLines) || orderLines.length === 0) return "—";
  return orderLines.map((l) => `${truncateProductName(l.product)} ×${l.count}`).join("、");
}

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const offset = (page - 1) * PER_PAGE;
  const { contents: orders, totalCount } = await listOrders(PER_PAGE, offset);
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const customerNames = await getCustomerNamesByEmails(orders.map((o) => o.email));

  const rows: OrderRow[] = orders.map((order) => ({
    id: order.id,
    orderNo: order.orderNo,
    orderDateTimeDisplay: formatDateTimeJST(order.orderDateTime),
    customerName: customerNames[order.email] ?? order.email,
    productSummary: orderLinesSummary(order.orderLines),
    orderTotalDisplay: formatPriceYen(order.orderTotal),
    sent: Boolean(order.sentDateTime),
  }));

  const pageHref = (p: number) => (p === 1 ? "/admin/orders/" : `/admin/orders/?page=${p}`);

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin" className="text-sm text-tea hover:underline">
            ← 管理メニュー
          </Link>
          <h1 className="text-xl font-semibold text-tea-deep">注文一覧</h1>
        </div>

        {rows.length === 0 ? (
          <p className="text-ink-muted text-sm">注文データがありません。</p>
        ) : (
          <OrdersTable rows={rows} totalCount={totalCount} />
        )}

        {totalPages > 1 && (
          <nav
            aria-label="注文一覧のページ切り替え"
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            {currentPage > 1 && (
              <Link
                href={pageHref(currentPage - 1)}
                className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
              >
                前へ
              </Link>
            )}
            <span className="flex items-center gap-2 px-2 text-[0.875rem] text-ink-muted">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                p === currentPage ? (
                  <span
                    key={p}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-tea-deep bg-tea-deep/10 font-semibold text-tea-deep"
                    aria-current="page"
                  >
                    {p}
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-border text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
                  >
                    {p}
                  </Link>
                )
              )}
            </span>
            {currentPage < totalPages && (
              <Link
                href={pageHref(currentPage + 1)}
                className="inline-flex items-center justify-center rounded border border-border bg-white px-3 py-1.5 text-[0.875rem] text-ink no-underline hover:border-tea-deep hover:text-tea-deep"
              >
                次へ
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
