/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['lucide-react'],
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
