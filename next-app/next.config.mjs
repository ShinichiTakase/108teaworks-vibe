/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfkit は .afm 等を __dirname で参照するためバンドルせず node_modules から読み込む
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
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
  // remotePatterns は許可ホストのみに限定（GHSA-9g9p-9gw9-jx7f 対策）
  images: {
    unoptimized: true,
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
