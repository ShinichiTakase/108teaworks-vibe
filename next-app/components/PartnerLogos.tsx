const PARTNERS = [
  { name: "GOOD COFFEE", url: "https://goodcoffee.me/", img: "/images/partners/GOOD-COFFEE-150x150.jpg" },
  { name: "Lattest Omotesando", url: "https://lattest.jp/", img: "/images/partners/lattest-150x150.jpg" },
  { name: "サンドイッチとコーヒー amper", url: "https://wat-inc.jp/shop/amperecoffee/", img: "/images/partners/ampere-150x150.jpg" },
  { name: "FIKA-FABRIKEN", url: "https://fikafabriken.theshop.jp/", img: "/images/partners/FIKA-FABRIKEN-300x300.jpg" },
  { name: "CASTOR", url: "https://wat-inc.jp/shop/amperecoffee/", img: "/images/partners/castore-150x150.jpg" },
  { name: "新緑茶房", url: "https://www.shinsabo.com/", img: "/images/partners/sinryoku-sabou-300x300.png" },
];

type PartnerLogosProps = {
  className?: string;
};

export default function PartnerLogos({ className = "" }: PartnerLogosProps) {
  return (
    <div
      className={`mt-8 pt-4 border-t border-border grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4 ${className}`}
      aria-label="取扱パートナー"
    >
      {PARTNERS.map((p) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded bg-washi border border-border px-1.5 py-2 transition-colors hover:border-tea-light hover:bg-white"
          title={p.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt={p.name}
            width={140}
            height={140}
            className="block h-auto w-full max-w-[88px] object-contain md:max-w-[112px]"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
}

