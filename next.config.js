/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', 'lucide-react'],
  swcMinify: false, // Disable SWC minifier to avoid issues with private methods
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `process` being defined
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        process: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
