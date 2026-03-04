import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import NewsList from "@/components/NewsList";
import InstagramSection from "@/components/InstagramSection";
import WholesaleSection from "@/components/WholesaleSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductList />
      <NewsList />
      <InstagramSection />
      <WholesaleSection />
    </>
  );
}
