import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "購入手続き｜伊勢茶の藤八茶寮",
  description: "ご購入手続きを行います。お届け先をご入力ください。",
};

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
