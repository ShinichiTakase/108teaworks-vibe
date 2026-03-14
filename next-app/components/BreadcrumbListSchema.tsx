import type { BreadcrumbItem } from "@/lib/breadcrumb";

type Props = { items: BreadcrumbItem[] };

/**
 * BreadcrumbList の JSON-LD を出力する。items が 0 または 1 の場合は出力しない。
 */
export default function BreadcrumbListSchema({ items }: Props) {
  if (items.length <= 1) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
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
