/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfkit は .afm 等を __dirname で参照するためバンドルせず node_modules から読み込む
  // optimizeCss: critical CSS をインライン展開し、残りを非同期ロードに変換（critters 使用）
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"],
    optimizeCss: true,
  },
  // 商品画像は差し替え時にすぐ反映、固定アセットは長期キャッシュ
  async headers() {
    return [
      {
        source: "/images/products/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/images/merchant/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/images/how-to-brew/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/logo/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/books/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/chachamaru-icon.webp",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
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
      // 旧スラッグ「伊勢のほうじ茶 ティーバッグ 30g」→現行の茶葉30g商品へ1:1マッピング。
      // 汎用の /products/:slug ルールより先に評価させるため配列の先頭に置く。
      {
        source:
          "/products/%E4%BC%8A%E5%8B%A2%E3%81%AE%E3%81%BB%E3%81%86%E3%81%98%E8%8C%B6-%E3%83%86%E3%82%A3%E3%83%BC%E3%83%90%E3%83%83%E3%82%B0-30g",
        destination: "/ise-cha/roasted-isecha/",
        statusCode: 301,
      },
      {
        source:
          "/products/%E4%BC%8A%E5%8B%A2%E3%81%AE%E3%81%BB%E3%81%86%E3%81%98%E8%8C%B6-%E3%83%86%E3%82%A3%E3%83%BC%E3%83%90%E3%83%83%E3%82%B0-30g/",
        destination: "/ise-cha/roasted-isecha/",
        statusCode: 301,
      },
      // 旧スラッグ「houjicha-powder-80g」→現行の無糖ほうじ茶パウダーへ1:1マッピング。
      // 汎用の /products/:slug ルールより先に評価させるため配列の先頭に置く。
      {
        source: "/products/houjicha-powder-80g",
        destination: "/ise-cha/roasted-isecha-powder-unsweetened/",
        statusCode: 301,
      },
      {
        source: "/products/houjicha-powder-80g/",
        destination: "/ise-cha/roasted-isecha-powder-unsweetened/",
        statusCode: 301,
      },
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
      // 旧 WooCommerce /products/* のうち上記の既知パターン以外（深い階層・アーカイブ等）はトップページへ
      { source: "/products", destination: "/", statusCode: 301 },
      { source: "/products/", destination: "/", statusCode: 301 },
      { source: "/products/:path*", destination: "/", statusCode: 301 },
      // 廃止済み多言語ルート配下の /products/* も、単数形 /product と同様にトップページへ
      { source: "/:lang(en|ko|zh)/products", destination: "/", statusCode: 301 },
      { source: "/:lang(en|ko|zh)/products/", destination: "/", statusCode: 301 },
      { source: "/:lang(en|ko|zh)/products/:path*", destination: "/", statusCode: 301 },
      // fr ロケールは本サイトに存在したことがないため、配下は一律トップページへ
      { source: "/fr", destination: "/", statusCode: 301 },
      { source: "/fr/", destination: "/", statusCode: 301 },
      { source: "/fr/:path*", destination: "/", statusCode: 301 },
      // 旧スラッグ・季節キャンペーンページの残骸 → 対応する現行商品ページへ1:1マッピング
      {
        source: "/ise-cha/houjicha-powder-80g",
        destination: "/ise-cha/roasted-isecha-powder-unsweetened/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/houjicha-powder-80g/",
        destination: "/ise-cha/roasted-isecha-powder-unsweetened/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/deep-steamed-isecha-mothersday",
        destination: "/ise-cha/deep-steamed-isecha/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/deep-steamed-isecha-mothersday/",
        destination: "/ise-cha/deep-steamed-isecha/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/roasted-isecha-teabag-mothersday",
        destination: "/ise-cha/roasted-isecha-teabag/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/roasted-isecha-teabag-mothersday/",
        destination: "/ise-cha/roasted-isecha-teabag/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/roasted-isecha-teabag-motherday",
        destination: "/ise-cha/roasted-isecha-teabag/",
        statusCode: 301,
      },
      {
        source: "/ise-cha/roasted-isecha-teabag-motherday/",
        destination: "/ise-cha/roasted-isecha-teabag/",
        statusCode: 301,
      },
      // 旧 WordPress ブログの日付別アーカイブ URL（/YYYY/, /YYYY/MM/, /YYYY/MM/DD/）は
      // /notice/:slug の単一セグメントルーティングとは衝突しないため、そのまま /notice/ へ集約する。
      // ただし個別記事（/YYYY/MM/DD/slug/）は対応する現行コンテンツへ1:1マッピングし、
      // 対応が確認できないものは404のまま(推測でのリダイレクトはしない)。
      { source: "/:year(\\d{4})", destination: "/notice/", statusCode: 301 },
      { source: "/:year(\\d{4})/", destination: "/notice/", statusCode: 301 },
      { source: "/:year(\\d{4})/:month(\\d{2})", destination: "/notice/", statusCode: 301 },
      { source: "/:year(\\d{4})/:month(\\d{2})/", destination: "/notice/", statusCode: 301 },
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})", destination: "/notice/", statusCode: 301 },
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/", destination: "/notice/", statusCode: 301 },
      // 2025-12-25「オンラインストアをオープンしました」
      { source: "/2025/12/25/20251225-0632", destination: "/notice/20251215-0632/", statusCode: 301 },
      { source: "/2025/12/25/20251225-0632/", destination: "/notice/20251215-0632/", statusCode: 301 },
      // 2025-12-26「クレジットカード、デビッドカード、Apple Pay、Google Pay がお使い頂けます」
      { source: "/2025/12/26/20251226-1907", destination: "/notice/20251226-0707/", statusCode: 301 },
      { source: "/2025/12/26/20251226-1907/", destination: "/notice/20251226-0707/", statusCode: 301 },
      // 2026-01-04「「伊勢茶とは」を公開しました」
      { source: "/2026/01/04/20260114-0701", destination: "/notice/0260114-0701/", statusCode: 301 },
      { source: "/2026/01/04/20260114-0701/", destination: "/notice/0260114-0701/", statusCode: 301 },
      // 2026-01-12「お得用 深蒸し茶ティーバッグと伊勢茶パウダーの販売を開始しました」
      { source: "/2026/01/12/20260112-0901", destination: "/notice/20260112-0901/", statusCode: 301 },
      { source: "/2026/01/12/20260112-0901/", destination: "/notice/20260112-0901/", statusCode: 301 },
      // 2026-01-31「伊勢茶発祥の地 川俣谷のお茶」公開告知 → コンテンツ本体へ
      { source: "/2026/01/31/kabatadani_no_ocha", destination: "/kabatadani_no_ocha/", statusCode: 301 },
      { source: "/2026/01/31/kabatadani_no_ocha/", destination: "/kabatadani_no_ocha/", statusCode: 301 },
      // 2026-02-02「【新発売】カフェインを70%カットしたカフェインカット（デカフェ）緑茶」
      {
        source:
          "/2026/02/02/%E3%80%90%E6%96%B0%E7%99%BA%E5%A3%B2%E3%80%91-%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3%E3%82%9270%E3%82%AB%E3%83%83%E3%83%88%E3%81%97%E3%81%9F%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3",
        destination: "/notice/20260202-0421/",
        statusCode: 301,
      },
      {
        source:
          "/2026/02/02/%E3%80%90%E6%96%B0%E7%99%BA%E5%A3%B2%E3%80%91-%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3%E3%82%9270%E3%82%AB%E3%83%83%E3%83%88%E3%81%97%E3%81%9F%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3/",
        destination: "/notice/20260202-0421/",
        statusCode: 301,
      },
      // 2026-02-11「粉糖がかかったガトーショコラみたいでかわいい茶畑」
      {
        source:
          "/2026/02/11/%E7%B2%89%E7%B3%96%E3%81%8C%E3%81%8B%E3%81%8B%E3%81%A3%E3%81%9F%E3%82%AC%E3%83%88%E3%83%BC%E3%82%B7%E3%83%A7%E3%82%B3%E3%83%A9%E3%81%BF%E3%81%9F%E3%81%84%E3%81%A7%E3%81%8B%E3%82%8F%E3%81%84%E3%81%84",
        destination: "/notice/20260211-0746/",
        statusCode: 301,
      },
      {
        source:
          "/2026/02/11/%E7%B2%89%E7%B3%96%E3%81%8C%E3%81%8B%E3%81%8B%E3%81%A3%E3%81%9F%E3%82%AC%E3%83%88%E3%83%BC%E3%82%B7%E3%83%A7%E3%82%B3%E3%83%A9%E3%81%BF%E3%81%9F%E3%81%84%E3%81%A7%E3%81%8B%E3%82%8F%E3%81%84%E3%81%84/",
        destination: "/notice/20260211-0746/",
        statusCode: 301,
      },
      // 2026-02-17「イラストレーター南夏希さんデザイン カフェインカット緑茶」
      {
        source:
          "/2026/02/17/%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3%E3%82%AB%E3%83%83%E3%83%88%E7%B7%91%E8%8C%B6%E3%81%AF%E3%81%AA%E3%81%A3%E3%81%A1%E3%82%83%E3%82%93punipuni729%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3",
        destination: "/notice/20260217-0633/",
        statusCode: 301,
      },
      {
        source:
          "/2026/02/17/%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A4%E3%83%B3%E3%82%AB%E3%83%83%E3%83%88%E7%B7%91%E8%8C%B6%E3%81%AF%E3%81%AA%E3%81%A3%E3%81%A1%E3%82%83%E3%82%93punipuni729%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3/",
        destination: "/notice/20260217-0633/",
        statusCode: 301,
      },
      // 2026-02-25「クレジットカード決済システム障害のお知らせとお詫び」
      {
        source:
          "/2026/02/25/%E3%82%AF%E3%83%AC%E3%82%B8%E3%83%83%E3%83%88%E3%82%AB%E3%83%BC%E3%83%89%E6%B1%BA%E6%B8%88%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E9%9A%9C%E5%AE%B3%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%A8",
        destination: "/notice/20260226-0326/",
        statusCode: 301,
      },
      {
        source:
          "/2026/02/25/%E3%82%AF%E3%83%AC%E3%82%B8%E3%83%83%E3%83%88%E3%82%AB%E3%83%BC%E3%83%89%E6%B1%BA%E6%B8%88%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E9%9A%9C%E5%AE%B3%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%81%A8/",
        destination: "/notice/20260226-0326/",
        statusCode: 301,
      },
      // 2026-02-27「おいしいほうじ茶ラテの作り方 by @__wadakanami__」
      {
        source:
          "/2026/02/27/%E3%81%A8%E3%81%A3%E3%81%A6%E3%82%82%E6%A5%BD%E3%81%97%E3%81%8F%E3%81%A6%E3%81%8A%E3%81%84%E3%81%97%E3%81%84%E3%81%BB%E3%81%86%E3%81%98%E8%8C%B6%E3%83%A9%E3%83%86%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9-b",
        destination: "/notice/20260227-0455/",
        statusCode: 301,
      },
      {
        source:
          "/2026/02/27/%E3%81%A8%E3%81%A3%E3%81%A6%E3%82%82%E6%A5%BD%E3%81%97%E3%81%8F%E3%81%A6%E3%81%8A%E3%81%84%E3%81%97%E3%81%84%E3%81%BB%E3%81%86%E3%81%98%E8%8C%B6%E3%83%A9%E3%83%86%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9-b/",
        destination: "/notice/20260227-0455/",
        statusCode: 301,
      },
      // /2025/12/25/20251225-0711/ は対応する現行コンテンツが確認できないため404のまま(意図的に対応なし)
      // 旧 WordPress システムパス（wp-admin/wp-content/wp-includes/wp-json）は
      // 実際に公開されたことのないbot/スキャナー由来のノイズのため、リダイレクトせず404のままとする。
      // /wp-content/uploads/* は今も画像配信に使っている実ファイルのため元から対象外。
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
      { source: "/isecha_no_rekushi", destination: "/isecha_no_rekishi/", statusCode: 301 },
      { source: "/isecha_no_rekushi/", destination: "/isecha_no_rekishi/", statusCode: 301 },
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
