import Link from "next/link";

/**
 * デザイン確認用：108teaworks.com/category/notice/ から取得した4件
 * 本来はDBなどから取得
 */
const news = [
  {
    href: "https://108teaworks.com/2026/02/27/houjicha-latte-howto/",
    date: "2026年2月27日",
    title:
      "とっても楽しくておいしいほうじ茶ラテの作り方 By @__wadakanami__",
    excerpt:
      "外苑前 カフェ 柔和 (にゅうわ @__newwa__)のオーナーでインフルエンサーの @__wadakanami__ さんが、藤八茶寮のほうじ茶パウダーを使ってとっても楽しいほうじ茶ラテを作ってくれました。カフェ 柔和のドリンクメニューでもお楽しみいただけます。",
  },
  {
    href: "https://108teaworks.com/2026/02/25/credit-payment-apology/",
    date: "2026年2月25日",
    title: "クレジットカード決済システム障害のお知らせとお詫び",
    excerpt:
      "当店のクレジットカード決済にシステム障害が発生しておりました。現在は復旧し、通常通りご利用いただけます。ご不便・ご迷惑をおかけいたしましたこと心よりお詫び申し上げます。",
  },
  {
    href: "https://108teaworks.com/2026/02/17/caffeine-cut-package/",
    date: "2026年2月17日",
    title: "カフェインカット緑茶は なっちゃん@punipuni729デザインのパッケージ",
    excerpt:
      "藤八茶寮のカフェインカット緑茶は、毎日飲みたいからカフェインを70%カット。三重県産・伊勢茶を使用し、香りとコクをしっかり残した毎日のためのカフェインカット緑茶です。パッケージのデザインは、イラストレーターのなっちゃん。",
  },
  {
    href: "https://108teaworks.com/category/notice/",
    date: "2026年2月8日",
    title: "粉糖がかかったガトーショコラみたいでかわいい茶畑",
    excerpt:
      "２月８日は雪。茶園がまるでモノクロームの写真のようになりました。砂糖がかかったガトーショコラみたい。実はこの時期の雪は、お茶にとっては「恵みの雪」なんです。サラっと積もる雪は、茶樹を極端な冷え込み（放射冷却）から守ってくれます。",
  },
];

export default function NewsList() {
  return (
    <section
      className="mb-12"
      id="news"
      aria-labelledby="news-heading"
      aria-label="お知らせ一覧"
    >
      <h2
        id="news-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        最新のお知らせ
      </h2>
      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {news.map((item) => (
          <li key={item.href} className="m-0">
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col h-full p-4 rounded border border-border bg-washi no-underline text-ink transition-colors hover:text-tea-deep hover:border-tea"
            >
              <span className="order-1 block font-bold text-[0.9375rem] leading-snug mb-1">
                {item.title}
              </span>
              <span className="order-2 block text-[0.8125rem] text-ink-muted text-right mb-2">
                {item.date}
              </span>
              <p className="order-3 flex-1 m-0 mb-1 text-sm text-ink-muted leading-relaxed line-clamp-5">
                {item.excerpt}
              </p>
              <span className="order-4 block text-[0.8125rem] text-tea text-right">
                …もっと読む
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
