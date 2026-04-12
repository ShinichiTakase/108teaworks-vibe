/** /ise-cha/maccha/ 左カラム画像（上から順。グループ間はページ側で余白を入れる） */
export type IsechaMacchaFigure = {
  src: string;
  caption: string;
  alt: string;
};

export const ISECHA_MACCHA_IMAGE_GROUPS: IsechaMacchaFigure[][] = [
  [
    { src: "/images/ise-cha/maccha/碾茶.webp", caption: "碾茶", alt: "碾茶の茶葉" },
    {
      src: "/images/ise-cha/maccha/深蒸し緑茶.webp",
      caption: "深蒸し緑茶",
      alt: "深蒸し緑茶の茶葉",
    },
  ],
  [
    { src: "/images/ise-cha/maccha/抹茶.webp", caption: "抹茶", alt: "抹茶の粉末" },
    {
      src: "/images/ise-cha/maccha/粉末茶.webp",
      caption: "パウダー緑茶",
      alt: "パウダー緑茶の粉末",
    },
  ],
  [
    {
      src: "/images/ise-cha/maccha/アイス.webp",
      caption: "緑茶アイス",
      alt: "バニラアイスにパウダー緑茶をトッピングしたデザート",
    },
  ],
];
