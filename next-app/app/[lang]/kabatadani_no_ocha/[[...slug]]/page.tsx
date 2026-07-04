import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ lang: string; slug?: string[] }>;
};

/**
 * kabatadani_no_ocha は日本語コンテンツのみのため、
 * 他言語URLでアクセスされた場合は日本語版に302リダイレクトする。
 */
export default async function LocalizedKabatadaniRedirect({ params }: Props) {
  const { slug } = await params;
  const path =
    slug && slug.length > 0 ? `/kabatadani_no_ocha/${slug.join("/")}/` : "/kabatadani_no_ocha/";
  redirect(path);
}
