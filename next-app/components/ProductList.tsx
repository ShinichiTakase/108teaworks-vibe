import Link from "next/link";
import Image from "next/image";

const products = [
  {
    slug: "caffeine-cut-teabag-8",
    name: "カフェインカット（デカフェ）緑茶 ティーバッグ8個",
    image: "/images/products/product-01.webp",
    price: "¥1,296",
  },
  {
    slug: "isecha-powder-500g",
    name: "お得用 伊勢茶パウダー 500g（無糖）",
    image: "/images/products/product-02.webp",
    price: "¥6,450",
  },
  {
    slug: "fukamushi-teabag-50",
    name: "お得用 伊勢の深蒸し茶 ティーバッグ 50個",
    image: "/images/products/product-03.webp",
    price: "¥5,800",
  },
  {
    slug: "fukamushi-teabag-10",
    name: "伊勢の深蒸し茶 ティーバッグ 10個",
    image: "/images/products/product-04.png",
    price: "¥1,188",
  },
  {
    slug: "houjicha-leaf-30g",
    name: "伊勢のほうじ茶 茶葉 30g",
    image: "/images/products/product-05.png",
    price: "¥972",
  },
  {
    slug: "houjicha-teabag-8",
    name: "伊勢のほうじ茶 ティーバッグ 8個",
    image: "/images/products/product-06.webp",
    price: "¥972",
  },
  {
    slug: "isecha-powder-100g",
    name: "伊勢茶パウダー 100g（無糖）",
    image: "/images/products/product-07.png",
    price: "¥1,380",
  },
  {
    slug: "houjicha-powder-80g",
    name: "伊勢ほうじ茶 パウダー 80g（無糖）",
    image: "/images/products/product-08.png",
    price: "¥1,380",
  },
  {
    slug: "fukamushi-teabag-3",
    name: "伊勢の深蒸し茶 ティーバッグ 3個",
    image: "/images/products/product-09.png",
    price: "¥648",
  },
  {
    slug: "houjicha-teabag-3",
    name: "伊勢のほうじ茶 ティーバッグ 3個",
    image: "/images/products/product-10.png",
    price: "¥648",
  },
  {
    slug: "wa-koucha-teabag-3",
    name: "伊勢の和紅茶 ティーバッグ 3個",
    image: "/images/products/product-11.webp",
    price: "¥648",
  },
  {
    slug: "compare-teabag-3set",
    name: "飲み比べ ティーバッグ３種セット",
    image: "/images/products/product-12.png",
    price: "¥583",
  },
];

export default function ProductList() {
  return (
    <section className="mb-12" id="products" aria-label="商品一覧">
      <ul className="list-none m-0 p-0 grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((product) => (
          <li key={product.slug} className="m-0">
            <Link
              href={`/product/${product.slug}/`}
              className="flex flex-col h-full p-3 bg-washi border border-border rounded transition-colors hover:border-tea-light hover:bg-white text-ink no-underline"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-auto mb-3 object-cover rounded bg-cream"
                loading="lazy"
              />
              <span className="block text-right text-base font-normal mb-1">
                {product.name}
              </span>
              <span className="block text-right text-[0.9375rem] font-bold text-tea-deep">
                {product.price}{" "}
                <span className="text-[0.8125rem] text-ink-muted font-normal">
                  (税込)
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
