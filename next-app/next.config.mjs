/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfkit は .afm 等を __dirname で参照するためバンドルせず node_modules から読み込む
  // optimizeCss: critical CSS をインライン展開し、残りを非同期ロードに変換（critters 使用）
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
    optimizeCss: true,
  },
  // 商品画像は差し替え時にすぐ反映されるようキャッシュを短くする
  async headers() {
    return [
      {
        source: "/images/products/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  // 静的エクスポートする場合: output: 'export', trailingSlash: true
  // 末尾スラッシュを正規URLとして統一（/foo -> /foo/）
  trailingSlash: true,
  // remotePatterns は許可ホストのみに限定（GHSA-9g9p-9gw9-jx7f 対策）
  async redirects() {
    return [
      // /products/* -> /ise-cha/* (301)
      {
        source: "/products/:slug",
        destination: "/ise-cha/:slug/",
        statusCode: 301,
      },
      {
        source: "/products/:slug/",
        destination: "/ise-cha/:slug/",
        statusCode: 301,
      },
      {
        source: "/products/:slug/reviews",
        destination: "/ise-cha/:slug/reviews/",
        statusCode: 301,
      },
      {
        source: "/products/:slug/reviews/",
        destination: "/ise-cha/:slug/reviews/",
        statusCode: 301,
      },
      {
        source: "/:lang(en|ko|zh)/products/:slug",
        destination: "/:lang/ise-cha/:slug/",
        statusCode: 301,
      },
      {
        source: "/:lang(en|ko|zh)/products/:slug/",
        destination: "/:lang/ise-cha/:slug/",
        statusCode: 301,
      },
      {
        source: "/:lang(en|ko|zh)/products/:slug/reviews",
        destination: "/:lang/ise-cha/:slug/reviews/",
        statusCode: 301,
      },
      {
        source: "/:lang(en|ko|zh)/products/:slug/reviews/",
        destination: "/:lang/ise-cha/:slug/reviews/",
        statusCode: 301,
      },
      {
        source: "/notice/20260331-1616",
        destination: "/notice/20260325-1616/",
        statusCode: 301,
      },
      {
        source: "/notice/20260331-1616/",
        destination: "/notice/20260325-1616/",
        statusCode: 301,
      },
      { source: "/isecha", destination: "/ise-cha", permanent: true },
      { source: "/isecha/", destination: "/ise-cha", permanent: true },
      { source: "/en/isecha", destination: "/en/ise-cha", permanent: true },
      { source: "/en/isecha/", destination: "/en/ise-cha", permanent: true },
      { source: "/ko/isecha", destination: "/ko/ise-cha", permanent: true },
      { source: "/ko/isecha/", destination: "/ko/ise-cha", permanent: true },
      { source: "/zh/isecha", destination: "/zh/ise-cha", permanent: true },
      { source: "/zh/isecha/", destination: "/zh/ise-cha", permanent: true },
      { source: "/isecha_no_rekushi", destination: "/isecha_no_rekishi", permanent: true },
      { source: "/isecha_no_rekushi/", destination: "/isecha_no_rekishi", permanent: true },
      { source: "/en/isecha_no_rekushi", destination: "/en/isecha_no_rekishi", permanent: true },
      { source: "/en/isecha_no_rekushi/", destination: "/en/isecha_no_rekishi", permanent: true },
      { source: "/ko/isecha_no_rekushi", destination: "/ko/isecha_no_rekishi", permanent: true },
      { source: "/ko/isecha_no_rekushi/", destination: "/ko/isecha_no_rekishi", permanent: true },
      { source: "/zh/isecha_no_rekushi", destination: "/zh/isecha_no_rekishi", permanent: true },
      { source: "/zh/isecha_no_rekushi/", destination: "/zh/isecha_no_rekishi", permanent: true },
      {
        source: "/pdf/isecha_no_rekushi.pdf",
        destination: "/pdf/isecha_no_rekishi.pdf",
        permanent: true,
      },
      {
        source: "/images/isecha_no_rekushi.jpg",
        destination: "/images/isecha_no_rekishi.jpg",
        permanent: true,
      },
      {
        source: "/images/books/isecha_no_rekushi.jpg",
        destination: "/images/books/isecha_no_rekishi.jpg",
        permanent: true,
      },
      {
        source: "/images/books/isecha_no_rekushi.png",
        destination: "/images/books/isecha_no_rekishi.jpg",
        permanent: true,
      },
      { source: "/ise-cha/amerika", destination: "/ise-cha/america", permanent: true },
      { source: "/ise-cha/amerika/", destination: "/ise-cha/america", permanent: true },
      { source: "/en/ise-cha/amerika", destination: "/en/ise-cha/america", permanent: true },
      { source: "/en/ise-cha/amerika/", destination: "/en/ise-cha/america", permanent: true },
      { source: "/ko/ise-cha/amerika", destination: "/ko/ise-cha/america", permanent: true },
      { source: "/ko/ise-cha/amerika/", destination: "/ko/ise-cha/america", permanent: true },
      { source: "/zh/ise-cha/amerika", destination: "/zh/ise-cha/america", permanent: true },
      { source: "/zh/ise-cha/amerika/", destination: "/zh/ise-cha/america", permanent: true },
      { source: "/inquery", destination: "/inquiry", permanent: true },
      { source: "/inquery/", destination: "/inquiry/", permanent: true },
      { source: "/en/inquery", destination: "/en/inquiry", permanent: true },
      { source: "/en/inquery/", destination: "/en/inquiry/", permanent: true },
      { source: "/ko/inquery", destination: "/ko/inquiry", permanent: true },
      { source: "/ko/inquery/", destination: "/ko/inquiry/", permanent: true },
      { source: "/zh/inquery", destination: "/zh/inquiry", permanent: true },
      { source: "/zh/inquery/", destination: "/zh/inquiry/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "108teaworks.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.microcms.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "108teaworks.microcms.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
