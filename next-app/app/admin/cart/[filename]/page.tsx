import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { filename: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    robots: "noindex, nofollow",
    title: `${params.filename} | カートログ`,
  };
}

async function getCartFile(
  filename: string
): Promise<{ headers: string[]; records: string[][] } | null> {
  if (!/^cart_\d{8}\.csv$/.test(filename)) return null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/cart/${encodeURIComponent(filename)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const HEADER_LABELS: Record<string, string> = {
  date: "日付",
  time: "時刻",
  ip: "IPアドレス",
  product: "商品名",
  quantity: "数量",
};

export default async function AdminCartFilePage({ params }: Props) {
  const data = await getCartFile(params.filename);
  if (!data) notFound();

  const { headers, records } = data;

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/admin/cart" className="text-sm text-tea hover:underline">
            ← 一覧に戻る
          </Link>
          <h1 className="font-mono text-lg font-semibold text-tea-deep">{params.filename}</h1>
        </div>

        {records.length === 0 ? (
          <p className="text-ink-muted text-sm">データがありません。</p>
        ) : (
          <div className="overflow-x-auto rounded border border-border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left font-semibold text-tea-deep whitespace-nowrap border-b border-border"
                    >
                      {HEADER_LABELS[h] ?? h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((row, i) => (
                  <tr key={i} className="hover:bg-cream/50 transition-colors">
                    {headers.map((_, j) => (
                      <td key={j} className="px-4 py-2 text-ink whitespace-nowrap">
                        {row[j] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-ink-muted border-t border-border">
              {records.length} 件
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
