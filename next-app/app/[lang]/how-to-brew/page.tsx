import type { Locale } from "@/lib/i18n";
import HowToBrewPage from "@/app/how-to-brew/page";

type Params = {
  lang: string;
};

export const dynamic = "force-dynamic";

export default function LocalizedHowToBrew({
  params,
}: {
  params: Params;
}) {
  // /[lang]/how-to-brew から渡ってきた lang をそのまま page.tsx 側の params に渡す
  const supported: Locale[] = ["ja", "en", "ko", "zh"];
  const lang = params.lang as Locale;
  const locale: Locale = supported.includes(lang) ? lang : "ja";

  return <HowToBrewPage params={{ lang: locale }} />;
}

