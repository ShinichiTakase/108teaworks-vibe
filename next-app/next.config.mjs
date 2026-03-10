/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfkit は .afm 等を __dirname で参照するためバンドルせず node_modules から読み込む
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
  },
  // 多言語対応（日本語 / 英語 / 韓国語 / 中国語 / フランス語）
  i18n: {
    locales: ["ja", "en", "ko", "zh", "fr"],
    defaultLocale: "ja",
  },
  // 静的エクスポートする場合: output: 'export', trailingSlash: true
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
