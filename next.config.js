/** @type {import('next').NextConfig} */

// For GitHub Pages project sites, set BASE_PATH="/your-repo-name" at build time:
//   BASE_PATH=/buildforge-ai npm run build
// Vercel / Cloudflare Pages / custom domains: leave BASE_PATH empty.
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
