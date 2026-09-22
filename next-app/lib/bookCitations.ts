/** 章によって変わらない書誌情報（全ページ共通の定数として保持） */
export type BookCitation = {
  author: string;
  title: string;
  publisher: string;
  publishedLabel: string;
};

export const MIE_CHAGYO_SHI_CITATION: BookCitation = {
  author: "高瀬孝二",
  title: "三重県茶業史",
  publisher: "三重県茶業会議所",
  publishedLabel: "2009年11月",
};
