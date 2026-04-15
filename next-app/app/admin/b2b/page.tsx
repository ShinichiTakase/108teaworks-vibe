import type { Metadata } from "next";
import AdminB2bList from "@/components/admin/AdminB2bList";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "B2B 管理",
};

export default function AdminB2bPage() {
  return <AdminB2bList />;
}

