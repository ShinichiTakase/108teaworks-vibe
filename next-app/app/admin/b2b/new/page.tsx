import type { Metadata } from "next";
import AdminB2bNew from "@/components/admin/AdminB2bNew";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "B2B 新規作成",
};

export default function AdminB2bNewPage() {
  return <AdminB2bNew />;
}

