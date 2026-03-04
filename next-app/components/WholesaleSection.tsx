import Link from "next/link";

const PARTNERS = [
  { name: "GOOD COFFEE", url: "https://goodcoffee.me/", img: "/images/partners/GOOD-COFFEE-150x150.jpg" },
  { name: "Lattest Omotesando", url: "https://lattest.jp/", img: "/images/partners/lattest-150x150.jpg" },
  { name: "サンドイッチとコーヒー amper", url: "https://wat-inc.jp/shop/amperecoffee/", img: "/images/partners/ampere-150x150.jpg" },
  { name: "FIKA-FABRIKEN", url: "https://fikafabriken.theshop.jp/", img: "/images/partners/FIKA-FABRIKEN-300x300.jpg" },
  { name: "CASTOR", url: "https://wat-inc.jp/shop/amperecoffee/", img: "/images/partners/castore-150x150.jpg" },
  { name: "新緑茶房", url: "https://www.shinsabo.com/", img: "/images/partners/sinryoku-sabou-300x300.png" },
];

export default function WholesaleSection() {
  return (
    <section
      className="mb-12"
      id="wholesale"
      aria-labelledby="wholesale-heading"
    >
      <h2
        id="wholesale-heading"
        className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
      >
        パートナー募集
      </h2>
      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:gap-8">
        <figure className="m-0 shrink-0 md:w-[40%] md:max-w-[400px]">
          {/* public/images/wholesale/partner.jpg を配置（108teaworks.com と同じ画像） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/wholesale/partner.jpg"
            alt="パートナー募集・伊勢茶をビジネスに"
            width={400}
            height={300}
            className="block w-full h-auto rounded object-cover"
            loading="lazy"
          />
        </figure>
        <div className="flex-1 min-w-0">
          <p className="m-0 text-[0.9375rem] text-ink-muted">
            藤八茶寮では、ビジネスパートナーを募集中です。カフェやレストランのドリンクメニューに、スイーツに、シェアオフィスのリフレッシュアイテムに…いろんなシーンで伊勢茶を気軽に取り入れてみませんか。
          </p>
          <p className="m-0 mt-2 text-[0.9375rem] text-ink-muted">
            <strong>ご提供できる商品</strong>
          </p>
          <ul className="wholesale__list list-disc pl-5 mt-1 mb-2 text-[0.9375rem] text-ink-muted ml-[1em]">
            <li>深蒸し緑茶</li>
            <li>ほうじ茶</li>
            <li>和紅茶</li>
          </ul>
          <p className="m-0 text-[0.9375rem] text-ink-muted">
            <strong>商品形態</strong>
          </p>
          <ul className="wholesale__list list-disc pl-5 mt-1 text-[0.9375rem] text-ink-muted ml-[1em]">
            <li>茶葉（リーフ）</li>
            <li>ティーバッグ</li>
            <li>パウダー（粉茶）</li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center">
        <Link
          href="/wholesale/"
          className="inline-block py-4 px-8 text-[0.9375rem] font-medium text-cream bg-tea-deep rounded no-underline transition-colors hover:bg-tea focus:outline-2 focus:outline-tea-light focus:outline-offset-2"
        >
          お問い合わせフォーム
        </Link>
      </p>
      <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-6" aria-label="取扱パートナー">
        {PARTNERS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 bg-washi border border-border rounded transition-colors hover:border-tea-light hover:bg-white"
            title={p.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={p.name}
              width={120}
              height={120}
              className="block w-full max-w-[80px] h-auto object-contain md:max-w-[100px]"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
