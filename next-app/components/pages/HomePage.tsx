import ProductList from "@/components/ProductList";
import NewsList from "@/components/NewsList";
import WholesaleSection from "@/components/WholesaleSection";

export default function HomePage() {
  return (
    <>
      <h1 className="m-0 mb-8 font-heading text-xl font-semibold text-tea-deep">
        幕末から続く伊勢茶の専門店「藤八茶寮」
      </h1>
      <ProductList />
      <NewsList />
      <WholesaleSection />
    </>
  );
}
