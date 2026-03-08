import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ショッピングカート｜伊勢茶の藤八茶寮",
  description: "ショッピングカートの内容を確認し、ご注文を進めます。",
};

export default function CartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
