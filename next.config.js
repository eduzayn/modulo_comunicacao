/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['lucide-react'],
  // Disable SWC for font loading to work with Babel
  swcMinify: false,
  webpack: (config) => {
    // Ignore specific modules that cause issues
    config.resolve.fallback = { 
      fs: false, 
      path: false,
      process: require.resolve('process/browser'),
    };
    
    // Exclude swagger-ui from the build
    config.module.rules.push({
      test: /swagger-ui/,
      use: 'null-loader',
    });
    
    return config;
  },
  // Disable font optimization to avoid conflicts with Babel
  optimizeFonts: false,
}

module.exports = nextConfig
