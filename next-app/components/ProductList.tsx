import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import ProductListWithFilter, { type ProductWithImage } from "./ProductListWithFilter";
import type { Locale } from "@/lib/i18n";
import { translateManyForLocale } from "@/lib/translateForLocale";

type Props = { locale?: Locale };

export default async function ProductList({ locale = "ja" }: Props) {
  const { contents: products } = await getProducts();
  const titlesJa = products.map((p) => p.TITLE ?? "");
  const titles =
    locale === "ja" ? titlesJa : await translateManyForLocale(titlesJa, locale);

  const productsWithImage: ProductWithImage[] = products.map((p, i) => {
    const slug = p.SLUG ?? p.id;
    const t = titles[i] ?? p.TITLE;
    return { ...p, TITLE: t, imagePath: getProductImagePath(slug) };
  });

  return <ProductListWithFilter products={productsWithImage} />;
}
