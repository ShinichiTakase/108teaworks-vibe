/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default nextConfig;
