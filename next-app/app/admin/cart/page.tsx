import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "カートログ一覧 | 管理",
};

async function getCartFiles(): Promise<{ name: string; size: number }[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/cart`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.files) ? data.files : [];
  } catch {
    return [];
  }
}

export default async function AdminCartPage() {
  const files = await getCartFiles();

  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-tea-deep">カートログ一覧</h1>
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
