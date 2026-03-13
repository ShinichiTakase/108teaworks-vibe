import HomePage from "@/components/pages/HomePage";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

// 常にサーバーサイドレンダリング（SSR）
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/", "ja");
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: buildAlternatesForLocales("/"),
  };
}

export default function Home() {
  // ルート（/）は日本語扱い
  return <HomePage locale="ja" />;
}

