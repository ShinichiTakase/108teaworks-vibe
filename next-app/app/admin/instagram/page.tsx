import type { Metadata } from "next";
import Link from "next/link";
import StatusPanel from "./StatusPanel";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Instagram トークン管理 | 管理",
};

export default function AdminInstagramPage() {
  return (
    <main className="min-h-screen bg-washi py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin" className="text-sm text-tea hover:underline">
            ← 管理メニュー
          </Link>
          <h1 className="text-xl font-semibold text-tea-deep">Instagram トークン管理</h1>
        </div>
        <StatusPanel />
      </div>
    </main>
  );
}
