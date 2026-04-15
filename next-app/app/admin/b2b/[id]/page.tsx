import type { Metadata } from "next";
import AdminB2bDetail from "@/components/admin/AdminB2bDetail";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "B2B 詳細",
};

export default async function AdminB2bDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminB2bDetail id={id} />;
}

