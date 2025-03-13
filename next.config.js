/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', 'lucide-react'],
  swcMinify: false, // Disable SWC minifier to avoid issues with private methods
  webpack: (config) => {
    // Ignore specific modules that cause issues
    config.resolve.fallback = { 
      fs: false, 
      path: false,
      process: require.resolve('process/browser'),
    };
    
    return config;
  },
}

module.exports = nextConfig
