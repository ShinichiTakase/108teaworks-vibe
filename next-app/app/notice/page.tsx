import NoticeListContent from "@/components/NoticeListContent";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = getFixedSeo("/notice", "ja");
  return {
    title: seo?.title ?? "お知らせ｜伊勢茶の藤八茶寮",
    description: seo?.description ?? "藤八茶寮からのお知らせ一覧です。",
    alternates: buildAlternatesForLocales("/notice"),
  };
}

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NoticeListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  return <NoticeListContent locale="ja" page={page} />;
}
