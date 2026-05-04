import type { Metadata } from "next";
import { readdir, stat } from "fs/promises";
import path from "path";
import Link from "next/link";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "カートログ一覧 | 管理",
};

async function getCartFiles(): Promise<{ name: string; size: number }[]> {
  const cartDir = path.resolve(process.cwd(), "data/cart");
  try {
    const entries = await readdir(cartDir);
    const csvFiles = entries
      .filter((f) => f.startsWith("cart_") && f.endsWith(".csv"))
      .sort((a, b) => b.localeCompare(a));

    const files = await Promise.all(
      csvFiles.map(async (name) => {
        const filePath = path.join(cartDir, name);
        const s = await stat(filePath).catch(() => null);
        return { name, size: s?.size ?? 0 };
      })
    );
    return files;
  } catch {
    return [];
  }
}

export default async function AdminCartPage() {
  const files = await getCartFiles();

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin" className="text-sm text-tea hover:underline">
            ← 管理メニュー
          </Link>
          <h1 className="text-xl font-semibold text-tea-deep">カートログ一覧</h1>
        </div>
        {files.length === 0 ? (
          <p className="text-ink-muted text-sm">ログファイルがまだありません。</p>
        ) : (
          <ul className="divide-y divide-border rounded border border-border bg-white">
            {files.map(({ name, size }) => (
              <li key={name}>
                <Link
                  href={`/admin/cart/${name}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-cream transition-colors"
                >
                  <span className="font-mono text-sm text-tea-deep">{name}</span>
                  <span className="text-xs text-ink-muted">
                    {size > 0 ? `${(size / 1024).toFixed(1)} KB` : "—"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
