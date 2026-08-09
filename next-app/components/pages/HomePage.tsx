import ProductList from "@/components/ProductList";
import NewsList from "@/components/NewsList";
import WholesaleSection from "@/components/WholesaleSection";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export default function HomePage({ locale }: Props) {
  return (
    <>
      <ProductList locale={locale} />
      <NewsList locale={locale} />
      <WholesaleSection locale={locale} />
    </>
  );
}
