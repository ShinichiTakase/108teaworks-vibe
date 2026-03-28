import { MAIN_CLASS, INNER_CLASS } from "@/components/Layout";
import KabatadaniViewer from "@/components/KabatadaniViewer";
import PageEndProductList from "@/components/PageEndProductList";
import BreadcrumbListSchema from "@/components/BreadcrumbListSchema";
import { getFixedSeo, buildAlternatesForLocales } from "@/lib/seo";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

export const dynamic = "force-dynamic";

const PDF_URL = "/pdf/isecha_no_rekushi.pdf";

export async function generateMetadata() {
  const seo = getFixedSeo("/isecha_no_rekushi", "ja");
  return {
    title:
      seo?.title ??
      "伊勢茶の歴史 お茶のおもしろ知識｜伊勢茶の藤八茶寮",
    description:
      seo?.description ??
      "伊勢茶の歴史とお茶のおもしろ知識（PDF版）を、右開きの冊子イメージでご覧いただけます。",
    alternates: buildAlternatesForLocales("/isecha_no_rekushi"),
  };
}

export default function IsechaNoRekushiPage() {
  return (
    <main className={MAIN_CLASS} id="main-content" role="main">
      <BreadcrumbListSchema items={getBreadcrumbItems("/isecha_no_rekushi", "ja")} />
      <div className={INNER_CLASS}>
        <section
          aria-labelledby="isecha-rekushi-heading"
          className="mb-12"
        >
          <h1
            id="isecha-rekushi-heading"
            className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
          >
            伊勢茶の歴史 お茶のおもしろ知識
          </h1>
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            日本語縦書きの冊子を、右開きの本のようなイメージでご覧いただけます。
            パソコンでは大きめの画面で、スマートフォンでは横向き表示にしていただくと読みやすくなります。
          </p>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            本文に「「漢字にはカナをふりました」との記述がありますが、電子化の都合上フリガナは付けていませんのでご了承ください。
          </p>

          <KabatadaniViewer pdfUrl={PDF_URL} />

          <div className="mx-auto mt-6 max-w-3xl rounded-md bg-washi px-4 py-3 text-[0.875rem] leading-relaxed text-ink-muted md:px-6 md:py-4">
            <h2 className="mt-0 mb-2 text-[0.9375rem] font-semibold text-tea-deep">
              【著者略歴】
            </h2>
            <p className="m-0">
              高瀬 孝二：松阪市在住（元三重県職員）。三重県農業技術センター主席研究員兼茶業センター場長を最後に定年退職。
              退職後は三重県茶業会議所常務理事に就任。日本茶インストラクター協会認定・日本茶インストラクターリーダー、日本茶アドバイザー養成講座専任講師。
              令和６年 瑞宝双光章を受章。主な著書に「三重県茶業史」「川俣谷のお茶」「伊勢茶の歴史」がある。
            </p>
          </div>
        </section>
        <PageEndProductList locale="ja" />
      </div>
    </main>
  );
}
