import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import ProductListWithFilter, { type ProductWithImage } from "./ProductListWithFilter";

export default async function ProductList() {
  const { contents: products } = await getProducts();
  const productsWithImage: ProductWithImage[] = products.map((p) => {
    const slug = p.SLUG ?? p.id;
    return { ...p, imagePath: getProductImagePath(slug) };
  });

  return <ProductListWithFilter products={productsWithImage} />;
}
