/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['lucide-react'],
  // Disable SWC for font loading to work with Babel
  swcMinify: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Disable font optimization to avoid conflicts with Babel
  optimizeFonts: false,
}

module.exports = nextConfig
