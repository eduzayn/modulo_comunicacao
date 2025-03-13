/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', 'lucide-react'],
  webpack: (config) => {
    // Ignore specific modules that cause issues
    config.resolve.fallback = { 
      fs: false, 
      path: false,
      process: require.resolve('process/browser'),
    };
    
    // Add a rule to handle process.browser assignments
    config.module.rules.push({
      test: /node_modules\/process\/browser\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'process.browser = true;',
        replace: 'Object.defineProperty(process, "browser", { value: true, writable: true });',
      },
    });
    
    return config;
  },
}

module.exports = nextConfig
