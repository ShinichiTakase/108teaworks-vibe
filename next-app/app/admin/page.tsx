import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "管理メニュー",
};

const MENU = [
  {
    href: "/admin/send-shipping/",
    label: "発送完了メール送信",
    description: "注文番号を指定して発送完了メールを送信する",
  },
  {
    href: "/admin/b2b/",
    label: "B2B 取引一覧",
    description: "法人・卸取引の申請・受注一覧を管理する",
  },
  {
    href: "/admin/cart/",
    label: "カート商品一覧",
    description: "利用者がカートに追加した商品のログを確認する",
  },
  {
    href: "/admin/checkout/",
    label: "購入ページ表示一覧",
    description: "購入ページが表示された日時・IP・カート合計額のログを確認する",
  },
  {
    href: "/admin/shipping/",
    label: "送料計算一覧",
    description: "送料が計算された日時・IP・送料・都道府県のログを確認する",
  },
  {
    href: "/admin/instagram/",
    label: "Instagram トークン管理",
    description: "アクセストークンの有効期限確認・手動更新（残り30日で自動更新）",
  },
];

export default function AdminTopPage() {
  return (
    <main className="min-h-screen bg-washi py-16 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-semibold text-tea-deep">管理メニュー</h1>
        <ul className="space-y-3">
          {MENU.map(({ href, label, description }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col gap-0.5 rounded border border-border bg-white px-5 py-4 shadow-sm transition-colors hover:bg-cream hover:border-tea"
              >
                <span className="font-semibold text-tea-deep">{label}</span>
                <span className="text-xs text-ink-muted">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
