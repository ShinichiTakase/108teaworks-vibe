import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-16 bg-footer-top border-t border-b border-border"
      role="contentinfo"
    >
      <div className="w-full">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-left text-[0.8125rem] text-ink-muted leading-relaxed">
            <Link href="/privacy-policy" className="text-tea no-underline hover:underline">
              プライバシーポリシー
            </Link>
            <span className="mx-2 text-ink-muted">｜</span>
            <Link href="/legal" className="text-tea no-underline hover:underline">
              特定商取引法に基づく表記
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full bg-footer-middle">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-right text-[0.8125rem] text-ink leading-relaxed">
            〒224-0007 横浜市都筑区荏田南一丁目１１番２３号
            <br />
            <Link
              href="mailto:info@108teaworks.com"
              className="text-tea no-underline hover:underline"
            >
              info@108teaworks.com
            </Link>{" "}
            /{" "}
            <Link
              href="tel:050-6860-7347"
              className="text-tea no-underline hover:underline"
            >
              050-6860-7347
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="w-[90%] max-w-wide mx-auto py-4">
          <p className="m-0 text-center text-[0.8125rem] text-ink-muted leading-relaxed">
            ©︎ 藤八茶寮 / シングルオリジン伊勢茶 108teaworks
          </p>
        </div>
      </div>
    </footer>
  );
}
