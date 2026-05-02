import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import NewsList from "@/components/NewsList";
import InstagramSection from "@/components/InstagramSection";
import WholesaleSection from "@/components/WholesaleSection";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export default function HomePage({ locale }: Props) {
  return (
    <>
      {/* Hero だけ先に多言語対応。順次ほかのセクションにも展開予定。 */}
      <Hero locale={locale} />
      <ProductList locale={locale} />
      <NewsList locale={locale} />
      {/* TODO: Instagram 表示を再開する場合は false を true に戻す */}
      {false && <InstagramSection locale={locale} />}
      <WholesaleSection locale={locale} />
    </>
  );
}
