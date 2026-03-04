import HomePage from "@/components/pages/HomePage";

// 常にサーバーサイドレンダリング（SSR）
export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePage />;
}

