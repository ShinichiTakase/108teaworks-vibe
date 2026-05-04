import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ filename: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { filename } = await params;
  return {
    robots: "noindex, nofollow",
    title: `${filename} | 送料計算ログ`,
  };
}

async function getLogFile(
  filename: string
): Promise<{ headers: string[]; records: string[][] } | null> {
  if (!/^shipping_\d{8}\.csv$/.test(filename)) return null;

  const dir = path.resolve(process.cwd(), "data/shipping");
  const filePath = path.join(dir, filename);

  if (!filePath.startsWith(dir + path.sep) && filePath !== dir) return null;

  try {
    const content = await readFile(filePath, "utf8");
    const lines = content.split("\n").filter((l) => l.trim() !== "");
    const [headerLine, ...rows] = lines;
    const headers = headerLine?.split(",") ?? [];
    const records = rows.map((line) => {
      const cols: string[] = [];
      let cur = "";
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuote) {
          if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (ch === '"') { inQuote = false; }
          else { cur += ch; }
        } else {
          if (ch === '"') { inQuote = true; }
          else if (ch === ",") { cols.push(cur); cur = ""; }
          else { cur += ch; }
        }
      }
      cols.push(cur);
      return cols;
    });
    return { headers, records };
  } catch {
    return null;
  }
}

const HEADER_LABELS: Record<string, string> = {
  date: "日付",
  time: "時刻",
  ip: "IPアドレス",
  shipping_fee: "送料",
  prefecture: "都道府県",
};

export default async function AdminShippingFilePage({ params }: Props) {
  const { filename } = await params;
  const data = await getLogFile(filename);
  if (!data) notFound();

  const { headers, records } = data;

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/admin/shipping" className="text-sm text-tea hover:underline">
            ← 一覧に戻る
          </Link>
          <h1 className="font-mono text-lg font-semibold text-tea-deep">{filename}</h1>
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
