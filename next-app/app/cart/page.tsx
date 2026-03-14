import CartPageContent from "@/components/CartPageContent";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export default function CartPage() {
  return (
    <>
      <BreadcrumbListSchema items={getBreadcrumbItems("/cart", "ja")} />
      <CartPageContent />
      <PageEndProductList locale="ja" />
    </>
  );
}
