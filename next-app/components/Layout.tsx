import { ReactNode } from "react";
import Header from "./Header";
import GlobalNav from "./GlobalNav";
import PromoVideoBanner from "./PromoVideoBanner";
import Footer from "./Footer";
import LanguageSwitcher from "./LanguageSwitcher";
import FloatingCartBar from "./FloatingCartBar";

const MAIN_CLASS = "pt-10 pb-16 px-4 md:py-16";
const INNER_CLASS = "w-[90%] max-w-wide mx-auto";

type LayoutProps = {
  children: ReactNode;
  /** メインの内側のみ渡す場合は true（デフォルト）。false のときは children をそのまま表示 */
  withInner?: boolean;
};

export default function Layout({ children, withInner = true }: LayoutProps) {
  return (
    <>
      <Header />
      <GlobalNav />
      <PromoVideoBanner />
      <main className={MAIN_CLASS} id="main-content" role="main">
        {withInner ? (
          <div className={INNER_CLASS}>{children}</div>
        ) : (
          children
        )}
      </main>
      <Footer />
      <LanguageSwitcher />
      <FloatingCartBar />
    </>
  );
}

export { MAIN_CLASS, INNER_CLASS };
