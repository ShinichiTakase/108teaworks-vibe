import { Suspense } from "react";
import { getProducts } from "@/lib/microcms";
import { getProductImagePath } from "@/lib/productImage";
import ProductListWithFilter, { type ProductWithImage } from "./ProductListWithFilter";
import ProductItemListJsonLd from "./ProductItemListJsonLd";

export default async function ProductList() {
  const { contents: products } = await getProducts();

  const productsWithImage: ProductWithImage[] = products.map((p) => {
    const slug = p.SLUG ?? p.id;
    return { ...p, imagePath: getProductImagePath(slug) };
  });

  return (
    <>
      <ProductItemListJsonLd
        slugs={productsWithImage.map((p) => p.SLUG ?? p.id)}
      />
      <Suspense fallback={null}>
        <ProductListWithFilter products={productsWithImage} />
      </Suspense>
    </>
  );
}
