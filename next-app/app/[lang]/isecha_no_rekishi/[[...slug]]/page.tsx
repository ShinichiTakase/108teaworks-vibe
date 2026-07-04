import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ lang: string; slug?: string[] }>;
};

/**
 * isecha_no_rekishi は日本語コンテンツのみのため、
 * 他言語URLでアクセスされた場合は日本語版に302リダイレクトする。
 */
export default async function LocalizedIsechaNoRekishiRedirect({ params }: Props) {
  const { slug } = await params;
  const path =
    slug && slug.length > 0 ? `/isecha_no_rekishi/${slug.join("/")}/` : "/isecha_no_rekishi/";
  redirect(path);
}
