import { ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

const AUTHOR = {
  "@type": "Person",
  name: "高瀬孝二",
} as const;

const BOOKS = [
  {
    name: "三重県茶業史",
    url: `${SITE_BASE_URL}/mie_chagyo_shi/`,
    description:
      "三重県茶業会議所設立50周年記念として刊行された、平安時代から平成に至る伊勢茶の歴史と茶業の変遷をまとめた一冊。",
  },
  {
    name: "伊勢茶の歴史 お茶のおもしろ知識",
    url: `${SITE_BASE_URL}/isecha_no_rekishi/`,
    description:
      "鎌倉時代から続く伊勢茶の歴史と、将軍家への献上・海外輸出など茶業を牽引してきた歩みを紹介する電子書籍。",
  },
  {
    name: "伊勢茶発祥の地　川俣谷のお茶",
    url: `${SITE_BASE_URL}/kabatadani_no_ocha/`,
    description:
      "伊勢茶発祥の地とされる川俣谷を中心に、鎌倉時代から現代までの茶業の歩みを記した電子書籍。",
  },
] as const;

/**
 * /ise-cha/books/ 用: 3冊の電子書籍を ItemList(Book) として構造化データ化する。
 * 各書籍は無料でウェブ公開されているため isAccessibleForFree を付与。
 */
export default function IsechaBooksJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: BOOKS.map((book, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Book",
        name: book.name,
        url: book.url,
        description: book.description,
        author: AUTHOR,
        inLanguage: "ja",
        isAccessibleForFree: true,
        publisher: {
          "@type": "Organization",
          name: ORGANIZATION_NAME_JA,
        },
      },
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
