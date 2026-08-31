import { SITE_BASE_URL } from "@/lib/siteConstants";

type Props = {
  slugs: string[];
};

/**
 * トップページ商品一覧の ItemList JSON-LD。
 * 個別商品ページに Product スキーマが実装済みのため、ここでは URL のみの
 * ListItem として軽量に列挙する（Google 推奨パターン）。
 */
export default function ProductItemListJsonLd({ slugs }: Props) {
  if (slugs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: slugs.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_BASE_URL}/ise-cha/${slug}/`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
