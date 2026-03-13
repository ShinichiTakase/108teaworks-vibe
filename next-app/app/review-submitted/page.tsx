import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ReviewSubmittedPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="m-0 mb-4 text-xl font-semibold text-tea-deep">
        レビューを送信しました
      </h1>
      <p className="m-0 mb-6 text-[0.9375rem] text-ink leading-relaxed">
        ご協力ありがとうございます。いただいたレビューは商品ページに掲載されます。
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold hover:bg-tea-light hover:border-tea-light transition-colors no-underline"
      >
        トップページへ
      </Link>
    </main>
  );
}
