import { MIE_CHAGYO_SHI_CITATION } from "@/lib/bookCitations";
import { SITE_BASE_URL } from "@/lib/siteConstants";
import { buildHref } from "@/lib/urlPath";

type Props = {
  pageTitle: string;
  path: string;
};

/** 各章ページ末尾に表示する出典・引用表記。書誌情報は全章共通の定数、ページタイトル/URLのみ動的。 */
export default function MieChagyoShiCitation({ pageTitle, path }: Props) {
  const { author, title, publisher, publishedLabel } = MIE_CHAGYO_SHI_CITATION;
  const pageUrl = `${SITE_BASE_URL}${buildHref(path)}`;
  const citationText = `${author}「${pageTitle}」『${title}』（${publisher}、${publishedLabel}）${pageUrl}`;

  return (
    <section
      aria-labelledby="citation-heading"
      className="mt-10 rounded-md border border-border bg-washi px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-muted"
    >
      <h2 id="citation-heading" className="mb-2 text-[0.8125rem] font-semibold text-tea-deep">
        出典・引用について
      </h2>
      <p className="m-0">
        出典：{author}『{title}』{publisher}、{publishedLabel}
      </p>
      <p className="m-0 mt-2">このページを引用する場合の表記例：</p>
      <p className="m-0 mt-1 break-words">{citationText}</p>
    </section>
  );
}
