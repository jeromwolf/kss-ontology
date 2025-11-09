/** @type {import('next').NextConfig} */
const nextConfig = {
  // MDX 지원
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Trailing slash
  trailingSlash: false,

  // Strict mode
  reactStrictMode: true,

  // 실험적 기능
  experimental: {
    mdxRs: true,
  },

  // 웹팩 설정
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

// MDX 설정
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
    ],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      require('rehype-highlight'),
    ],
  },
});

module.exports = withMDX(nextConfig);
