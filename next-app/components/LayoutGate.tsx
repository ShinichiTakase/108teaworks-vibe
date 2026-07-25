"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";
import { isBareLpPath } from "@/lib/urlPath";

/**
 * ルートレイアウトは初回リクエスト時にしか評価されない（クライアント遷移では再実行されない）ため、
 * headers() ベースの判定だと <Link> でwakocha-lpへ遷移した際に通常のヘッダー/フッターが
 * 残ってしまう。usePathname() はクライアント遷移のたびに更新されるため、ここで判定し直す。
 */
export default function LayoutGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const bareLp = isBareLpPath(pathname);
  return bareLp ? <>{children}</> : <Layout>{children}</Layout>;
}
