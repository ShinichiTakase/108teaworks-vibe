import type { Metadata } from "next";
import B2bPayPage from "@/components/b2b/B2bPayPage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "お支払いページ",
};

export default async function B2bTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <B2bPayPage token={token} />;
}

