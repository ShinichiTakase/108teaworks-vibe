import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ lang: string; slug?: string[] }>;
};

/**
 * mie_chagyo_shi は日本語コンテンツのみのため、
 * 他言語URLでアクセスされた場合は日本語版に302リダイレクトする。
 */
export default async function LocalizedMieChagyoShiRedirect({ params }: Props) {
  const { slug } = await params;
  const path = slug && slug.length > 0 ? `/mie_chagyo_shi/${slug.join("/")}/` : "/mie_chagyo_shi/";
  redirect(path);
}
